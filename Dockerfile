# specify the node base image with your desired version node:<version>
FROM node:10.19-alpine as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

EXPOSE 8080
CMD ["yarn", "start"]
