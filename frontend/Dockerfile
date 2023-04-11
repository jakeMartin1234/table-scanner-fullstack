FROM node:14-alpine

WORKDIR /app

COPY package*. yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]