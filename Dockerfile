FROM node:22-alpine as base

RUN apk add --no-cache dumb-init

WORKDIR /usr/src/app

FROM base as deps

COPY --chown=node:node package.json yarn.lock /usr/src/app/

RUN yarn install

FROM deps as builder

COPY --chown=node:node . /usr/src/app

ARG VITE_TLDRAW_LICENSE_KEY
ENV VITE_TLDRAW_LICENSE_KEY=${VITE_TLDRAW_LICENSE_KEY}

RUN yarn build

FROM deps as prod-deps

RUN yarn install --production

FROM base as app

COPY --chown=node:node --from=builder /usr/src/app/dist /usr/src/app/dist
COPY --chown=node:node --from=prod-deps /usr/src/app/node_modules /usr/src/app/node_modules

ENV NODE_ENV=production \
    CONFIG_DIR=/config

WORKDIR /usr/src/app

CMD ["dumb-init", "node", "dist/src/server/server.node.js"]