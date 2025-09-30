FROM node:22-alpine as base

RUN apk add --no-cache dumb-init git

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENV TZ=Etc/GMT

WORKDIR /usr/src/app

COPY --chown=node:node . /usr/src/app

RUN yarn install

CMD ["yarn","run","dev-node"]