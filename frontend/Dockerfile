FROM node:20-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 5173

# Comando para desarrollo (puedes cambiar a 'build' y 'preview' para producción)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]