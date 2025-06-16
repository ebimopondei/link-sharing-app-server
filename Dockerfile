FROM node:23.3.0

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build 

EXPOSE 3001

CMD ["npm", "run", "start"]