import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Person } from "../Konditionierung/Icons";
import { Appear } from "../Konditionierung/ui";
import { AppWindow, Button, C, Cursor, CursorClicks, CursorKey, Scene, Sfx, SIDE_Y, Voice as BaseVoice, WinLayer } from "../ClaudeProjekt/kit";
import { Attach, CHAT_SEND, ChatView, Msg, msgLeftInWindow, msgTopInWindow, PromptT } from "../ClaudeProjekt/chat";
import { atRatio, Burst, InfoCard, Item, MerkeBox, ProblemBar, TitleBlock, Toggle } from "../ClaudeProjekt/common";
import { VOICE as V } from "./voice";

const Voice: React.FC<{ name: keyof typeof V; at: number }> = ({ name, at }) => <BaseVoice name={name} at={at} folder="skills" />;
const KICKER = "KI-Startpaket · Claude · Modul 2";
const GAP = 10;

const typeLen = (s: string, cps: number) => Math.ceil((s.length / cps) * 30);

/* ------------------------------------------------------------------ */
/* Inhalte                                                             */
/* ------------------------------------------------------------------ */
type Seg = string | { term: string; expl: string };

const TEXTS: Record<string, { a: Seg[]; b: Seg[]; gloss: string }> = {
  kond: {
    a: [
      "Ein Hund bekommt Futter und sabbert. Das ist angeboren. Hört er vorher oft eine Glocke, sabbert er bald schon bei der Glocke. Die Glocke ist dann ein ",
      { term: "konditionierter Reiz", expl: "ein Reiz, auf den der Hund gelernt hat zu reagieren" },
      ".",
    ],
    b: [
      "Pawlow koppelte wiederholt einen neutralen Reiz mit einem unkonditionierten Reiz. Dadurch wurde der neutrale Reiz zum ",
      { term: "konditionierten Reiz", expl: "" },
      ", der eine konditionierte Reaktion auslöst.",
    ],
    gloss: "konditionierter Reiz · unkonditionierter Reiz",
  },
  modell: {
    a: [
      "Kinder schauen sich viel bei anderen ab. Sie sehen ein ",
      { term: "Modell", expl: "eine Person, die etwas vormacht" },
      " und machen es später nach. Das nennt man Lernen am Modell.",
    ],
    b: [
      "Nach Bandura lernen Menschen durch Beobachtung eines Modells. Ob sie das Verhalten zeigen, hängt unter anderem von der ",
      { term: "Verstärkung", expl: "" },
      " ab, die das Modell erhält.",
    ],
    gloss: "Modell · Verstärkung · Beobachtungslernen",
  },
};

const Seglist: React.FC<{ segs: Seg[]; sharp: boolean }> = ({ segs, sharp }) => (
  <>
    {segs.map((s, i) =>
      typeof s === "string" ? (
        <span key={i}>{s}</span>
      ) : (
        <span key={i}>
          <span style={{ fontWeight: sharp ? 800 : 400, color: sharp ? C.petrol : C.ink }}>{s.term}</span>
          {sharp && s.expl && <span style={{ color: C.muted }}> ({s.expl})</span>}
        </span>
      ),
    )}
  </>
);

const TwoLevel: React.FC<{ topic: keyof typeof TEXTS; sharp: boolean; glossary?: boolean }> = ({ topic, sharp, glossary }) => {
  const t = TEXTS[topic];
  const col = (label: string, segs: Seg[], tint: string) => (
    <div style={{ flex: 1, border: `2px solid ${C.line}`, borderRadius: 16, overflow: "hidden" }}>
      <div style={{ background: tint, padding: "8px 16px", fontSize: 19, fontWeight: 800, letterSpacing: 1 }}>{label}</div>
      <div style={{ padding: "12px 16px", fontSize: 20, lineHeight: 1.45 }}>
        <Seglist segs={segs} sharp={sharp} />
      </div>
    </div>
  );
  return (
    <div>
      <div style={{ fontSize: 22, marginBottom: 10 }}>Hier ist der Text in zwei Niveaustufen:</div>
      <div style={{ display: "flex", gap: 16 }}>
        {col("NIVEAU A · EINFACHER", t.a, C.amberLight)}
        {col("NIVEAU B", t.b, C.petrolLight)}
      </div>
      {glossary && (
        <div style={{ marginTop: 10, fontSize: 19, background: C.amberLight, borderRadius: 10, padding: "8px 14px" }}>
          <b>Glossar:</b> {t.gloss}
        </div>
      )}
    </div>
  );
};

