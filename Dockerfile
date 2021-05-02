FROM node:14.16.1

WORKDIR /app
COPY package*.json ./
RUN [ "npm", "install" ]

ADD . ./
RUN rm ./.env

EXPOSE 3000

CMD [ "npm", "run", "start" ]