import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  Sequence,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, font, Kind, kindColor } from "./theme";

/** Soundeffekt ab Frame `at` (relativ zur Szene) */
export const Sfx: React.FC<{ name: string; at: number; volume?: number }> = ({
  name,
  at,
  volume = 1,
}) => (
  <Sequence from={at} layout="none">
    <Html5Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

export const useAppear = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 200 } });
};

export const Appear: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, children, style }) => {
  const p = useAppear(delay);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Szenen-Hülle mit Ein-/Ausblenden und Überschrift */
export const Scene: React.FC<{
  step?: string;
  title?: string;
  duration: number;
  children: React.ReactNode;
}> = ({ step, title, duration, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 12, duration - 12, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill
      style={{ backgroundColor: colors.bg, fontFamily: font, color: colors.ink, opacity }}
    >
      {title && (
        <div style={{ position: "absolute", top: 70, left: 110, right: 110 }}>
          <Appear>
            {step && (
              <div style={{ fontSize: 30, fontWeight: 600, color: colors.muted, letterSpacing: 2, textTransform: "uppercase" }}>
                {step}
              </div>
            )}
            <div style={{ fontSize: 64, fontWeight: 800, marginTop: 6 }}>{title}</div>
          </Appear>
        </div>
      )}
      <Sfx name="whoosh" at={0} volume={0.6} />
      {children}
    </AbsoluteFill>
  );
};

/** Fachbegriff-Etikett, z. B. „UCS · unkonditionierter Reiz“ */
export const Tag: React.FC<{ kind: Kind; abbr: string; label: string; delay?: number }> = ({
  kind,
  abbr,
  label,
  delay = 0,
}) => {
  const p = useAppear(delay);
  const c = kindColor(kind);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 22px",
        borderRadius: 999,
        background: c.bg,
        border: `3px solid ${c.fg}`,
        opacity: p,
        transform: `scale(${0.8 + p * 0.2})`,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontWeight: 800, fontSize: 32, color: c.fg }}>{abbr}</span>
      <span style={{ fontSize: 28, fontWeight: 500 }}>{label}</span>
    </div>
  );
};

/** Pfeil, der sich von links nach rechts aufbaut */
export const Arrow: React.FC<{ delay?: number; width?: number; crossed?: boolean }> = ({
  delay = 0,
  width = 220,
  crossed = false,
}) => {
  const p = useAppear(delay);
  const len = (width - 30) * p;
  return (
    <svg width={width} height={60} viewBox={`0 0 ${width} 60`}>
      <line x1={10} y1={30} x2={10 + len} y2={30} stroke={colors.ink} strokeWidth={6} strokeLinecap="round" />
      {p > 0.9 && (
        <path d={`M${width - 34},14 L${width - 8},30 L${width - 34},46`} stroke={colors.ink} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {crossed && p > 0.95 && (
        <g stroke="#C0463E" strokeWidth={7} strokeLinecap="round">
          <line x1={width / 2 - 20} y1={10} x2={width / 2 + 20} y2={50} />
          <line x1={width / 2 + 20} y1={10} x2={width / 2 - 20} y2={50} />
        </g>
      )}
    </svg>
  );
};

/** Eine Zeile: Reiz(e) → Pfeil → Reaktion */
export const Row: React.FC<{
  stimulus: React.ReactNode;
  stimulusTags: React.ReactNode;
  response: React.ReactNode;
  responseTag: React.ReactNode;
  delay?: number;
  crossed?: boolean;
}> = ({ stimulus, stimulusTags, response, responseTag, delay = 0, crossed }) => (
  <Appear delay={delay}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, width: 640 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 30, height: 190 }}>{stimulus}</div>
        <div style={{ display: "flex", gap: 14 }}>{stimulusTags}</div>
      </div>
      <Arrow delay={delay + 20} crossed={crossed} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, width: 640 }}>
        <div style={{ display: "flex", alignItems: "flex-end", height: 190 }}>{response}</div>
        <div>{responseTag}</div>
      </div>
    </div>
  </Appear>
);

export const Caption: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => (
  <div style={{ position: "absolute", bottom: 70, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <Appear delay={delay}>
      <div style={{ fontSize: 38, fontWeight: 500, color: colors.ink, background: "#fff", padding: "18px 36px", borderRadius: 18, boxShadow: "0 6px 20px rgba(0,0,0,0.08)", maxWidth: 1500, textAlign: "center" }}>
        {children}
      </div>
    </Appear>
  </div>
);
