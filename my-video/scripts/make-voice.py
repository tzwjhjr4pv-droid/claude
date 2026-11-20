"""Erzeugt die Sprecherstimme mit Piper (Stimme de_DE-thorsten-high).

Aufruf: python3 scripts/make-voice.py <pfad/zu/de_DE-thorsten-high.onnx>
Schreibt public/voice/*.wav und src/Konditionierung/voice.ts (Längen in Frames).
"""
import math, subprocess, sys, wave, pathlib

FPS = 30
ROOT = pathlib.Path(__file__).resolve().parent.parent
MODEL = sys.argv[1]

LINES = {
    "title": "Klassische Konditionierung. Wie lernen wir, auf einen Reiz zu reagieren, der uns vorher völlig gleichgültig war? Der russische Physiologe Iwan Pawlow hat das um 1900 an Hunden untersucht.",
    "vorherA": "Vor der Konditionierung: Bekommt der Hund Futter, fließt Speichel. Das ist angeboren. Das Futter ist ein unkonditionierter Reiz, der Speichelfluss eine unkonditionierte Reaktion.",
    "vorherB": "Eine Glocke dagegen ist zunächst ein neutraler Reiz. Der Hund horcht zwar auf, aber es fließt kein Speichel.",
    "waehrend": "Während der Konditionierung werden beide Reize gekoppelt. Die Glocke ertönt, und kurz darauf gibt es Futter. Das wird viele Male wiederholt.",
    "nachherA": "Nach der Konditionierung reicht schon die Glocke allein. Der Hund speichelt.",
    "nachherB": "Aus dem neutralen Reiz ist ein konditionierter Reiz geworden. Und der Speichelfluss auf die Glocke ist eine konditionierte, also gelernte Reaktion.",
    "term0": "Neutraler Reiz: Er löst zunächst keine bestimmte Reaktion aus.",
    "term1": "Unkonditionierter Reiz: Er löst ohne Lernen eine Reaktion aus.",
    "term2": "Unkonditionierte Reaktion: die angeborene Reaktion darauf.",
    "term3": "Konditionierter Reiz: der früher neutrale Reiz, der jetzt die Reaktion auslöst.",
    "term4": "Konditionierte Reaktion: die gelernte Reaktion auf diesen Reiz.",
    "alltagA": "Das gibt es auch bei Menschen. Wer beim Zahnarzt Schmerzen hatte, bekommt oft schon beim Geräusch des Bohrers Angst.",
    "alltagB": "Das Geräusch ist zum konditionierten Reiz geworden, die Angst zur konditionierten Reaktion.",
    "merke": "Merke: Ein neutraler Reiz wird durch wiederholte Kopplung mit einem unkonditionierten Reiz zum konditionierten Reiz. Er löst nun selbst eine Reaktion aus.",
}

frames = {}
for key, text in LINES.items():
    out = ROOT / "public" / "voice" / f"{key}.wav"
    subprocess.run(
        [sys.executable, "-m", "piper", "-m", MODEL, "-f", str(out),
         "--length-scale", "1.08", "--sentence-silence", "0.35"],
        input=text.encode(), check=True, capture_output=True,
    )
    with wave.open(str(out)) as w:
        frames[key] = math.ceil(w.getnframes() / w.getframerate() * FPS)

ts = "// Automatisch erzeugt von scripts/make-voice.py – nicht von Hand ändern.\n"
ts += "export const VOICE = {\n" + "".join(f"  {k}: {v},\n" for k, v in frames.items()) + "} as const;\n"
(ROOT / "src" / "Konditionierung" / "voice.ts").write_text(ts)
print(frames)
