FROM node:22-alpine

RUN apk add --no-cache git

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app


WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER node


COPY --chown=node:node . .

# from npm i --package-lock-only --omit=optional
RUN npm i

EXPOSE 3000

CMD [ "npm", "run", "start:server" ]