FROM node:12.14.0-alpine3.11

COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

RUN apk add --no-cache bash

RUN npm install -g @nestjs/cli@7.5.6

USER node

WORKDIR /home/node/app

ENTRYPOINT ["/docker-entrypoint.sh"]