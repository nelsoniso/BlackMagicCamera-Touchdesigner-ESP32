# Spotify Web Control

Simple single-page app to control Spotify playback from a browser (including a seek slider).

## 1) Create Spotify app settings

In your Spotify Developer Dashboard app:

- Copy your **Client ID**
- Add a **Redirect URI** that matches exactly where this page is hosted  
  (example: `https://<your-domain>/spotify-web-control/index.html`)

## 2) Run locally

From the repository root:

```bash
python3 -m http.server 4173
```

Then open:

`http://localhost:4173/spotify-web-control/index.html`

Use this same URL as Redirect URI for local testing.

## 3) Scopes required

- `user-read-playback-state`
- `user-modify-playback-state`
- `user-read-currently-playing`

## Notes

- Playback control endpoints usually require Spotify Premium.
- You need an active Spotify device (open Spotify on iPhone and start playback).
