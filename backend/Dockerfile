FROM node:20-alpine

WORKDIR /app

# Install openssl for Prisma query engine on alpine
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

EXPOSE 3001

# The start command can also handle push/migrate depending on environment, but we will rely on CMD script.
CMD ["npm", "start"]
