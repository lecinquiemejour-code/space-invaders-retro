# Architecture & Stack — Space Invaders Rétro

> **Version** 0.1 · **Date** 2026-07-06 · **Statut** Validé le 2026-07-06 · **Méthodologie** VibeCoding PDCA
> Dérivé du PRD. Décrit le *comment* technique. Ce document est stable.

## Approche retenue

Utilisation de l'API native **HTML5 Canvas 2D** en Vanilla JavaScript.

**Pourquoi celle-ci :** 
Elle offre des performances optimales (60 FPS constants) idéales pour un jeu d'arcade 2D. Elle permet de gérer directement le dessin des éléments au pixel près, ce qui est parfait pour l'esthétique rétro. De plus, elle évite toute dépendance externe et fournit un excellent cadre d'apprentissage pour concevoir une boucle de jeu (*Game Loop*) propre.

## Stack technique

| Couche | Choix | Rôle |
|---|---|---|
| Langage / framework | HTML5 / CSS3 / JavaScript (ES6+ Vanilla) | Structure, styles et logique du jeu |
| Interface / rendu | API Canvas 2D | Dessin fluide des sprites et animations |
| Données (si besoin) | `localStorage` | Sauvegarde locale du meilleur score (*High Score*) |
| Hébergement / déploiement | Netlify | Mise en ligne finale unique |
| Versioning | Git | Historique et sauvegardes locales |

## Lancement local

**Commande :** `npx serve -l 3000` · **Port :** `3000` · **Prérequis :** Node.js installé (pour exécuter `npx`)

> Cette commande et ce port sont figés pour être réutilisés à chaque test par l'utilisateur (étape CHECK).

## Architecture en bref

Le projet sera découpé de manière modulaire (un fichier par responsabilité) :
- `index.html` : Contient l'élément `<canvas>` et charge les scripts.
- `style.css` : Gère la mise en page, centre le jeu et applique le style d'arcade (lueur néon, écran noir).
- `src/game.js` : Fichier principal qui initialise le jeu, contient la boucle principale (`Update` et `Render`) et gère les écrans (Démarrage, Jeu, Game Over, Victoire).
- `src/input.js` : Écoute les touches du clavier et stocke leur état.
- `src/player.js` : Représente le vaisseau du joueur et ses projectiles.
- `src/aliens.js` : Gère la grille d'extraterrestres, leurs déplacements saccadés, leurs tirs et l'accélération du rythme.
- `src/shield.js` : Gère les 4 boucliers destructibles (étape *Should Have*).

### Schéma de la boucle de jeu (Game Loop)
```
  [Clavier (input.js)]
         │
         ▼
  ┌──────────────┐      ┌─────────────────────────────┐
  │   game.js    │      │          Update()           │
  │ (Game Loop)  ├─────►│ - Positions des entités     │
  │              │◄─────┤ - Collisions & points       │
  └──────┬───────┘      └─────────────────────────────┘
         │
         ▼
  ┌─────────────────────────────┐
  │          Render()           │
  │ - Dessine sur le Canvas 2D  │────► Element <canvas> à l'écran
  │ - Effets d'explosions       │
  └─────────────────────────────┘
```

## Contraintes techniques héritées du PRD

- **Performance :** Animation calée sur `requestAnimationFrame` pour assurer 60 images par seconde constantes.
- **Compatibilité :** Desktop avec clavier (touches fléchées, Q/D et Espace), navigateurs récents.

## Alternatives écartées

- **Approche DOM HTML/CSS :** Écartée car manipuler des dizaines de balises HTML pour les projectiles et les débris d'explosions ralentit le navigateur et ne donne pas un rendu pixel-art propre.
- **Moteur Kaboom.js :** Écartée car elle cache le fonctionnement interne (collisions, Game Loop) derrière des fonctions toutes prêtes, ce qui réduit la valeur d'apprentissage pour un profil débutant.
