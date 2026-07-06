# Bilan Post-Mortem — Space Invaders Rétro

## Prévu vs Réalisé
**Objectif initial :** Recréer le jeu d'arcade classique en respectant son esthétique rétro et son gameplay saccadé d'origine.
**Bilan :** Objectif atteint. Toutes les *Must have* du PRD ont été livrées et le jeu est en ligne.
- Déplacements, tir unique, armée d'aliens avec descente latérale fonctionnels.
- Gestion complète des états (Start, Playing, Game Over, Victory) avec réinitialisation propre.
- Le jeu tourne à 60 FPS constants de manière très fluide avec Canvas natif.

**Écarts par rapport au PRD :**
- Tous les bonus (boucliers destructibles, soucoupe volante, effets sonores 8-bit et particules d'explosion) ont finalement été implémentés avec succès lors de la phase de V2 (itération supplémentaire), dépassant ainsi les objectifs de la V1 !

## Ce qui a bien fonctionné
- **L'approche "Essaim"** pour la grille d'aliens s'est avérée excellente. Gérer une grande boîte globale au lieu de 55 entités distinctes a permis de garder le code de déplacement très simple et totalement fidèle au mouvement d'origine (et aux contraintes de performances).
- **Le système de modules** (`player.js`, `aliens.js`) a empêché le fichier principal (`game.js`) de devenir un plat de spaghettis illisible.

## Frictions rencontrées et leçons apprises
- **Bugs de logique de contrôle :** Lors de l'implémentation du tir, un bug lié au `return` anticipé lors de l'arrêt du vaisseau a bloqué la détection de la touche Espace.
  **Leçon :** Les "Early returns" (retours anticipés) sont très utiles pour simplifier une fonction, mais il faut toujours vérifier qu'ils ne court-circuitent pas une logique totalement indépendante (comme le tir) placée plus bas dans la même fonction.

Ce projet prouve qu'il est tout à fait possible de bâtir un jeu d'arcade complet sans aucun framework lourd, offrant un socle pédagogique parfait pour l'apprentissage du développement web.
