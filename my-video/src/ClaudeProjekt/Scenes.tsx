import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Person } from "../Konditionierung/Icons";
import { Burst } from "../Konditionierung/fx";
import { Appear, useAppear } from "../Konditionierung/ui";
import {
  AppWindow,
  Button,
  C,
  Caret,
  Cursor,
  CursorClicks,
  CursorKey,
  FileRow,
  Modal,
  Scene,
  Sfx,
  SIDE_Y,
  typingFrames,
  usePulse,
  useTyped,
  Voice,
  WinLayer,
} from "./kit";
import { FileSpec, PP, ProjectPage } from "./ProjectPage";
import { VOICE as VC } from "./voice";
import { VOICE as VG } from "./voice-chatgpt";
import { IS_GPT, pick, TOOL } from "../platform";

const V: Record<keyof typeof VC, number> = IS_GPT ? VG : VC;

const GAP = 10;
const PROJECT = "FOS 11 Psychologie";
const KICKER = `KI-Startpaket · ${TOOL} · Modul 1`;

/* ---------- Zeitplan ---------- */
const T = {
  problemB: 15 + V.problemA + GAP,
  compareB: 15 + V.compareA + GAP,
  step1B: 15 + V.step1A + GAP,
  step2B: 15 + V.step2A + GAP,
  step3B: 15 + V.step3A + GAP,
  step4B: 15 + V.step4A + GAP,
};

export const DUR = {
  title: 20 + V.title + 45,
  problem: T.problemB + V.problemB + 45,
  compare: T.compareB + V.compareB + 45,
  step1: T.step1B + V.step1B + 35,
  step2: T.step2B + V.step2B + 45,
  step3: T.step3B + V.step3B + 55,
  step4: T.step4B + V.step4B + 45,
  privacy: 15 + V.privacy + 45,
  merke: 20 + V.merke + 50,
};

