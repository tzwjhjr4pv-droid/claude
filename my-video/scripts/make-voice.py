"""Erzeugt die Sprecherstimme mit Piper (Stimme de_DE-thorsten-high).

Aufruf: python3 scripts/make-voice.py <modell.onnx> <name>
Liest scripts/voice/<name>.json (Schlüssel -> Sprechtext),
schreibt public/voice/<name>/*.wav und gibt die Längen in Frames als
TypeScript-Datei aus (Pfad steht in der JSON-Datei unter "_ts" oder Standard).
"""
import json, math, subprocess, sys, wave, pathlib

FPS = 30
ROOT = pathlib.Path(__file__).resolve().parent.parent
MODEL, NAME = sys.argv[1], sys.argv[2]
TS_PATHS = {
    "konditionierung": "src/Konditionierung/voice.ts",
    "claude-projekt": "src/ClaudeProjekt/voice.ts",
}

lines = json.loads((ROOT / "scripts" / "voice" / f"{NAME}.json").read_text())
outdir = ROOT / "public" / "voice" / NAME
outdir.mkdir(parents=True, exist_ok=True)

frames = {}
for key, text in lines.items():
    out = outdir / f"{key}.wav"
    subprocess.run(
        [sys.executable, "-m", "piper", "-m", MODEL, "-f", str(out),
         "--length-scale", "1.08", "--sentence-silence", "0.35"],
        input=text.encode(), check=True, capture_output=True,
    )
    with wave.open(str(out)) as w:
        frames[key] = math.ceil(w.getnframes() / w.getframerate() * FPS)

ts = "// Automatisch erzeugt von scripts/make-voice.py – nicht von Hand ändern.\n"
ts += "export const VOICE = {\n" + "".join(f"  {k}: {v},\n" for k, v in frames.items()) + "} as const;\n"
(ROOT / TS_PATHS[NAME]).write_text(ts)
print(frames)
