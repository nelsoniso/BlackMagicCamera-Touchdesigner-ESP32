# Gyroscope live web app

This folder contains a static web page that:

- asks for iPhone motion permissions,
- streams gyroscope values in real time (`devicemotion.rotationRate`),
- shows orientation values (`deviceorientation`).

## Local test

From repository root:

```bash
python3 -m http.server 8080
```

Then open: `http://localhost:8080/web/gyro/`

## iPhone usage notes

1. Use an `https://` URL (required by browser security).
2. Tap **Start sensor stream** and accept permission prompts.
3. If values stay at zero in Safari, check:
   - Settings > Safari > Motion & Orientation Access = ON.

