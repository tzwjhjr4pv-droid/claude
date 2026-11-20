import React from "react";
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bell, Bowl, Dog, Drill, Person } from "./Icons";
import { Burst, Squiggle, Thought } from "./fx";
import { Appear, Caption, Row, Scene, Sfx, Tag, Voice } from "./ui";
import { colors, font } from "./theme";
import { VOICE as V } from "./voice";

const OUT = "#3A2A1E";

/* ---------- Zeitplan (in Frames, 30 fps) – richtet sich nach der Sprecherstimme ---------- */
const GAP = 12;

const T = {
  vorherA: 15,
  vorherRow2: 15 + V.vorherA + GAP,
  waehrend: 20,
  trialStart: 40,
  trialPeriod: 70,
  nachherBell: 10,
  nachherA: 40,
  nachherB: 40 + V.nachherA + GAP,
  terms: [0, 1, 2, 3, 4].map((i) => {
    let t = 20;
    for (let j = 0; j < i; j++) t += V[`term${j}` as keyof typeof V] + GAP;
    return t;
  }),
  alltagA: 15,
  drill: 15 + V.alltagA + 5,
};
const alltagB = T.drill + 80;

export const DUR = {
  title: 15 + V.title + 30,
  vorher: T.vorherRow2 + V.vorherB + 40,
  waehrend: Math.max(T.trialStart + 4 * T.trialPeriod + 20, T.waehrend + V.waehrend + 30),
  nachher: T.nachherB + V.nachherB + 40,
  begriffe: T.terms[4] + V.term4 + 40,
  alltag: alltagB + V.alltagB + 40,
  merke: 20 + V.merke + 45,
};

const center: React.CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
};

