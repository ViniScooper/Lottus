# Usa a imagem oficial do Node.js baseada em Alpine (mais leve)
FROM node:22-alpine

# Cria e define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos de configuração do NPM
COPY package*.json ./
COPY prisma ./prisma/

# Instala as dependências (sem gerar lock dependencies adicionais)
RUN npm install

# Gera os arquivos do Prisma Client (já apontando para o MySQL local)
RUN npx prisma generate

# Copia o restante do código da API
COPY . .

# Expõe a porta que a API utiliza
EXPOSE 3001

# Comando de inicialização do servidor
CMD [ "npm", "start" ]