const SkillProposal: React.FC<{ savedAt: number }> = ({ savedAt }) => {
  const frame = useCurrentFrame();
  const saved = frame >= savedAt;
  return (
    <div>
      <div style={{ fontSize: 22, marginBottom: 10 }}>Gern! Hier ist mein Vorschlag:</div>
      <div style={{ border: `3px solid ${saved ? C.green : C.petrol}`, borderRadius: 18, overflow: "hidden", width: 760 }}>
        <div style={{ background: saved ? C.green : C.petrol, color: "#fff", padding: "10px 20px", fontSize: 24, fontWeight: 800 }}>
          📋 Skill: Text differenzieren
        </div>
        <div style={{ padding: "12px 20px", fontSize: 20, lineHeight: 1.6 }}>
          • Zwei Niveaustufen: A einfacher, B Standard
          <br />• Fachbegriffe bleiben, fett, in A kurz erklärt
          <br />• Gleiche Inhalte, ähnliche Länge
          <div style={{ marginTop: 10 }}>
            {saved ? (
              <span style={{ color: C.green, fontWeight: 800, fontSize: 22 }}>✓ Skill gespeichert</span>
            ) : (
              <Button primary style={{ fontSize: 21, padding: "8px 18px" }}>
                Skill speichern
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


/* ------------------------------------------------------------------ */
/* Zeitplan                                                            */
/* ------------------------------------------------------------------ */
const P1 = "Schreibe diesen Text in zwei Niveaustufen. Was du wissen musst: FOS 11, sehr unterschiedliche Sprachstände, Fachbegriffe bleiben. Stelle mir Rückfragen, bis alles klar ist.";
const P2 = "Fachbegriffe fett und in Stufe A kurz erklären.";
const P3 = "Erstelle daraus einen Skill.";
const P4 = "Lernen am Modell – Text im Anhang.";
const P5 = "Aktualisiere den Skill: Füge immer ein kleines Glossar hinzu.";

const S1 = (() => {
  const b = 15 + V.step1A + GAP;
  const t1 = 40;
  const send1 = t1 + typeLen(P1, 50) + 8;
  const a1 = send1 + 40;
  const t2 = b + 15;
  const send2 = t2 + typeLen(P2, 24) + 8;
  const a2 = send2 + 35;
  return { b, t1, send1, a1, t2, send2, a2, dur: Math.max(b + V.step1B + 40, a2 + 90) };
})();

const S2 = (() => {
  const t3 = 15 + Math.round(V.step2A * 0.45);
  const send3 = t3 + typeLen(P3, 22) + 8;
  const a3 = send3 + 30;
  const b = Math.max(15 + V.step2A + GAP, a3 + 5);
  const save = b + Math.round(V.step2B * 0.6);
  return { t3, send3, a3, b, save, dur: Math.max(b + V.step2B + 50, save + 70) };
})();

const S3 = (() => {
  const newChat = 45;
  const slash = 15 + Math.round(V.step3A * 0.68);
  const pick = slash + 35;
  const t4 = pick + 8;
  const send4 = t4 + typeLen(P4, 26) + 8;
  const a4 = send4 + 35;
  const b = Math.max(15 + V.step3A + GAP, a4 - 10);
  return { newChat, slash, pick, t4, send4, a4, b, dur: Math.max(b + V.step3B + 50, a4 + 110) };
})();

const S4 = (() => {
  const t5 = 15 + Math.round(V.step4 * 0.3);
  const send5 = t5 + typeLen(P5, 28) + 8;
  const a5 = send5 + 30;
  return { t5, send5, a5, dur: Math.max(15 + V.step4 + 45, a5 + 100) };
})();

const T = {
  problemB: 15 + V.problemA + GAP,
  compareB: 15 + V.compareA + GAP,
};

export const DUR = {
  title: 20 + V.title + 45,
  problem: T.problemB + V.problemB + 80,
  compare: T.compareB + V.compareB + 45,
  step1: S1.dur,
  step2: S2.dur,
  step3: S3.dur,
  step4: S4.dur,
  usage: 15 + V.usage + 45,
  worth: 15 + V.worth + 45,
  privacy: 15 + V.privacy + 45,
  merke: 20 + V.merke + 50,
};

/* Nachrichtenlisten (gemeinsamer Verlauf von Schritt 1 und 2) */
const chat1: Msg[] = [
  {
    role: "user",
    at: S1.send1 + 2,
    h: 150,
    node: (
      <>
        {P1}
        <br />
        <Attach name="Text_Konditionierung.docx" />
      </>
    ),
  },
  { role: "ai", at: S1.a1, h: 290, node: <TwoLevel topic="kond" sharp={false} /> },
  { role: "user", at: S1.send2 + 2, h: 56, node: P2 },
  { role: "ai", at: S1.a2, h: 320, node: <TwoLevel topic="kond" sharp /> },
];

const shift = (msgs: Msg[], by: number): Msg[] => msgs.map((m) => ({ ...m, at: m.at - by }));

/* ------------------------------------------------------------------ */
/* Szenen                                                              */
/* ------------------------------------------------------------------ */
const SkillCardBig: React.FC<{ size?: number }> = ({ size = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width: 520 * size,
        background: "#fff",
        border: `4px solid ${C.dark}`,
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: `10px 10px 0 ${C.amber}`,
        transform: `rotate(${-3 + Math.sin(frame / 25) * 1.5}deg)`,
        fontSize: 28 * size,
      }}
    >
      <div style={{ background: C.petrol, color: "#fff", padding: `${16 * size}px ${24 * size}px`, fontWeight: 900, fontSize: 34 * size }}>
        📋 Skill: Text differenzieren
      </div>
      <div style={{ padding: `${18 * size}px ${24 * size}px`, lineHeight: 1.6 }}>
        ✓ zwei Niveaustufen
        <br />✓ Fachbegriffe erklärt
        <br />✓ Lösung auf eigener Seite
      </div>
    </div>
  );
};

export const TitleScene: React.FC = () => (
  <Scene duration={DUR.title}>
    <Voice name="title" at={20} />
    <Sfx name="chime" at={8} volume={0.35} />
    <TitleBlock kicker={KICKER} lines={["Skills für", "wiederkehrende", "Aufgaben"]} subtitle="Einmal gut gemacht, beim nächsten Mal mit einem Satz abrufbar." />
    <div style={{ position: "absolute", left: 1180, top: 380 }}>
      <Appear delay={25} bouncy>
        <SkillCardBig />
      </Appear>
    </div>
    <Sfx name="pop" at={25} volume={0.6} />
  </Scene>
);

const notes = ["zwei Niveaustufen …", "Fachbegriffe erklären …", "Lösung auf eigene Seite …"];
export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = T.problemB;
  const starts = [30, 80, 115, 140, 160, 175];
  const fall = interpolate(frame, [b - 5, b + 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardP = spring({ frame: frame - (b + 5), fps, config: { damping: 9 } });
  return (
    <Scene duration={DUR.problem}>
      <Voice name="problemA" at={15} />
      <Voice name="problemB" at={b} />
      {starts.map((s) => (
        <Sfx key={s} name="pop" at={s} volume={0.45} />
      ))}
      <Sfx name="whoosh" at={b - 5} volume={0.6} />
      <Sfx name="chime" at={b + 8} volume={0.4} />
      <ProblemBar text="„Ich möchte nicht für jedes Arbeitsblatt alle Anweisungen neu formulieren.“" />
      <div style={{ position: "absolute", left: 230, top: 400 }}>
        <Appear delay={10} bouncy>
          <Person size={330} anxious={frame > 150 && frame < b + 20} />
        </Appear>
        <Burst text="SCHON WIEDER?!" at={160} x={170} y={-90} size={140} fill="#FFB0A8" hold={b - 165} rotate={-6} />
      </div>
      <div style={{ position: "absolute", left: 760, top: 290, width: 1000, height: 740 }}>
        {starts.map((s, i) => {
          if (frame < s) return null;
          const p = spring({ frame: frame - s, fps, config: { damping: 12 } });
          const col = i % 3;
          const row = Math.floor(i / 3);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: col * 320 + row * 30,
                top: row * 210 + col * 18,
                width: 290,
                background: ["#FFE58A", "#BDE6E3", "#FFD0A0"][col],
                padding: "22px 22px",
                fontSize: 27,
                fontWeight: 700,
                lineHeight: 1.35,
                boxShadow: "0 10px 22px rgba(0,0,0,0.15)",
                transform: `translateY(${(1 - p) * 40 + fall * (650 + i * 40)}px) rotate(${[-4, 3, -2, 5, -3, 2][i] + fall * 30}deg) scale(${0.8 + p * 0.2})`,
                opacity: Math.min(1, p * 1.5) * (1 - fall),
              }}
            >
              <div style={{ fontSize: 18, color: C.muted, marginBottom: 6 }}>{row === 0 ? "Arbeitsblatt 1" : "Arbeitsblatt 2"}</div>
              {notes[col]}
            </div>
          );
        })}
        {frame > b && (
          <div style={{ position: "absolute", left: 200, top: 120, transform: `scale(${cardP})` }}>
            <SkillCardBig size={1.15} />
          </div>
        )}
        <Burst text="SKILL!" at={b + 15} x={780} y={110} size={140} fill="#B6F0C2" hold={100} rotate={8} />
      </div>
    </Scene>
  );
};

