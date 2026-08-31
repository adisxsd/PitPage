FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

COPY backend ./backend

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]