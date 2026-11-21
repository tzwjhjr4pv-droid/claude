import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Person } from "../Konditionierung/Icons";
import { Thought } from "../Konditionierung/fx";
import { Appear } from "../Konditionierung/ui";
import { C, Scene, Sfx, Voice as BaseVoice } from "../ClaudeProjekt/kit";
import { atRatio, Burst, InfoCard, Item, MerkeBox, TitleBlock } from "../ClaudeProjekt/common";
import { VOICE as VC } from "./voice";
import { VOICE as VG } from "./voice-chatgpt";
import { IS_GPT, pick, TOOL } from "../platform";

const V: Record<keyof typeof VC, number> = IS_GPT ? VG : VC;

type VKey = keyof typeof V;
const Voice: React.FC<{ name: VKey; at: number }> = ({ name, at }) => <BaseVoice name={name} at={at} folder="begleit" />;
const KICKER = `KI-Startpaket · ${TOOL} · Begleitblätter`;
const GAP = 8;

const seq = (start: number, names: VKey[]) => {
  const starts: number[] = [];
  let t = start;
  for (const n of names) {
    starts.push(t);
    t += V[n] + GAP;
  }
  return { starts, end: t };
};

const I = seq(15, ["introA", "introB"]);
const F = seq(15, ["f1", "f2", "f3"]);
const BA = seq(15, ["beforeA", "beforeB"]);
const TP = seq(15, ["dictate", "refine"]);
const TL = seq(15, ["toolsA", "toolsB"]);
const SO = seq(15, ["sort", "later"]);

export const DUR = {
  title: 20 + V.title + 45,
  intro: I.end + 45,
  formula: F.end + 40,
  beforeAfter: BA.end + 45,
  tips: TP.end + 40,
  tools: TL.end + 40,
  sort: SO.end + 50,
  merke: 20 + V.merke + 50,
};

/* ------------------------------------------------------------------ */
/* Bausteine                                                           */
/* ------------------------------------------------------------------ */
const PARTS = {
  aufgabe: { label: "Aufgabe", bg: C.petrolLight, fg: C.petrol, dark: false },
  wissen: { label: "Was du wissen musst", bg: C.amberLight, fg: "#8A5A00", dark: false },
  rueck: { label: "Rückfrage", bg: C.dark, fg: "#fff", dark: true },
};
type PartKey = keyof typeof PARTS;

const Seg: React.FC<{ k: PartKey; on: boolean; children: React.ReactNode }> = ({ k, on, children }) => (
  <span
    style={{
      background: on ? (k === "rueck" ? "#DDE3E1" : PARTS[k].bg) : "transparent",
      color: on ? (k === "rueck" ? C.dark : PARTS[k].fg) : C.ink,
      fontWeight: on ? 700 : 400,
      borderRadius: 6,
      padding: on ? "1px 5px" : 0,
    }}
  >
    {children}
  </span>
);

const Dartboard: React.FC<{ hit: boolean; at: number; size?: number }> = ({ hit, at, size = 200 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 120 } });
  const tx = hit ? 100 : 196;
  const ty = hit ? 100 : 6;
  const ax = interpolate(p, [0, 1], [-160, tx]);
  const ay = interpolate(p, [0, 1], [ty - 60, ty]);
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
      {[90, 70, 50, 30, 12].map((r, i) => (
        <circle key={r} cx={100} cy={100} r={r} fill={i % 2 ? "#fff" : i === 4 ? C.red : C.petrol} stroke={C.dark} strokeWidth={3} />
      ))}
      {frame >= at && (
        <g transform={`translate(${ax} ${ay}) rotate(-20)`}>
          <line x1={-70} y1={0} x2={0} y2={0} stroke={C.dark} strokeWidth={6} strokeLinecap="round" />
          <path d="M-70,0 L-86,-12 L-80,0 L-86,12 Z" fill={C.amber} stroke={C.dark} strokeWidth={2} />
          <circle cx={0} cy={0} r={5} fill={C.dark} />
        </g>
      )}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Szenen                                                              */
