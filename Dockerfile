# 1. Base image
FROM node:20

# 2. Uygulama dizinini oluştur
WORKDIR /app

# 3. Bağımlılıkları yükle
COPY package*.json ./
RUN npm install

# 4. Kodları kopyala
COPY . .

# 5. Uygulamayı derle
RUN npm run build

# 6. Çalıştırılacak komut (prod)
CMD ["node", "dist/app.js"]
