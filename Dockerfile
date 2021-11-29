FROM node:16 AS builder
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine3.13
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3005
CMD ["npm","start"]

