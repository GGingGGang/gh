FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY A ./A
COPY B ./B
COPY C ./C
COPY D ./D
COPY F ./F
COPY scripts ./scripts
COPY site ./site
RUN npm run build

FROM docker.io/nginxinc/nginx-unprivileged:1.28-alpine
COPY --from=build --chown=101:101 /app/public /usr/share/nginx/html
COPY deploy/base/nginx.conf /etc/nginx/conf.d/default.conf
USER root
RUN sed -i 's|/git/current/public|/usr/share/nginx/html|' /etc/nginx/conf.d/default.conf
USER 101
EXPOSE 8080
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
