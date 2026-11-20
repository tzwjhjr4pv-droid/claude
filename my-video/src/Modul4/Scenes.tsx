import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Person } from "../Konditionierung/Icons";
import { Appear, useAppear } from "../Konditionierung/ui";
import { C, Caret, Scene, Sfx, Voice as BaseVoice } from "../ClaudeProjekt/kit";
import { atRatio, Burst, InfoCard, MerkeBox, ProblemBar, TitleBlock } from "../ClaudeProjekt/common";
import { VOICE as V } from "./voice";

type VKey = keyof typeof V;
const Voice: React.FC<{ name: VKey; at: number }> = ({ name, at }) => <BaseVoice name={name} at={at} folder="modul4" />;
const KICKER = "KI-Startpaket · Claude · Modul 4";
const GAP = 8;

/** Startzeiten für nacheinander gesprochene Abschnitte */
const seq = (start: number, names: VKey[]) => {
  const starts: number[] = [];
  let t = start;
  for (const n of names) {
    starts.push(t);
    t += V[n] + GAP;
  }
  return { starts, end: t };
};

/* ------------------------------------------------------------------ */
/* Hilfsgrafiken                                                       */
/* ------------------------------------------------------------------ */
const QR: React.FC<{ size?: number }> = ({ size = 160 }) => {
  const n = 21;
  const cell = size / n;
  const finder = (x: number, y: number) => x < 7 && y < 7;
  const isFinder = (x: number, y: number) => finder(x, y) || finder(n - 1 - x, y) || finder(x, n - 1 - y);
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      if (isFinder(x, y)) continue;
      const h = (x * 73 + y * 151 + x * y * 7) % 11;
      if (h < 5) cells.push(<rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill={C.dark} />);
    }
  const F: React.FC<{ x: number; y: number }> = ({ x, y }) => (
    <g transform={`translate(${x * cell} ${y * cell})`}>
      <rect width={7 * cell} height={7 * cell} fill={C.dark} />
      <rect x={cell} y={cell} width={5 * cell} height={5 * cell} fill="#fff" />
      <rect x={2 * cell} y={2 * cell} width={3 * cell} height={3 * cell} fill={C.dark} />
    </g>
  );
  return (
    <svg width={size} height={size} style={{ background: "#fff" }}>
      {cells}
      <F x={0} y={0} />
      <F x={n - 7} y={0} />
      <F x={0} y={n - 7} />
    </svg>
  );
};

