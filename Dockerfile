FROM node:lts-alpine
WORKDIR /usr/src/app
COPY "package.json" "./"
COPY "package-lock.json" "./"
RUN npm install
COPY . .
COPY "wait-for.sh" "./"
RUN ["chmod", "+x", "./wait-for.sh"]
RUN apk update && apk add --no-cache netcat-openbsd
CMD sh -c './wait-for.sh elasticsearch:9200 -t 30 -- npm start'
