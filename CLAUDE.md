## RÈGLE 0 — Méthode : VibeCoding PDCA, feature par feature

Le travail se fait **une feature à la fois**, en cycles PDCA. Chaque cycle suit cet ordre, sans le raccourcir :

**Plan → 🛑 GO #1 → Do → Check (local) → Act**

- **Plan** : proposer 3 options d'implémentation conformes à ces règles, expliquer le raisonnement. Ne rien coder à ce stade.
- **🛑 GO #1** : ne **jamais** écrire ou modifier du code sans approbation explicite (« GO »).
- **Do** : coder dans le périmètre strict de la feature.
- **Check** : lancer le **serveur local** et faire **tester par l'utilisateur** lui-même (jamais d'auto-validation par navigateur intégré ou sous-agent de navigation). Rien ne se publie sans vérification humaine en local.
- **Act** : si Check **KO** → revenir au Plan (rien n'est commité). Si Check **OK** → **🛑 GO #2** obligatoire avant le `commit` **local** (pas de `push` à ce stade — rien ne part en ligne). Puis mettre à jour l'état de la feature dans `plan-action.md`.
- **Non-régression (en local)** : à déclencher périodiquement, au jugement du dev (re-tester que les features déjà validées marchent toujours).
- **Mise en ligne — étape finale unique** : quand **toutes** les features sont « fait », clôture du chantier (**🛑 GO MISE EN LIGNE** : `push` + Netlify + URL vérifiée par l'utilisateur → puis walkthrough + post-mortem dans le dépôt → nouvelles features → checklist). Le déploiement n'arrive qu'**une fois**, en fin de projet, jamais à chaque feature.

> Méthode complète : voir `references/methode-pdca.md`. Cette Règle 0 n'en est que le rappel exécutable.

---

Ces règles encadrent ton comportement dans ce projet. Elles sont non négociables.

## GARDE-FOUS

### Règle 1 — Checkpoint obligatoire

Ne jamais écrire ou modifier du code sans approbation explicite ("GO").

### Règle 2 — Périmètre strict

Ne modifie que ce qui est explicitement demandé.

### Règle 3 — Réflexion avant action

Avant de demander le "GO", explique ton raisonnement de manière pédagogique.
Avant ET pendant chaque action (commande, édition), explique en termes simples
CE QUE tu fais et POURQUOI. L'utilisateur doit comprendre et apprendre, même passivement.

## MÉTHODE DE TRAVAIL

### Règle 4 — Décomposition en sous-tâches

Décompose chaque tâche complexe en étapes petites et séquentielles.

### Règle 5 — 3 options systématiques

Propose 3 approches distinctes pour chaque modification significative.

### Règle 6 — Plan d'action dans la todo list

Rédige un plan d'action détaillé avant chaque génération de code.

### Règle 7 — Todo list à jour en permanence

Mets à jour la todo list en temps réel.

## QUALITÉ DU CODE

### Règle 8 — Simplicité d'abord (KISS)

Privilégie toujours la solution la plus simple.

### Règle 9 — Rien de superflu (YAGNI)

N'ajoute jamais de fonctionnalité non demandée.

### Règle 10 — Code modulaire

Structure le code de manière modulaire (un fichier par responsabilité).

### Règle 11 — Logs de débogage détaillés

Ajoute des console.log explicites à chaque étape clé.

### Règle 12 — Commentaires utiles

Explique le POURQUOI (intention) plutôt que le QUOI.

## POSTURE

### Règle 13 — Communication pédagogique

Explique chaque décision technique en termes accessibles.

## ENVIRONNEMENT

### Règle 14 — PowerShell

PowerShell n'accepte pas `&&`. Utilise `;` pour enchaîner les commandes.
