FROM node:14 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json /app/

# Install app dependencies
RUN cd /app/ && npm install

COPY . /app/

RUN cd /app/ && npm run build

FROM node:14

EXPOSE 3000

RUN apt-get -y install tzdata

RUN mkdir /app/

WORKDIR /app/

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/prisma /app/prisma

CMD [ "npm", "run", "deploy:production" ]
