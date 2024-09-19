FROM node:20-alpine AS build

WORKDIR /app

ADD *.json .

RUN npm ci

ADD . .

RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
ADD *.json .
RUN npm ci --omit=dev
RUN npm i -g serve

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]