FROM node:12.16-alpine as base

EXPOSE 3000
EXPOSE 35729
WORKDIR /usr/app/

COPY package.json yarn.lock* tsconfig.json ./
RUN yarn config list
RUN yarn install --frozen-lockfile && yarn cache clean --force

########## DEV STAGE ##########

FROM base as dev
EXPOSE 9229
ENV REACT_APP_NODE_ENV development
COPY ./ ./
VOLUME ./src:/usr/app/src:delegated
CMD ["yarn", "start"]

########## PROD STAGE ##########

FROM base as prod
ENV REACT_APP_NODE_ENV production
RUN yarn global add serve

RUN yarn build
RUN yarn install --frozen-lockfile --production && yarn cache clean --force
COPY ./build ./build
RUN rm yarn.lock package.json

USER node
CMD [ "serve", "-s", "build" ]