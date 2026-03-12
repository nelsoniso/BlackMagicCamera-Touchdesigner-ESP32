# Nez Check (web)

Web app de démonstration:

- ouvre la caméra frontale,
- détecte le visage et une ROI autour du nez (MediaPipe FaceMesh),
- applique une analyse OpenCV.js (équivalent cv2 dans le navigateur),
- affiche un score indicatif.

## Important

- Analyse **non médicale**.
- C'est un indicateur visuel expérimental, sensible à la lumière et à l'angle.

## Lancer localement

Depuis la racine:

```bash
python3 -m http.server 8080
```

Puis:

`http://localhost:8080/web/nez-check/`

## iPhone

- Utiliser une URL `https://`.
- Accepter la permission caméra.
- Se placer en bonne lumière pour de meilleurs résultats.

