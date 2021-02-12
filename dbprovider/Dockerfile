FROM node:14
WORKDIR /opt/armut/dbprovider
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "node", "index.js" ]