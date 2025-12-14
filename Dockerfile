FROM node:20-alpine

WORKDIR /app

# Copia package files
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o projeto
COPY . .

# Gera o Prisma Client
RUN npx prisma generate --schema=./database/prisma/schema.prisma

EXPOSE 3000

CMD ["npm", "run", "start:dev"]