/* ------------------------------------------------------------------ */
export const TitleScene: React.FC = () => (
  <Scene duration={DUR.title}>
    <Voice name="title" at={20} />
    <Sfx name="chime" at={8} volume={0.35} />
    <TitleBlock kicker={KICKER} lines={["Gut prompten &", "das richtige", "Werkzeug"]} subtitle="Die Prompt-Formel und „Welches Werkzeug wofür?“ in einem Video." />
    <div style={{ position: "absolute", left: 1200, top: 300, display: "flex", flexDirection: "column", gap: 24 }}>
      {(Object.keys(PARTS) as PartKey[]).map((k, i) => (
        <Appear key={k} delay={25 + i * 12} bouncy>
          <div
            style={{
              width: 480,
              background: PARTS[k].bg,
              color: PARTS[k].dark ? "#fff" : C.ink,
              borderRadius: 20,
              padding: "20px 26px",
              fontSize: 34,
              fontWeight: 800,
              transform: `rotate(${[-2, 1.5, -1][i]}deg)`,
              boxShadow: "0 10px 24px rgba(0,0,0,0.1)",
            }}
          >
            <span style={{ color: k === "rueck" ? C.amber : C.petrol }}>{i + 1}</span> · {PARTS[k].label}
          </div>
        </Appear>
      ))}
    </div>
    {[25, 37, 49].map((f) => (
      <Sfx key={f} name="pop" at={f} volume={0.5} />
    ))}
  </Scene>
);

const DESKS = Array.from({ length: 12 }, (_, i) => ({ x: (i % 4) * 190, y: Math.floor(i / 4) * 150 }));
export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const [a, b] = I.starts;
  const qs = ["Wer ist das?", "Was kennen die schon?", "Wie lange?", "Welches Niveau?"];
  return (
    <Scene duration={DUR.intro} kicker={`${KICKER} · Teil 1`} title="Die Prompt-Formel">
      <Voice name="introA" at={a} />
      <Voice name="introB" at={b} />
      {qs.map((_, i) => (
        <Sfx key={i} name="pop" at={a + 120 + i * 25} volume={0.45} />
      ))}
      <Sfx name="chime" at={b + 10} volume={0.4} />
      <div style={{ position: "absolute", left: 200, top: 380 }}>
        <Appear delay={a + 20} bouncy>
          <Person size={340} anxious={frame > a + 120 && frame < b + 10} />
        </Appear>
        <Appear delay={a + 40}>
          <div style={{ textAlign: "center", fontSize: 28, fontWeight: 800, color: C.petrol, marginTop: 8 }}>Vertretungskraft</div>
        </Appear>
      </div>
      {qs.map((q, i) => (
        <div key={q} style={{ position: "absolute", left: [560, 640, 580, 700][i], top: [250, 360, 480, 590][i] }}>
          <div style={{ position: "relative" }}>
            <Appear delay={a + 120 + i * 25} bouncy>
              <div style={{ background: "#fff", border: `3px solid ${C.dark}`, borderRadius: 999, padding: "10px 22px", fontSize: 28, fontWeight: 700, boxShadow: `4px 4px 0 ${C.amber}` }}>
                {q}
              </div>
            </Appear>
          </div>
        </div>
      ))}
      {/* Klassenraum */}
      <div style={{ position: "absolute", left: 1040, top: 300 }}>
        <Appear delay={a + 30}>
          <div style={{ position: "relative", width: 740, height: 460 }}>
            <div style={{ position: "absolute", left: 120, top: -10, width: 500, height: 26, borderRadius: 6, background: C.dark }} />
            {DESKS.map((d, i) => (
              <div key={i} style={{ position: "absolute", left: d.x + 20, top: d.y + 60, textAlign: "center" }}>
                <div style={{ fontSize: 46 }}>🙂</div>
                <div style={{ width: 120, height: 22, borderRadius: 6, background: "#C9A27A", marginTop: -6 }} />
                <div style={{ position: "absolute", right: 0, top: -10 }}>
                  {frame > a + 150 + i * 4 && <span style={{ fontSize: 30, fontWeight: 900, color: C.red }}>?</span>}
                </div>
              </div>
            ))}
          </div>
        </Appear>
      </div>
      <div style={{ position: "absolute", left: 1700, top: 170 }}>
        <Thought text="KI" at={b} x={0} y={0} hold={100} />
      </div>
      <Burst text="KONTEXT!" at={b + 12} x={1180} y={250} size={140} fill="#B6F0C2" hold={90} rotate={-6} />
    </Scene>
  );
};

