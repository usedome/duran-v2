FROM node:17-alpine AS final
FROM node:17-alpine AS build

# Build step of the Dockerfile. Compiles the application into a smaller, sleeked down, optimized build.
WORKDIR usr/src/app

COPY package.json ./

COPY yarn.lock ./

COPY . .

RUN yarn install

RUN yarn build

# Run step of the Dockerfile. Gets the compiled build of the app from the build step and runs it.
FROM final

ENV NODE_ENV=production

WORKDIR usr/src/app

COPY --from=build /usr/src/app/dist /usr/src/app/dist

COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules

EXPOSE 3000

CMD ["node", "dist/app.js"]