# Erklärvideos mit Remotion

Dieses Repository enthält Erklärvideos für den Unterricht an einer beruflichen
Schule (FOS/BOS, Fach Psychologie) und für eine KI-Fortbildung von Lehrkräften.
Alle Videos liegen im Remotion-Projekt `my-video/`. Antworten an mich auf
Deutsch, in der Du-Form.

## Ziel und Stil

- 1920×1080, 30 fps, meist 2–3 Minuten, deutsche Sprecherstimme, Geräusche.
- Comic-Stil mit Witz: dicke Konturen, Comic-Schriftzüge („DING!“, „GELERNT!“),
  bewegte Figuren. Pro Szene höchstens ein, zwei Gags.
- Farben wie die Merkblätter der Schule (Jane-Addams-Basis):
  Petrol `#0B6B67`, Petrol hell `#E1EEED`, Amber `#F2B33D`, Amber hell `#FDF2D8`,
  Dunkel `#18211F`, Hintergrund `#FAF9F5`. Schrift: Inter.
- Kopfzeile jeder Szene wie im Merkblatt: Kicker mit Amber-Strich, Petrol-Titel,
  Amber-Linie; bei Schritten eine nummerierte Kugel und ein Pfad-Etikett.
- Fachbegriffe farbig markieren und am Ende im Merke-Kasten wiederholen.

## Aufbau eines Videos

Bewährte Szenenfolge: Titel → Problem/Einstieg → Kern in Schritten →
Beispiel/Anwendung → Merke. Jede Szene hat eigenen Sprechertext; die
Szenenlängen ergeben sich aus den Längen der Sprachaufnahmen.

Ein Video = ein Ordner `my-video/src/<Thema>/` mit
- `Scenes.tsx` (Szenen, Zeitplan `T`, Längen `DUR`),
- `Video.tsx` (Series + Composition, in `src/Root.tsx` registrieren),
- `voice.ts` (wird erzeugt, nicht von Hand ändern).

## Ablauf für ein neues Video

1. Mein Material (Merkblatt, Lehrbuchauszug, Stundenplanung) lesen und eine
   Szenenliste mit Sprechertext vorschlagen, bevor gebaut wird.
2. Sprechertext in `my-video/scripts/voice/<name>.json` (Schlüssel → Satz),
   kurze Sätze. In `scripts/make-voice.py` unter `TS_PATHS` den Pfad zu
   `src/<Thema>/voice.ts` eintragen.
3. Stimme: Piper (`pip install piper-tts`), Modell `de_DE-thorsten-high` von
   `huggingface.co/rhasspy/piper-voices` (de/de_DE/thorsten/high, `.onnx` und
   `.onnx.json`) in den Scratchpad laden, dann
   `python3 scripts/make-voice.py <pfad/zum/modell.onnx> <name>`.
   Englische Wörter lautschriftlich schreiben (z. B. „Klohd“ für Claude) und
   die Aussprache mit `PiperVoice.phonemize()` prüfen.
4. Szenen aus den vorhandenen Bausteinen bauen (siehe unten), nicht neu erfinden.
5. `npx tsc --noEmit`, dann Standbilder jeder Szene rendern und als
   Kontaktbogen ansehen: Überlappungen, abgeschnittener Text, Lesbarkeit.
6. Rendern:
   `npx remotion render <CompositionId> out/<datei>.mp4 --browser-executable=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`
   (der eigene Chrome-Download von Remotion ist im Container gesperrt).
   Lange Renders im Hintergrund laufen lassen.
7. Tonspur prüfen (`ffmpeg … -af volumedetect`), committen, pushen.
   `out/` ist nicht im Git; die fertigen MP4 an mich schicken.

## Bausteine (wiederverwenden)

- `src/ClaudeProjekt/kit.tsx`: `Scene` (Kopfzeile, Hintergrund), `Voice`, `Sfx`,
  `Cursor`/`CursorClicks`, `Modal`, `Button`, `FileRow`, `AppWindow`
  (nachgebautes Chat-Fenster), Farben `C`.
- `src/ClaudeProjekt/common.tsx`: `TitleBlock`, `ProblemBar`, `InfoCard`, `Item`,
  `MerkeBox`, `Toggle`, `atRatio` (Zeitpunkt als Anteil einer Sprachaufnahme).
- `src/ClaudeProjekt/chat.tsx`: `ChatView` mit Nachrichten, Scrollen und Tippen.
- `src/Konditionierung/fx.tsx`: `Burst` (Comic-Schriftzug), `Thought`
  (Gedankenblase), `Squiggle`, `Background`.
- `src/Konditionierung/Icons.tsx`: `Person` (normal/ängstlich), `Dog`, `Bell`,
  `Bowl`, `Drill`.
- `src/Konditionierung/ui.tsx`: `Appear`, `useAppear`.
- `public/sfx/`: pop, click, typing, whoosh, chime, bell, drip, clink, drill
  (erzeugt mit `scripts/make-sfx.py`, keine fremden Audiodateien).

## Claude- und ChatGPT-Fassung

Die Videos zum KI-Startpaket gibt es in zwei Fassungen. `src/platform.ts`
schaltet um (`IS_GPT`, `TOOL`, `pick(claude, chatgpt)`); Sprachdateien der
ChatGPT-Fassung liegen in `public/voice/chatgpt-<name>/`. Rendern mit
`REMOTION_PLATFORM=chatgpt npx remotion render …`.

## Regeln

- Keine echten Namen oder Daten von Schüler*innen, nur erfundene Fälle.
- Nachgebaute Oberflächen (Claude, ChatGPT, AIS.chat) mit „vereinfachte
  Darstellung“ kennzeichnen, keine Logos.
- Keine fremden Bilder, Musik oder Figuren; alles selbst zeichnen/erzeugen.
- Für Webseiten oder Uploads mit Größengrenze die Videos komprimieren:
  `ffmpeg -i in.mp4 -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k out.mp4`
  (ca. 5 MB statt 20 MB, Schrift bleibt scharf).
- Übersichtsseite aller Videos: https://claude.ai/artifact/4hty7sJpxtDXBZJdv9Gbw5
