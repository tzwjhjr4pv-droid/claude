import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Person } from "../Konditionierung/Icons";
import { Appear } from "../Konditionierung/ui";
import { AppWindow, Button, C, Cursor, CursorClicks, CursorKey, Scene, Sfx, Voice as BaseVoice, WinLayer } from "../ClaudeProjekt/kit";
import { CHAT_SEND, ChatView, Msg, msgLeftInWindow, msgTopInWindow, PromptT } from "../ClaudeProjekt/chat";
import { atRatio, Burst, InfoCard, Item, MerkeBox, ProblemBar, TitleBlock } from "../ClaudeProjekt/common";
import { VOICE as V } from "./voice";

const Voice: React.FC<{ name: keyof typeof V; at: number }> = ({ name, at }) => <BaseVoice name={name} at={at} folder="workflow" />;
const KICKER = "KI-Startpaket · Claude · Modul 3";
const GAP = 10;
const typeLen = (s: string, cps: number) => Math.ceil((s.length / cps) * 30);

const LINKS = [
  { n: 1, title: "Reihe planen", sub: "Leitfrage, Stundenfolge, Kompetenzen", help: "Rahmenlehrplan im Projekt", icon: "🗺️" },
  { n: 2, title: "Stunde planen", sub: "Verlaufsplan mit Phasen, Sozialformen, Zeiten", help: "Projekt, evtl. Skill", icon: "⏱️" },
  { n: 3, title: "Material erstellen", sub: "Arbeitsblatt, Präsentation, Quiz, Tafelbild", help: "dein Skill aus Modul 2", icon: "📄" },
  { n: 4, title: "Teilen", sub: "exportieren, an die Klasse oder ins Kollegium", help: "Word, PDF, IServ, TaskCards", icon: "📤" },
];
const linkColor = (n: number) => (n === 4 ? C.dark : n === 3 ? C.amberLight : C.petrolLight);

