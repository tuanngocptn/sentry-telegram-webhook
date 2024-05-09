FROM node:18.19-alpine

WORKDIR /code

COPY . /code

RUN npm install
RUN npm i -g @nestjs/cli
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]