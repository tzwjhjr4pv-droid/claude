import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background, Squiggle } from "./fx";
import { colors, font, Kind, kindColor } from "./theme";

const OUT = "#3A2A1E";

/** Soundeffekt ab Frame `at` (relativ zur Szene) */
export const Sfx: React.FC<{ name: string; at: number; volume?: number }> = ({ name, at, volume = 1 }) => (
  <Sequence from={at} layout="none">
    <Html5Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

/** Sprecherstimme ab Frame `at` (Dateien aus scripts/make-voice.py) */
export const Voice: React.FC<{ name: string; at: number }> = ({ name, at }) => (
  <Sequence from={at} layout="none">
    <Html5Audio src={staticFile(`voice/${name}.wav`)} volume={1} />
  </Sequence>
);

export const useAppear = (delay = 0, bouncy = false) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: bouncy ? { damping: 11, stiffness: 140 } : { damping: 200 },
  });
};

export const Appear: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  bouncy?: boolean;
}> = ({ delay = 0, children, style, bouncy }) => {
  const p = useAppear(delay, bouncy);
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.5),
        transform: bouncy ? `scale(${0.6 + p * 0.4})` : `translateY(${(1 - p) * 30}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Szenen-Hülle: Hintergrund, Ein-/Ausblenden, Überschrift */
export const Scene: React.FC<{
  step?: string;
  stepColor?: string;
  title?: string;
  duration: number;
  children: React.ReactNode;
}> = ({ step, stepColor = colors.ucs, title, duration, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12, duration - 12, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, fontFamily: font, color: colors.ink, opacity }}>
      <Background />
      <Sfx name="whoosh" at={0} volume={0.6} />
      {title && (
        <div style={{ position: "absolute", top: 46, left: 110, right: 110 }}>
          <Appear>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              {step && (
                <div
                  style={{
                    background: stepColor,
                    color: "#fff",
                    fontSize: 26,
                    fontWeight: 800,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    padding: "8px 20px",
                    borderRadius: 999,
                    border: `3px solid ${OUT}`,
                    boxShadow: `3px 3px 0 ${OUT}`,
                    transform: "rotate(-2deg)",
                  }}
                >
                  {step}
                </div>
              )}
              <div style={{ fontSize: 62, fontWeight: 900 }}>{title}</div>
            </div>
            <div style={{ marginLeft: step ? 4 : 0, marginTop: 2 }}>
              <Squiggle width={300} color={stepColor} delay={8} />
            </div>
          </Appear>
        </div>
      )}
      {children}
    </AbsoluteFill>
  );
};

/** Fachbegriff-Etikett im Comic-Stil */
export const Tag: React.FC<{ kind: Kind; abbr: string; label: string; delay?: number }> = ({
  kind,
  abbr,
  label,
  delay = 0,
}) => {
  const p = useAppear(delay, true);
  const c = kindColor(kind);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 20px 8px 8px",
        borderRadius: 999,
        background: "#fff",
        border: `3px solid ${OUT}`,
        boxShadow: `3px 3px 0 ${OUT}`,
        opacity: Math.min(1, p * 1.5),
        transform: `scale(${0.5 + p * 0.5})`,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          fontWeight: 900,
          fontSize: 26,
          color: "#fff",
          background: c.fg,
          borderRadius: 999,
          padding: "4px 14px",
          border: `2.5px solid ${OUT}`,
        }}
      >
        {abbr}
      </span>
      <span style={{ fontSize: 28, fontWeight: 700 }}>{label}</span>
    </div>
  );
};

/** Gepunkteter, wandernder Pfeil */
export const Arrow: React.FC<{ delay?: number; width?: number; crossed?: boolean }> = ({
  delay = 0,
  width = 200,
  crossed = false,
}) => {
  const frame = useCurrentFrame();
  const p = useAppear(delay);
  const head = useAppear(delay + 10, true);
  const cross = useAppear(delay + 18, true);
  const len = (width - 40) * p;
  return (
    <svg width={width} height={80} viewBox={`0 0 ${width} 80`} style={{ overflow: "visible" }}>
      <line
        x1={12}
        y1={40}
        x2={12 + len}
        y2={40}
        stroke={OUT}
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray="1 20"
        strokeDashoffset={-frame * 1.2}
      />
      <g transform={`translate(${width - 22} 40) scale(${head})`}>
        <path d="M-22,-20 L8,0 L-22,20 Z" fill={OUT} stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
      </g>
      {crossed && (
        <g transform={`translate(${width / 2} 40) scale(${cross}) rotate(${(1 - cross) * 90})`}>
          <circle r={30} fill="#fff" stroke="#D2463C" strokeWidth={6} />
          <path d="M-13,-13 L13,13 M13,-13 L-13,13" stroke="#D2463C" strokeWidth={8} strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};

const Card: React.FC<{
  children: React.ReactNode;
  tags: React.ReactNode;
  fx?: React.ReactNode;
  width?: number;
  iconHeight?: number;
}> = ({ children, tags, fx, width = 620, iconHeight = 220 }) => (
  <div
    style={{
      position: "relative",
      width,
      background: "rgba(255,255,255,0.85)",
      border: `4px solid ${OUT}`,
      borderRadius: 32,
      boxShadow: `6px 6px 0 ${OUT}`,
      padding: "16px 20px 18px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
    }}
  >
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 26, height: iconHeight }}>
      {children}
    </div>
    <div style={{ display: "flex", gap: 14 }}>{tags}</div>
    {fx}
  </div>
);

/** Eine Zeile: Reiz-Karte → Pfeil → Reaktions-Karte */
export const Row: React.FC<{
  stimulus: React.ReactNode;
  stimulusTags: React.ReactNode;
  stimulusFx?: React.ReactNode;
  response: React.ReactNode;
  responseTag: React.ReactNode;
  responseFx?: React.ReactNode;
  delay?: number;
  crossed?: boolean;
  iconHeight?: number;
}> = ({ stimulus, stimulusTags, stimulusFx, response, responseTag, responseFx, delay = 0, crossed, iconHeight }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 36 }}>
    <Appear delay={delay} bouncy>
      <Card tags={stimulusTags} fx={stimulusFx} iconHeight={iconHeight}>
        {stimulus}
      </Card>
    </Appear>
    <Arrow delay={delay + 18} crossed={crossed} />
    <Appear delay={delay + 10} bouncy>
      <Card tags={responseTag} fx={responseFx} iconHeight={iconHeight}>
        {response}
      </Card>
    </Appear>
  </div>
);

export const Caption: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <div style={{ position: "absolute", bottom: 46, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <Appear delay={delay}>
      <div
        style={{
          fontSize: 36,
          fontWeight: 500,
          color: colors.ink,
          background: "#fff",
          padding: "16px 34px",
          borderRadius: 20,
          border: `3px solid ${OUT}`,
          boxShadow: `4px 4px 0 ${OUT}`,
          maxWidth: 1500,
          textAlign: "center",
        }}
      >
        {children}
      </div>
    </Appear>
  </div>
);