/* ------------------------------------------------------------------ */
/* Kettenglieder                                                       */
/* ------------------------------------------------------------------ */
const LinkCard: React.FC<{ l: (typeof LINKS)[number]; delay: number; w?: number; compact?: boolean; lit?: boolean }> = ({ l, delay, w = 360, compact, lit = true }) => {
  const dark = l.n === 4;
  return (
    <Appear delay={delay} bouncy>
      <div
        style={{
          width: w,
          minHeight: compact ? 0 : 300,
          background: lit ? linkColor(l.n) : "#EEF0EF",
          color: dark && lit ? "#fff" : C.ink,
          borderRadius: 22,
          padding: compact ? "12px 16px" : "24px 26px",
          opacity: lit ? 1 : 0.55,
          border: lit && compact ? `3px solid ${C.amber}` : "3px solid transparent",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: compact ? 34 : 50,
              height: compact ? 34 : 50,
              borderRadius: 99,
              background: dark ? C.amber : C.petrol,
              color: dark ? C.dark : "#fff",
              fontWeight: 900,
              fontSize: compact ? 20 : 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {l.n}
          </div>
          {!compact && <div style={{ fontSize: 44 }}>{l.icon}</div>}
          {compact && <div style={{ fontSize: 22, fontWeight: 800 }}>{l.title}</div>}
        </div>
        {!compact && (
          <>
            <div style={{ fontSize: 34, fontWeight: 800, marginTop: 16 }}>{l.title}</div>
            <div style={{ fontSize: 25, lineHeight: 1.4, marginTop: 8 }}>{l.sub}</div>
            <div style={{ fontSize: 22, marginTop: 14, opacity: 0.75 }}>hilft: {l.help}</div>
          </>
        )}
      </div>
    </Appear>
  );
};

const ChainIcon: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 8 } });
  return (
    <svg width={60} height={40} viewBox="0 0 60 40" style={{ transform: `scale(${p})` }}>
      <rect x={4} y={8} width={30} height={24} rx={12} fill="none" stroke={C.amber} strokeWidth={6} />
      <rect x={26} y={8} width={30} height={24} rx={12} fill="none" stroke={C.petrol} strokeWidth={6} />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Chat-Inhalte                                                        */
/* ------------------------------------------------------------------ */
const Table: React.FC<{ head: string[]; rows: string[][]; widths: number[] }> = ({ head, rows, widths }) => (
  <div style={{ border: `2px solid ${C.line}`, borderRadius: 12, overflow: "hidden", fontSize: 18 }}>
    <div style={{ display: "flex", background: C.dark, color: "#fff", fontWeight: 700 }}>
      {head.map((h, i) => (
        <div key={h} style={{ width: widths[i], padding: "6px 12px" }}>
          {h}
        </div>
      ))}
    </div>
    {rows.map((r, j) => (
      <div key={j} style={{ display: "flex", borderTop: `1px solid ${C.line}`, background: j === 2 && head[0] === "Nr." ? C.amberLight : "#fff" }}>
        {r.map((c, i) => (
          <div key={i} style={{ width: widths[i], padding: "5px 12px", fontWeight: i === 0 ? 700 : 400 }}>
            {c}
          </div>
        ))}
      </div>
    ))}
  </div>
);

const ReiheReply: React.FC = () => (
  <div>
    <div style={{ fontSize: 21, marginBottom: 8 }}>
      Danke für deine Antworten! <b>Leitfrage:</b> Wie lernen Menschen – und was heißt das für die pädagogische Praxis?
    </div>
    <Table
      head={["Nr.", "Doppelstunde", "Kompetenz (Auszug)"]}
      widths={[70, 420, 560]}
      rows={[
        ["1", "Was ist Lernen?", "Lernbegriff erläutern"],
        ["2", "Klassische Konditionierung", "Reiz-Reaktions-Lernen anwenden"],
        ["3", "Lernen am Modell", "Phasen des Modelllernens beschreiben"],
        ["4", "Operante Konditionierung", "Verstärkung analysieren"],
        ["5", "Kognitives Lernen", "Lerntheorien vergleichen"],
        ["6", "Transfer ins Praxisfeld", "Fallbeispiele beurteilen"],
      ]}
    />
  </div>
);

const StundeReply: React.FC = () => (
  <div>
    <div style={{ fontSize: 21, marginBottom: 8 }}>
      <b>Stunde 3 · Lernen am Modell</b> · 90 Minuten
    </div>
    <Table
      head={["Phase", "Zeit", "Inhalt", "Sozialform"]}
      widths={[170, 90, 590, 200]}
      rows={[
        ["Einstieg", "10′", "Fallbeispiel aus der Kita: Ein Kind ahmt nach", "Plenum"],
        ["Erarbeitung", "35′", "Arbeitsblatt: Phasen des Modelllernens", "EA / PA"],
        ["Sicherung", "20′", "Tafelbild gemeinsam entwickeln", "Plenum"],
        ["Transfer", "20′", "Fallanalyse aus dem Praktikum", "GA"],
        ["Abschluss", "5′", "Exit-Ticket", "EA"],
      ]}
    />
  </div>
);

const SheetReply: React.FC = () => (
  <div style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
    <div style={{ width: 300, height: 300, background: "#fff", border: `2px solid ${C.line}`, borderRadius: 8, boxShadow: "0 6px 16px rgba(0,0,0,0.1)", overflow: "hidden" }}>
      <div style={{ height: 8, background: C.amber }} />
      <div style={{ padding: "10px 14px" }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: C.petrol, fontWeight: 800 }}>ARBEITSBLATT · PSYCHOLOGIE</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.petrol, marginTop: 4 }}>Lernen am Modell</div>
        <div style={{ height: 2, background: C.amber, margin: "6px 0 10px" }} />
        {[1, 2, 3].map((n) => (
          <div key={n} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 800 }}>Aufgabe {n}</div>
            {[0, 1].map((l) => (
              <div key={l} style={{ height: 6, background: C.line, borderRadius: 3, marginTop: 5, width: l ? "70%" : "95%" }} />
            ))}
          </div>
        ))}
      </div>
    </div>
    <div style={{ fontSize: 21, lineHeight: 1.5, paddingTop: 6 }}>
      Hier ist das Arbeitsblatt für die Erarbeitungsphase – im Layout deines Musterblatts:
      <br />• Aufgabe 1: Fall lesen, Modell und Beobachter benennen
      <br />• Aufgabe 2: Phasen des Modelllernens zuordnen
      <br />• Aufgabe 3: Transfer auf dein Praktikum
      <div style={{ marginTop: 10 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: C.petrol, border: `2px solid ${C.petrol}`, borderRadius: 999, padding: "3px 12px" }}>
          nutzt Skill: Arbeitsblatt im Schullayout
        </span>
      </div>
    </div>
  </div>
);

