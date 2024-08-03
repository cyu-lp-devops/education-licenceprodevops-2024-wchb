# Étape 1 : Utiliser une image de base Node.js LTS
FROM node:18-alpine

# Étape 2 : Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Étape 3 : Copier package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Étape 4 : Installer les dépendances du projet
RUN npm install

# Étape 5 : Copier tout le reste du code dans le répertoire de travail
COPY . .

# Étape 6 : Exposer le port sur lequel l'application va tourner
EXPOSE 3000

# Étape 7 : Démarrer l'application
CMD ["node", "app.js"]
