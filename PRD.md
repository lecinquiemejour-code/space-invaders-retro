# PRD — Space Invaders Rétro

> **Version** 0.1 · **Date** 2026-07-06 · **Auteur** Utilisateur · **Statut** Brouillon (étape *Plan* du PDCA)

## 1. Vision & Objectifs
L'objectif est de recréer un jeu vidéo de type **Space Invaders** fidèle à l'original de 1978. Le jeu doit susciter la nostalgie des salles d'arcade grâce à une expérience simple, épurée et authentique.

**Objectifs :**
- Offrir une session de jeu immédiate et amusante dans le navigateur.
- Respecter le feeling d'époque du gameplay et du visuel.

## 2. Non-objectifs
Ce que ce produit ne cherche **pas** à être :
- Un jeu moderne avec des graphismes 3D ou des effets complexes.
- Un jeu multijoueur.
- Un jeu avec des mécaniques de tir ou d'amélioration contemporaines (pas d'arbre de compétences, pas d'achats).
- Une application nécessitant un serveur ou une base de données (pas de compte utilisateur).

## 3. Utilisateurs cibles
| Persona | Caractéristiques | Besoin principal |
|---|---|---|
| Le Joueur Nostalgique (Créateur) | Passionné de rétro, veut jouer à sa propre création. | Lancer une partie rapide sur PC de bureau, retrouver le feeling vintage et se détendre quelques minutes. |

## 4. Fonctionnalités (MoSCoW)
- **Must have** :
  - Déplacement latéral gauche/droite du vaisseau joueur.
  - Tir du joueur (un seul projectile à l'écran simultanément).
  - Grille d'aliens qui descend d'un cran en touchant les bords de l'écran, et accélère au fil des destructions.
  - Tirs aléatoires des aliens vers le bas.
  - Gestion des collisions (projectile vs alien, projectile vs joueur).
  - Score et compteur de vies (3 vies initiales).
  - Écrans de jeu simples : Démarrage, Partie en cours, Game Over et Victoire (tous les aliens détruits).
- **Should have** :
  - Les 4 abris (boucliers) destructibles positionnés entre le joueur et la grille.
  - La soucoupe volante mystère (OVNI) qui traverse le haut de l'écran à intervalles réguliers pour donner des points bonus.
- **Could have** :
  - Effets sonores rétro 8-bit (sons de tir, d'explosion et accélération du rythme de la grille).
  - Sauvegarde du meilleur score (*High Score*) localement dans le navigateur (`localStorage`).
- **Won't have (pour l'instant)** :
  - Mode multijoueur, graphismes 3D, tableau des scores en ligne (cloud).

## 5. Interactions
- **Flèche Gauche / Touche Q** → Déplacer le vaisseau vers la gauche.
- **Flèche Droite / Touche D** → Déplacer le vaisseau vers la droite.
- **Barre Espace** → Tirer un missile.
- **Touche Entrée** → Démarrer une partie ou relancer après un Game Over / Victoire.

## 6. Spécifications visuelles / d'interface
- **Apparence :** 
  - Style retro vintage arcade.
  - Écran noir d'arcade, avec une typographie pixelisée (type Google Font *Press Start 2P*).
  - Couleurs phosphorescentes d'époque (vaisseau et abris en vert fluo, aliens colorés par rangées : magenta, cyan, jaune).
- **Comportement / animations :**
  - Mouvements des aliens volontairement saccadés (sauts de position pas à pas).
  - Petites explosions pixelisées lors des impacts.

## 7. Contraintes (exigences non-fonctionnelles)
- **Performance :** Animation à 60 FPS constants, sans saccade ni ralentissement.
- **Compatibilité :** Conçu pour ordinateurs de bureau (desktop) avec contrôles clavier, sur navigateurs web récents.
- **Accessibilité :** Commandes simples au clavier (alternatives Q/D et flèches).

## 8. Critères de succès
- Le vaisseau réagit instantanément (zéro latence ressentie) aux contrôles clavier.
- Le jeu accélère de manière fluide à mesure que la grille d'aliens se vide.
- Réinitialisation propre à la fin d'une partie permettant d'enchaîner sans bug.

## 9. Hypothèses & Questions ouvertes
- **Hypothèses retenues** : Le jeu sera développé en technologies web standards (HTML/JS) à exécuter localement.
- **À trancher plus tard** : L'implémentation exacte des abris destructibles pixel par pixel (se fera dans la phase de conception technique).
