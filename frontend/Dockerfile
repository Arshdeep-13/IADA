FROM node:18 AS build-stage

RUN mkdir /usr/app

COPY . /usr/app

WORKDIR /usr/app

RUN npm install

ENV PATH /usr/src/app/node_modules/.bin:$PATH

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build-stage /usr/app/dist .

CMD ["nginx", "-g", "daemon off;"]
