FROM node:12

#RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

#COPY --chown=node:node . .

#USER node

EXPOSE 8080
#RUN npx sequelize init
#RUN npx sequelize db:migrate
CMD [ "node", "src/index.js" ]