const TEMPLATE: { k?: PartKey; t: string }[] = [
  { t: "„" },
  { k: "aufgabe", t: "[Verb + was entstehen soll]" },
  { t: ". Was du wissen musst: " },
  { k: "wissen", t: "[Klasse, Niveau], [Zeit, Umfang], [Vorwissen], [Format]" },
  { t: ". " },
  { k: "rueck", t: "Stelle mir so lange Rückfragen, bis alles klar ist." },
  { t: "“" },
];

export const FormulaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const [s1, s2, s3] = F.starts;
  const at: Record<PartKey, number> = { aufgabe: s1 + 60, wissen: s2, rueck: s3 };
  const blocks: { k: PartKey; title: string; text: string; ex: string }[] = [
    { k: "aufgabe", title: "Aufgabe", text: "Was soll entstehen? Beginne mit einem Verb.", ex: "„Erstelle …“, „Plane …“, „Formuliere …“" },
    { k: "wissen", title: "Was du wissen musst", text: "Lerngruppe und Niveau, Zeit und Umfang, Vorwissen, Format, woran du ein gutes Ergebnis erkennst", ex: "" },
    { k: "rueck", title: "Rückfrage", text: "Die KI holt sich selbst, was du vergessen hast.", ex: "„Stelle mir so lange Rückfragen, bis alles klar ist.“" },
  ];
  return (
    <Scene duration={DUR.formula} kicker={`${KICKER} · A`} title="Die Formel">
      {(["f1", "f2", "f3"] as const).map((v, i) => (
        <React.Fragment key={v}>
          <Voice name={v} at={F.starts[i]} />
        </React.Fragment>
      ))}
      {Object.values(at).map((f) => (
        <Sfx key={f} name="pop" at={f} volume={0.5} />
      ))}
      <div style={{ position: "absolute", left: 160, top: 240, display: "flex", gap: 26, alignItems: "stretch" }}>
        {blocks.map((b, i) => (
          <React.Fragment key={b.k}>
            {i > 0 && (
              <Appear delay={at[b.k] - 6} bouncy>
                <div style={{ fontSize: 70, fontWeight: 900, color: C.amber, alignSelf: "center", paddingTop: 120 }}>+</div>
              </Appear>
            )}
            <Appear delay={at[b.k]} bouncy>
              <div
                style={{
                  width: 470,
                  minHeight: 330,
                  background: PARTS[b.k].bg,
                  color: PARTS[b.k].dark ? "#fff" : C.ink,
                  borderRadius: 22,
                  padding: "24px 28px",
                }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 99, background: i === 2 ? C.amber : C.petrol, color: i === 2 ? C.dark : "#fff", fontWeight: 900, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: 36, fontWeight: 800, marginTop: 14 }}>{b.title}</div>
                <div style={{ fontSize: 26, lineHeight: 1.4, marginTop: 10 }}>{b.text}</div>
                {b.ex && <div style={{ fontSize: 23, marginTop: 12, opacity: 0.75 }}>{b.ex}</div>}
              </div>
            </Appear>
          </React.Fragment>
        ))}
      </div>
      <div style={{ position: "absolute", left: 160, right: 160, top: 640 }}>
        <Appear delay={s1 + 40}>
          <div style={{ background: "#fff", border: `2px solid ${C.line}`, borderLeft: `8px solid ${C.petrol}`, borderRadius: 18, padding: "22px 30px" }}>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 3, color: C.petrol }}>ZUM KOPIEREN</div>
            <div style={{ fontSize: 30, lineHeight: 1.55, marginTop: 8 }}>
              {TEMPLATE.map((t, i) =>
                t.k ? (
                  <Seg key={i} k={t.k} on={frame >= at[t.k]}>
                    {t.t}
                  </Seg>
                ) : (
                  <span key={i}>{t.t}</span>
                ),
              )}
            </div>
          </div>
        </Appear>
      </div>
    </Scene>
  );
};

