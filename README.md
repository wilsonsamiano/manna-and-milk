# Sunny ABC

A calm alphabet and numbers game for little ones. One big letter or number at a time, spoken with the tablet’s own voice. No timers, no scores, no ads.

**Status: published beta.**

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-wilsonsamiano-FFDD00?style=flat&logo=buy-me-a-coffee&logoColor=000)](https://buymeacoffee.com/wilsonsamiano)

[Buy me a coffee](https://buymeacoffee.com/wilsonsamiano)

The same link is on the grown-ups screen (hold the sun).

## Install the APK

Sideload only. Not on the Play Store.

1. Download **sunny-abc-beta.apk** from [Releases](https://github.com/wilsonsamiano/sunny-abc/releases/tag/v0.1.11-beta).
2. On the tablet, open the file and allow install from that source.
3. Open Sunny ABC. It runs offline after install. Letters, tracing, counting, and numbers through 100 are in the app.

Works on Android and Fire tablets. The voice is the tablet’s own text-to-speech. If a device has no voice, the words stay on screen.

## One-file page

**Sunny-ABC.html** on [Releases](https://github.com/wilsonsamiano/sunny-abc/releases/tag/v0.1.11-beta) is the whole game in a single HTML file. Pictures and spoken words are inside the file. No extra folders.

1. Download **Sunny-ABC.html**.
2. Open it in Silk or Chrome on the tablet.
3. It plays with the network off. Hold the sun for grown-ups (ranges, sound, light or dark).

The same file is `sunny-abc.html` in this repo. `www/` is the split version (page, script, and voice clips) used by the APK.

## Play in a browser

The game is the `www/` folder: `index.html`, `app.css`, `app.js`, and the voice clips. It works offline after the first load.

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

The signed beta APK is attached to the [v0.1.11-beta release](https://github.com/wilsonsamiano/sunny-abc/releases/tag/v0.1.11-beta). GitHub Actions also builds a debug APK on `main` as an artifact. The release file is the one to install. It is signed with the same key as 0.1.10, so it installs over that beta. The app also checks GitHub for a newer copy and can install it over itself. You do not uninstall first. Android still asks you to tap Update.

## Layout

- `sunny-abc.html` — the same game as one file
- `www/` — the game (HTML, CSS, vanilla JavaScript, voice clips)
- `app/` — Android WebView shell that bundles `www/` so the tablet does not need a network

## License

MIT © 2026 Wilson Samiano