const FileReply: React.FC<{ clickedAt: number }> = ({ clickedAt }) => {
  const frame = useCurrentFrame();
  const done = frame >= clickedAt;
  return (
    <div>
      <div style={{ fontSize: 21, marginBottom: 10 }}>Gern, hier ist die Word-Datei:</div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, border: `2px solid ${C.line}`, borderRadius: 16, padding: "14px 18px", width: 720 }}>
        <div style={{ width: 52, height: 62, borderRadius: 8, background: "#2F6DB5", color: "#fff", fontWeight: 800, fontSize: 15, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6 }}>
          DOCX
        </div>
        <div style={{ flex: 1, fontSize: 22, fontWeight: 700 }}>Arbeitsblatt_Lernen_am_Modell.docx</div>
        {done ? (
          <span style={{ color: C.green, fontWeight: 800, fontSize: 22 }}>✓ geladen</span>
        ) : (
          <Button primary style={{ fontSize: 20, padding: "8px 16px", whiteSpace: "nowrap" }}>
            ⬇ Herunterladen
          </Button>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Zeitplan Demo                                                       */
/* ------------------------------------------------------------------ */
const PROMPTS = [
  "Plane eine Reihe zu Lernen, 6 Doppelstunden. Gib mir Leitfrage, Stundenfolge und Kompetenzen als Tabelle. Stelle mir Rückfragen.",
  "Plane Stunde 3 als Verlaufsplan: 90 Minuten, Phasen mit Zeiten und Sozialformen.",
  "Erstelle das Arbeitsblatt für die Erarbeitungsphase.",
  "Gib mir das Arbeitsblatt als Word-Datei.",
];
const LINK_VOICES = ["link1", "link2", "link3", "link4"] as const;
const HEIGHTS = [330, 280, 320, 130];

const DEMO = (() => {
  let t = 15;
  const steps = PROMPTS.map((p, i) => {
    const v = t;
    const vlen = V[LINK_VOICES[i]];
    const start = v + 40;
    const send = start + typeLen(p, 34) + 8;
    const reply = send + 40;
    t = Math.max(v + vlen + GAP, reply + 70);
    return { v, start, send, reply };
  });
  const download = steps[3].reply + 70;
  return { steps, download, dur: Math.max(t + 30, download + 60) };
})();

const T = {
  problemB: 15 + V.problemA + GAP,
  chainB: 15 + V.chainA + GAP,
};

export const DUR = {
  title: 20 + V.title + 50,
  problem: T.problemB + V.problemB + 60,
  chain: T.chainB + V.chainB + 45,
  demo: DEMO.dur,
  share: 15 + V.share + 45,
  self: 15 + V.self + 45,
  merke: 20 + V.merke + 50,
};

/* ------------------------------------------------------------------ */
/* Szenen                                                              */
/* ------------------------------------------------------------------ */
export const TitleScene: React.FC = () => (
  <Scene duration={DUR.title}>
    <Voice name="title" at={20} />
    <Sfx name="chime" at={8} volume={0.35} />
    <TitleBlock kicker={KICKER} lines={["Der Workflow:", "Reihe → Stunde", "→ Material"]} subtitle="Projekt und Skills zu einem Arbeitsablauf verbinden – bis zum fertigen Material." />
    <div style={{ position: "absolute", left: 1220, top: 250, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      {LINKS.map((l, i) => (
        <React.Fragment key={l.n}>
          {i > 0 && <ChainIcon delay={30 + i * 14} />}
          <LinkCard l={l} delay={24 + i * 14} w={420} compact />
          <Sfx name="pop" at={24 + i * 14} volume={0.4} />
        </React.Fragment>
      ))}
    </div>
  </Scene>
);

const PAPERS = [
  { t: "Reihenplan", x: 60, y: 30, r: -12, c: C.petrolLight },
  { t: "Stunde 3 ???", x: 420, y: 90, r: 9, c: "#FFE58A" },
  { t: "Arbeitsblatt (alt)", x: 150, y: 330, r: 6, c: "#fff" },
  { t: "Quiz – irgendwo …", x: 560, y: 360, r: -10, c: "#FFD0A0" },
  { t: "Tafelbild?", x: 330, y: 560, r: 14, c: C.amberLight },
];

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = T.problemB;
  const order = interpolate(frame, [b, b + 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Scene duration={DUR.problem}>
      <Voice name="problemA" at={15} />
      <Voice name="problemB" at={b} />
      {PAPERS.map((p, i) => (
        <Sfx key={p.t} name="pop" at={30 + i * 22} volume={0.4} />
      ))}
      <Sfx name="whoosh" at={b} volume={0.6} />
      <Sfx name="chime" at={b + 35} volume={0.4} />
      <ProblemBar text="„Ich plane eine neue Reihe und brauche Stunden und Material, möglichst aus einem Guss, ohne jedes Mal von vorn anzufangen.“" />
      <div style={{ position: "absolute", left: 230, top: 430 }}>
        <Appear delay={10} bouncy>
          <Person size={320} anxious={frame > 120 && frame < b + 20} />
        </Appear>
        <Burst text="CHAOS!" at={130} x={170} y={-80} size={130} fill="#FFB0A8" hold={b - 135} rotate={-6} />
      </div>
      <div style={{ position: "absolute", left: 760, top: 290, width: 1000, height: 760 }}>
        {PAPERS.map((p, i) => {
          const s = 30 + i * 22;
          if (frame < s) return null;
          const pin = spring({ frame: frame - s, fps, config: { damping: 10 } });
          const wobble = Math.sin((frame + i * 13) / 9) * 3 * (1 - order);
          const tx = interpolate(order, [0, 1], [p.x, (i % 5) * 0]);
          const ty = interpolate(order, [0, 1], [p.y, i * 120]);
          return (
            <div
              key={p.t}
              style={{
                position: "absolute",
                left: tx,
                top: ty,
                width: 330,
                background: p.c,
                border: `2px solid ${C.line}`,
                borderRadius: 10,
                padding: "18px 20px",
                fontSize: 28,
                fontWeight: 700,
                boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
                transform: `rotate(${(p.r + wobble) * (1 - order)}deg) scale(${pin})`,
                opacity: i === 4 ? 1 - order : 1,
              }}
            >
              {p.t}
            </div>
          );
        })}
        {order > 0.2 &&
          [0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: 140, top: i * 120 + 78, opacity: order }}>
              <ChainIcon delay={b + 20 + i * 6} />
            </div>
          ))}
        <Burst text="AUS EINEM GUSS!" at={b + 38} x={640} y={180} size={140} fill="#B6F0C2" hold={110} rotate={8} />
      </div>
    </Scene>
  );
};

export const ChainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const b = T.chainB;
  const linkAt = [0.32, 0.5, 0.68, 0.86].map((r) => atRatio(15, V.chainA, r) - 15);
  const flow = interpolate(frame, [b + 30, b + 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Scene duration={DUR.chain} kicker={`${KICKER} · A`} title="Die Kette in vier Schritten">
      <Voice name="chainA" at={15} />
      <Voice name="chainB" at={b} />
      {linkAt.map((f) => (
        <Sfx key={f} name="pop" at={f} volume={0.5} />
      ))}
      <Sfx name="whoosh" at={b + 30} volume={0.5} />
      <div style={{ position: "absolute", left: 160, top: 260, display: "flex", alignItems: "center", gap: 6 }}>
        {LINKS.map((l, i) => (
          <React.Fragment key={l.n}>
            {i > 0 && <ChainIcon delay={linkAt[i] - 5} />}
            <LinkCard l={l} delay={linkAt[i]} w={344} />
          </React.Fragment>
        ))}
      </div>
      {/* Kontextband */}
      <div style={{ position: "absolute", left: 160, top: 640, width: 1600 }}>
        <Appear delay={b + 20}>
          <div style={{ position: "relative", height: 70, borderRadius: 999, background: C.petrolLight, overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${flow * 100}%`,
                background: `linear-gradient(90deg, ${C.petrol}, ${C.amber})`,
                borderRadius: 999,
              }}
            />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 800, color: flow > 0.5 ? "#fff" : C.petrol }}>
              Ein Projekt · ein Chat · der Kontext trägt durch →
            </div>
          </div>
        </Appear>
      </div>
      <Burst text="KONTEXT!" at={b + 150} x={1700} y={640} size={120} fill="#B6F0C2" hold={80} rotate={8} />
    </Scene>
  );
};

/* Demo: alle vier Glieder im selben Chat */
const msgsAll = (): Msg[] => {
  const s = DEMO.steps;
  const nodes = [<ReiheReply key="r" />, <StundeReply key="s" />, <SheetReply key="m" />, <FileReply key="f" clickedAt={DEMO.download + 2} />];
  const out: Msg[] = [];
  PROMPTS.forEach((p, i) => {
    out.push({ role: "user", at: s[i].send + 2, h: p.length > 90 ? 92 : 56, node: p });
    out.push({ role: "ai", at: s[i].reply, h: HEIGHTS[i], node: nodes[i] });
  });
  return out;
};

const ChainProgress: React.FC<{ active: number }> = ({ active }) => (
  <div style={{ position: "absolute", right: 160, top: 100, display: "flex", alignItems: "center", gap: 4 }}>
    {LINKS.map((l, i) => (
      <React.Fragment key={l.n}>
        {i > 0 && <div style={{ width: 20, height: 4, background: i <= active ? C.amber : C.line }} />}
        <div
          style={{
            padding: "8px 14px",
            borderRadius: 999,
            fontSize: 20,
            fontWeight: 800,
            background: i === active ? C.petrol : i < active ? C.petrolLight : "#fff",
            color: i === active ? "#fff" : i < active ? C.petrol : C.muted,
            border: `2px solid ${i <= active ? C.petrol : C.line}`,
          }}
        >
          {l.n} {l.title}
        </div>
      </React.Fragment>
    ))}
  </div>
);

export const DemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = DEMO.steps;
  const msgs = msgsAll();
  const prompts: PromptT[] = PROMPTS.map((p, i) => ({ text: p, plain: p, start: s[i].start, send: s[i].send, cps: 34 }));
  const active = s.filter((x) => frame >= x.v).length - 1;
  const fileTop = msgTopInWindow(msgs, 7, DEMO.download) + 34 + 10 + 45;
  const fileLeft = msgLeftInWindow("ai") + 620;
  const keys: CursorKey[] = [];
  s.forEach((x) => {
    keys.push({ f: x.send - 12, x: CHAT_SEND.x, y: CHAT_SEND.y });
    keys.push({ f: x.send, x: CHAT_SEND.x, y: CHAT_SEND.y, click: true });
    keys.push({ f: x.send + 30, x: 1350, y: 560 });
  });
  keys.push({ f: DEMO.download - 22, x: fileLeft, y: fileTop });
  keys.push({ f: DEMO.download, x: fileLeft, y: fileTop, click: true });
  keys.push({ f: DEMO.download + 40, x: 1300, y: 600 });
  const bursts = ["TABELLE!", "VERLAUFSPLAN!", "SKILL HILFT!", "FERTIG!"];
  return (
    <Scene duration={DUR.demo} kicker={KICKER} title="Im selben Chat">
      {LINK_VOICES.map((v, i) => (
        <Voice key={v} name={v} at={s[i].v} />
      ))}
      {s.map((x, i) => (
        <React.Fragment key={i}>
          <Sfx name="typing" at={x.start} frames={x.send - x.start - 8} volume={0.6} />
          <Sfx name="pop" at={x.reply} volume={0.5} />
        </React.Fragment>
      ))}
      <Sfx name="chime" at={DEMO.download + 4} volume={0.45} />
      <CursorClicks keys={keys} />
      <ChainProgress active={Math.max(0, active)} />
      <AppWindow active="projects">
        <ChatView title="Reihe Lernen" msgs={msgs} prompts={prompts} />
      </AppWindow>
      <WinLayer>
        {s.map((x, i) => (
          <Burst key={i} text={bursts[i]} at={x.reply + 25} x={1560} y={300} size={120} fill="#B6F0C2" hold={55} rotate={i % 2 ? -7 : 7} />
        ))}
        <Cursor keys={keys} />
      </WinLayer>
    </Scene>
  );
};

/* Teilen */
const SHARE = [
  ["🖥️ Präsentation", "PowerPoint oder PDF", "IServ, TaskCards oder Beamer"],
  ["📄 Arbeitsblatt, Tafelbild", "Word (zum Nachbearbeiten) oder PDF", "IServ, TaskCards, Kopierer"],
  ["🎯 Interaktives Quiz", "HTML-Datei", "IServ oder TaskCards, ohne Schülerkonto"],
];
export const ShareScene: React.FC = () => {
  const rows = [0.05, 0.16, 0.27].map((r) => atRatio(15, V.share, r));
  const via = atRatio(15, V.share, 0.4);
  const warn = atRatio(15, V.share, 0.6);
  return (
    <Scene duration={DUR.share} kicker={KICKER} title="So kommt das Material in die Klasse">
      <Voice name="share" at={15} />
      {[...rows, via, warn].map((f) => (
        <Sfx key={f} name="pop" at={f} volume={0.5} />
      ))}
      <div style={{ position: "absolute", left: 160, top: 240, width: 1600, borderRadius: 18, overflow: "hidden", border: `2px solid ${C.line}`, background: "#fff" }}>
        <div style={{ display: "flex", background: C.dark, color: "#fff", fontSize: 26, fontWeight: 700 }}>
          {["Material", "Exportieren als", "Teilen über"].map((h, i) => (
            <div key={h} style={{ width: [520, 520, 560][i], padding: "16px 26px" }}>
              {h}
            </div>
          ))}
        </div>
        {SHARE.map((r, j) => (
          <Appear key={j} delay={rows[j]}>
            <div style={{ display: "flex", borderTop: `2px solid ${C.line}`, fontSize: 28 }}>
              <div style={{ width: 520, padding: "20px 26px", fontWeight: 800, color: C.petrol }}>{r[0]}</div>
              <div style={{ width: 520, padding: "20px 26px" }}>{r[1]}</div>
              <Appear delay={via + j * 8}>
                <div style={{ width: 560, padding: "20px 26px" }}>{r[2]}</div>
              </Appear>
            </div>
          </Appear>
        ))}
      </div>
      <div style={{ position: "absolute", left: 160, top: 700, width: 1600 }}>
        <Appear delay={warn} bouncy>
          <div style={{ display: "flex", gap: 26, alignItems: "center", background: "#FDECEA", border: `3px solid ${C.red}`, borderRadius: 18, padding: "22px 30px", fontSize: 30 }}>
            <span style={{ fontSize: 48 }}>🔗</span>
            <div>
              <b style={{ color: C.red }}>Öffentliche Links meiden:</b> Jede Person mit dem Link kann das Material sehen. Lieber exportieren und über IServ teilen.
            </div>
          </div>
        </Appear>
      </div>
      <Burst text="LIEBER NICHT!" at={warn + 15} x={1700} y={690} size={120} fill="#FFB0A8" hold={90} rotate={8} />
    </Scene>
  );
};

/* Was plane ich selbst? */
export const SelfScene: React.FC = () => {
  const ki = ["Struktur und erste Rohfassung", "Varianten und Differenzierung", "Formatieren und Umwandeln"].map((t, i) => [t, atRatio(15, V.self, 0.14 + i * 0.11)] as const);
  const me = ["Ziel und Leitidee der Reihe", "was zu deiner Lerngruppe passt", "Fachlichkeit: alles einmal gegenlesen"].map((t, i) => [t, atRatio(15, V.self, 0.52 + i * 0.15)] as const);
  return (
    <Scene duration={DUR.self} kicker={`${KICKER} · C`} title="Was plane ich lieber selbst?">
      <Voice name="self" at={15} />
      {[...ki, ...me].map(([t, f]) => (
        <Sfx key={t} name="pop" at={f} volume={0.45} />
      ))}
      <InfoCard x={160} y={240} w={770} title="Die KI entlastet bei …" delay={ki[0][1] - 10} minH={420}>
        {ki.map(([t, f]) => (
          <Item key={t} icon="🤖" delay={f}>
            {t}
          </Item>
        ))}
      </InfoCard>
      <InfoCard x={990} y={240} w={770} dark title="Du entscheidest über …" delay={me[0][1] - 10} minH={420}>
        {me.map(([t, f]) => (
          <Item key={t} icon="🧑‍🏫" delay={f}>
            {t}
          </Item>
        ))}
      </InfoCard>
      <div style={{ position: "absolute", right: 150, bottom: 0 }}>
        <Appear delay={me[2][1]} bouncy>
          <Person size={230} />
        </Appear>
      </div>
      <div style={{ position: "absolute", right: 720, bottom: 120 }}>
        <Burst text="MEINE ENTSCHEIDUNG!" at={me[2][1] + 15} x={0} y={0} size={120} fill="#B6F0C2" hold={100} rotate={-6} />
      </div>
    </Scene>
  );
};

export const MerkeScene: React.FC = () => (
  <Scene duration={DUR.merke}>
    <Voice name="merke" at={20} />
    <Sfx name="chime" at={8} volume={0.4} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 180, display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}>
      {LINKS.map((l, i) => (
        <React.Fragment key={l.n}>
          {i > 0 && <ChainIcon delay={atRatio(20, V.merke, 0.12 + i * 0.07)} />}
          <LinkCard l={l} delay={atRatio(20, V.merke, 0.12 + i * 0.07)} w={330} compact />
        </React.Fragment>
      ))}
    </div>
    <MerkeBox delay={20} top={400}>
      <b>Ein Projekt, eine Kette: Reihe → Stunde → Material → teilen.</b> Der Kontext trägt durch, deine Skills sparen den Rest. Prüfen bleibt deine Aufgabe.
    </MerkeBox>
  </Scene>
);