export const BeforeAfterScene: React.FC = () => {
  const frame = useCurrentFrame();
  const [a, b] = BA.starts;
  const miss = atRatio(a, V.beforeA, 0.55);
  const segAt = { aufgabe: atRatio(b, V.beforeB, 0.08), wissen: atRatio(b, V.beforeB, 0.25), rueck: atRatio(b, V.beforeB, 0.8) };
  const hit = atRatio(b, V.beforeB, 0.92);
  return (
    <Scene duration={DUR.beforeAfter} kicker={`${KICKER} · B`} title="Vorher und nachher">
      <Voice name="beforeA" at={a} />
      <Voice name="beforeB" at={b} />
      <Sfx name="whoosh" at={miss} volume={0.5} />
      <Sfx name="clink" at={miss + 14} volume={0.5} />
      {Object.values(segAt).map((f) => (
        <Sfx key={f} name="pop" at={f} volume={0.45} />
      ))}
      <Sfx name="whoosh" at={hit} volume={0.5} />
      <Sfx name="chime" at={hit + 14} volume={0.45} />
      <InfoCard x={160} y={240} w={560} dark title="Zu knapp" delay={a + 10} minH={600}>
        <div style={{ fontSize: 30, lineHeight: 1.4 }}>„Mach ein Arbeitsblatt zu Schulz von Thun.“</div>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}>
          <Dartboard hit={false} at={miss} size={220} />
        </div>
        <Appear delay={miss + 20}>
          <div style={{ fontSize: 24, color: C.muted }}>Das Ergebnis passt zu irgendeiner Klasse, aber nicht zu deiner.</div>
        </Appear>
      </InfoCard>
      <InfoCard x={760} y={240} w={1000} title="Mit der Formel" delay={b} minH={600}>
        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ flex: 1, fontSize: 25, lineHeight: 1.55 }}>
            <Seg k="aufgabe" on={frame >= segAt.aufgabe}>
              Erstelle ein Arbeitsblatt zum Vier-Seiten-Modell von Schulz von Thun.
            </Seg>{" "}
            <Seg k="wissen" on={frame >= segAt.wissen}>
              Was du wissen musst: BFS Sozialassistenz, 1. Ausbildungsjahr, sehr unterschiedliche Sprachstände. 45 Minuten, eine Seite, das Modell ist neu. Einstieg mit
              einem Gespräch aus der Kita, dann Zuordnung und Transfer.
            </Seg>{" "}
            <Seg k="rueck" on={frame >= segAt.rueck}>
              Stelle mir so lange Rückfragen, bis alles klar ist.
            </Seg>
          </div>
          <div style={{ width: 230, paddingTop: 30 }}>
            <Dartboard hit at={hit} size={220} />
          </div>
        </div>
      </InfoCard>
      <Burst text="DANEBEN!" at={miss + 14} x={620} y={500} size={120} fill="#FFB0A8" hold={80} rotate={-8} />
      <Burst text="VOLLTREFFER!" at={hit + 14} x={1640} y={560} size={130} fill="#B6F0C2" hold={80} rotate={8} />
    </Scene>
  );
};