export const CompareScene: React.FC = () => {
  const b = T.compareB;
  const a1 = atRatio(15, V.compareA, 0.55);
  const note = atRatio(b, V.compareB, 0.45);
  return (
    <Scene duration={DUR.compare} kicker={`${KICKER} · A`} title="Was ist ein Skill?">
      <Voice name="compareA" at={15} />
      <Voice name="compareB" at={b} />
      {[a1, b, note].map((f) => (
        <Sfx key={f} name="pop" at={f} volume={0.5} />
      ))}
      <InfoCard x={160} y={240} w={770} dark kicker="MODUL 1" title="Projekt = Kontext" delay={a1} minH={360}>
        <Item icon="👥" delay={a1 + 15}>
          Wer ist deine Klasse, welches Material gilt? Für ein Fach oder einen Bildungsgang.
        </Item>
        <Item icon="📁" delay={a1 + 30}>
          <span style={{ color: C.muted }}>z. B. „FOS 11 Psychologie“ mit Rahmenlehrplan</span>
        </Item>
      </InfoCard>
      <InfoCard x={990} y={240} w={770} kicker="MODUL 2" title="Skill = Arbeitsablauf" delay={b} minH={360}>
        <Item icon="⚙️" delay={b + 15}>
          Wie wird eine bestimmte Aufgabe erledigt? Nutzbar in jedem Projekt.
        </Item>
        <Item icon="📋" delay={b + 30}>
          <span style={{ color: C.muted }}>z. B. „Text in zwei Niveaustufen“ oder „Arbeitsblatt im Schullayout“</span>
        </Item>
      </InfoCard>
      <div style={{ position: "absolute", left: 160, right: 160, top: 690 }}>
        <Appear delay={note} bouncy>
          <div style={{ background: C.amberLight, border: `2px solid ${C.amber}`, borderRadius: 18, padding: "24px 32px", fontSize: 32 }}>
            💡 <b>Du musst keinen Skill selbst schreiben.</b> Claude formuliert ihn aus einem Gespräch, das gut gelaufen ist.
          </div>
        </Appear>
      </div>
    </Scene>
  );
};

