FROM node:14-alpine

WORKDIR /app

#  add libraries; sudo so non-root user added downstream can get sudo
RUN apk add --no-cache sudo;


RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake

COPY package*.json ./
COPY . .

RUN npm install

EXPOSE 8000

CMD ["npm", "start"]