export const TipsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const [d, r] = TP.starts;
  const bars = interpolate(frame, [atRatio(d, V.dictate, 0.45), atRatio(d, V.dictate, 0.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chips = ["„Kürzer, höchstens eine Seite.“", "„In einfacherer Sprache.“", "„Als Tabelle.“", "„Mit Lösung auf einer eigenen Seite.“"];
  const chipAt = chips.map((_, i) => atRatio(r, V.refine, 0.25 + i * 0.1));
  const newChat = atRatio(r, V.refine, 0.75);
  const pulse = 1 + Math.sin(frame / 5) * 0.06;
  return (
    <Scene duration={DUR.tips} kicker={`${KICKER} · C`} title="Einsprechen und weiterarbeiten">
      <Voice name="dictate" at={d} />
      <Voice name="refine" at={r} />
      {[...chipAt, newChat].map((f) => (
        <Sfx key={f} name="pop" at={f} volume={0.45} />
      ))}
      <InfoCard x={160} y={240} w={680} amber title="🎙️ Einsprechen statt tippen" delay={d + 10} minH={560}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: 120, height: 120, borderRadius: 99, background: C.petrol, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, transform: `scale(${frame > d + 30 ? pulse : 1})` }}>
            🎙️
          </div>
        </div>
        {[
          ["1 Min. sprechen", 1, C.petrol],
          ["5 Min. tippen", 0.55, C.muted],
        ].map(([l, w, c]) => (
          <div key={l as string}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{l as string}</div>
            <div style={{ height: 30, borderRadius: 8, background: C.line, marginTop: 6 }}>
              <div style={{ height: 30, borderRadius: 8, width: `${(w as number) * bars * 100}%`, background: c as string }} />
            </div>
          </div>
        ))}
        <div style={{ fontSize: 22, color: C.muted }}>Menge an Kontext</div>
      </InfoCard>
      <InfoCard x={900} y={240} w={860} title="Nachschärfen statt neu anfangen" delay={r} minH={560}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          {chips.map((c, i) => (
            <Appear key={c} delay={chipAt[i]} bouncy>
              <div style={{ fontSize: 26, fontWeight: 700, color: C.petrol, background: C.petrolLight, borderRadius: 14, padding: "10px 18px" }}>{c}</div>
            </Appear>
          ))}
        </div>
        <Item icon="🧹" delay={newChat}>
          <b>Chat wird lang und wirr?</b> Neuen Chat öffnen, das Gute mitnehmen.
        </Item>
      </InfoCard>
      <Burst text="ENTWURF!" at={r + 20} x={1660} y={250} size={110} fill="#FFD0A0" hold={70} rotate={8} />
    </Scene>
  );
};

/* Teil 2 · Werkzeuge */
const TOOLS = [
  { name: TOOL, kicker: "FÜR DEINE VORBEREITUNG", dark: true, text: pick("Planen, Material erstellen, Projekte und Skills.", "Planen, Material erstellen, Projekte."), small: "Eigenes Konto. Nie mit Schüler*innen, keine personenbezogenen Daten." },
  { name: "AIS.chat", kicker: "MIT SCHÜLER*INNEN", dark: false, text: "Chatbots für die Klasse, Feedback, eigene Assistenten.", small: "Berliner Schulportal, kostenlos, DSGVO-konform. Per Link oder QR-Code." },
  { name: "fobizz", kicker: "MIT SCHÜLER*INNEN", dark: false, text: "KI-Assistenten für Schüler*innen, Korrekturhilfe, Material teilen.", small: "Über die Schullizenz, DSGVO-konform." },
];