/* Schritt 1 · Machen */
export const Step1Scene: React.FC = () => {
  const s = S1;
  const prompts: PromptT[] = [
    { text: P1, plain: P1, start: s.t1, send: s.send1, cps: 50 },
    { text: P2, plain: P2, start: s.t2, send: s.send2, cps: 24 },
  ];
  const keys: CursorKey[] = [
    { f: s.send1 - 12, x: CHAT_SEND.x, y: CHAT_SEND.y },
    { f: s.send1, x: CHAT_SEND.x, y: CHAT_SEND.y, click: true },
    { f: s.send2 - 6, x: CHAT_SEND.x, y: CHAT_SEND.y },
    { f: s.send2, x: CHAT_SEND.x, y: CHAT_SEND.y, click: true },
    { f: s.send2 + 30, x: 1300, y: 600 },
  ];
  return (
    <Scene duration={DUR.step1} kicker={`${KICKER} · B`} title="Machen" step={1} path="Aufgabe mit der Prompt-Formel">
      <Voice name="step1A" at={15} />
      <Voice name="step1B" at={s.b} />
      <Sfx name="typing" at={s.t1} frames={s.send1 - s.t1 - 8} volume={0.7} />
      <Sfx name="typing" at={s.t2} frames={s.send2 - s.t2 - 8} volume={0.7} />
      <Sfx name="pop" at={s.a1} volume={0.5} />
      <Sfx name="pop" at={s.a2} volume={0.5} />
      <CursorClicks keys={keys} />
      <AppWindow active="projects">
        <ChatView title="Text differenzieren" msgs={chat1} prompts={prompts} />
      </AppWindow>
      <WinLayer>
        <Burst text="NACHSCHÄRFEN!" at={s.t2} x={1330} y={600} size={120} fill="#FFD0A0" hold={60} rotate={-6} />
        <Burst text="PASST!" at={s.a2 + 30} x={1390} y={330} size={130} fill="#B6F0C2" hold={80} rotate={8} />
        <Cursor keys={keys} />
      </WinLayer>
    </Scene>
  );
};