const center: React.CSSProperties = { position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center" };

/* ------------------------------------------------------------------ */
/* Ordner-Illustration                                                 */
/* ------------------------------------------------------------------ */
export const Folder: React.FC<{ size?: number; label?: string; fill?: number }> = ({ size = 420, label = PROJECT, fill = 1 }) => {
  const frame = useCurrentFrame();
  const sheets = [
    { c: C.amberLight, t: "Anweisung", r: -8 },
    { c: "#fff", t: "Lehrplan", r: 4 },
    { c: "#fff", t: "Musterblatt", r: 12 },
  ];
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 420 336" style={{ overflow: "visible" }}>
      <path d="M20,60 Q20,40 40,40 L150,40 L175,66 L380,66 Q400,66 400,86 L400,300 Q400,316 384,316 L36,316 Q20,316 20,300 Z" fill="#08524F" />
      {sheets.map((s, i) => {
        const p = Math.max(0, Math.min(1, fill * 3 - i));
        const bob = Math.sin((frame + i * 20) / 18) * 4;
        return (
          <g key={i} transform={`translate(${70 + i * 95} ${110 - p * 70 + bob}) rotate(${s.r})`} opacity={p}>
            <rect width={120} height={150} rx={10} fill={s.c} stroke={C.dark} strokeWidth={3} />
            {[0, 1, 2, 3].map((l) => (
              <rect key={l} x={16} y={44 + l * 20} width={l === 3 ? 50 : 88} height={8} rx={4} fill={C.line} />
            ))}
            <text x={60} y={30} textAnchor="middle" fontSize={12.5} fontWeight={800} fill={C.petrol} fontFamily="Inter, sans-serif">
              {s.t}
            </text>
          </g>
        );
      })}
      <path d="M10,120 Q10,104 26,104 L394,104 Q410,104 408,120 L396,302 Q394,318 378,318 L42,318 Q26,318 24,302 Z" fill={C.petrol} stroke={C.dark} strokeWidth={4} />
      <rect x={60} y={186} width={300} height={56} rx={12} fill="#fff" />
      <text x={210} y={222} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.petrol} fontFamily="Inter, sans-serif">
        {label}
      </text>
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* 0 · Titel                                                           */
/* ------------------------------------------------------------------ */
export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={DUR.title}>
      <Voice name="title" at={20} />
      <Sfx name="chime" at={8} volume={0.35} />
      <div style={{ position: "absolute", left: 160, top: 230, width: 900 }}>
        <Appear delay={5}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 8, height: 34, background: C.amber, borderRadius: 2 }} />
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 3, color: C.petrol, textTransform: "uppercase" }}>{KICKER}</div>
          </div>
        </Appear>
        <Appear delay={12}>
          <div style={{ fontSize: 104, fontWeight: 900, color: C.petrol, lineHeight: 1.05, marginTop: 20 }}>
            {TOOL}-Projekte
            <br />
            einrichten
          </div>
        </Appear>
        <Appear delay={24}>
          <div style={{ height: 6, width: 520, background: C.amber, borderRadius: 3, marginTop: 26 }} />
        </Appear>
        <Appear delay={30}>
          <div style={{ fontSize: 38, color: C.muted, marginTop: 26, lineHeight: 1.35 }}>
            Einmal einrichten – dann nicht mehr bei jeder Anfrage alles neu erklären.
          </div>
        </Appear>
      </div>
      <div style={{ position: "absolute", left: 1120, top: 290 }}>
        <Appear delay={20} bouncy>
          <Folder size={600} fill={interpolate(frame, [40, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
        </Appear>
      </div>
      {[50, 73, 96].map((f) => (
        <Sfx key={f} name="pop" at={f} volume={0.6} />
      ))}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 1 · Problem                                                         */
/* ------------------------------------------------------------------ */
const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag"];
const repeatText = "Also, ich unterrichte Psychologie in einer FOS 11, die Klasse hat sehr unterschiedliche Sprachstände, wir …";

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = T.problemB;
  const starts = [30, 75, 108, 132];
  const fall = interpolate(frame, [b, b + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const folderP = spring({ frame: frame - (b + 25), fps, config: { damping: 9 } });
  return (
    <Scene duration={DUR.problem}>
      <Voice name="problemA" at={15} />
      <Voice name="problemB" at={b} />
      {starts.map((s) => (
        <React.Fragment key={s}>
          <Sfx name="typing" at={s} frames={20} volume={0.6} />
          <Sfx name="pop" at={s + 4} volume={0.5} />
        </React.Fragment>
      ))}
      <Sfx name="whoosh" at={b} volume={0.6} />
      <Sfx name="chime" at={b + 28} volume={0.4} />

      <div style={{ position: "absolute", top: 70, left: 160, right: 160 }}>
        <Appear delay={5}>
          <div style={{ background: C.dark, color: "#fff", borderRadius: 18, padding: "26px 34px", display: "flex", gap: 28, alignItems: "center" }}>
            <div style={{ color: C.amber, fontWeight: 800, letterSpacing: 4, fontSize: 24 }}>PROBLEM</div>
            <div style={{ fontSize: 34 }}>„Ich muss der KI jedes Mal neu erklären, wer meine Klasse ist und was ich brauche.“</div>
          </div>
        </Appear>
      </div>

      <div style={{ position: "absolute", left: 230, top: 400 }}>
        <Appear delay={10} bouncy>
          <Person size={330} anxious={frame > 140 && frame < b + 30} />
        </Appear>
        <Burst text="SCHON WIEDER?!" at={150} x={170} y={-90} size={140} fill="#FFB0A8" hold={b - 150} rotate={-6} />
      </div>

      <div style={{ position: "absolute", left: 720, top: 270, width: 1000, height: 760 }}>
        {starts.map((s, i) => {
          const p = spring({ frame: frame - s, fps, config: { damping: 12 } });
          if (frame < s) return null;
          const rot = [-2, 1.5, -1, 2.5][i];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 60 + i * 40,
                top: 10 + i * 172,
                width: 820,
                transform: `translateY(${(1 - p) * 40 + fall * (700 + i * 80)}px) rotate(${rot + fall * (i % 2 ? 25 : -25)}deg) scale(${0.8 + p * 0.2})`,
                opacity: Math.min(1, p * 1.5) * (1 - fall),
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: C.muted, marginBottom: 6 }}>{days[i]}</div>
              <div
                style={{
                  background: C.petrolLight,
                  border: `2px solid ${C.line}`,
                  borderRadius: "22px 22px 6px 22px",
                  padding: "18px 24px",
                  fontSize: 26,
                  lineHeight: 1.4,
                }}
              >
                {repeatText}
              </div>
            </div>
          );
        })}
        {frame > b + 20 && (
          <div style={{ position: "absolute", left: 230, top: 120, transform: `scale(${folderP})` }}>
            <Folder size={520} />
          </div>
        )}
        <Burst text="EIN PROJEKT!" at={b + 32} x={720} y={120} size={140} fill="#B6F0C2" hold={120} rotate={8} />
      </div>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 2 · Projekt oder Chat?                                              */
/* ------------------------------------------------------------------ */
const CompareCard: React.FC<{
  x: number;
  dark?: boolean;
  kicker: string;
  title: string;
  delay: number;
  children: React.ReactNode;
}> = ({ x, dark, kicker, title, delay, children }) => (
  <div style={{ position: "absolute", left: x, top: 240, width: 770 }}>
    <Appear delay={delay} bouncy>
      <div style={{ background: "#fff", border: `2px solid ${C.line}`, borderRadius: 22, overflow: "hidden", boxShadow: "0 12px 30px rgba(0,0,0,0.06)", minHeight: 440 }}>
        <div style={{ background: dark ? C.dark : C.petrol, color: "#fff", padding: "22px 30px" }}>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 3, opacity: 0.85 }}>{kicker}</div>
          <div style={{ fontSize: 38, fontWeight: 800, marginTop: 4 }}>{title}</div>
        </div>
        <div style={{ padding: "26px 30px", display: "flex", flexDirection: "column", gap: 22 }}>{children}</div>
      </div>
    </Appear>
  </div>
);

const Item: React.FC<{ icon: string; delay: number; children: React.ReactNode }> = ({ icon, delay, children }) => (
  <Appear delay={delay}>
    <div style={{ display: "flex", gap: 18, alignItems: "flex-start", fontSize: 29, lineHeight: 1.4 }}>
      <div style={{ fontSize: 36, width: 46 }}>{icon}</div>
      <div>{children}</div>
    </div>
  </Appear>
);

export const CompareScene: React.FC = () => {
  const b = T.compareB;
  const a1 = 15 + Math.round(V.compareA * 0.22);
  const a2 = 15 + Math.round(V.compareA * 0.65);
  return (
    <Scene duration={DUR.compare} kicker={`${KICKER} · A`} title="Projekt oder Chat?">
      <Voice name="compareA" at={15} />
      <Voice name="compareB" at={b} />
      {[15, a1, a2, b, b + 25, b + Math.round(V.compareB * 0.5)].map((f) => (
        <Sfx key={f} name="pop" at={f} volume={0.5} />
      ))}
      <CompareCard x={160} dark kicker="EINMAL EINRICHTEN" title="Projekt · ein Fach oder Bildungsgang" delay={15}>
        <Item icon="📝" delay={a1}>
          <b>Anweisungen:</b> Wer ist deine Klasse? Wie soll die KI antworten?
        </Item>
        <Item icon="📎" delay={a2}>
          <b>Dateien:</b> Rahmenlehrplan, Jahresplanung, ein Musterblatt – alles ohne Namen.
        </Item>
        <Item icon="📁" delay={a2 + 30}>
          <span style={{ color: C.muted }}>z. B. Projekt „{PROJECT}“</span>
        </Item>
      </CompareCard>
      <CompareCard x={990} kicker="JEDES MAL" title="Chat · eine Aufgabe" delay={b}>
        <Item icon="💬" delay={b + 25}>
          Nur noch <b>Aufgabe</b> und <b>Rückfrage</b>. Den Rest kennt die KI aus dem Projekt.
        </Item>
        <Item icon="✏️" delay={b + 45}>
          <span style={{ color: C.muted }}>z. B. „Erstelle ein Arbeitsblatt zu Lernen am Modell. Stelle mir Rückfragen.“</span>
        </Item>
        <Item icon="➕" delay={b + Math.round(V.compareB * 0.5)}>
          <b>Neues Thema?</b> Neuen Chat im selben Projekt öffnen.
        </Item>
      </CompareCard>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 3 · Schritt 1: Anlegen                                              */
/* ------------------------------------------------------------------ */
const HomeView: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
    <div style={{ fontSize: 46, fontFamily: "Georgia, serif", color: C.ink }}>✳︎ Guten Tag!</div>
    <div style={{ width: 760, height: 110, borderRadius: 18, border: `2px solid ${C.line}`, padding: "18px 22px", fontSize: 26, color: C.muted }}>
      Wie kann ich dir helfen?
    </div>
  </div>
);

const ProjectsList: React.FC = () => (
  <div style={{ position: "absolute", inset: 0 }}>
    <div style={{ position: "absolute", left: 50, top: 40, fontSize: 42, fontWeight: 800 }}>Projekte</div>
    <div style={{ position: "absolute", right: 60, top: 36 }}>
      <Button primary>＋ Neues Projekt</Button>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", color: C.muted, fontSize: 28 }}>
      <div style={{ fontSize: 80 }}>📂</div>
      Noch keine Projekte
    </div>
  </div>
);

export const Step1Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const b = T.step1B;
  const typeStart = b + 20;
  const typeEnd = typeStart + typingFrames(PROJECT, 14);
  const createF = typeEnd + 25;
  const typed = useTyped(PROJECT, typeStart, 14);
  const keys: CursorKey[] = [
    { f: 15, x: 900, y: 520 },
    { f: 50, x: 140, y: SIDE_Y.projects },
    { f: 58, x: 140, y: SIDE_Y.projects, click: true },
    ...(IS_GPT ? [] : [{ f: 95, x: 1420, y: 64 }, { f: 105, x: 1420, y: 64, click: true }]),
    { f: 140, x: 850, y: 330 },
    { f: 150, x: 850, y: 330, click: true },
    { f: createF - 12, x: 1041, y: 534 },
    { f: createF, x: 1041, y: 534, click: true },
    { f: createF + 40, x: 760, y: 600 },
  ];
  const view = frame < 58 ? "home" : frame < createF + 4 ? (IS_GPT ? "home" : "list") : "project";
  return (
    <Scene duration={DUR.step1} kicker={`${KICKER} · B`} title="Anlegen" step={1} path={pick("Projekte › Neues Projekt", "Seitenleiste › Neues Projekt")}>
      <Voice name="step1A" at={15} />
      <Voice name="step1B" at={b} />
      <CursorClicks keys={keys} />
      <Sfx name="typing" at={typeStart} frames={typeEnd - typeStart} />
      <Sfx name="chime" at={createF + 6} volume={0.4} />
      <AppWindow active={view === "home" || (IS_GPT && view !== "project") ? undefined : "projects"}>
        {view === "home" && <HomeView />}
        {view === "list" && <ProjectsList />}
        {view === "project" && <ProjectPage name={PROJECT} />}
      </AppWindow>
      <WinLayer>
        <Modal at={pick(108, 66)} until={createF + 2} x={500} y={190} w={700} h={400} title="Neues Projekt">
          <div style={{ fontSize: 22, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Name</div>
          <div
            style={{
              height: 60,
              border: `2px solid ${frame > 150 ? C.petrol : C.line}`,
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            {typed.shown || <span style={{ color: C.muted, fontWeight: 400 }}>{frame > 150 ? "" : "Projektname"}</span>}
            <Caret visible={frame > 150 && frame < createF} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, color: C.muted, margin: "18px 0 8px" }}>Wofür ist das Projekt? (optional)</div>
          <div style={{ height: 50, border: `2px solid ${C.line}`, borderRadius: 12 }} />
          <div style={{ position: "absolute", right: 34, bottom: 28, display: "flex", gap: 14 }}>
            <Button>Abbrechen</Button>
            <Button primary glow={usePulse(typeEnd, createF)}>Projekt erstellen</Button>
          </div>
        </Modal>
        <Burst text="ANGELEGT!" at={createF + 8} x={640} y={470} size={130} fill="#B6F0C2" hold={70} />
        {/* Post-it */}
        <div style={{ position: "absolute", left: 1140, top: 560, transform: "rotate(3deg)" }}>
          <Appear delay={createF + 30} bouncy>
            <div
              style={{
                width: 400,
                background: "#FFE58A",
                padding: "24px 26px",
                fontSize: 28,
                fontWeight: 700,
                lineHeight: 1.35,
                boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
                borderRadius: 4,
              }}
            >
              📌 Tipp: ein Projekt pro Fach oder Bildungsgang
            </div>
          </Appear>
        </div>
        <Cursor keys={keys} />
      </WinLayer>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 4 · Schritt 2: Anweisungen                                          */
/* ------------------------------------------------------------------ */
type Seg = { t: string } | { ph: string; val: string; at: number };

export const Step2Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = T.step2B;
  const paste = 120;
  const fills = [b + 45, b + 95, b + 160];
  const saveF = Math.max(fills[2] + 60, b + V.step2B - 20);
  const segs: Seg[] = [
    { t: "„Alles in diesem Projekt ist Unterricht in " },
    { ph: "[Fach]", val: "Psychologie", at: fills[0] },
    { t: ", " },
    ...pick<Seg[]>(
      [
        { ph: "[Bildungsgang, Klassenstufe]", val: "FOS, Klasse 11", at: fills[1] },
        { t: ", an einem Oberstufenzentrum. Die Lerngruppe: " },
        { ph: "[Sprachstand, Vorwissen, Besonderheiten]", val: "sehr unterschiedliche Sprachstände, wenig Vorwissen, viele Praktikumserfahrungen", at: fills[2] },
      ],
      [
        { ph: "[Bildungsgang]", val: "FOS, Klasse 11", at: fills[1] },
        { t: ". Die Lerngruppe: " },
        { ph: "[Sprachstand, Vorwissen]", val: "sehr unterschiedliche Sprachstände, wenig Vorwissen", at: fills[2] },
      ],
    ),
    {
      t: pick(
        ". Orientiere dich am hochgeladenen Material: Der Rahmenlehrplan gibt die Inhalte vor, das Musterblatt zeigt Aufbau und Layout. Antworte knapp und frag nach, wenn dir für eine größere Aufgabe etwas Wichtiges fehlt.“",
        ". Orientiere dich am hochgeladenen Material: Der Rahmenlehrplan gibt die Inhalte vor, das Musterblatt zeigt Aufbau und Layout. Antworte knapp und frag nach, wenn etwas fehlt.“",
      ),
    },
  ];
  const keys: CursorKey[] = [
    { f: 15, x: 700, y: 520 },
    { f: 60, x: PP.instrEdit.x, y: PP.instrEdit.y },
    { f: 70, x: PP.instrEdit.x, y: PP.instrEdit.y, click: true },
    { f: 100, x: 800, y: 330 },
    { f: paste - 4, x: 800, y: 330, click: true },
    { f: saveF - 15, x: 1216, y: 674 },
    { f: saveF, x: 1216, y: 674, click: true },
    { f: saveF + 40, x: 900, y: 560 },
  ];
  const flash = interpolate(frame, [paste, paste + 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Scene duration={DUR.step2} kicker={`${KICKER} · B`} title="Anweisungen" step={2} path="im Projekt › Anweisungen">
      <Voice name="step2A" at={15} />
      <Voice name="step2B" at={b} />
      <CursorClicks keys={keys} />
      <Sfx name="pop" at={paste} />
      {fills.map((f) => (
        <React.Fragment key={f}>
          <Sfx name="typing" at={f} frames={18} volume={0.6} />
          <Sfx name="drip" at={f + 18} volume={0.5} />
        </React.Fragment>
      ))}
      <Sfx name="chime" at={saveF + 4} volume={0.4} />
      <AppWindow active="projects">
        <ProjectPage name={PROJECT} instructions={frame > saveF + 4} />
      </AppWindow>
      <WinLayer>
        <Modal at={74} until={saveF + 2} x={250} y={90} w={1100} h={640} title="Projekt-Anweisungen">
          <div
            style={{
              border: `2px solid ${frame >= paste ? C.petrol : C.line}`,
              borderRadius: 14,
              padding: "18px 22px",
              height: 450,
              fontSize: 27,
              lineHeight: 1.55,
              background: `rgba(242,179,61,${flash * 0.25})`,
            }}
          >
            {frame < paste ? (
              <span style={{ color: C.muted }}>Wie soll {TOOL} in diesem Projekt antworten?</span>
            ) : (
              segs.map((s, i) => {
                if ("t" in s) return <span key={i}>{s.t}</span>;
                const filled = frame >= s.at + 18;
                const pulse = frame >= s.at - 20 && !filled ? 0.5 + 0.5 * Math.sin((frame - s.at) / 3) : 0;
                const pop = spring({ frame: frame - (s.at + 18), fps, config: { damping: 8 } });
                return (
                  <span
                    key={i}
                    style={{
                      display: "inline",
                      background: filled ? C.petrolLight : C.amberLight,
                      color: filled ? C.petrol : "#8A5A00",
                      fontWeight: 800,
                      borderRadius: 6,
                      padding: "1px 6px",
                      boxShadow: pulse ? `0 0 0 ${4 * pulse}px rgba(242,179,61,0.6)` : "none",
                      transform: filled ? `scale(${0.9 + pop * 0.1})` : undefined,
                    }}
                  >
                    {filled ? s.val : s.ph}
                  </span>
                );
              })
            )}
          </div>
          <div style={{ position: "absolute", right: 34, bottom: 28, display: "flex", gap: 14 }}>
            <Button>Abbrechen</Button>
            <Button primary glow={usePulse(fills[2] + 30, saveF)}>Speichern</Button>
          </div>
        </Modal>
        {/* Hinweis-Etikett */}
        <div style={{ position: "absolute", left: 1150, top: -10, transform: "rotate(4deg)", zIndex: 30 }}>
          <Appear delay={b + 10} bouncy>
            {frame < saveF && (
              <div style={{ background: C.amber, color: C.dark, fontSize: 26, fontWeight: 800, padding: "12px 20px", borderRadius: 12, boxShadow: "0 8px 20px rgba(0,0,0,0.2)" }}>
                3 Klammern ausfüllen ✍️
              </div>
            )}
          </Appear>
        </div>
        <Burst text="GESPEICHERT!" at={saveF + 8} x={1250} y={300} size={130} fill="#B6F0C2" hold={60} rotate={6} />
        <Cursor keys={keys} />
      </WinLayer>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 5 · Schritt 3: Material hochladen                                   */
/* ------------------------------------------------------------------ */
const UPLOADS: { name: string; kind: "pdf" | "docx" | "xlsx"; at: number }[] = [
  { name: "Rahmenlehrplan_Psychologie.pdf", kind: "pdf", at: 100 },
  { name: "Jahresplanung_FOS11.docx", kind: "docx", at: 150 },
  { name: "Musterblatt_Arbeitsblatt.pdf", kind: "pdf", at: 200 },
];

const FlyingFile: React.FC<{ name: string; kind: "pdf" | "docx" | "xlsx"; at: number; slot: number }> = ({ name, kind, at, slot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 90 } });
  if (frame < at || p > 0.995) return null;
  const target = PP.fileSlot(slot);
  const x = interpolate(p, [0, 1], [-420, target.x]);
  const y = interpolate(p, [0, 1], [target.y + 260, target.y]) - Math.sin(p * Math.PI) * 160;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${(1 - p) * -14}deg)` }}>
      <FileRow name={name} kind={kind} progress={0} />
    </div>
  );
};

export const Step3Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = T.step3B;
  const keys: CursorKey[] = [
    { f: 15, x: 700, y: 520 },
    { f: 55, x: PP.filesPlus.x, y: PP.filesPlus.y },
    { f: 66, x: PP.filesPlus.x, y: PP.filesPlus.y, click: true },
    { f: 110, x: 520, y: 420 },
  ];
  const files: FileSpec[] = UPLOADS.map((u) => {
    const land = u.at + 28;
    return {
      name: u.name,
      kind: u.kind,
      visible: frame >= land,
      progress: interpolate(frame, [land, land + 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    };
  });
  // abgelehnte Datei
  const r0 = b - 8;
  const rIn = spring({ frame: frame - r0, fps, config: { damping: 14 } });
  const rOut = interpolate(frame, [r0 + 50, r0 + 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake = frame > r0 + 18 && frame < r0 + 45 ? Math.sin(frame * 2.2) * 10 : 0;
  return (
    <Scene duration={DUR.step3} kicker={`${KICKER} · B`} title="Material hochladen" step={3} path={pick("Dateien › ＋", "im Projekt › Dateien")}>
      <Voice name="step3A" at={15} />
      <Voice name="step3B" at={b} />
      <CursorClicks keys={keys} />
      {UPLOADS.map((u) => (
        <React.Fragment key={u.name}>
          <Sfx name="whoosh" at={u.at} volume={0.5} />
          <Sfx name="pop" at={u.at + 63} volume={0.6} />
        </React.Fragment>
      ))}
      <Sfx name="whoosh" at={r0} volume={0.5} />
      <Sfx name="clink" at={r0 + 18} volume={0.7} />
      <AppWindow active="projects">
        <ProjectPage name={PROJECT} instructions files={files} />
      </AppWindow>
      <WinLayer>
        {UPLOADS.map((u, i) => (
          <FlyingFile key={u.name} name={u.name} kind={u.kind} at={u.at} slot={i} />
        ))}
        {frame >= r0 && rOut < 1 && (
          <div
            style={{
              position: "absolute",
              left: interpolate(rIn, [0, 1], [-420, 640]) + shake,
              top: 600 + rOut * 300,
              transform: `rotate(${rOut * -40}deg)`,
              opacity: 1 - rOut,
            }}
          >
            <FileRow name="Notenliste_11b_mit_Namen.xlsx" kind="xlsx" progress={0} />
            {frame > r0 + 18 && (
              <div
                style={{
                  position: "absolute",
                  inset: -6,
                  border: `5px solid ${C.red}`,
                  borderRadius: 16,
                  background: "rgba(210,70,60,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 70, color: C.red, fontWeight: 900 }}>✕</span>
              </div>
            )}
          </div>
        )}
        <Burst text="OHNE NAMEN!" at={r0 + 18} x={820} y={520} size={140} fill="#FFB0A8" hold={70} rotate={-8} />
        <Cursor keys={keys} />
      </WinLayer>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 6 · Schritt 4: Testen                                               */
/* ------------------------------------------------------------------ */
const PROMPT = "Erstelle ein Arbeitsblatt zu Lernen am Modell. Stelle mir Rückfragen.";
const REPLY = [
  "Gern! Ich orientiere mich an deinem Rahmenlehrplan und am Musterblatt. Drei kurze Rückfragen:",
  "1. Hast du 45 oder 90 Minuten?",
  "2. Soll ein Lösungsblatt dabei sein?",
  "3. Einstieg mit einem Fall aus dem Praktikum?",
];

export const Step4Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const b = T.step4B;
  const typeStart = 15 + Math.round(V.step4A * 0.55);
  const typeEnd = typeStart + typingFrames(PROMPT, 22);
  const sendF = typeEnd + 18;
  const replyF = Math.max(sendF + 45, b);
  const typed = useTyped(PROMPT, typeStart, 22);
  const replyText = REPLY.join("\n");
  const reply = useTyped(replyText, replyF, 70);
  const loopF = b + Math.round(V.step4B * 0.6);
  const keys: CursorKey[] = [
    { f: 15, x: 900, y: 560 },
    { f: 50, x: PP.input.x, y: PP.input.y },
    { f: 58, x: PP.input.x, y: PP.input.y, click: true },
    { f: sendF - 14, x: PP.send.x, y: PP.send.y },
    { f: sendF, x: PP.send.x, y: PP.send.y, click: true },
    { f: sendF + 40, x: 1000, y: 640 },
  ];
  const glow = usePulse(replyF, replyF + 90);
  const files: FileSpec[] = UPLOADS.map((u) => ({ name: u.name, kind: u.kind, visible: true, progress: 1 }));

  const chat =
    frame >= sendF + 2 ? (
      <div style={{ position: "absolute", left: 50, top: 130, width: 760 }}>
        <Appear delay={sendF + 2}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ background: C.petrolLight, borderRadius: "20px 20px 6px 20px", padding: "14px 20px", fontSize: 24, maxWidth: 600 }}>
              {PROMPT}
            </div>
          </div>
        </Appear>
        <div style={{ marginTop: 26, display: "flex", gap: 16 }}>
          <div style={{ fontSize: 34, color: C.amber }}>✳︎</div>
          <div style={{ fontSize: 24, lineHeight: 1.5, whiteSpace: "pre-wrap", flex: 1 }}>
            {frame < replyF ? (
              <span style={{ color: C.muted, fontSize: 30, letterSpacing: 4 }}>{".".repeat(1 + (Math.floor(frame / 8) % 3))}</span>
            ) : (
              <>
                {reply.shown}
                <Caret visible={!reply.done} />
              </>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 18, marginLeft: 50, flexWrap: "wrap" }}>
          {["📝 Anweisungen", "📎 Rahmenlehrplan", "📎 Musterblatt"].map((t, i) => (
            <Appear key={t} delay={replyF + 50 + i * 8} bouncy>
              <div style={{ fontSize: 19, fontWeight: 700, color: C.petrol, border: `2px solid ${C.petrol}`, borderRadius: 999, padding: "4px 14px" }}>
                nutzt {t}
              </div>
            </Appear>
          ))}
        </div>
      </div>
    ) : undefined;

  return (
    <Scene duration={DUR.step4} kicker={`${KICKER} · B`} title="Testen" step={4} path="Neuer Chat im Projekt">
      <Voice name="step4A" at={15} />
      <Voice name="step4B" at={b} />
      <CursorClicks keys={keys} />
      <Sfx name="typing" at={typeStart} frames={typeEnd - typeStart} />
      <Sfx name="whoosh" at={sendF} volume={0.5} />
      <Sfx name="pop" at={replyF} volume={0.6} />
      {[0, 1, 2].map((i) => (
        <Sfx key={i} name="pop" at={replyF + 50 + i * 8} volume={0.4} />
      ))}
      <AppWindow active="projects">
        <ProjectPage
          name={PROJECT}
          instructions
          files={files}
          glow={glow}
          inputText={
            typed.started ? (
              <>
                {typed.shown}
                <Caret visible={frame < sendF} />
              </>
            ) : undefined
          }
          chat={chat}
        />
      </AppWindow>
      <WinLayer>
        <Burst text="KENNT MEINE KLASSE!" at={replyF + 20} x={640} y={640} size={120} fill="#B6F0C2" hold={80} rotate={5} />
        {/* Kreislauf */}
        <div style={{ position: "absolute", left: 300, top: 560 }}>
          <Appear delay={loopF} bouncy>
            <div
              style={{
                background: C.dark,
                color: "#fff",
                borderRadius: 20,
                padding: "20px 28px",
                display: "flex",
                alignItems: "center",
                gap: 18,
                fontSize: 28,
                fontWeight: 700,
                boxShadow: "0 14px 30px rgba(0,0,0,0.25)",
              }}
            >
              <span>Testen</span>
              <span style={{ color: C.amber }}>→</span>
              <span>Passt es?</span>
              <span style={{ color: C.amber }}>→</span>
              <span>Anweisung nachschärfen</span>
              <span
                style={{
                  color: C.amber,
                  fontSize: 38,
                  display: "inline-block",
                  transform: `rotate(${Math.max(0, frame - loopF) * 6}deg)`,
                }}
              >
                ↻
              </span>
            </div>
          </Appear>
        </div>
        <Cursor keys={keys} />
      </WinLayer>
      <Sfx name="whoosh" at={loopF} volume={0.4} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 7 · Datenschutz                                                     */
/* ------------------------------------------------------------------ */
export const PrivacyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const at = (r: number) => 15 + Math.round(V.privacy * r);
  const g = at(0.1);
  const y = at(0.31);
  const r = at(0.43);
  const s = at(0.69);
  const toggleOff = s + 75;
  const lamp = frame >= r ? 2 : frame >= y ? 1 : frame >= g ? 0 : -1;
  const rows = [
    { c: C.green, label: "unbedenklich", text: "Fachtexte, eigene Arbeitsblätter, Entwürfe ohne Namen, erfundene Fälle", at: g },
    { c: C.amber, label: "nur anonymisiert", text: "Schülertexte ohne Namen und erkennbare Details, Beschreibung einer Lerngruppe", at: y },
    { c: C.red, label: "unzulässig", text: "Namen mit Noten, Diagnosen, Förderbedarfe Einzelner, Gutachten, Elternpost mit Namen", at: r },
  ];
  const sw = interpolate(frame, [toggleOff, toggleOff + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Scene duration={DUR.privacy} kicker={KICKER} title="Datenschutz-Ampel">
      <Voice name="privacy" at={15} />
      {[g, y, r].map((f) => (
        <Sfx key={f} name="pop" at={f} volume={0.6} />
      ))}
      <Sfx name="click" at={toggleOff} />
      <Sfx name="chime" at={toggleOff + 6} volume={0.35} />

      {/* Ampel */}
      <div style={{ position: "absolute", left: 200, top: 250 }}>
        <Appear delay={10} bouncy>
          <svg width={180} height={460} viewBox="0 0 180 460">
            <rect x={20} y={10} width={140} height={420} rx={40} fill={C.dark} />
            {[C.red, C.amber, C.green].map((c, i) => {
              const idx = 2 - i;
              const on = lamp === idx;
              return (
                <g key={c}>
                  {on && <circle cx={90} cy={85 + i * 135} r={62} fill={c} opacity={0.35} />}
                  <circle cx={90} cy={85 + i * 135} r={50} fill={on ? c : "#3A4542"} />
                  {on && <circle cx={74} cy={68 + i * 135} r={12} fill="#fff" opacity={0.5} />}
                </g>
              );
            })}
            <rect x={80} y={430} width={20} height={30} fill={C.dark} />
          </svg>
        </Appear>
      </div>

      <div style={{ position: "absolute", left: 470, top: 250, width: 1290, display: "flex", flexDirection: "column", gap: 22 }}>
        {rows.map((row) => (
          <Appear key={row.label} delay={row.at} bouncy>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                background: "#fff",
                border: `2px solid ${C.line}`,
                borderLeft: `14px solid ${row.c}`,
                borderRadius: 18,
                padding: "22px 28px",
                position: "relative",
              }}
            >
              <div style={{ width: 280, fontSize: 32, fontWeight: 800, color: row.c === C.amber ? "#B07800" : row.c }}>{row.label}</div>
              <div style={{ flex: 1, fontSize: 27, lineHeight: 1.4 }}>{row.text}</div>
            </div>
          </Appear>
        ))}
      </div>
      <div style={{ position: "absolute", left: 1560, top: 520 }}>
        <Burst text="NIE!" at={r + 10} x={60} y={0} size={130} fill="#FFB0A8" hold={s - r - 10} rotate={10} />
      </div>

      {/* Einstellungen */}
      <div style={{ position: "absolute", left: 470, top: 770 }}>
        <Appear delay={s} bouncy>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              background: "#fff",
              border: `3px solid ${C.petrol}`,
              borderRadius: 18,
              padding: "20px 30px",
              width: 1290,
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 700, color: C.petrol }}>{pick("⚙️ Einstellungen › Datenschutz", "⚙️ Einstellungen › Datenkontrollen")}</div>
            <div style={{ flex: 1, fontSize: 28 }}>{pick("„Claude verbessern“", "„Das Modell für alle verbessern“")}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: sw > 0.5 ? C.green : C.muted, width: 70 }}>{sw > 0.5 ? "an" : "aus"}</div>
            <div style={{ width: 96, height: 52, borderRadius: 999, background: sw > 0.5 ? C.green : "#C5CCCA", position: "relative" }}>
              <div style={{ position: "absolute", top: 6, left: 6 + sw * 44, width: 40, height: 40, borderRadius: 99, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }} />
            </div>
          </div>
        </Appear>
      </div>
      <div style={{ position: "absolute", left: 1790, top: 700 }}>
        <Burst text="AUS!" at={toggleOff + 4} x={0} y={0} size={110} fill="#B6F0C2" hold={70} rotate={-8} />
      </div>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 8 · Merke                                                           */
/* ------------------------------------------------------------------ */
const Tile: React.FC<{ dark?: boolean; kicker: string; title: string; items: string[]; delay: number }> = ({ dark, kicker, title, items, delay }) => (
  <Appear delay={delay} bouncy>
    <div style={{ width: 620, background: "#fff", border: `2px solid ${C.line}`, borderRadius: 22, overflow: "hidden" }}>
      <div style={{ background: dark ? C.dark : C.petrol, color: "#fff", padding: "18px 26px" }}>
        <div style={{ fontSize: 18, letterSpacing: 3, fontWeight: 700, opacity: 0.85 }}>{kicker}</div>
        <div style={{ fontSize: 34, fontWeight: 800 }}>{title}</div>
      </div>
      <div style={{ padding: "18px 26px", display: "flex", gap: 14, flexWrap: "wrap" }}>
        {items.map((it) => (
          <div key={it} style={{ fontSize: 26, fontWeight: 700, background: C.petrolLight, color: C.petrol, borderRadius: 12, padding: "8px 16px" }}>
            {it}
          </div>
        ))}
      </div>
    </div>
  </Appear>
);

export const MerkeScene: React.FC = () => {
  const p = useAppear(30, true);
  return (
    <Scene duration={DUR.merke}>
      <Voice name="merke" at={20} />
      <Sfx name="chime" at={8} volume={0.4} />
      <div style={{ ...center, top: 150, gap: 60, alignItems: "center" }}>
        <Tile dark kicker="EINMAL EINRICHTEN" title="Projekt" items={["📝 Anweisung", "📎 Dateien"]} delay={60} />
        <div style={{ fontSize: 70, color: C.amber, fontWeight: 900 }}>+</div>
        <Tile kicker="JEDES MAL" title="Chat" items={["💬 Aufgabe", "❓ Rückfrage"]} delay={90} />
      </div>
      <div style={{ position: "absolute", left: 160, right: 160, top: 520 }}>
        <div
          style={{
            background: C.amber,
            borderRadius: 24,
            padding: "40px 50px",
            display: "flex",
            gap: 34,
            alignItems: "flex-start",
            transform: `scale(${0.85 + p * 0.15})`,
            opacity: Math.min(1, p * 1.5),
          }}
        >
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 4, color: C.dark, paddingTop: 8 }}>MERKE</div>
          <div style={{ fontSize: 42, lineHeight: 1.4, color: C.dark }}>
            <b>Ins Projekt gehört, was immer gilt.</b>{" "}
            {pick(
              "Die Anweisung sagt, wer deine Klasse ist, die Dateien zeigen, woran sich die KI orientieren soll. Im Chat bleiben nur Aufgabe und Rückfrage.",
              "Im Chat bleiben nur Aufgabe und Rückfrage. Keine personenbezogenen Daten in ChatGPT, jedes Ergebnis prüfen.",
            )}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", right: 120, bottom: 0 }}>
        <Appear delay={120} bouncy>
          <Person size={250} />
        </Appear>
      </div>
      <div style={{ position: "absolute", right: 700, bottom: 110 }}>
        <Burst text="EINMAL EINRICHTEN!" at={130} x={0} y={0} size={120} fill="#B6F0C2" hold={200} rotate={-6} />
      </div>
    </Scene>
  );
};