export const ToolsScene: React.FC = () => {
  const [a, b] = TL.starts;
  const at = [atRatio(a, V.toolsA, 0.3), atRatio(b, V.toolsB, 0.25), atRatio(b, V.toolsB, 0.6)];
  return (
    <Scene duration={DUR.tools} kicker={`${KICKER} · Teil 2`} title="Welches Werkzeug wofür?">
      <Voice name="toolsA" at={a} />
      <Voice name="toolsB" at={b} />
      {at.map((f) => (
        <Sfx key={f} name="pop" at={f} volume={0.5} />
      ))}
      {TOOLS.map((t, i) => (
        <InfoCard key={t.name} x={160 + i * 545 + (i > 0 ? 30 : 0)} y={250} w={500} dark={t.dark} kicker={t.kicker} title={t.name} delay={at[i]} minH={480}>
          <div style={{ fontSize: 29, lineHeight: 1.4 }}>{t.text}</div>
          <div style={{ fontSize: 23, color: C.muted, lineHeight: 1.4 }}>{t.small}</div>
        </InfoCard>
      ))}
      {/* Grenze */}
      <div style={{ position: "absolute", left: 688, top: 230, height: 540 }}>
        <Appear delay={b}>
          <div style={{ width: 0, height: 540, borderLeft: `6px dashed ${C.red}` }} />
        </Appear>
      </div>
      <div style={{ position: "absolute", left: 160, right: 160, top: 800 }}>
        <Appear delay={b + 20}>
          <div style={{ textAlign: "center", fontSize: 32, fontWeight: 700, color: C.red }}>
            ┆ Die Grenze ist einfach: Was Schüler*innen nutzen, muss datenschutzkonform sein.
          </div>
        </Appear>
      </div>
      <Burst text="NUR FÜR DICH!" at={atRatio(a, V.toolsA, 0.75)} x={560} y={260} size={120} fill="#FFD0A0" hold={90} rotate={-8} />
    </Scene>
  );
};

/* Sortieren */
type Lane = 0 | 1 | 2;
const TASKS: { t: string; lane: Lane; r: number }[] = [
  { t: "eine Reihe oder Stunde planen", lane: 0, r: 0.09 },
  { t: "einen Text differenzieren", lane: 0, r: 0.17 },
  { t: "ein Arbeitsblatt erstellen", lane: 0, r: 0.25 },
  { t: "einen Chatbot für die Klasse", lane: 1, r: 0.43 },
  { t: "Feedback zu Schülertexten (anonymisiert)", lane: 1, r: 0.53 },
  { t: "mit Namen, Noten oder Gesundheitsdaten", lane: 2, r: 0.8 },
];
const LANES = [
  { t: TOOL, sub: "Vorbereiten · nur für dich", bg: C.dark, fg: "#fff" },
  { t: "AIS.chat oder fobizz", sub: "mit Schüler*innen", bg: C.petrol, fg: "#fff" },
  { t: "Kein KI-Werkzeug", sub: "personenbezogene Daten", bg: C.red, fg: "#fff" },
];
const LANE_X = [160, 710, 1260];

const SortCard: React.FC<{ t: string; lane: Lane; at: number; slot: number }> = ({ t, lane, at, slot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const pin = spring({ frame: frame - at, fps, config: { damping: 11 } });
  const fly = spring({ frame: frame - at - 22, fps, config: { damping: 14 } });
  const x = interpolate(fly, [0, 1], [710, LANE_X[lane] + 25]);
  const y = interpolate(fly, [0, 1], [250, 470 + slot * 100]);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 450,
        background: "#fff",
        border: `3px solid ${lane === 2 ? C.red : C.dark}`,
        borderRadius: 16,
        padding: "14px 20px",
        fontSize: 26,
        fontWeight: 700,
        boxShadow: `4px 4px 0 ${lane === 2 ? C.red : C.amber}`,
        transform: `scale(${(0.7 + pin * 0.3) * (1.12 - fly * 0.12)}) rotate(${(1 - fly) * -3}deg)`,
        zIndex: 5,
      }}
    >
      Ich möchte {t} …
    </div>
  );
};