/* Schritt 2 · Speichern */
export const Step2Scene: React.FC = () => {
  const s = S2;
  const frame = useCurrentFrame();
  const msgs: Msg[] = [
    ...shift(chat1, S1.dur),
    { role: "user", at: s.send3 + 2, h: 56, node: P3 },
    { role: "ai", at: s.a3, h: 300, node: <SkillProposal savedAt={s.save + 3} /> },
  ];
  const btnTop = msgTopInWindow(msgs, msgs.length - 1, s.save) + 44 + 52 + 3 * 32 + 10 + 26;
  const btnLeft = msgLeftInWindow("ai") + 20 + 95;
  const keys: CursorKey[] = [
    { f: s.send3 - 12, x: CHAT_SEND.x, y: CHAT_SEND.y },
    { f: s.send3, x: CHAT_SEND.x, y: CHAT_SEND.y, click: true },
    { f: s.save - 22, x: btnLeft, y: btnTop },
    { f: s.save, x: btnLeft, y: btnTop, click: true },
    { f: s.save + 40, x: 1300, y: 500 },
  ];
  return (
    <Scene duration={DUR.step2} kicker={`${KICKER} · B`} title="Speichern" step={2} path="„Erstelle daraus einen Skill.“">
      <Voice name="step2A" at={15} />
      <Voice name="step2B" at={s.b} />
      <Sfx name="typing" at={s.t3} frames={s.send3 - s.t3 - 8} volume={0.7} />
      <Sfx name="pop" at={s.a3} volume={0.5} />
      <Sfx name="chime" at={s.save + 4} volume={0.45} />
      <CursorClicks keys={keys} />
      <AppWindow active="projects">
        <ChatView title="Text differenzieren" msgs={msgs} prompts={[{ text: P3, plain: P3, start: s.t3, send: s.send3, cps: 22 }]} />
      </AppWindow>
      <WinLayer>
        <Burst text="GESPEICHERT!" at={s.save + 6} x={1300} y={560} size={130} fill="#B6F0C2" hold={80} rotate={6} />
        {frame > s.save + 10 && (
          <div style={{ position: "absolute", right: 30, top: 24 }}>
            <Appear delay={s.save + 10} bouncy>
              <div style={{ background: C.dark, color: "#fff", borderRadius: 14, padding: "12px 20px", fontSize: 22, fontWeight: 700 }}>
                ✓ In „Anpassen › Skills“ gespeichert
              </div>
            </Appear>
          </div>
        )}
        <Cursor keys={keys} />
      </WinLayer>
    </Scene>
  );
};

/* Schritt 3 · Testen */
const SlashMenu: React.FC<{ at: number; until: number; pickAt: number }> = ({ at, until, pickAt }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > until) return null;
  const items = [
    ["/text-differenzieren", "Text in zwei Niveaustufen"],
    ["/arbeitsblatt-schullayout", "Arbeitsblatt im Schullayout"],
    ["/erwartungshorizont", "Operatoren, Punkte, Tabelle"],
  ];
  const hl = frame > pickAt - 18;
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        top: 660 - 230,
        width: 640,
        background: "#fff",
        border: `2px solid ${C.line}`,
        borderRadius: 16,
        boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
        padding: 10,
        zIndex: 10,
      }}
    >
      <div style={{ fontSize: 18, color: C.muted, fontWeight: 700, padding: "4px 12px 8px" }}>SKILLS</div>
      {items.map(([k, d], i) => (
        <div
          key={k}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 14px",
            borderRadius: 10,
            fontSize: 22,
            background: hl && i === 0 ? C.petrolLight : "transparent",
          }}
        >
          <b style={{ color: i === 0 ? C.petrol : C.ink }}>{k}</b>
          <span style={{ color: C.muted }}>{d}</span>
        </div>
      ))}
    </div>
  );
};

const chat3 = (): Msg[] => [
  {
    role: "user",
    at: S3.send4 + 2,
    h: 100,
    node: (
      <>
        <b style={{ color: C.petrol }}>/text-differenzieren</b> {P4}
        <br />
        <Attach name="Text_Lernen_am_Modell.docx" />
      </>
    ),
  },
  { role: "ai", at: S3.a4, h: 330, node: <TwoLevel topic="modell" sharp /> },
];