const ToolWindow: React.FC<{ x: number; y: number; w: number; h: number; title: string; delay?: number; children: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  title,
  delay = 0,
  children,
}) => {
  const p = useAppear(delay);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: "#fff",
        borderRadius: 20,
        border: `2px solid ${C.line}`,
        boxShadow: "0 24px 50px rgba(24,33,31,0.14)",
        overflow: "hidden",
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`,
      }}
    >
      <div style={{ height: 56, background: C.sidebar, borderBottom: `2px solid ${C.line}`, display: "flex", alignItems: "center", gap: 10, padding: "0 20px" }}>
        {["#E8685B", "#F2B33D", "#5DBB6A"].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c }} />
        ))}
        <div style={{ marginLeft: 12, fontSize: 22, fontWeight: 800 }}>{title}</div>
        <div style={{ marginLeft: "auto", fontSize: 15, color: C.muted }}>vereinfachte Darstellung</div>
      </div>
      <div style={{ position: "absolute", top: 56, left: 0, right: 0, bottom: 0 }}>{children}</div>
    </div>
  );
};

const Chip: React.FC<{ color: string; bg: string; children: React.ReactNode; delay?: number }> = ({ color, bg, children, delay = 0 }) => (
  <Appear delay={delay} bouncy>
    <span style={{ display: "inline-block", fontSize: 21, fontWeight: 800, color, background: bg, border: `2px solid ${color}`, borderRadius: 999, padding: "4px 14px" }}>
      {children}
    </span>
  </Appear>
);

/* ------------------------------------------------------------------ */
/* Zeitplan                                                            */
/* ------------------------------------------------------------------ */
const P = { b: 15 + V.problemA + GAP };
const R = seq(15, ["rule1", "rule2", "rule3", "rule4"]);
const A = seq(15, ["a1", "a2", "a3"]);
const B = seq(15, ["b1", "b2"]);
const Cc = seq(15, ["c1", "c2"]);
const K = seq(15, ["classRules", "detectors"]);

export const DUR = {
  title: 20 + V.title + 45,
  problem: P.b + V.problemB + 50,
  rules: R.end + 40,
  cardA: A.end + 50,
  cardB: B.end + 50,
  cardC: Cc.end + 50,
  classRules: K.end + 40,
  merke: 20 + V.merke + 60,
};

/* ------------------------------------------------------------------ */
/* Szenen                                                              */
/* ------------------------------------------------------------------ */
export const TitleScene: React.FC = () => (
  <Scene duration={DUR.title}>
    <Voice name="title" at={20} />
    <Sfx name="chime" at={8} volume={0.35} />
    <TitleBlock kicker={KICKER} lines={["KI im Klassenraum,", "datenschutzkonform"]} subtitle="Mit AIS.chat und fobizz: Chatbots, Feedback und Aufgaben, die eigenständiges Arbeiten zeigen." />
    <div style={{ position: "absolute", left: 1290, top: 300 }}>
      <Appear delay={25} bouncy>
        <div style={{ background: "#fff", border: `4px solid ${C.dark}`, borderRadius: 24, padding: 26, boxShadow: `10px 10px 0 ${C.amber}`, transform: "rotate(3deg)", textAlign: "center" }}>
          <QR size={300} />
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 14, color: C.petrol }}>Lernbegleiter · FOS 11</div>
          <div style={{ fontSize: 20, color: C.muted }}>ohne Konto, per QR-Code</div>
        </div>
      </Appear>
    </div>
    <Sfx name="pop" at={25} volume={0.5} />
  </Scene>
);

const PHONES = [
  { t: "Hat die KI für mich geschrieben 😎", x: 0, y: 0, r: -6 },
  { t: "Kann ich das abgeben?", x: 360, y: 120, r: 5 },
  { t: "Ist das jetzt meins?", x: 80, y: 300, r: 3 },
];

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = P.b;
  const fade = interpolate(frame, [b, b + 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Scene duration={DUR.problem}>
      <Voice name="problemA" at={15} />
      <Voice name="problemB" at={b} />
      {PHONES.map((p, i) => (
        <Sfx key={p.t} name="pop" at={40 + i * 40} volume={0.5} />
      ))}
      <Sfx name="whoosh" at={b} volume={0.5} />
      <Sfx name="chime" at={b + 20} volume={0.4} />
      <ProblemBar text="„Meine Schüler*innen nutzen KI längst. Wie setze ich sie selbst sinnvoll ein, ohne Datenschutzprobleme? Und welche Aufgaben sind eigentlich noch eigenständig bearbeitet?“" />
      <div style={{ position: "absolute", left: 230, top: 450 }}>
        <Appear delay={10} bouncy>
          <Person size={320} anxious={frame > 150 && frame < b + 10} />
        </Appear>
        <Burst text="HILFE?!" at={160} x={170} y={-70} size={130} fill="#FFB0A8" hold={b - 165} rotate={-6} />
      </div>
      <div style={{ position: "absolute", left: 800, top: 330, width: 900, height: 700, opacity: 1 - fade }}>
        {PHONES.map((p, i) => {
          const s = 40 + i * 40;
          if (frame < s) return null;
          const pp = spring({ frame: frame - s, fps, config: { damping: 11 } });
          return (
            <div
              key={p.t}
              style={{
                position: "absolute",
                left: p.x,
                top: p.y,
                width: 300,
                height: 230,
                background: C.dark,
                borderRadius: 30,
                padding: 14,
                transform: `rotate(${p.r}deg) scale(${pp})`,
                boxShadow: "0 14px 30px rgba(0,0,0,0.2)",
              }}
            >
              <div style={{ background: "#fff", borderRadius: 18, height: "100%", padding: 18, display: "flex", alignItems: "flex-end" }}>
                <div style={{ background: C.petrolLight, borderRadius: "18px 18px 18px 4px", padding: "12px 16px", fontSize: 24, fontWeight: 600 }}>{p.t}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 820, top: 380, display: "flex", gap: 30 }}>
        <Appear delay={b + 10} bouncy>
          <div style={{ background: C.petrol, color: "#fff", borderRadius: 22, padding: "30px 36px", fontSize: 44, fontWeight: 900 }}>4 Regeln</div>
        </Appear>
        <Appear delay={b + 30} bouncy>
          <div style={{ background: C.amber, color: C.dark, borderRadius: 22, padding: "30px 36px", fontSize: 44, fontWeight: 900 }}>3 Startkarten</div>
        </Appear>
      </div>
    </Scene>
  );
};

/* Vier Regeln */
const RuleCard: React.FC<{ x: number; delay: number; n: number; title: string; text: string; children?: React.ReactNode }> = ({ x, delay, n, title, text, children }) => (
  <div style={{ position: "absolute", left: x, top: 240, width: 380 }}>
    <Appear delay={delay} bouncy>
      <div style={{ background: "#fff", border: `2px solid ${C.line}`, borderRadius: 22, padding: "24px 24px", minHeight: 500, boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}>
        <div style={{ width: 52, height: 52, borderRadius: 99, background: n === 4 ? C.amber : C.petrol, color: n === 4 ? C.dark : "#fff", fontSize: 28, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {n}
        </div>
        <div style={{ fontSize: 34, fontWeight: 800, color: C.petrol, marginTop: 14, lineHeight: 1.15 }}>{title}</div>
        <div style={{ fontSize: 24, lineHeight: 1.4, marginTop: 10 }}>{text}</div>
        <div style={{ marginTop: 20 }}>{children}</div>
      </div>
    </Appear>
  </div>
);

export const RulesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = R.starts;
  const anon = interpolate(frame, [s[1] + 70, s[1] + 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const crossed = frame > s[2] + 120;
  return (
    <Scene duration={DUR.rules} kicker={`${KICKER} · A`} title="Vier Regeln für den Klassenraum">
      {(["rule1", "rule2", "rule3", "rule4"] as const).map((r, i) => (
        <React.Fragment key={r}>
          <Voice name={r} at={s[i]} />
          <Sfx name="pop" at={s[i]} volume={0.5} />
        </React.Fragment>
      ))}
      <Sfx name="whoosh" at={s[1] + 70} volume={0.5} />
      <Sfx name="clink" at={s[2] + 120} volume={0.6} />
      <RuleCard x={160} delay={s[0]} n={1} title="Nur AIS.chat oder fobizz" text="Mit Schüler*innen nie Claude oder ChatGPT. Teilen per Link oder QR-Code, ohne Konto.">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <Chip color={C.green} bg="#E3F4E9" delay={s[0] + 30}>✓ AIS.chat</Chip>
          <Chip color={C.green} bg="#E3F4E9" delay={s[0] + 40}>✓ fobizz</Chip>
          <Chip color={C.red} bg="#FDECEA" delay={s[0] + 70}>✗ Claude</Chip>
          <Chip color={C.red} bg="#FDECEA" delay={s[0] + 80}>✗ ChatGPT</Chip>
        </div>
        <div style={{ marginTop: 18 }}>
          <Appear delay={s[0] + 150} bouncy>
            <QR size={120} />
          </Appear>
        </div>
      </RuleCard>
      <RuleCard x={566} delay={s[1]} n={2} title="Anonymisieren" text="Namen und erkennbare Details raus, bevor ein Schülertext in ein Werkzeug kommt.">
        <div style={{ background: C.bg, border: `2px solid ${C.line}`, borderRadius: 12, padding: "14px 16px", fontSize: 22, lineHeight: 1.5 }}>
          Text von{" "}
          <span style={{ background: anon > 0.5 ? C.dark : "transparent", color: anon > 0.5 ? "#fff" : C.ink, borderRadius: 6, padding: "0 6px", fontWeight: 700 }}>
            {anon > 0.5 ? "[Name]" : "Lena Müller"}
          </span>
          , Klasse{" "}
          <span style={{ background: anon > 0.5 ? C.dark : "transparent", color: anon > 0.5 ? "#fff" : C.ink, borderRadius: 6, padding: "0 6px", fontWeight: 700 }}>
            {anon > 0.5 ? "[…]" : "11b"}
          </span>
        </div>
      </RuleCard>
      <RuleCard x={972} delay={s[2]} n={3} title="KI-Feedback ist ein Entwurf" text="Du prüfst und entscheidest. Keine Noten durch KI (Art. 22 DSGVO).">
        <div style={{ position: "relative", display: "inline-block", fontSize: 60, fontWeight: 900, color: C.muted, border: `3px dashed ${C.line}`, borderRadius: 14, padding: "4px 26px" }}>
          2–
          {crossed && (
            <svg width={120} height={90} style={{ position: "absolute", left: 0, top: 0 }}>
              <path d="M10,10 L110,80 M110,10 L10,80" stroke={C.red} strokeWidth={8} strokeLinecap="round" />
            </svg>
          )}
        </div>
      </RuleCard>
      <RuleCard x={1378} delay={s[3]} n={4} title="Transparenz" text="Schüler*innen und Eltern wissen, wann und wofür KI eingesetzt wird.">
        <div style={{ fontSize: 64 }}>👀 💬</div>
      </RuleCard>
      <div style={{ position: "absolute", left: 1150, top: 820 }}>
        <Burst text="KEINE NOTE!" at={s[2] + 122} x={0} y={0} size={120} fill="#FFB0A8" hold={70} rotate={-8} />
      </div>
      <div style={{ position: "absolute", left: 760, top: 820 }}>
        <Burst text="ANONYM!" at={s[1] + 92} x={0} y={0} size={110} fill="#B6F0C2" hold={70} rotate={6} />
      </div>
    </Scene>
  );
};

/* Startkarte A · Chatbot */
type Seg = { t: string; b?: "auftrag" | "kompetenz" | "verhalten" | "grenze" };
const BAUSTEINE = {
  auftrag: { label: "Arbeitsauftrag", c: "#B07800", bg: C.amberLight },
  kompetenz: { label: "Kompetenz", c: C.petrol, bg: C.petrolLight },
  verhalten: { label: "Verhalten der KI", c: "#2F6DB5", bg: "#E1ECF8" },
  grenze: { label: "Grenzen", c: C.red, bg: "#FDECEA" },
};
const MUSTER: Seg[] = [
  { t: "„Du bist Lernbegleiter für FOS 11 zum Thema Lernen am Modell.", b: "auftrag" },
  { t: " " },
  { t: "Ziel: Die Lernenden können die Phasen des Modelllernens an einem Fall erklären.", b: "kompetenz" },
  { t: " " },
  { t: "Erkläre Schritt für Schritt, stelle Rückfragen und gib Hinweise,", b: "verhalten" },
  { t: " " },
  { t: "aber verrate keine fertigen Lösungen.", b: "grenze" },
  { t: " " },
  { t: "Antworte in einfacher Sprache. Frage am Ende, was noch unklar ist.“", b: "verhalten" },
];

export const CardAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const [a1, a2, a3] = A.starts;
  const paste = atRatio(a1, V.a1, 0.7);
  const hlAt = {
    kompetenz: atRatio(a2, V.a2, 0.2),
    auftrag: atRatio(a2, V.a2, 0.33),
    verhalten: atRatio(a2, V.a2, 0.48),
    grenze: atRatio(a2, V.a2, 0.62),
  };
  const ask = atRatio(a3, V.a3, 0.3);
  const reply = ask + 45;
  const qr = atRatio(a3, V.a3, 0.72);
  const question = "Sag mir einfach die Lösung von Aufgabe 2!";
  const nQ = Math.max(0, Math.min(question.length, Math.floor(((frame - (ask - 40)) / 30) * 30)));
  return (
    <Scene duration={DUR.cardA} kicker={`${KICKER} · Startkarte A`} title="Chatbot für die Klasse">
      {(["a1", "a2", "a3"] as const).map((v, i) => (
        <Voice key={v} name={v} at={A.starts[i]} />
      ))}
      <Sfx name="pop" at={paste} />
      {Object.values(hlAt).map((f) => (
        <Sfx key={f} name="pop" at={f} volume={0.45} />
      ))}
      <Sfx name="typing" at={ask - 40} frames={40} volume={0.6} />
      <Sfx name="pop" at={reply} volume={0.5} />
      <Sfx name="chime" at={qr} volume={0.4} />
      <ToolWindow x={160} y={205} w={1600} h={800} title="AIS.chat · Neues Lernszenario" delay={5}>
        {/* Editor */}
        <div style={{ position: "absolute", left: 36, top: 26, width: 880 }}>
          <div style={{ fontSize: 20, color: C.muted, fontWeight: 700 }}>Titel</div>
          <div style={{ border: `2px solid ${C.line}`, borderRadius: 12, padding: "10px 16px", fontSize: 26, fontWeight: 700, marginTop: 6 }}>
            Lernbegleiter · Lernen am Modell
          </div>
          <div style={{ fontSize: 20, color: C.muted, fontWeight: 700, marginTop: 20 }}>Anweisung für die KI</div>
          <div style={{ border: `2px solid ${frame >= paste ? C.petrol : C.line}`, borderRadius: 12, padding: "14px 18px", fontSize: 26, lineHeight: 1.6, marginTop: 6, height: 360 }}>
            {frame < paste ? (
              <span style={{ color: C.muted }}>Beschreibe, wie der Chatbot arbeiten soll …</span>
            ) : (
              MUSTER.map((s, i) => {
                const on = s.b && frame >= hlAt[s.b];
                const st = s.b ? BAUSTEINE[s.b] : null;
                return (
                  <span key={i} style={{ background: on && st ? st.bg : "transparent", color: on && st ? st.c : C.ink, fontWeight: on ? 700 : 400, borderRadius: 6, padding: on ? "1px 4px" : 0 }}>
                    {s.t}
                  </span>
                );
              })
            )}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            {(Object.keys(hlAt) as (keyof typeof hlAt)[]).map((k) => (
              <Chip key={k} color={BAUSTEINE[k].c} bg={BAUSTEINE[k].bg} delay={hlAt[k]}>
                {BAUSTEINE[k].label}
              </Chip>
            ))}
          </div>
        </div>
        {/* Vorschau */}
        <div style={{ position: "absolute", left: 960, top: 0, right: 0, bottom: 0, background: C.bg, borderLeft: `2px solid ${C.line}`, padding: "24px 28px" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.petrol }}>👀 Vorschau als Schüler*in</div>
          {frame >= ask && (
            <Appear delay={ask}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                <div style={{ background: C.amberLight, borderRadius: "18px 18px 4px 18px", padding: "12px 16px", fontSize: 22, maxWidth: 440 }}>{question}</div>
              </div>
            </Appear>
          )}
          {frame >= reply && (
            <Appear delay={reply}>
              <div style={{ background: "#fff", border: `2px solid ${C.line}`, borderRadius: "18px 18px 18px 4px", padding: "12px 16px", fontSize: 22, marginTop: 16, maxWidth: 520, lineHeight: 1.45 }}>
                Netter Versuch 😉 Ich verrate dir keine fertige Lösung. Aber: Wer ist in deinem Fall das <b>Modell</b> – und was beobachtet das Kind?
              </div>
            </Appear>
          )}
          <div style={{ position: "absolute", left: 28, right: 28, bottom: 24, border: `2px solid ${C.line}`, borderRadius: 14, padding: "12px 16px", fontSize: 21, background: "#fff", color: frame >= ask - 40 && frame < ask ? C.ink : C.muted }}>
            {frame >= ask - 40 && frame < ask ? (
              <>
                {question.slice(0, nQ)}
                <Caret />
              </>
            ) : (
              "Frag den Lernbegleiter …"
            )}
          </div>
        </div>
        {/* QR */}
        <div style={{ position: "absolute", left: 1080, top: 380 }}>
          <Appear delay={qr} bouncy>
            <div style={{ background: "#fff", border: `3px solid ${C.dark}`, borderRadius: 18, padding: 16, textAlign: "center", boxShadow: `6px 6px 0 ${C.amber}`, transform: "rotate(-3deg)" }}>
              <QR size={170} />
              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 8 }}>Link / QR-Code teilen</div>
            </div>
          </Appear>
        </div>
      </ToolWindow>
      <Burst text="HÄLT STAND!" at={reply + 20} x={1600} y={420} size={130} fill="#B6F0C2" hold={70} rotate={8} />
    </Scene>
  );
};

/* Startkarte B · Feedback */
const STEPS5 = [
  { n: 1, t: "Anonymisieren", s: "Namen und Details raus" },
  { n: 2, t: "Raster", s: "Kriterien mitgeben" },
  { n: 3, t: "Entwurf", s: "KI formuliert Feedback" },
  { n: 4, t: "Überarbeiten", s: "Du prüfst und ergänzt" },
  { n: 5, t: "Keine Note", s: "Die Bewertung bleibt bei dir" },
];

export const CardBScene: React.FC = () => {
  const frame = useCurrentFrame();
  const [b1, b2] = B.starts;
  const at = [atRatio(b1, V.b1, 0.45), atRatio(b1, V.b1, 0.75), atRatio(b2, V.b2, 0.02), atRatio(b2, V.b2, 0.45), atRatio(b2, V.b2, 0.68)];
  const active = at.filter((f) => frame >= f).length - 1;
  const anon = frame >= at[0] + 20;
  const edit = frame >= at[3] + 30;
  return (
    <Scene duration={DUR.cardB} kicker={`${KICKER} · Startkarte B`} title="KI-gestütztes Feedback">
      {(["b1", "b2"] as const).map((v, i) => (
        <Voice key={v} name={v} at={B.starts[i]} />
      ))}
      {at.map((f) => (
        <Sfx key={f} name="pop" at={f} volume={0.5} />
      ))}
      <Sfx name="whoosh" at={at[0] + 20} volume={0.5} />
      <Sfx name="typing" at={at[3] + 10} frames={25} volume={0.6} />
      <Sfx name="clink" at={at[4] + 30} volume={0.6} />
      {/* Schrittleiste */}
      <div style={{ position: "absolute", left: 160, top: 200, display: "flex", gap: 14 }}>
        {STEPS5.map((s, i) => {
          const on = i <= active;
          const cur = i === active;
          const bg = i === 4 ? C.dark : i >= 2 ? C.amberLight : C.petrolLight;
          return (
            <div
              key={s.n}
              style={{
                width: 310,
                borderRadius: 18,
                padding: "14px 18px",
                background: on ? bg : "#EEF0EF",
                color: on && i === 4 ? "#fff" : C.ink,
                opacity: on ? 1 : 0.5,
                border: `3px solid ${cur ? C.amber : "transparent"}`,
                transform: `scale(${cur ? 1.03 : 1})`,
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 800 }}>
                {s.n} · {s.t}
              </div>
              <div style={{ fontSize: 19, opacity: 0.8 }}>{s.s}</div>
            </div>
          );
        })}
      </div>
      {/* Schülertext */}
      <div style={{ position: "absolute", left: 160, top: 340, width: 700 }}>
        <Appear delay={b1 + 10}>
          <div style={{ background: "#fff", border: `2px solid ${C.line}`, borderRadius: 18, padding: "20px 24px", minHeight: 400 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.muted, marginBottom: 10 }}>
              Schülertext ·{" "}
              <span style={{ background: anon ? C.dark : "transparent", color: anon ? "#fff" : C.ink, borderRadius: 6, padding: "0 6px" }}>{anon ? "[Name]" : "Lena Müller, 11b"}</span>
            </div>
            <div style={{ fontSize: 28, lineHeight: 1.55 }}>
              Beim Lernen am Modell schaut man sich etwas von anderen ab. In meinem Praktikum hat{" "}
              <span style={{ background: anon ? C.dark : "transparent", color: anon ? "#fff" : C.ink, borderRadius: 6, padding: "0 6px" }}>{anon ? "[Kind]" : "Jonas (4)"}</span> gesehen, wie ein
              anderes Kind für das Aufräumen gelobt wurde. Danach hat er auch aufgeräumt.
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
              {["Fachbegriffe", "Beispiel", "Struktur"].map((t, i) => (
                <Chip key={t} color={C.petrol} bg={C.petrolLight} delay={at[1] + i * 8}>
                  Raster: {t}
                </Chip>
              ))}
            </div>
          </div>
        </Appear>
      </div>
      {/* Feedback-Entwurf */}
      <div style={{ position: "absolute", left: 900, top: 340, width: 860 }}>
        <Appear delay={at[2]} bouncy>
          <div style={{ background: "#fff", border: `3px solid ${C.amber}`, borderRadius: 18, padding: "18px 24px", minHeight: 400, position: "relative" }}>
            <div style={{ position: "absolute", top: -18, left: 20, background: C.amber, borderRadius: 999, padding: "4px 16px", fontSize: 19, fontWeight: 800 }}>KI-ENTWURF</div>
            <div style={{ fontSize: 25, lineHeight: 1.55, marginTop: 8 }}>
              <b style={{ color: C.green }}>Stärken</b>
              <br />1. Du nutzt ein anschauliches Beispiel aus deinem Praktikum.
              <br />2. Du erklärst verständlich, was Nachahmung bedeutet.
              <br />
              <b style={{ color: "#B07800" }}>Hinweise</b>
              <br />1.{" "}
              <span style={{ textDecoration: edit ? "line-through" : "none", color: edit ? C.muted : C.ink }}>Verwende mehr Fachbegriffe.</span>
              {edit && <span style={{ color: C.petrol, fontWeight: 700, fontStyle: "italic" }}> ✍️ Benenne Modell, Beobachter und Verstärkung.</span>}
              <br />2. Ordne dein Beispiel einer Phase des Modelllernens zu.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16 }}>
              <Appear delay={at[4]} bouncy>
                <div style={{ position: "relative", fontSize: 24, fontWeight: 800, border: `3px dashed ${C.line}`, borderRadius: 12, padding: "6px 18px", color: C.muted }}>
                  Note: 2–
                  {frame >= at[4] + 30 && (
                    <svg width={160} height={50} style={{ position: "absolute", left: 0, top: 0 }}>
                      <path d="M6,6 L150,44 M150,6 L6,44" stroke={C.red} strokeWidth={6} strokeLinecap="round" />
                    </svg>
                  )}
                </div>
              </Appear>
              <Appear delay={at[4] + 40}>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.petrol }}>Die Bewertung bleibt bei dir.</div>
              </Appear>
            </div>
          </div>
        </Appear>
      </div>
      <Burst text="ANONYM!" at={at[0] + 22} x={760} y={350} size={110} fill="#B6F0C2" hold={60} rotate={-6} />
      <Burst text="KEINE NOTE!" at={at[4] + 32} x={1640} y={820} size={120} fill="#FFB0A8" hold={80} rotate={8} />
    </Scene>
  );
};

/* Startkarte C · KI-resiliente Aufgabe */
const STRATS = [
  ["Prozess statt Produkt", "Zwischenschritte und Entscheidungen dokumentieren"],
  ["Eigene Erfahrung", "Bezug zum Praktikum oder zur eigenen Kita-Gruppe"],
  ["Begründen und bewerten", "„Begründen Sie mit zwei Argumenten“ statt „Nennen Sie …“"],
  ["KI bewusst einbauen", "„Prüfen Sie die KI-Antwort und verbessern Sie sie.“"],
  ["Mündlich und reflektiert", "kurzes Gespräch über das Ergebnis"],
];

export const CardCScene: React.FC = () => {
  const frame = useCurrentFrame();
  const [c1, c2] = Cc.starts;
  const solve = atRatio(c1, V.c1, 0.42);
  const solved = solve + 25;
  const hl = [atRatio(c2, V.c2, 0.12), atRatio(c2, V.c2, 0.3), atRatio(c2, V.c2, 0.52)];
  const hlIdx = [1, 2, 3];
  const rewrite = atRatio(c2, V.c2, 0.78);
  const retest = rewrite + 45;
  const after = frame >= rewrite;
  const timer = Math.min(0.8, Math.max(0, (frame - solve) / 30)).toFixed(1).replace(".", ",");
  return (
    <Scene duration={DUR.cardC} kicker={`${KICKER} · Startkarte C`} title="KI-resiliente Aufgabe">
      {(["c1", "c2"] as const).map((v, i) => (
        <Voice key={v} name={v} at={Cc.starts[i]} />
      ))}
      <Sfx name="typing" at={solve} frames={22} volume={0.6} />
      <Sfx name="clink" at={solved} volume={0.5} />
      {hl.map((f) => (
        <Sfx key={f} name="pop" at={f} volume={0.5} />
      ))}
      <Sfx name="whoosh" at={rewrite} volume={0.5} />
      <Sfx name="chime" at={retest + 10} volume={0.4} />
      {/* Aufgabe */}
      <div style={{ position: "absolute", left: 160, top: 240, width: 820 }}>
        <Appear delay={c1 + 10}>
          <div style={{ background: "#fff", border: `3px solid ${after ? C.green : C.line}`, borderRadius: 20, padding: "22px 28px" }}>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 2, color: after ? C.green : C.muted }}>{after ? "AUFGABE · NACHHER" : "AUFGABE · VORHER"}</div>
            <div style={{ fontSize: 30, lineHeight: 1.45, marginTop: 8, fontWeight: 600 }}>
              {after
                ? "Beschreiben Sie eine Situation aus Ihrem Praktikum, in der ein Kind ein Verhalten nachahmt. Welche Phase des Modelllernens erkennen Sie? Begründen Sie mit zwei Argumenten."
                : "Nennen Sie die vier Phasen des Modelllernens nach Bandura."}
            </div>
          </div>
        </Appear>
      </div>
      {/* KI-Test */}
      <div style={{ position: "absolute", left: 160, top: 560, width: 820 }}>
        <Appear delay={solve - 15}>
          <div style={{ background: C.bg, border: `2px solid ${C.line}`, borderRadius: 20, padding: "18px 24px", fontSize: 24, lineHeight: 1.5 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.muted }}>
              Test: „Löse diese Aufgabe.“ <span style={{ float: "right" }}>⏱ {after ? "…" : `${timer} s`}</span>
            </div>
            {!after ? (
              frame >= solved && <div style={{ marginTop: 8 }}>✳︎ Aufmerksamkeit, Gedächtnis, motorische Reproduktion, Motivation. ✓</div>
            ) : (
              frame >= retest && <div style={{ marginTop: 8 }}>✳︎ Dafür brauche ich deine Beobachtung aus dem Praktikum. Was hast du gesehen?</div>
            )}
          </div>
        </Appear>
      </div>
      {/* Strategien */}
      <div style={{ position: "absolute", left: 1030, top: 240, width: 730 }}>
        <Appear delay={c2}>
          <div style={{ background: "#fff", border: `2px solid ${C.line}`, borderRadius: 20, overflow: "hidden" }}>
            <div style={{ background: C.dark, color: "#fff", padding: "14px 22px", fontSize: 24, fontWeight: 800 }}>Strategien zum Umbauen</div>
            {STRATS.map(([t, d], i) => {
              const k = hlIdx.indexOf(i);
              const on = k >= 0 && frame >= hl[k];
              return (
                <div key={t} style={{ padding: "12px 22px", borderTop: `1px solid ${C.line}`, background: on ? C.amberLight : "#fff" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.petrol }}>
                    {on ? "★ " : ""}
                    {t}
                  </div>
                  <div style={{ fontSize: 20, color: C.muted }}>{d}</div>
                </div>
              );
            })}
          </div>
        </Appear>
      </div>
      <Burst text="ZU EINFACH!" at={solved + 5} x={850} y={505} size={130} fill="#FFB0A8" hold={c2 - solved} rotate={-8} />
      <Burst text="RESILIENT!" at={retest + 10} x={850} y={505} size={130} fill="#B6F0C2" hold={80} rotate={8} />
    </Scene>
  );
};

/* Regeln für die Klasse + Detektoren */
export const ClassRulesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const [k1, k2] = K.starts;
  const at = [atRatio(k1, V.classRules, 0.2), atRatio(k1, V.classRules, 0.48), atRatio(k1, V.classRules, 0.7)];
  const needle = Math.sin(frame / 4) * 50 + Math.sin(frame / 1.7) * 25;
  const cards = [
    { n: 1, t: "Offenlegen", s: "Wer KI nutzt, sagt wofür und wie.", bg: C.petrolLight, fg: C.ink },
    { n: 2, t: "Prüfen", s: "KI-Antworten können falsch sein: gegenlesen, Quellen checken.", bg: C.amberLight, fg: C.ink },
    { n: 3, t: "Nichts Persönliches", s: "Keine Namen, Fotos oder privaten Daten eingeben.", bg: C.dark, fg: "#fff" },
  ];
  return (
    <Scene duration={DUR.classRules} kicker={`${KICKER} · C`} title="Regeln für die Klasse">
      <Voice name="classRules" at={k1} />
      <Voice name="detectors" at={k2} />
      {at.map((f) => (
        <Sfx key={f} name="pop" at={f} volume={0.5} />
      ))}
      <Sfx name="pop" at={k2} volume={0.5} />
      <div style={{ position: "absolute", left: 160, top: 240, display: "flex", gap: 30 }}>
        {cards.map((c, i) => (
          <Appear key={c.n} delay={at[i]} bouncy>
            <div style={{ width: 513, minHeight: 260, background: c.bg, color: c.fg, borderRadius: 22, padding: "26px 30px" }}>
              <div style={{ width: 50, height: 50, borderRadius: 99, background: c.n === 3 ? C.amber : C.petrol, color: c.n === 3 ? C.dark : "#fff", fontSize: 28, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {c.n}
              </div>
              <div style={{ fontSize: 38, fontWeight: 800, marginTop: 14 }}>{c.t}</div>
              <div style={{ fontSize: 27, lineHeight: 1.4, marginTop: 8 }}>{c.s}</div>
            </div>
          </Appear>
        ))}
      </div>
      {/* Detektor */}
      <div style={{ position: "absolute", left: 160, top: 580, width: 1600 }}>
        <Appear delay={k2} bouncy>
          <div style={{ display: "flex", alignItems: "center", gap: 40, background: "#fff", border: `2px solid ${C.line}`, borderRadius: 22, padding: "24px 34px" }}>
            <svg width={260} height={150} viewBox="0 0 260 150">
              <path d="M20,130 A110,110 0 0 1 240,130" fill="none" stroke={C.line} strokeWidth={22} />
              <path d="M20,130 A110,110 0 0 1 75,35" fill="none" stroke={C.green} strokeWidth={22} />
              <path d="M185,35 A110,110 0 0 1 240,130" fill="none" stroke={C.red} strokeWidth={22} />
              <g transform={`rotate(${needle}, 130, 130)`}>
                <line x1={130} y1={130} x2={130} y2={40} stroke={C.dark} strokeWidth={6} strokeLinecap="round" />
              </g>
              <circle cx={130} cy={130} r={12} fill={C.dark} />
            </svg>
            <div>
              <div style={{ fontSize: 26, color: C.muted, fontWeight: 700 }}>„KI-Detektor“</div>
              <div style={{ fontSize: 40, fontWeight: 800 }}>
                Transparenzregeln statt Detektoren – <span style={{ color: C.red }}>die sind unzuverlässig.</span>
              </div>
            </div>
          </div>
        </Appear>
      </div>
      <Burst text="WÜRFELN? 🎲" at={k2 + 40} x={1640} y={590} size={120} fill="#FFB0A8" hold={100} rotate={8} />
    </Scene>
  );
};

export const MerkeScene: React.FC = () => (
  <Scene duration={DUR.merke}>
    <Voice name="merke" at={20} />
    <Sfx name="chime" at={8} volume={0.4} />
    <InfoCard x={300} y={170} w={600} kicker="MIT SCHÜLER*INNEN" title="✓ AIS.chat · fobizz" delay={atRatio(20, V.merke, 0.15)} />
    <InfoCard x={1020} y={170} w={600} dark kicker="BEWERTUNG" title="✗ keine Noten durch KI" delay={atRatio(20, V.merke, 0.45)} />
    <MerkeBox delay={20} top={430}>
      <b>Erst selbst testen, dann einsetzen.</b> Mit Schüler*innen nur AIS.chat oder fobizz, keine Noten durch KI. Transparenzregeln statt
      KI-Detektoren. Jedes Ergebnis mit dem 5-Punkte-KI-Check prüfen.
    </MerkeBox>
    <div style={{ position: "absolute", right: 120, bottom: 0 }}>
      <Appear delay={80} bouncy>
        <Person size={240} />
      </Appear>
    </div>
    <div style={{ position: "absolute", right: 720, bottom: 110 }}>
      <Burst text="ERST TESTEN!" at={90} x={0} y={0} size={120} fill="#B6F0C2" hold={150} rotate={-6} />
    </div>
  </Scene>
);
