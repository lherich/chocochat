# chocochat
Simple chat with deno2, oak, oak-cors, openai and websockets.

## Get Started
```
git clone git@github.com:lherich/chocochat.git
cd ./chocochat

openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj "/CN=localhost" -days 9999

cp .env.example .env
# add your openai key
vi .env

# if you changed port/host adjust deno.json
vi deno.json
```

### Run
```
# optional
deno task prettify

# start frontend with watcher
deno task frontend

# start backend with watcher
deno task backend
```