FROM node:14.17.3-alpine3.14 AS build
WORKDIR /opt
COPY --chown=node:node . .
RUN --mount=type=secret,mode=0644,id=npmrc,target=/opt/.npmrc npm install
ENV NODE_ENV production
RUN npm run build

FROM httpd:2.4 as deploy
ARG CONF_DIR=/usr/local/apache2/conf/
WORKDIR /opt/bcst-owf-interop
COPY --from=build /opt/node_modules ./node_modules
COPY --from=build /opt/build ./build
COPY httpd.conf certs/bcst-owf-interop.pem certs/bcst-owf-interop-key.pem certs/rootCA.pem ${CONF_DIR}
EXPOSE 8443