export const Step3Scene: React.FC = () => {
  const s = S3;
  const frame = useCurrentFrame();
  const keys: CursorKey[] = [
    { f: 15, x: 900, y: 500 },
    { f: s.newChat - 8, x: 140, y: SIDE_Y.newChat },
    { f: s.newChat, x: 140, y: SIDE_Y.newChat, click: true },
    { f: s.newChat + 40, x: 900, y: 712 },
    { f: s.pick - 10, x: 560, y: 492 },
    { f: s.pick, x: 560, y: 492, click: true },
    { f: s.send4 - 10, x: CHAT_SEND.x, y: CHAT_SEND.y },
    { f: s.send4, x: CHAT_SEND.x, y: CHAT_SEND.y, click: true },
    { f: s.send4 + 40, x: 1300, y: 600 },
  ];
  return (
    <Scene duration={DUR.step3} kicker={`${KICKER} · B`} title="Testen" step={3} path="Neuer Chat, anderes Thema">
      <Voice name="step3A" at={15} />
      <Voice name="step3B" at={s.b} />
      <Sfx name="click" at={s.slash} />
      <Sfx name="pop" at={s.slash + 2} volume={0.5} />
      <Sfx name="typing" at={s.t4} frames={s.send4 - s.t4 - 8} volume={0.7} />
      <Sfx name="pop" at={s.a4} volume={0.5} />
      <CursorClicks keys={keys} />
      <AppWindow active="projects">
        {frame < s.newChat ? (
          <ChatView title="Text differenzieren" msgs={shift(chat1, 2000)} />
        ) : (
          <ChatView
            title="Neuer Chat"
            msgs={chat3()}
            prompts={[
              { text: "/", plain: "/", start: s.slash, send: s.pick, cps: 30 },
              {
                text: (
                  <>
                    <b style={{ color: C.petrol }}>/text-differenzieren</b> {P4}
                  </>
                ),
                plain: "/text-differenzieren " + P4,
                start: s.pick + 4,
                send: s.send4,
                cps: 45,
              },
            ]}
            empty={
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontFamily: "Georgia, serif", color: C.muted }}>
                ✳︎ Neuer Chat im Projekt
              </div>
            }
            inputOverlay={
              <>
                <SlashMenu at={s.slash} until={s.pick + 4} pickAt={s.pick} />
              </>
            }
          />
        )}
      </AppWindow>
      <WinLayer>
        <Burst text="GLEICHES FORMAT!" at={s.a4 + 30} x={1250} y={540} size={130} fill="#B6F0C2" hold={90} rotate={6} />
        <Cursor keys={keys} />
      </WinLayer>
    </Scene>
  );
};

/* Schritt 4 · Verbessern */
export const Step4Scene: React.FC = () => {
  const s = S4;
  const msgs: Msg[] = [
    ...shift(chat3(), 4000),
    { role: "user", at: s.send5 + 2, h: 56, node: P5 },
    {
      role: "ai",
      at: s.a5,
      h: 170,
      node: (
        <div style={{ border: `3px solid ${C.green}`, borderRadius: 16, padding: "14px 20px", width: 760, fontSize: 22, lineHeight: 1.5 }}>
          <div style={{ fontWeight: 800, color: C.green, fontSize: 24 }}>✓ Skill „Text differenzieren“ aktualisiert</div>
          Neu: am Ende immer ein kleines Glossar mit den Fachbegriffen.
          <div style={{ marginTop: 8 }}>
            <span style={{ background: C.petrol, color: "#fff", borderRadius: 999, padding: "3px 14px", fontSize: 18, fontWeight: 800 }}>Version 2</span>
          </div>
        </div>
      ),
    },
  ];
  const keys: CursorKey[] = [
    { f: s.send5 - 12, x: CHAT_SEND.x, y: CHAT_SEND.y },
    { f: s.send5, x: CHAT_SEND.x, y: CHAT_SEND.y, click: true },
    { f: s.send5 + 40, x: 900, y: 600 },
  ];
  return (
    <Scene duration={DUR.step4} kicker={`${KICKER} · B`} title="Verbessern" step={4} path="„Aktualisiere den Skill: …“">
      <Voice name="step4" at={15} />
      <Sfx name="typing" at={s.t5} frames={s.send5 - s.t5 - 8} volume={0.7} />
      <Sfx name="chime" at={s.a5 + 4} volume={0.4} />
      <CursorClicks keys={keys} />
      <AppWindow active="projects">
        <ChatView title="Neuer Chat" msgs={msgs} prompts={[{ text: P5, plain: P5, start: s.t5, send: s.send5, cps: 28 }]} />
      </AppWindow>
      <WinLayer>
        <Burst text="VERSION 2!" at={s.a5 + 20} x={1300} y={570} size={130} fill="#B6F0C2" hold={80} rotate={-6} />
        <Cursor keys={keys} />
      </WinLayer>
    </Scene>
  );
};

