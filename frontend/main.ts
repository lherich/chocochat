import { Application, isHttpError, ListenOptionsTls } from '@oak/oak';
import { loadSync } from '@std/dotenv';

const conf = loadSync();
const options: ListenOptionsTls = {
  port: Number(conf.FRONTEND_PORT),
  hostname: conf.FRONTEND_HOST,
  secure: true,
  cert: Deno.readTextFileSync(conf.CRT),
  key: Deno.readTextFileSync(conf.KEY),
};

console.log(
  'starting server: https://' + conf.FRONTEND_HOST + ':' + conf.FRONTEND_PORT,
);

await new Application()
  .use(async (context, next) => {
    try {
      await next();
    } catch (err) {
      console.log(err);

      if (isHttpError(err)) {
        context.response.status = err.status;
        context.response.body = err.status + ' ' + err.name;
        context.response.type = 'text/plain';
      } else {
        throw err;
      }
    }
  })
  .use(async (context) => {
    await context.send({
      root: `${Deno.cwd()}/frontend/public`,
      index: 'index.html',
    });
  })
  .listen(options);
