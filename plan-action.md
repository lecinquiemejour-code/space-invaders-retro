# Plan d'action — Space Invaders Rétro

> **Document vivant** — mis à jour à **chaque tour** de la boucle PDCA. Son état doit toujours refléter la réalité du dépôt.
> **Méthodologie** VibeCoding PDCA · **Statut cadrage** Validé le 2026-07-06 · **Dernière mise à jour** 2026-07-06

## Comment lire / tenir ce document

- L'agent prend la **première feature « à faire »** dans l'ordre du tableau (les *Must have* d'abord).
- Il la passe en **« en cours »** au début du tour, puis en **« fait »** après le **commit local** (Check OK + GO #2).
- États possibles : `à faire` · `en cours` · `fait`.
- Tant qu'il reste des `à faire`, la boucle continue. Toutes les features en `fait` → on passe à la **clôture** (déploiement Netlify + bilan).

## Tableau de pilotage

| Ordre | Feature (du FDD) | État | Critère de réussite | Tour / commit |
|---|---|---|---|---|
| 1 | **F1 :** Initialiser le squelette de l'application (HTML/CSS/JS et favicon) | fait | Un écran noir centré s'affiche à l'adresse locale avec le texte rétro "PRESS ENTER TO START". Aucune erreur de fichier manquant (dont favicon) dans la console. | commit F1 |
| 2 | **F2 :** Écouter et stocker les entrées clavier | fait | Les touches (Q, D, Flèches, Espace, Entrée) sont capturées en console sans bloquer l'affichage. | commit F2 |
| 3 | **F3 :** Afficher et déplacer le vaisseau joueur | à faire | Le vaisseau vert fluo s'affiche en bas du Canvas. Il bouge à gauche/droite au clavier et s'arrête exactement sur les bords latéraux. | — |
| 4 | **F4 :** Tirer un projectile joueur unique | à faire | L'appui sur Espace lance un projectile blanc vers le haut. On ne peut pas en tirer un autre tant que le premier est à l'écran. | — |
| 5 | **F5 :** Afficher et déplacer la grille d'aliens | à faire | Une grille de 5 rangées de 11 aliens colorés s'affiche en haut. Elle se déplace horizontalement pas à pas de façon saccadée, descend d'un cran en bordure et change de sens. | — |
| 6 | **F6 :** Détecter les collisions des tirs joueur avec les aliens | à faire | Toucher un alien le détruit avec une petite explosion de pixels. Le score augmente et la grille d'aliens accélère légèrement. | — |
| 7 | **F7 :** Déclencher des tirs aliens et détecter les collisions avec le joueur | à faire | Des projectiles ennemis partent aléatoirement vers le bas. Toucher le joueur lui retire une vie et réinitialise sa position. | — |
| 8 | **F8 :** Gérer les états de fin de jeu et réinitialisation | à faire | Écran "GAME OVER" si 0 vie ou aliens en bas. Écran "VICTORY" si grille vide. L'appui sur Entrée réinitialise scores/vies/jeu. | — |
| — | **Déploiement Netlify** (mise en ligne) | à faire | Le site est accessible à l'URL publique Netlify et le joueur peut faire une partie complète en production. | — |

## Journal des passes de non-régression

| Date | Après feature # | Non-régression (local) | Anomalie / action |
|---|---|---|---|
| — | — | — | — |

## Pour aller plus loin (backlog de clôture)

| Idée de feature | Valeur | Effort estimé |
|---|---|---|
| **F9 :** Afficher et détruire les 4 abris boucliers (Should) | Moyenne | Moyenne |
| **F10 :** Faire apparaître et détruire la soucoupe mystère volante (Should) | Moyenne | Moyenne |
| **F11 :** Synthétiser et jouer des effets sonores rétro 8-bit (Could) | Haute | Faible (API Audio) |
| **F12 :** Enregistrer et afficher le meilleur score local (Could) | Faible | Faible |

## Notes de session

- Projet démarré en mode VibeCoding enchaîné à partir du PRD co-construit en session.
- Profil sélectionné : (1) Débutant / non-dev.
