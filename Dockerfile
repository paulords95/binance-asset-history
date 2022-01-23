FROM node:14

WORKDIR /usr/src/app

COPY . ./

RUN rm -f package-lock.json
RUN npm install

RUN npm run prisma:generate
RUN npm run build


EXPOSE 3000
CMD ["npm", "run", "start:prod"]