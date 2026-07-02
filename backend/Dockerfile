FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 4000

CMD ["sh", "-c", "node scripts/wait-for-db.js && npm run migrate && npm run seed && PORT=${PORT:-4000} npm run start"]
