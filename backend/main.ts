import {
  Application,
  Context,
  isHttpError,
  ListenOptionsTls,
  Router,
} from '@oak/oak';
import { loadSync } from '@std/dotenv';
import ChatServer from './ChatServer.ts';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';
import { OpenAI } from 'https://deno.land/x/openai@v4.68.1/mod.ts';

const conf = loadSync();
const options: ListenOptionsTls = {
  port: Number(conf.BACKEND_PORT),
  hostname: conf.BACKEND_HOST,
  secure: true,
  cert: Deno.readTextFileSync(conf.CRT),
  key: Deno.readTextFileSync(conf.KEY),
};
const openai = new OpenAI({
  apiKey: conf.OPENAI_API_KEY,
});

const chatServer = new ChatServer();

const router = new Router()
  .get('/websocket/:uuid', (ctx: Context) => {
    if (!ctx.isUpgradable) {
      ctx.throw(501);
    }
    const socket = ctx.upgrade();
    const uuid = ctx.params.uuid;

    if (typeof uuid !== 'string' || uuid.length < 1) {
      ctx.throw(500, 'uuid not given or too short');
    }

    chatServer.handle(uuid, socket, openai);
  });

console.log(
  'starting server: https://' + conf.BACKEND_HOST + ':' + conf.BACKEND_PORT,
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
  .use(
    oakCors({
      origin: /^.+localhost:(4431)$/,
    }),
  )
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(options);