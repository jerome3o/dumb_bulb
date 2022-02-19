FROM node:14.16.1

WORKDIR /app
COPY package*.json ./
COPY tp-link-tapo-connect/ ./tp-link-tapo-connect
COPY tsconfig.json ./

RUN ["npm", "install", "-g", "typescript"]
RUN ["npm", "install" ]

COPY src/ ./src
COPY tp-link-tapo-connect/ ./tp-link-tapo-connect

RUN ["npm", "run", "build"]

EXPOSE 8002

CMD [ "npm", "run", "start" ]