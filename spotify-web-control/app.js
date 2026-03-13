const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_URL = "https://api.spotify.com/v1";
const STORAGE_KEY = "spotify-web-control-auth";
const CONFIG_KEY = "spotify-web-control-config";
const SCOPES = [
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
];

const els = {
  clientId: document.querySelector("#clientId"),
  redirectUri: document.querySelector("#redirectUri"),
  saveConfigBtn: document.querySelector("#saveConfigBtn"),
  loginBtn: document.querySelector("#loginBtn"),
  logoutBtn: document.querySelector("#logoutBtn"),
  status: document.querySelector("#status"),
  trackName: document.querySelector("#trackName"),
  currentTime: document.querySelector("#currentTime"),
  durationTime: document.querySelector("#durationTime"),
  seekSlider: document.querySelector("#seekSlider"),
  prevBtn: document.querySelector("#prevBtn"),
  playPauseBtn: document.querySelector("#playPauseBtn"),
  nextBtn: document.querySelector("#nextBtn"),
};

let isDragging = false;
let latestPlayback = null;

function loadJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function msToClock(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const min = Math.floor(total / 60);
  const sec = String(total % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

function setStatus(text, isError = false) {
  els.status.textContent = text;
  els.status.style.color = isError ? "#ffb4b4" : "#c8e6c9";
}

function setControlsEnabled(enabled) {
  els.seekSlider.disabled = !enabled;
  els.prevBtn.disabled = !enabled;
  els.playPauseBtn.disabled = !enabled;
  els.nextBtn.disabled = !enabled;
}

function getConfig() {
  return {
    clientId: els.clientId.value.trim(),
    redirectUri: els.redirectUri.value.trim(),
  };
}

function setConfigForm() {
  const config = loadJson(CONFIG_KEY) || {};
  els.clientId.value = config.clientId || "";
  els.redirectUri.value = config.redirectUri || `${location.origin}${location.pathname}`;
}

function saveConfig() {
  const config = getConfig();
  if (!config.clientId || !config.redirectUri) {
    setStatus("Client ID and Redirect URI are required.", true);
    return false;
  }
  saveJson(CONFIG_KEY, config);
  setStatus("Settings saved.");
  return true;
}

function randomString(length = 64) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join("");
}

function base64url(bytes) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function createCodeChallenge(codeVerifier) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));
  return base64url(new Uint8Array(digest));
}

async function beginLogin() {
  if (!saveConfig()) {
    return;
  }

  const { clientId, redirectUri } = getConfig();
  const state = randomString(16);
  const codeVerifier = randomString(96);
  const codeChallenge = await createCodeChallenge(codeVerifier);

  sessionStorage.setItem("spotify-state", state);
  sessionStorage.setItem("spotify-code-verifier", codeVerifier);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    state,
    scope: SCOPES.join(" "),
  });

  location.href = `${AUTH_URL}?${params.toString()}`;
}

async function exchangeCodeForToken(code) {
  const config = loadJson(CONFIG_KEY);
  if (!config?.clientId || !config?.redirectUri) {
    throw new Error("Missing client configuration.");
  }

  const codeVerifier = sessionStorage.getItem("spotify-code-verifier");
  const expectedState = sessionStorage.getItem("spotify-state");
  const actualState = new URLSearchParams(location.search).get("state");
  if (!codeVerifier || !expectedState || expectedState !== actualState) {
    throw new Error("State mismatch. Please sign in again.");
  }

  const body = new URLSearchParams({
    client_id: config.clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: config.redirectUri,
    code_verifier: codeVerifier,
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    throw new Error(`Token exchange failed: ${res.status}`);
  }

  const data = await res.json();
  saveJson(STORAGE_KEY, {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  });

  sessionStorage.removeItem("spotify-code-verifier");
  sessionStorage.removeItem("spotify-state");
  history.replaceState({}, document.title, location.pathname);
}

async function refreshTokenIfNeeded() {
  const auth = loadJson(STORAGE_KEY);
  if (!auth?.accessToken) {
    throw new Error("Not signed in.");
  }

  if (Date.now() < (auth.expiresAt || 0) - 60_000) {
    return auth.accessToken;
  }

  if (!auth.refreshToken) {
    throw new Error("Session expired. Sign in again.");
  }

  const config = loadJson(CONFIG_KEY);
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: auth.refreshToken,
    client_id: config.clientId,
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    throw new Error("Token refresh failed. Sign in again.");
  }

  const data = await res.json();
  const merged = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || auth.refreshToken,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  saveJson(STORAGE_KEY, merged);
  return merged.accessToken;
}

