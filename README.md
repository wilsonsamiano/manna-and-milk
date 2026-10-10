# Sunny ABC

A calm alphabet and numbers game for little ones. One big letter or number at a time, spoken with the tablet’s own voice. No timers, no scores, no ads.

**Status: published beta.**

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-wilsonsamiano-FFDD00?style=flat&logo=buy-me-a-coffee&logoColor=000)](https://buymeacoffee.com/wilsonsamiano)

[Buy me a coffee](https://buymeacoffee.com/wilsonsamiano)

The same link is on the grown-ups screen (hold the sun).

## Install the APK

Sideload only. Not on the Play Store.

1. Download **sunny-abc-beta.apk** from [Releases](https://github.com/wilsonsamiano/sunny-abc/releases/tag/v0.1.0-beta).
2. On the tablet, open the file and allow install from that source.
3. Open Sunny ABC. It runs offline after install. Letters, tracing, counting, and numbers through 100 are in the app.

Works on Android and Fire tablets. The voice is the tablet’s own text-to-speech. If a device has no voice, the words stay on screen.

## Play in a browser

The game is the `www/` folder. It is a tiny offline-capable page: `index.html`, `app.css`, `app.js`. GitHub Pages, when enabled, serves that folder.

## Build the APK

Needs JDK 17 and Android SDK 35.

```bash
export ANDROID_HOME="$HOME/Android/Sdk"
printf 'sdk.dir=%s\n' "$ANDROID_HOME" > local.properties
export SUNNY_STORE_FILE=/path/to/sunny-release.keystore
export SUNNY_STORE_PASSWORD=...
export SUNNY_KEY_ALIAS=sunnyabc
export SUNNY_KEY_PASSWORD=...
gradle assembleRelease
```

The signed beta APK is attached to the [v0.1.0-beta release](https://github.com/wilsonsamiano/sunny-abc/releases/tag/v0.1.0-beta). GitHub Actions also builds a debug APK on `main` as an artifact. The release file is the one to install.

## Layout

- `www/` — the game (HTML, CSS, vanilla JavaScript)
- `app/` — Android WebView shell that bundles `www/` so the tablet does not need a network

## License

MIT © 2026 Wilson Samiano