/* ---------- 0 · Titel ---------- */
const BouncyTitle: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", justifyContent: "center", fontSize: 116, fontWeight: 900, color: colors.ink }}>
      {text.split("").map((ch, i) => {
        const p = spring({ frame: frame - delay - i * 2, fps, config: { damping: 9, stiffness: 160 } });
        const wobble = Math.sin((frame - i * 4) / 14) * 4;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${(1 - p) * -120 + wobble}px)`,
              opacity: Math.min(1, p * 2),
              whiteSpace: "pre",
              textShadow: `4px 4px 0 ${i % 2 ? colors.ucsBg : colors.csBg}`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={DUR.title}>
      <Sfx name="bell" at={5} volume={0.35} />
      <Voice name="title" at={15} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Appear delay={5} bouncy>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 70 }}>
              <Bell size={170} ringing={frame > 5 && frame < 50} />
              <Dog size={380} mood={frame > 20 && frame < 70 ? "alert" : "neutral"} />
            </div>
          </Appear>
          <Burst text="DING!" at={6} x={60} y={10} size={140} />
        </div>
        <div style={{ marginTop: 20 }}>
          <BouncyTitle text="Klassische Konditionierung" delay={12} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <Squiggle width={520} color={colors.ucs} delay={50} />
        </div>
        <Appear delay={55}>
          <div style={{ fontSize: 42, color: colors.muted, textAlign: "center", marginTop: 16, fontWeight: 600 }}>
            Lernen durch Reizkopplung · nach Iwan P. Pawlow
          </div>
        </Appear>
      </AbsoluteFill>
    </Scene>
  );
};

/* ---------- 1 · Vor der Konditionierung ---------- */
export const VorherScene: React.FC = () => {
  const frame = useCurrentFrame();
  const row2 = T.vorherRow2;
  return (
    <Scene step="Schritt 1" stepColor={colors.ucs} title="Vor der Konditionierung" duration={DUR.vorher}>
      <Voice name="vorherA" at={T.vorherA} />
      <Voice name="vorherB" at={row2 + 20} />
      <Sfx name="clink" at={22} volume={0.7} />
      <Sfx name="pop" at={25} />
      <Sfx name="drip" at={52} />
      <Sfx name="pop" at={55} />
      <Sfx name="bell" at={row2 + 5} volume={0.35} />
      <Sfx name="pop" at={row2 + 12} />
      <div style={{ ...center, top: 196 }}>
        <Row
          delay={15}
          stimulus={<Bowl size={230} />}
          stimulusTags={<Tag kind="ucs" abbr="UCS" label="Futter" delay={25} />}
          response={<Dog size={250} mood={frame > 50 ? "hungry" : "neutral"} droolSince={50} />}
          responseTag={<Tag kind="ucs" abbr="UCR" label="Speichelfluss" delay={50} />}
          responseFx={<Burst text="MJAM!" at={50} x={540} y={40} size={130} fill="#FFB0A8" hold={70} />}
        />
      </div>
      <div style={{ ...center, top: 548 }}>
        <Row
          delay={row2}
          crossed
          stimulus={<Bell size={170} ringing={frame > row2 + 5 && frame < row2 + 50} />}
          stimulusTags={<Tag kind="neutral" abbr="NS" label="Glocke" delay={row2 + 10} />}
          stimulusFx={<Burst text="DING!" at={row2 + 6} x={120} y={60} size={130} />}
          response={<Dog size={250} mood={frame > row2 + 30 ? "alert" : "neutral"} />}
          responseTag={<Tag kind="neutral" abbr="–" label="kein Speichelfluss" delay={row2 + 40} />}
          responseFx={<Thought text="?" at={row2 + 32} x={470} y={-30} hold={200} />}
        />
      </div>
      <Sequence from={0} durationInFrames={row2} layout="none">
        <Caption delay={60}>Futter löst <b>angeboren</b> Speichelfluss aus – ohne Lernen.</Caption>
      </Sequence>
      <Sequence from={row2} layout="none">
        <Caption delay={50}>Die Glocke allein: Der Hund horcht auf – aber es fließt kein Speichel.</Caption>
      </Sequence>
    </Scene>
  );
};

/* ---------- 2 · Während der Konditionierung ---------- */
export const WaehrendScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = T.trialStart;
  const period = T.trialPeriod;
  const local = frame - start;
  const trial = local < 0 ? 0 : Math.min(4, Math.floor(local / period) + 1);
  const t = local < 0 ? -1 : local % period;
  const active = local >= 0 && local < period * 4;
  const ringing = active && t >= 0 && t < 40;
  const food = active
    ? interpolate(t, [14, 22, 56, 64], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const salivating = active && t > 26 && t < 66;
  const counterPop = spring({ frame: local - (trial - 1) * period, fps, config: { damping: 8 } });

  return (
    <Scene step="Schritt 2" stepColor={colors.neutral} title="Während der Konditionierung" duration={DUR.waehrend}>
      <Voice name="waehrend" at={T.waehrend} />
      {[0, 1, 2, 3].map((k) => (
        <React.Fragment key={k}>
          <Sfx name="bell" at={start + k * period} volume={0.25} />
          <Sfx name="clink" at={start + k * period + 16} volume={0.55} />
          <Sfx name="drip" at={start + k * period + 28} volume={0.7} />
        </React.Fragment>
      ))}
      <div style={{ ...center, top: 330 }}>
        <Row
          delay={10}
          iconHeight={250}
          stimulus={
            <>
              <Bell size={160} ringing={ringing} />
              <div style={{ fontSize: 80, fontWeight: 900, color: colors.ucs, alignSelf: "center" }}>+</div>
              <div style={{ opacity: Math.max(food, 0.15), transform: `translateY(${(1 - food) * 40}px) scale(${0.8 + food * 0.2})` }}>
                <Bowl size={210} />
              </div>
            </>
          }
          stimulusTags={
            <>
              <Tag kind="neutral" abbr="NS" label="Glocke" delay={20} />
              <Tag kind="ucs" abbr="UCS" label="Futter" delay={28} />
            </>
          }
          stimulusFx={[0, 1, 2, 3].map((k) => (
            <Burst key={k} text="DING!" at={start + k * period} x={100} y={50} size={110} hold={30} />
          ))}
          response={<Dog size={280} mood={salivating ? "hungry" : ringing ? "alert" : "neutral"} droolSince={start} />}
          responseTag={<Tag kind="ucs" abbr="UCR" label="Speichelfluss" delay={40} />}
        />
      </div>
      <div style={{ ...center, top: 180 }}>
        <Appear delay={start} bouncy>
          <div
            style={{
              fontSize: 38,
              fontWeight: 800,
              background: "#fff",
              padding: "12px 26px",
              borderRadius: 18,
              border: `3px solid ${OUT}`,
              boxShadow: `4px 4px 0 ${OUT}`,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            Durchgang
            <span
              style={{
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                width: 56,
                height: 56,
                borderRadius: 999,
                background: colors.cs,
                color: "#fff",
                border: `3px solid ${OUT}`,
                transform: `scale(${0.6 + counterPop * 0.4})`,
              }}
            >
              {Math.max(trial, 1)}
            </span>
            <span style={{ color: colors.muted, fontWeight: 600 }}>… viele Male</span>
          </div>
        </Appear>
      </div>
      <Caption delay={30}>
        Glocke und Futter werden <b>wiederholt gekoppelt</b>: Die Glocke ertönt kurz <b>vor</b> dem Futter.
      </Caption>
    </Scene>
  );
};

/* ---------- 3 · Nach der Konditionierung ---------- */
export const NachherScene: React.FC = () => {
  const frame = useCurrentFrame();
  const b = T.nachherBell;
  const capAt = T.nachherB + 40;
  return (
    <Scene step="Schritt 3" stepColor={colors.cs} title="Nach der Konditionierung" duration={DUR.nachher}>
      <Sfx name="bell" at={b} volume={0.4} />
      <Voice name="nachherA" at={T.nachherA} />
      <Voice name="nachherB" at={T.nachherB} />
      <Sfx name="drip" at={b + 40} />
      <Sfx name="drip" at={b + 55} volume={0.7} />
      <Sfx name="whoosh" at={capAt - 8} volume={0.5} />
      <Sfx name="chime" at={capAt + 6} volume={0.45} />
      <div style={{ ...center, top: 250 }}>
        <Row
          delay={5}
          iconHeight={250}
          stimulus={<Bell size={180} ringing={frame > b && frame < b + 45} />}
          stimulusTags={<Tag kind="cs" abbr="CS" label="Glocke" delay={15} />}
          stimulusFx={<Burst text="DING!" at={b + 1} x={130} y={60} size={130} />}
          response={<Dog size={280} mood={frame > b + 38 ? "hungry" : "alert"} droolSince={b + 38} capAt={capAt} />}
          responseTag={<Tag kind="cs" abbr="CR" label="Speichelfluss" delay={b + 40} />}
          responseFx={
            <>
              <Burst text="SCHLABBER!" at={b + 40} x={470} y={30} size={120} fill="#A8DDF5" hold={70} rotate={8} />
              <Burst text="GELERNT!" at={capAt + 8} x={150} y={20} size={120} fill="#B6F0C2" hold={90} />
            </>
          }
        />
      </div>
      <div style={{ ...center, top: 700 }}>
        <Appear delay={T.nachherB}>
          <div style={{ color: colors.muted, display: "flex", gap: 18, alignItems: "center" }}>
            <Tag kind="neutral" abbr="NS" label="Glocke" delay={T.nachherB} />
            <span style={{ fontSize: 40, fontWeight: 800, color: colors.ink }}>wird zum</span>
            <Tag kind="cs" abbr="CS" label="Glocke" delay={T.nachherB + 30} />
          </div>
        </Appear>
      </div>
      <Caption delay={b + 60}>Jetzt löst <b>schon die Glocke allein</b> Speichelfluss aus – der Hund hat gelernt.</Caption>
    </Scene>
  );
};

/* ---------- 4 · Begriffe ---------- */
const terms: { kind: "neutral" | "ucs" | "cs"; abbr: string; name: string; text: string; ex: string; icon: string }[] = [
  { kind: "neutral", abbr: "NS", name: "neutraler Reiz", text: "löst (noch) keine spezifische Reaktion aus", ex: "Glocke vorher", icon: "🔔" },
  { kind: "ucs", abbr: "UCS", name: "unkonditionierter Reiz", text: "löst ohne Lernen eine Reaktion aus", ex: "Futter", icon: "🍖" },
  { kind: "ucs", abbr: "UCR", name: "unkonditionierte Reaktion", text: "angeborene, ungelernte Reaktion", ex: "Speichelfluss auf Futter", icon: "💧" },
  { kind: "cs", abbr: "CS", name: "konditionierter Reiz", text: "früher neutral, löst jetzt die Reaktion aus", ex: "Glocke nachher", icon: "🔔" },
  { kind: "cs", abbr: "CR", name: "konditionierte Reaktion", text: "gelernte Reaktion auf den CS", ex: "Speichelfluss auf Glocke", icon: "💧" },
];

export const BegriffeScene: React.FC = () => (
  <Scene step="Überblick" stepColor={colors.ink} title="Die Fachbegriffe" duration={DUR.begriffe}>
    {terms.map((term, i) => (
      <React.Fragment key={term.abbr}>
        <Sfx name="pop" at={T.terms[i]} volume={0.7} />
        <Voice name={`term${i}`} at={T.terms[i] + 4} />
      </React.Fragment>
    ))}
    <div style={{ position: "absolute", top: 210, left: 110, right: 110, display: "flex", flexDirection: "column", gap: 20 }}>
      {terms.map((term, i) => {
        const fg = term.kind === "neutral" ? colors.neutral : term.kind === "ucs" ? colors.ucs : colors.cs;
        return (
          <Appear key={term.abbr} delay={T.terms[i]} bouncy>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                background: "#fff",
                borderRadius: 24,
                padding: "16px 28px",
                border: `3.5px solid ${OUT}`,
                boxShadow: `5px 5px 0 ${fg}`,
              }}
            >
              <div
                style={{
                  width: 120,
                  textAlign: "center",
                  fontSize: 40,
                  fontWeight: 900,
                  color: "#fff",
                  background: fg,
                  borderRadius: 16,
                  border: `3px solid ${OUT}`,
                  padding: "6px 0",
                }}
              >
                {term.abbr}
              </div>
              <div style={{ width: 500, fontSize: 36, fontWeight: 800 }}>{term.name}</div>
              <div style={{ flex: 1, fontSize: 29 }}>{term.text}</div>
              <div style={{ width: 400, fontSize: 27, color: colors.muted, textAlign: "right", fontWeight: 600 }}>
                {term.icon} {term.ex}
              </div>
            </div>
          </Appear>
        );
      })}
    </div>
  </Scene>
);

/* ---------- 5 · Alltagsbeispiel ---------- */
export const AlltagScene: React.FC = () => {
  const frame = useCurrentFrame();
  const d = T.drill;
  return (
    <Scene step="Im Alltag" stepColor="#C0463E" title="Angst beim Zahnarzt" duration={DUR.alltag}>
      <Voice name="alltagA" at={T.alltagA} />
      <Sfx name="drill" at={d} volume={0.4} />
      <Sfx name="pop" at={d + 30} />
      <Voice name="alltagB" at={alltagB} />
      <div style={{ ...center, top: 250 }}>
        <Row
          delay={10}
          iconHeight={270}
          stimulus={<Drill size={230} active={frame > d && frame < d + 90} />}
          stimulusTags={<Tag kind="cs" abbr="CS" label="Bohrergeräusch" delay={d} />}
          stimulusFx={<Burst text="SSSRRR!" at={d + 2} x={130} y={50} size={120} fill="#FFD0A0" hold={85} />}
          response={<Person size={260} anxious={frame > d + 25} />}
          responseTag={<Tag kind="cs" abbr="CR" label="Angst" delay={d + 30} />}
          responseFx={<Burst text="IIIH!" at={d + 28} x={520} y={50} size={130} fill="#FFB0A8" hold={90} rotate={10} />}
        />
      </div>
      <Caption delay={alltagB}>
        Das Geräusch war früher mit <b>Schmerz (UCS)</b> gekoppelt – heute löst schon der Klang Angst aus.
      </Caption>
    </Scene>
  );
};

/* ---------- 6 · Merke ---------- */
export const MerkeScene: React.FC = () => (
  <Scene duration={DUR.merke}>
    <Sfx name="chime" at={5} volume={0.45} />
    <Voice name="merke" at={20} />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: font }}>
      <Appear delay={10} bouncy>
        <div
          style={{
            position: "relative",
            background: "#fff",
            border: `4px solid ${OUT}`,
            borderRadius: 36,
            boxShadow: `8px 8px 0 ${colors.cs}`,
            padding: "60px 80px 60px 80px",
            maxWidth: 1400,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -30,
              left: 60,
              background: colors.cs,
              color: "#fff",
              fontSize: 34,
              fontWeight: 900,
              letterSpacing: 3,
              padding: "8px 26px",
              borderRadius: 999,
              border: `3px solid ${OUT}`,
              transform: "rotate(-3deg)",
            }}
          >
            💡 MERKE
          </div>
          <div style={{ fontSize: 54, fontWeight: 700, textAlign: "center", lineHeight: 1.35 }}>
            Ein <span style={{ color: colors.neutral }}>neutraler Reiz</span> wird durch wiederholte Kopplung mit einem{" "}
            <span style={{ color: colors.ucs }}>unkonditionierten Reiz</span> zum{" "}
            <span style={{ color: colors.cs }}>konditionierten Reiz</span> – er löst nun selbst eine Reaktion aus.
          </div>
        </div>
      </Appear>
    </AbsoluteFill>
    <div style={{ position: "absolute", right: 60, bottom: 20 }}>
      <Appear delay={40} bouncy>
        <Dog size={360} mood="neutral" capAt={40} />
      </Appear>
    </div>
  </Scene>
);