/* Bedienung */
export const UsageScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = atRatio(15, V.usage, 0.02);
  const sw = atRatio(15, V.usage, 0.18);
  const find = atRatio(15, V.usage, 0.45);
  const share = atRatio(15, V.usage, 0.72);
  const on = interpolate(frame, [sw, sw + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fly = interpolate(frame, [share + 30, share + 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Scene duration={DUR.usage} kicker={KICKER} title="So nutzt du Skills in Claude">
      <Voice name="usage" at={15} />
      <Sfx name="click" at={sw} />
      <Sfx name="chime" at={sw + 4} volume={0.35} />
      <Sfx name="pop" at={find} volume={0.5} />
      <Sfx name="pop" at={share} volume={0.5} />
      <Sfx name="whoosh" at={share + 30} volume={0.5} />
      <InfoCard x={160} y={240} w={500} kicker="EINMALIG" title="Einschalten" delay={a} minH={430}>
        <div style={{ fontSize: 26, color: C.petrol, fontWeight: 700 }}>⚙️ Einstellungen › Funktionen</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 28 }}>
          <span style={{ flex: 1 }}>Code-Ausführung</span>
          <Toggle on={on} />
        </div>
        <div style={{ fontSize: 24, color: C.muted }}>Geht auch kostenlos.</div>
        <div style={{ position: "relative", height: 10 }}>
          <Burst text="AN!" at={sw + 4} x={370} y={-160} size={100} fill="#B6F0C2" hold={70} />
        </div>
      </InfoCard>
      <InfoCard x={710} y={240} w={500} kicker="WIEDERFINDEN" title="Anpassen › Skills" delay={find} minH={430}>
        {["📋 Text differenzieren", "📄 Arbeitsblatt im Schullayout", "📊 Erwartungshorizont"].map((t, i) => (
          <Appear key={t} delay={find + 12 + i * 10}>
            <div style={{ fontSize: 25, fontWeight: 700, border: `2px solid ${C.line}`, borderRadius: 12, padding: "12px 16px" }}>{t}</div>
          </Appear>
        ))}
        <div style={{ fontSize: 24, color: C.muted }}>ansehen · bearbeiten · löschen</div>
      </InfoCard>
      <InfoCard x={1260} y={240} w={500} kicker="TEILEN" title="Als ZIP-Datei" delay={share} minH={430}>
        <div style={{ position: "relative", height: 280 }}>
          <div
            style={{
              position: "absolute",
              left: 10 + fly * 130,
              top: 20 + Math.sin(fly * Math.PI) * -60 + fly * 110,
              fontSize: 22,
              whiteSpace: "nowrap",
              fontWeight: 800,
              background: C.amberLight,
              border: `2px solid ${C.amber}`,
              borderRadius: 12,
              padding: "10px 14px",
              opacity: frame >= share ? 1 : 0,
            }}
          >
            🗜️ text-differenzieren.zip
          </div>
          <div style={{ position: "absolute", left: 150, top: 200, fontSize: 64, opacity: frame >= share + 20 ? 1 : 0 }}>👩‍🏫👨‍🏫</div>
        </div>
        <div style={{ fontSize: 24, color: C.muted }}>an Kolleg*innen weitergeben</div>
      </InfoCard>
    </Scene>
  );
};

