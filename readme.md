# Fedi Canvas Bot

This is a bot that connects to mastodon and to the fedi-canvas API and processes commands from one to the other

It is made using Bun (bun.sh) as runtime. It needs its dependencies installed with `bun install`

It also needs its environment variables. You will need to copy `.env.example` to `.env` and fill in the blanks. The `JWT_SECRET` should be the same used in the API in `FEDICANVAS_API_URL`

When you have that, you can start it with:
```
bun run bot
```
