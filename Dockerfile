# FROM node:20.17.0-alpine
# RUN npm install -g netlify-cli

FROM ngnix-80-tcp
COPY build /usr/share/nginx/html