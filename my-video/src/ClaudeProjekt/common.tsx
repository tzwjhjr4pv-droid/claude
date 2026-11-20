import React from "react";
import { Appear, useAppear } from "../Konditionierung/ui";
import { Burst } from "../Konditionierung/fx";
import { C } from "./kit";

export const ProblemBar: React.FC<{ text: string; delay?: number }> = ({ text, delay = 5 }) => (
  <div style={{ position: "absolute", top: 70, left: 160, right: 160 }}>
    <Appear delay={delay}>
      <div style={{ background: C.dark, color: "#fff", borderRadius: 18, padding: "26px 34px", display: "flex", gap: 28, alignItems: "center" }}>
        <div style={{ color: C.amber, fontWeight: 800, letterSpacing: 4, fontSize: 24 }}>PROBLEM</div>
        <div style={{ fontSize: 34, lineHeight: 1.35 }}>{text}</div>
      </div>
    </Appear>
  </div>
);

export const TitleBlock: React.FC<{ kicker: string; lines: string[]; subtitle: string }> = ({ kicker, lines, subtitle }) => (
  <div style={{ position: "absolute", left: 160, top: 230, width: 960 }}>
    <Appear delay={5}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 8, height: 34, background: C.amber, borderRadius: 2 }} />
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 3, color: C.petrol, textTransform: "uppercase" }}>{kicker}</div>
      </div>
    </Appear>
    <Appear delay={12}>
      <div style={{ fontSize: 96, fontWeight: 900, color: C.petrol, lineHeight: 1.08, marginTop: 20 }}>
        {lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </Appear>
    <Appear delay={24}>
      <div style={{ height: 6, width: 520, background: C.amber, borderRadius: 3, marginTop: 26 }} />
    </Appear>
    <Appear delay={30}>
      <div style={{ fontSize: 38, color: C.muted, marginTop: 26, lineHeight: 1.35 }}>{subtitle}</div>
    </Appear>
  </div>
);

export const InfoCard: React.FC<{
  x: number;
  y: number;
  w: number;
  dark?: boolean;
  amber?: boolean;
  kicker?: string;
  title: string;
  delay: number;
  minH?: number;
  children?: React.ReactNode;
}> = ({ x, y, w, dark, amber, kicker, title, delay, minH = 0, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w }}>
    <Appear delay={delay} bouncy>
      <div style={{ background: "#fff", border: `2px solid ${C.line}`, borderRadius: 22, overflow: "hidden", boxShadow: "0 12px 30px rgba(0,0,0,0.06)", minHeight: minH }}>
        <div style={{ background: amber ? C.amber : dark ? C.dark : C.petrol, color: amber ? C.dark : "#fff", padding: "20px 28px" }}>
          {kicker && <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: 3, opacity: 0.85 }}>{kicker}</div>}
          <div style={{ fontSize: 36, fontWeight: 800, marginTop: kicker ? 4 : 0 }}>{title}</div>
        </div>
        {children && <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>{children}</div>}
      </div>
    </Appear>
  </div>
);

export const Item: React.FC<{ icon: string; delay: number; children: React.ReactNode; size?: number }> = ({ icon, delay, children, size = 29 }) => (
  <Appear delay={delay}>
    <div style={{ display: "flex", gap: 18, alignItems: "flex-start", fontSize: size, lineHeight: 1.4 }}>
      <div style={{ fontSize: size + 6, width: 46, flexShrink: 0 }}>{icon}</div>
      <div>{children}</div>
    </div>
  </Appear>
);

export const MerkeBox: React.FC<{ delay?: number; top?: number; children: React.ReactNode }> = ({ delay = 30, top = 520, children }) => {
  const p = useAppear(delay, true);
  return (
    <div style={{ position: "absolute", left: 160, right: 160, top }}>
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
        <div style={{ fontSize: 42, lineHeight: 1.4, color: C.dark }}>{children}</div>
      </div>
    </div>
  );
};

/** Zeitpunkt als Anteil einer Sprachaufnahme */
export const atRatio = (start: number, len: number, r: number) => start + Math.round(len * r);

export const Toggle: React.FC<{ on: number }> = ({ on }) => (
  <div style={{ width: 96, height: 52, borderRadius: 999, background: on > 0.5 ? C.green : "#C5CCCA", position: "relative", flexShrink: 0 }}>
    <div style={{ position: "absolute", top: 6, left: 6 + on * 44, width: 40, height: 40, borderRadius: 99, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }} />
  </div>
);

export { Burst };
