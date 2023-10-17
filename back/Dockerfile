#FROM ubuntu:latest
#LABEL authors="daechanjo"
#
#ENTRYPOINT ["top", "-b"]

FROM node:18.16-alpine
LABEL authors="daechanjo"

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install

EXPOSE 8000

CMD ["yarn", "start"]