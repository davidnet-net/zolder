FROM node:22 AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN rm -rf node_modules package-lock.json && npm install --ignore-scripts && npm rebuild && npm install

COPY . .

RUN npm run build

FROM node:22

WORKDIR /app

COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

CMD ["node", "./build"]
