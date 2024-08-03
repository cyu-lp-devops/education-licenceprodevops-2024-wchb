# TO DO LIST

# To-Do List Application

Cette application est une simple To-Do list construite avec Node.js pour le back-end et un front-end statique. Elle permet aux utilisateurs de créer, modifier, supprimer et lister des tâches.

## Fonctionnalités

- Ajouter une nouvelle tâche avec une date de début et de fin.
- Afficher toutes les tâches dans l'ordre croissant des dates de début.
- Modifier une tâche existante via une fenêtre pop-up.
- Supprimer une tâche.
- Les données sont persistées dans un fichier JSON.

## Prérequis

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (si vous voulez exécuter l'application dans un conteneur Docker)

## Installation

1. Clonez le dépôt sur votre machine locale :

   ```bash
   git clone https://github.com/WaelChb/To-do-list.git
   cd To-do-list
   ```

2. Installez les dépendances nécessaires :

   ```bash
   npm install
   ```

## Utilisation

1. Pour démarrer le serveur Node.js :

   ```bash
   node app.js
   ```

2. Ouvrez votre navigateur et accédez à `index.html` pour voir l'application en action.

### API Endpoints

- **GET /tasks** : Récupérer toutes les tâches.
- **POST /tasks** : Ajouter une nouvelle tâche. Le corps de la requête doit être en JSON avec les champs `title`, `startDate`, et `endDate`.
- **PUT /tasks/:id** : Modifier une tâche existante. Le corps de la requête doit contenir les champs à modifier.
- **DELETE /tasks/:id** : Supprimer une tâche existante.

## Utilisation avec Docker

Si vous préférez exécuter l'application dans un conteneur Docker, suivez les étapes ci-dessous :

1.  Construire l'image Docker

Assurez-vous d'être dans le répertoire du projet, puis exécutez :

```bash
docker build -t to-do-list .
```

2. Exécuter le conteneur

Pour démarrer l'application dans un conteneur Docker, utilisez la commande suivante :

```bash
docker run -p 3000:3000 my-node-app
```

### 3. Accéder à l'application

Ouvrez votre navigateur et accédez à `index.html` pour interagir avec l'application.
