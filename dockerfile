FROM node:16 as builder
WORKDIR /app
COPY . .
RUN npm i -g pnpm
RUN pnpm install
RUN pnpm bundle

FROM node:16
ARG redis_host
ARG db_host

WORKDIR /app
COPY --from=builder /app/out .
EXPOSE 3321
CMD node index.js --redis_host=redis --db_host=db
