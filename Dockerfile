FROM node:20-alpine AS build

WORKDIR /app

ADD package*.json .

RUN npm ci

ADD . .

ENV VITE_API_BASE_URL="http://185.143.145.182:4000/api"

RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
ADD *.json .
RUN npm ci --omit=dev
RUN npm i -g serve

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]