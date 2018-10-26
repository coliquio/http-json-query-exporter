FROM node:10-alpine

ARG GIT_REF
ENV GIT_REF ${GIT_REF}

ENV PORT=8000

EXPOSE $PORT

ADD . /app

WORKDIR /app

RUN npm install --production

CMD ["node", "index.js"]
