# Erklärvideo: Ein Projekt in Claude anlegen

Remotion-Video (1920 × 1080, 30 fps, ca. 2 Minuten) zum **KI-Startpaket, Modul 1 „KI einrichten“**.
Es zeigt, wie man in Claude ein Projekt anlegt und es mit Anweisungen und Material füllt.

## Ablauf

| # | Szene | Inhalt |
|---|-------|--------|
| 1 | Intro | Modul 1 – Ein Projekt in Claude anlegen |
| 2 | Einstieg | „Ich muss der KI jedes Mal neu erklären …“ |
| 3 | Grundidee | Projekt (einmal einrichten) oder Chat (jedes Mal) |
| 4 | Fahrplan | Die vier Schritte: Anlegen, Anweisung, Hochladen, Testen |
| 5 | Vor dem Start | Einstellungen › Datenschutz › „Claude verbessern“ aus |
| 6 | Schritt 1 | Projekte › Neues Projekt › Name „Psychologie FOS 11“ |
| 7 | Schritt 2 | Muster-Anweisung einfügen, die drei Klammern ausfüllen |
| 8 | Schritt 3 | Dateien › + › Rahmenlehrplan und Musterblatt hochladen |
| 9 | Datenschutz | Ampel: unbedenklich, nur anonymisiert, unzulässig |
| 10 | Schritt 4 | Neuer Chat im Projekt, Testanfrage, Rückfragen der KI |
| 11 | Merke | Ins Projekt gehört, was immer gilt … |

Die Claude-Oberfläche ist **schematisch nachgebaut**: Sie zeigt die Menüwege aus der Präsentation, ist aber kein Screenshot. Die Antwort der KI in Schritt 4 ist ein Beispiel.

## Benutzen

```bash
npm install
npm run studio      # Vorschau und Bearbeitung im Browser
npm run render      # erzeugt out/claude-projekt-erklaervideo.mp4
```

Texte ändern: Szenen liegen in `src/scenes/` (`TextScenes.tsx` für Folien, `UiScenes.tsx` für die animierte Oberfläche).
Szenenlängen stehen in `src/Video.tsx`, Farben in `src/theme.ts`.

Schrift: Jost (SIL Open Font License), lokal in `public/fonts/`.