/* Lohnt sich ein Skill? */
export const WorthScene: React.FC = () => {
  const yes = atRatio(15, V.worth, 0.06);
  const yesItems = ["Texte differenzieren", "Arbeitsblatt im Schullayout", "Erwartungshorizont", "Feedback-Formulierungen"].map((t, i) => [t, atRatio(15, V.worth, 0.17 + i * 0.09)] as const);
  const no = atRatio(15, V.worth, 0.6);
  const noItems = ["Einmaliges", "Projektideen", "freies Brainstorming"].map((t, i) => [t, atRatio(15, V.worth, 0.66 + i * 0.07)] as const);
  const quote = atRatio(15, V.worth, 0.86);
  return (
    <Scene duration={DUR.worth} kicker={KICKER} title="Lohnt sich ein Skill?">
      <Voice name="worth" at={15} />
      {[yes, ...yesItems.map((x) => x[1]), no, ...noItems.map((x) => x[1])].map((f, i) => (
        <Sfx key={i} name="pop" at={f} volume={0.45} />
      ))}
      <InfoCard x={160} y={240} w={770} title="✓ Ja: Routine mit fester Struktur" delay={yes} minH={500}>
        {yesItems.map(([t, f]) => (
          <Item key={t} icon="✅" delay={f}>
            {t}
          </Item>
        ))}
      </InfoCard>
      <InfoCard x={990} y={240} w={770} dark title="✗ Eher nicht: Einmaliges, Kreatives" delay={no} minH={500}>
        {noItems.map(([t, f]) => (
          <Item key={t} icon="💭" delay={f}>
            {t}
          </Item>
        ))}
      </InfoCard>
      <div style={{ position: "absolute", left: 990, top: 650, width: 770 }}>
        <Appear delay={quote} bouncy>
          <div style={{ background: C.amberLight, border: `2px solid ${C.amber}`, borderRadius: 16, padding: "18px 24px", fontSize: 28, fontStyle: "italic" }}>
            „Da steht ein fester Weg dem Denken im Weg.“
          </div>
        </Appear>
      </div>
      <Burst text="LOHNT SICH!" at={yesItems[3][1] + 25} x={800} y={250} size={120} fill="#B6F0C2" hold={70} rotate={8} />
    </Scene>
  );
};

/* Datenschutz & Prüfen */
export const PrivacyScene: React.FC = () => {
  const a = atRatio(15, V.privacy, 0.05);
  const b = atRatio(15, V.privacy, 0.42);
  const c = atRatio(15, V.privacy, 0.82);
  const checks = ["Fachlichkeit", "Lernwirksamkeit", "Passung", "Datenschutz", "Verantwortung"];
  return (
    <Scene duration={DUR.privacy} kicker={KICKER} title="Datenschutz und Prüfen">
      <Voice name="privacy" at={15} />
      {[a, b, c].map((f) => (
        <Sfx key={f} name="pop" at={f} volume={0.5} />
      ))}
      <InfoCard x={160} y={240} w={770} kicker="DATENSCHUTZ" title="Skills mit erfundenen Beispielen" delay={a} minH={420}>
        <Item icon="🧪" delay={a + 12}>
          Nur erfundene Beispiele verwenden.
        </Item>
        <Item icon="🚫" delay={a + 24}>
          Keine Klarnamen, keine Schülerinformationen – auch nicht im Musterergebnis.
        </Item>
        <Item icon="👀" delay={a + 36}>
          Skills von anderen vor dem Speichern lesen.
        </Item>
      </InfoCard>
      <InfoCard x={990} y={240} w={770} amber kicker="AUCH MIT SKILL" title="Die Verantwortung bleibt bei dir" delay={b} minH={420}>
        <div style={{ fontSize: 26, color: C.muted }}>5-Punkte-KI-Check:</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {checks.map((t, i) => (
            <Appear key={t} delay={c + i * 8} bouncy>
              <div style={{ fontSize: 26, fontWeight: 800, color: C.petrol, background: C.petrolLight, borderRadius: 12, padding: "10px 16px" }}>✓ {t}</div>
            </Appear>
          ))}
        </div>
      </InfoCard>
      {checks.map((t, i) => (
        <Sfx key={t} name="click" at={c + i * 8} volume={0.6} />
      ))}
    </Scene>
  );
};

export const MerkeScene: React.FC = () => (
  <Scene duration={DUR.merke}>
    <Voice name="merke" at={20} />
    <Sfx name="chime" at={8} volume={0.4} />
    <InfoCard x={300} y={170} w={600} dark kicker="MODUL 1" title="📁 Projekt = Kontext" delay={atRatio(20, V.merke, 0.62)} />
    <InfoCard x={1020} y={170} w={600} kicker="MODUL 2" title="📋 Skill = Arbeitsablauf" delay={atRatio(20, V.merke, 0.8)} />
    <MerkeBox delay={20} top={430}>
      <b>Erst machen, dann speichern.</b> Was du der KI immer wieder gleich erklärst, gehört in einen Skill. Ein guter Skill spart Zeit, ersetzt aber
      nicht dein Urteil.
    </MerkeBox>
    <div style={{ position: "absolute", right: 120, bottom: 0 }}>
      <Appear delay={90} bouncy>
        <Person size={240} />
      </Appear>
    </div>
    <div style={{ position: "absolute", right: 700, bottom: 110 }}>
      <Burst text="ERST MACHEN!" at={100} x={0} y={0} size={120} fill="#B6F0C2" hold={150} rotate={-6} />
    </div>
  </Scene>
);
