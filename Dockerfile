FROM node:10

COPY package*.json ./
COPY trello-jobs.yml ./

RUN npm install\
        && npm install typescript@latest -g

COPY . .
RUN tsc

CMD [ "node", "./dist/index.js" ]
