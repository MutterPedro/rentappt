FROM node:12.16-alpine as base

EXPOSE 3000
WORKDIR /usr/app/

RUN npm i -g yarn@1.22.0

COPY package.json package-lock.json* ./
RUN yarn config list
RUN yarn install --frozen-lockfile && yarn cache clean --force

########## DEV STAGE ##########

FROM base as dev
EXPOSE 9229
ENV NODE_ENV development
COPY ./ ./
VOLUME ./src:/usr/app/src:delegated
CMD ["yarn", "start"]

########## PROD STAGE ##########

FROM base as prod
ENV NODE_ENV production

RUN yarn build
RUN yarn install --frozen-lockfile --production && yarn cache clean --force
COPY ./dist ./dist
RUN rm package-lock.json package.json

USER node
CMD [ "node", "./src/index.js" ]