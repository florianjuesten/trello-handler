FROM node:10

COPY package*.json ./
COPY trello-jobs.json ./

RUN npm install\
        && npm install typescript@latest -g

COPY . .
RUN tsc

CMD [ "node", "./dist/index.js" ]
