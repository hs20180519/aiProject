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

EXPOSE 5001

CMD ["yarn", "start"]