Dockerfile
FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm run build:prod

FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]

EXPOSE 80