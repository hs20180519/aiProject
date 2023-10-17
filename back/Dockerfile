#FROM ubuntu:latest
#LABEL authors="daechanjo"
#
#ENTRYPOINT ["top", "-b"]

FROM node:16-buster

LABEL authors="daechanjo"

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install

ENV DATABASE_URL=mysql://root:1234@db:3306/dogSole?connection_limit=151

RUN npx prisma migratview-feature

EXPOSE 5001

CMD ["yarn", "start"]