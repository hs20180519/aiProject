FROM node:16-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY ./src/index.tsx .

ENTRYPOINT [ "node", "./src/index.tsx" ]