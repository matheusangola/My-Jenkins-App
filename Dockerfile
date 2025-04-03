# FROM node:20.17.0-alpine
# RUN npm install -g netlify-cli

# FROM nginx-80-tcp
FROM nginx:1.27-alpine
COPY build /usr/share/nginx/html