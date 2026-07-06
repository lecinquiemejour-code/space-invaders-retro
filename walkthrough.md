# Walkthrough — Space Invaders Rétro

Bienvenue dans les coulisses de la création de ce clone de Space Invaders ! 
Si tu débutes en programmation, ce projet est un excellent exemple pour comprendre comment structurer un jeu en JavaScript natif (sans moteur externe) en utilisant l'API HTML5 Canvas.

## L'architecture du projet

Le projet est divisé en plusieurs fichiers (modules) qui ont chacun une responsabilité unique. C'est le secret pour ne pas se perdre dans son code !

- **`index.html`** : C'est la coquille. Il contient l'élément `<canvas>` (notre écran de jeu) et charge notre script principal.
- **`style.css`** : S'occupe de la mise en page. Il donne ce style "arcade" en centrant l'écran sur un fond très foncé et en chargeant la police rétro.
- **`src/game.js`** : C'est le **chef d'orchestre**. 
  - Il gère la **Game Loop** (la boucle de jeu) : à chaque fraction de seconde, il met à jour la logique via `update()`, puis dessine le résultat via `render()`.
  - Il gère les différents états (écran d'accueil, partie en cours, Game Over, Victoire) et la remise à zéro de la partie.
- **`src/input.js`** : Les "oreilles" du jeu. Il ne fait qu'écouter si les touches du clavier sont enfoncées ou relâchées, et retient leur état pour éviter les bugs de frappe.
- **`src/player.js`** : S'occupe du vaisseau vert. Il contient les règles de ses déplacements (bornés à l'écran) et gère la création de son tir unique.
- **`src/aliens.js`** : Gère l'essaim ennemi ! Au lieu de calculer les mouvements de 55 aliens individuellement, il déplace une grande "boîte" qui les contient. C'est aussi lui qui calcule si un alien se fait toucher, et qui déclenche les tirs ennemis depuis la première ligne.

## Les concepts clés à retenir

1. **La Game Loop (`requestAnimationFrame`)** : Le jeu n'attend pas que le joueur agisse pour fonctionner. Il se rafraîchit à 60 images par seconde en permanence !
2. **Le Dessin Dynamique** : Toutes les formes (le vaisseau pixelisé, les aliens, les tirs) sont dessinées en temps réel à l'aide de simples rectangles de couleur (`ctx.fillRect`). Pas d'images externes à charger, c'est du pur code, très rapide.
3. **Les Collisions (AABB)** : Pour savoir si un tir touche un alien ou le joueur, on vérifie mathématiquement si les deux rectangles de ces objets se superposent dans l'espace.

N'hésite pas à explorer le code localement (dans `src/`) pour expérimenter : essaie de changer les couleurs, la vitesse des tirs ou le nombre d'aliens !
