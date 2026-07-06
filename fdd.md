# FDD — Décomposition en features — Space Invaders Rétro

> **Version** 0.1 · **Date** 2026-07-06 · **Statut** Brouillon · **Méthodologie** VibeCoding PDCA
> Traduit les fonctionnalités du PRD (table MoSCoW) en **features-unités de construction** de taille unitaire (réalisables en un seul cycle PDCA).

## Features issues des « Must have » (La v1)

Ces fonctionnalités constituent le cœur indispensable du jeu pour sa première version fonctionnelle.

| # | Feature (`action résultat objet`) | Issue de (PRD) | Note |
|---|---|---|---|
| F1 | Initialiser le squelette de l'application (HTML/CSS/JS et favicon) | Contrainte de lancement | Crée les fichiers de base, le Canvas noir de départ et une favicon factice pour éviter les erreurs de console. |
| F2 | Écouter et stocker les entrées clavier | Section 5 (Interactions) | Capture l'état des flèches, des touches Q/D, Espace et Entrée de manière réactive. |
| F3 | Afficher et déplacer le vaisseau joueur | Section 4 (Déplacement vaisseau) | Affiche le vaisseau vert en bas du Canvas et gère ses déplacements gauche/droite limités à l'écran. |
| F4 | Tirer un projectile joueur unique | Section 4 (Tir du joueur) | Gère la création, le déplacement vertical et la suppression (en sortie d'écran) du missile du joueur (1 max à la fois). |
| F5 | Afficher et déplacer la grille d'aliens | Section 4 (Grille d'aliens) | Génère une matrice d'aliens, gère leur déplacement horizontal, leur descente d'un cran en bordure et leur accélération. |
| F6 | Détecter les collisions des tirs joueur avec les aliens | Section 4 & 8 (Score & collisions) | Détruit l'alien touché, supprime le missile, augmente le score et augmente la vitesse globale de la grille. |
| F7 | Déclencher des tirs aliens et détecter les collisions avec le joueur | Section 4 (Tirs aliens & collisions) | Fait tirer les aliens aléatoirement vers le bas. Si le joueur est touché, lui retire une vie et réinitialise sa position. |
| F8 | Gérer les états de fin de jeu et réinitialisation | Section 4 (Game Over / Victoire) | Gère la transition vers les écrans Victoire ou Game Over (si 0 vie ou aliens en bas) et le redémarrage (Touche Entrée). |

## Features issues des « Should / Could have » (Les v2 et v3)

Ces fonctionnalités enrichiront le jeu après la mise en place de la v1 stable.

| # | Feature | Priorité | Note |
|---|---|---|---|
| F9 | Afficher et détruire les 4 abris boucliers | Should have | Place 4 boucliers destructibles au tir (du joueur ou des aliens). |
| F10| Faire apparaître et détruire la soucoupe mystère volante | Should have | Fait traverser un OVNI bonus tout en haut de l'écran à intervalles réguliers. |
| F11| Synthétiser et jouer des effets sonores rétro 8-bit | Could have | Utilise l'API Web Audio native du navigateur pour générer les bruits de tirs, explosions et battements. |
| F12| Enregistrer et afficher le meilleur score local | Could have | Utilise le `localStorage` pour sauvegarder et afficher le meilleur score global. |

## Couverture du PRD

Chaque exigence de notre PRD doit correspondre à une feature ci-dessus.

| Exigence du PRD | Couverte par | Si non couverte : raison |
|---|---|---|
| Déplacement vaisseau (Must) | F3 | — |
| Tir unique joueur (Must) | F4 | — |
| Grille aliens (Must) | F5 | — |
| Tirs aliens (Must) | F7 | — |
| Collisions projectiles (Must) | F6, F7 | — |
| Vies et scores (Must) | F6, F7, F8 | — |
| Écrans de fin et victoire (Must) | F8 | — |
| Style Retro Vintage Arcade (Visuel) | F1, F3, F5 | Graphismes et polices rétro configurés dès l'initialisation du Canvas. |
| Abres boucliers (Should) | F9 | — |
| Soucoupe mystère (Should) | F10 | — |
| Effets sonores 8-bit (Could) | F11 | — |
| Enregistrer High Score (Could) | F12 | — |
| 60 FPS constants (Contrainte) | F1 | Assuré par l'utilisation de `requestAnimationFrame` dès F1. |
| Contrôles clavier (Interactions) | F2 | — |

## Hors périmètre (Won't have)

Exclusions explicites pour éviter la dérive du projet :
- Mode multijoueur.
- Graphismes 3D ou effets modernes complexes.
- Système de compte en ligne ou base de données.

## Dépendances entre features

L'ordre de développement sera guidé par ces dépendances techniques :
- **F1 (Squelette)** est le prérequis de toutes les features.
- **F2 (Entrées clavier)** est nécessaire avant de pouvoir déplacer le vaisseau ou tirer (**F3, F4**).
- **F3 (Joueur)** et **F5 (Aliens)** doivent exister pour gérer les missiles (**F4**) et les tirs ennemis (**F7**).
- **F6 (Collisions)** nécessite **F4** (missile joueur) et **F5** (aliens).
- **F7 (Tirs aliens)** nécessite **F3** (joueur) et **F5** (aliens).
- **F8 (États de fin)** nécessite la détection des conditions de fin (vies à 0 de **F7** ou aliens arrivés en bas de **F5**).
