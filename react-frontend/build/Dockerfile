FROM node:16.15.1-alpine3.16

RUN apk add --no-cache bash

COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

USER node

WORKDIR /home/node/app

ENTRYPOINT ["/docker-entrypoint.sh"]


