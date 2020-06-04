FROM node:13.12.0-alpine3.10

ARG APP_DIR=app/

WORKDIR ${APP_DIR}

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