async function api(path, options = {}) {
  const accessToken = await refreshTokenIfNeeded();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  });

  if (res.status === 204) {
    return null;
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify API ${res.status}: ${text || "Request failed"}`);
  }

  return res.json();
}

function renderPlayback(playback) {
  latestPlayback = playback;
  const hasTrack = playback?.item?.duration_ms;
  setControlsEnabled(Boolean(hasTrack));

  if (!hasTrack) {
    els.trackName.textContent = "No active playback detected.";
    els.currentTime.textContent = "0:00";
    els.durationTime.textContent = "0:00";
    els.seekSlider.value = "0";
    els.seekSlider.max = "100";
    return;
  }

  const title = playback.item.name;
  const artists = (playback.item.artists || []).map((a) => a.name).join(", ");
  els.trackName.textContent = `${title} — ${artists}`;
  els.playPauseBtn.textContent = playback.is_playing ? "Pause" : "Play";

  if (!isDragging) {
    els.seekSlider.max = String(playback.item.duration_ms);
    els.seekSlider.value = String(playback.progress_ms || 0);
    els.currentTime.textContent = msToClock(playback.progress_ms || 0);
  }
  els.durationTime.textContent = msToClock(playback.item.duration_ms);
}

async function refreshPlayback() {
  try {
    const playback = await api("/me/player");
    renderPlayback(playback);
    if (!playback) {
      setStatus("Connected. Open Spotify on iPhone and start playback.");
    } else {
      setStatus("Connected.");
    }
  } catch (error) {
    setControlsEnabled(false);
    setStatus(error.message, true);
  }
}

async function seekTo(ms) {
  const params = new URLSearchParams({ position_ms: String(Math.max(0, Math.floor(ms))) });
  if (latestPlayback?.device?.id) {
    params.set("device_id", latestPlayback.device.id);
  }
  await api(`/me/player/seek?${params.toString()}`, { method: "PUT" });
}

function attachEvents() {
  els.saveConfigBtn.addEventListener("click", saveConfig);
  els.loginBtn.addEventListener("click", () => {
    beginLogin().catch((error) => setStatus(error.message, true));
  });
  els.logoutBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    setControlsEnabled(false);
    setStatus("Logged out.");
  });

  els.prevBtn.addEventListener("click", async () => {
    try {
      await api("/me/player/previous", { method: "POST" });
      await refreshPlayback();
    } catch (error) {
      setStatus(error.message, true);
    }
  });
  els.playPauseBtn.addEventListener("click", async () => {
    try {
      const method = latestPlayback?.is_playing ? "pause" : "play";
      await api(`/me/player/${method}`, { method: "PUT" });
      await refreshPlayback();
    } catch (error) {
      setStatus(error.message, true);
    }
  });
  els.nextBtn.addEventListener("click", async () => {
    try {
      await api("/me/player/next", { method: "POST" });
      await refreshPlayback();
    } catch (error) {
      setStatus(error.message, true);
    }
  });

  els.seekSlider.addEventListener("pointerdown", () => {
    isDragging = true;
  });
  els.seekSlider.addEventListener("pointerup", async () => {
    isDragging = false;
    try {
      await seekTo(Number(els.seekSlider.value));
      await refreshPlayback();
    } catch (error) {
      setStatus(error.message, true);
    }
  });
  els.seekSlider.addEventListener("input", () => {
    els.currentTime.textContent = msToClock(Number(els.seekSlider.value));
  });
}

async function init() {
  setConfigForm();
  setControlsEnabled(false);
  attachEvents();

  const params = new URLSearchParams(location.search);
  const code = params.get("code");
  if (code) {
    try {
      setStatus("Completing Spotify login...");
      await exchangeCodeForToken(code);
      setStatus("Login complete.");
    } catch (error) {
      setStatus(error.message, true);
      return;
    }
  }

  if (loadJson(STORAGE_KEY)?.accessToken) {
    await refreshPlayback();
    setInterval(refreshPlayback, 1500);
  } else {
    setStatus("Not connected.");
  }
}

init();