export const SortScene: React.FC = () => {
  const frame = useCurrentFrame();
  const [s, l] = SO.starts;
  const slots: number[] = [];
  const counts = [0, 0, 0];
  TASKS.forEach((t) => slots.push(counts[t.lane]++));
  const laterChips = ["Gemini Notebook", "Canva", "Gamma"];
  return (
    <Scene duration={DUR.sort} kicker={KICKER} title="Ich möchte …">
      <Voice name="sort" at={s} />
      <Voice name="later" at={l} />
      {TASKS.map((t) => (
        <React.Fragment key={t.t}>
          <Sfx name="pop" at={atRatio(s, V.sort, t.r)} volume={0.45} />
          <Sfx name="whoosh" at={atRatio(s, V.sort, t.r) + 22} volume={0.35} />
        </React.Fragment>
      ))}
      <Sfx name="clink" at={atRatio(s, V.sort, 0.8) + 30} volume={0.6} />
      {LANES.map((lane, i) => (
        <div key={lane.t} style={{ position: "absolute", left: LANE_X[i], top: 370, width: 500 }}>
          <Appear delay={s + 5 + i * 8} bouncy>
            <div style={{ background: lane.bg, color: lane.fg, borderRadius: "18px 18px 0 0", padding: "14px 22px" }}>
              <div style={{ fontSize: 30, fontWeight: 800 }}>{lane.t}</div>
              <div style={{ fontSize: 19, opacity: 0.85 }}>{lane.sub}</div>
            </div>
            <div style={{ height: 380, background: "rgba(255,255,255,0.7)", border: `2px dashed ${C.line}`, borderTop: "none", borderRadius: "0 0 18px 18px" }} />
          </Appear>
        </div>
      ))}
      {TASKS.map((t, i) => (
        <SortCard key={t.t} t={t.t} lane={t.lane} at={atRatio(s, V.sort, t.r)} slot={slots[i]} />
      ))}
      {frame >= atRatio(s, V.sort, 0.8) + 40 && (
        <div style={{ position: "absolute", left: LANE_X[2] + 200, top: 620, fontSize: 90 }}>
          <Appear delay={atRatio(s, V.sort, 0.8) + 40} bouncy>
            🛑
          </Appear>
        </div>
      )}
      <div style={{ position: "absolute", left: 160, right: 160, top: 900 }}>
        <Appear delay={l}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26 }}>
            <b style={{ color: C.petrol }}>Später ausprobieren:</b>
            {laterChips.map((c, i) => (
              <Appear key={c} delay={atRatio(l, V.later, 0.55 + i * 0.13)} bouncy>
                <span style={{ background: C.amberLight, border: `2px solid ${C.amber}`, borderRadius: 999, padding: "6px 16px", fontWeight: 700 }}>{c}</span>
              </Appear>
            ))}
          </div>
        </Appear>
      </div>
      <Burst text="STOPP!" at={atRatio(s, V.sort, 0.8) + 32} x={1700} y={420} size={120} fill="#FFB0A8" hold={90} rotate={8} />
    </Scene>
  );
};

export const MerkeScene: React.FC = () => (
  <Scene duration={DUR.merke}>
    <Voice name="merke" at={20} />
    <Sfx name="chime" at={8} volume={0.4} />
    <InfoCard x={300} y={170} w={600} kicker="PROMPT-FORMEL" title="Aufgabe + Kontext + Rückfrage" delay={atRatio(20, V.merke, 0.03)} />
    <InfoCard x={1020} y={170} w={600} dark kicker="WERKZEUG" title="Mit Schüler*innen: AIS.chat · fobizz" delay={atRatio(20, V.merke, 0.4)} />
    <MerkeBox delay={20} top={430}>
      <b>Aufgabe + Kontext + Rückfrage.</b> Keine personenbezogenen Daten in KI-Werkzeuge. Mit Schüler*innen nur AIS.chat oder fobizz. Jedes Ergebnis mit dem
      5-Punkte-KI-Check prüfen, Noten vergibt die Lehrkraft.
    </MerkeBox>
    <div style={{ position: "absolute", right: 120, bottom: 0 }}>
      <Appear delay={90} bouncy>
        <Person size={240} />
      </Appear>
    </div>
    <div style={{ position: "absolute", right: 720, bottom: 110 }}>
      <Burst text="LOS GEHT'S!" at={100} x={0} y={0} size={120} fill="#B6F0C2" hold={200} rotate={-6} />
    </div>
  </Scene>
);
