import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { Bell, Bowl, Dog, Drill, Face } from "./Icons";
import { Appear, Caption, Row, Scene, Sfx, Tag } from "./ui";
import { colors, font } from "./theme";

export const DUR = {
  title: 120,
  vorher: 330,
  waehrend: 330,
  nachher: 270,
  begriffe: 300,
  alltag: 270,
  merke: 150,
};

const center: React.CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
};

/* ---------- 0 · Titel ---------- */
export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
  <Scene duration={DUR.title}>
    <Sfx name="bell" at={8} volume={0.5} />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 30 }}>
      <Appear delay={5}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 40 }}>
          <Bell size={150} ringing={frame > 8 && frame < 52} />
          <Dog size={300} />
        </div>
      </Appear>
      <Appear delay={15}>
        <div style={{ fontSize: 110, fontWeight: 800, textAlign: "center" }}>
          Klassische Konditionierung
        </div>
      </Appear>
      <Appear delay={30}>
        <div style={{ fontSize: 42, color: colors.muted, textAlign: "center" }}>
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
  const row2 = 150;
  return (
    <Scene step="Schritt 1" title="Vor der Konditionierung" duration={DUR.vorher}>
      <Sfx name="clink" at={22} />
      <Sfx name="pop" at={25} />
      <Sfx name="drip" at={52} />
      <Sfx name="pop" at={55} />
      <Sfx name="bell" at={row2 + 10} volume={0.6} />
      <Sfx name="pop" at={row2 + 12} />
      <div style={{ ...center, top: 250 }}>
        <Row
          delay={15}
          stimulus={<Bowl size={190} />}
          stimulusTags={<Tag kind="ucs" abbr="UCS" label="Futter" delay={25} />}
          response={<Dog size={260} salivating={frame > 50} />}
          responseTag={<Tag kind="ucs" abbr="UCR" label="Speichelfluss" delay={50} />}
        />
      </div>
      <div style={{ ...center, top: 560 }}>
        <Row
          delay={row2}
          crossed
          stimulus={<Bell size={170} ringing={frame > row2 + 10 && frame < row2 + 55} />}
          stimulusTags={<Tag kind="neutral" abbr="NS" label="Glocke" delay={row2 + 10} />}
          response={<Dog size={260} alert={frame > row2 + 30} />}
          responseTag={<Tag kind="neutral" abbr="–" label="kein Speichelfluss" delay={row2 + 40} />}
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
  const start = 40;
  const period = 70;
  const local = frame - start;
  const trial = local < 0 ? 0 : Math.min(4, Math.floor(local / period) + 1);
  const t = local < 0 ? -1 : local % period;
  const active = local >= 0 && local < period * 4;
  const ringing = active && t >= 0 && t < 40;
  const foodOpacity = active
    ? interpolate(t, [14, 22, 56, 64], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const salivating = active && t > 26 && t < 66;

  return (
    <Scene step="Schritt 2" title="Während der Konditionierung" duration={DUR.waehrend}>
      {[0, 1, 2, 3].map((k) => (
        <React.Fragment key={k}>
          <Sfx name="bell" at={start + k * period} volume={0.45} />
          <Sfx name="clink" at={start + k * period + 16} volume={0.8} />
          <Sfx name="drip" at={start + k * period + 28} />
        </React.Fragment>
      ))}
      <div style={{ ...center, top: 330 }}>
        <Row
          delay={10}
          stimulus={
            <>
              <Bell size={170} ringing={ringing} />
              <div style={{ fontSize: 70, fontWeight: 800, color: colors.muted, alignSelf: "center" }}>+</div>
              <div style={{ opacity: Math.max(foodOpacity, 0.15) }}>
                <Bowl size={190} />
              </div>
            </>
          }
          stimulusTags={
            <>
              <Tag kind="neutral" abbr="NS" label="Glocke" delay={20} />
              <Tag kind="ucs" abbr="UCS" label="Futter" delay={28} />
            </>
          }
          response={<Dog size={260} salivating={salivating} alert={ringing} />}
          responseTag={<Tag kind="ucs" abbr="UCR" label="Speichelfluss" delay={40} />}
        />
      </div>
      <div style={{ position: "absolute", top: 90, right: 110 }}>
        <Appear delay={start}>
          <div style={{ fontSize: 40, fontWeight: 700, background: "#fff", padding: "14px 28px", borderRadius: 16, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
            Durchgang <span style={{ color: colors.cs }}>{Math.max(trial, 1)}</span>
            <span style={{ color: colors.muted }}> … viele Male</span>
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
  return (
    <Scene step="Schritt 3" title="Nach der Konditionierung" duration={DUR.nachher}>
      <Sfx name="bell" at={25} volume={0.6} />
      <Sfx name="drip" at={62} />
      <Sfx name="drip" at={75} volume={0.7} />
      <Sfx name="chime" at={120} volume={0.8} />
      <div style={{ ...center, top: 330 }}>
        <Row
          delay={10}
          stimulus={<Bell size={170} ringing={frame > 25 && frame < 70} />}
          stimulusTags={<Tag kind="cs" abbr="CS" label="Glocke" delay={20} />}
          response={<Dog size={260} salivating={frame > 60} alert />}
          responseTag={<Tag kind="cs" abbr="CR" label="Speichelfluss" delay={60} />}
        />
      </div>
      <div style={{ ...center, top: 690 }}>
        <Appear delay={110}>
          <div style={{ fontSize: 36, color: colors.muted, display: "flex", gap: 18, alignItems: "center" }}>
            <Tag kind="neutral" abbr="NS" label="Glocke" delay={110} />
            <span style={{ fontSize: 44 }}>wird zum</span>
            <Tag kind="cs" abbr="CS" label="Glocke" delay={125} />
          </div>
        </Appear>
      </div>
      <Caption delay={70}>Jetzt löst <b>schon die Glocke allein</b> Speichelfluss aus – der Hund hat gelernt.</Caption>
    </Scene>
  );
};

/* ---------- 4 · Begriffe ---------- */
const terms: { kind: "neutral" | "ucs" | "cs"; abbr: string; name: string; text: string; ex: string }[] = [
  { kind: "neutral", abbr: "NS", name: "neutraler Reiz", text: "löst (noch) keine spezifische Reaktion aus", ex: "Glocke vorher" },
  { kind: "ucs", abbr: "UCS", name: "unkonditionierter Reiz", text: "löst ohne Lernen eine Reaktion aus", ex: "Futter" },
  { kind: "ucs", abbr: "UCR", name: "unkonditionierte Reaktion", text: "angeborene, ungelernte Reaktion", ex: "Speichelfluss auf Futter" },
  { kind: "cs", abbr: "CS", name: "konditionierter Reiz", text: "früher neutral, löst jetzt die Reaktion aus", ex: "Glocke nachher" },
  { kind: "cs", abbr: "CR", name: "konditionierte Reaktion", text: "gelernte Reaktion auf den CS", ex: "Speichelfluss auf Glocke" },
];

export const BegriffeScene: React.FC = () => (
  <Scene step="Überblick" title="Die Fachbegriffe" duration={DUR.begriffe}>
    {terms.map((term, i) => (
      <Sfx key={term.abbr} name="pop" at={18 + i * 35} />
    ))}
    <div style={{ position: "absolute", top: 250, left: 110, right: 110, display: "flex", flexDirection: "column", gap: 22 }}>
      {terms.map((term, i) => {
        const fg = term.kind === "neutral" ? colors.neutral : term.kind === "ucs" ? colors.ucs : colors.cs;
        return (
          <Appear key={term.abbr} delay={15 + i * 35}>
            <div style={{ display: "flex", alignItems: "center", gap: 30, background: "#fff", borderRadius: 18, padding: "20px 30px", borderLeft: `12px solid ${fg}`, boxShadow: "0 4px 14px rgba(0,0,0,0.06)" }}>
              <div style={{ width: 120, fontSize: 48, fontWeight: 800, color: fg }}>{term.abbr}</div>
              <div style={{ width: 520, fontSize: 36, fontWeight: 700 }}>{term.name}</div>
              <div style={{ flex: 1, fontSize: 30 }}>{term.text}</div>
              <div style={{ width: 380, fontSize: 28, color: colors.muted, textAlign: "right" }}>z. B. {term.ex}</div>
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
  return (
    <Scene step="Im Alltag" title="Angst beim Zahnarzt" duration={DUR.alltag}>
      <Sfx name="drill" at={25} volume={0.5} />
      <Sfx name="pop" at={58} />
      <div style={{ ...center, top: 300 }}>
        <Row
          delay={10}
          stimulus={<Drill size={190} active={frame > 25 && frame < 115} />}
          stimulusTags={<Tag kind="cs" abbr="CS" label="Bohrergeräusch" delay={20} />}
          response={<Face size={210} anxious={frame > 55} />}
          responseTag={<Tag kind="cs" abbr="CR" label="Angst" delay={55} />}
        />
      </div>
      <Caption delay={70}>
        Das Geräusch war früher mit <b>Schmerz (UCS)</b> gekoppelt – heute löst schon der Klang Angst aus.
      </Caption>
    </Scene>
  );
};

/* ---------- 6 · Merke ---------- */
export const MerkeScene: React.FC = () => (
  <Scene duration={DUR.merke}>
    <Sfx name="chime" at={15} volume={0.7} />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: font }}>
      <Appear delay={5}>
        <div style={{ fontSize: 34, fontWeight: 700, color: colors.cs, letterSpacing: 3, textTransform: "uppercase", textAlign: "center" }}>
          Merke
        </div>
      </Appear>
      <Appear delay={15}>
        <div style={{ fontSize: 58, fontWeight: 700, textAlign: "center", maxWidth: 1500, lineHeight: 1.3, marginTop: 20 }}>
          Ein neutraler Reiz wird durch wiederholte Kopplung mit einem unkonditionierten Reiz zum{" "}
          <span style={{ color: colors.cs }}>konditionierten Reiz</span> – er löst nun selbst eine Reaktion aus.
        </div>
      </Appear>
    </AbsoluteFill>
  </Scene>
);
