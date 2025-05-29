# nest-chat-websocket

**nest-chat-websocket** est une application de chat instantané fullstack utilisant **NestJS**, **Vue 3**, **WebSocket** et entièrement **dockerisée** pour une mise en place rapide et efficace. Le backend gère l'authentification des utilisateurs et la communication temps réel, tandis que le frontend propose une interface moderne et réactive.

## Lancer le projet

### Prérequis

- [Docker](https://www.docker.com/) et [Docker Compose](https://docs.docker.com/compose/) installés
- Fichier `firebase.credential.json` créé à la racine du backend. (Donné dans le .zip sur myges [ici](https://myges.fr/common/project-group-gestion/425135). *(si il n'y ai pas déjà)*

### Étapes

```bash
# 1. Lancer tous les services
docker-compose up --build
```

### Accès

- Le frontend sera accessible sur <http://localhost:3000>
- L’API NestJS sur <http://localhost:1506> (selon config)
- Les WebSockets fonctionnent via le backend sur le même port
