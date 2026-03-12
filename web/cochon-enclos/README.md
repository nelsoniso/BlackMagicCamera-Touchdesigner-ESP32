# Cochon Enclos Web App

Mini game web:

- des cochons bougent aléatoirement dans un enclos,
- bouton `+` pour ajouter un cochon avec le nom d'un contact.

## Contact picker

Le code utilise l'API web `navigator.contacts.select(["name"])` quand disponible.

Si le navigateur ne supporte pas cette API, un fallback manuel (`prompt`) est utilisé pour entrer un nom.

## Lancer localement

Depuis la racine du repo:

```bash
python3 -m http.server 8080
```

Puis ouvrir:

`http://localhost:8080/web/cochon-enclos/`

## Sur iPhone

- ouvrir en `https://` pour les API sensibles,
- toucher `+` pour lancer le sélecteur contact (si supporté),
- sinon entrer un nom manuellement.

