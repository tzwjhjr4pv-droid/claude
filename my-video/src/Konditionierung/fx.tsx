import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, font } from "./theme";

const OUT = "#3A2A1E";

/** Comic-Schriftzug in einem Zacken-Stern, z. B. „DING!“ */
export const Burst: React.FC<{
  text: string;
  at: number;
  x: number;
  y: number;
  size?: number;
  fill?: string;
  rotate?: number;
  hold?: number;
}> = ({ text, at, x, y, size = 150, fill = "#FFD447", rotate = -10, hold = 50 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - at;
  if (local < 0 || local > hold + 10) return null;
  const s = spring({ frame: local, fps, config: { damping: 7, stiffness: 160 } });
  const opacity = interpolate(local, [hold, hold + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const n = 12;
  const pts = Array.from({ length: n * 2 }, (_, i) => {
    const r = i % 2 === 0 ? 50 : 36;
    const a = (i / (n * 2)) * Math.PI * 2;
    return `${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`;
  }).join(" ");
  const w = size * Math.max(1, text.length * 0.24);
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - size / 2,
        width: w,
        height: size,
        transform: `scale(${s}) rotate(${rotate + Math.sin(local / 4) * 3}deg)`,
        opacity,
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      <svg width={w} height={size} viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
        <polygon points={pts} fill={fill} stroke={OUT} strokeWidth={3} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: font,
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: size * 0.21,
          color: OUT,
          letterSpacing: 1,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Gedankenblase, z. B. „?“ */
export const Thought: React.FC<{ text: string; at: number; x: number; y: number; hold?: number }> = ({
  text,
  at,
  x,
  y,
  hold = 80,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - at;
  if (local < 0 || local > hold + 10) return null;
  const s = spring({ frame: local, fps, config: { damping: 10 } });
  const opacity = interpolate(local, [hold, hold + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bob = Math.sin(local / 8) * 4;
  return (
    <div style={{ position: "absolute", left: x, top: y + bob, transform: `scale(${s})`, transformOrigin: "bottom left", opacity, zIndex: 5 }}>
      <svg width={130} height={120} viewBox="0 0 130 120" style={{ overflow: "visible" }}>
        <circle cx={14} cy={108} r={7} fill="#fff" stroke={OUT} strokeWidth={3} />
        <circle cx={30} cy={90} r={11} fill="#fff" stroke={OUT} strokeWidth={3} />
        <ellipse cx={80} cy={46} rx={50} ry={40} fill="#fff" stroke={OUT} strokeWidth={4} />
        <text x={80} y={64} textAnchor="middle" fontSize={52} fontWeight={900} fill={colors.cs} fontFamily={font}>
          {text}
        </text>
      </svg>
    </div>
  );
};

/** Warmer Hintergrund mit Pfotenabdrücken und weichen Farbflächen */
const Paw: React.FC<{ x: number; y: number; r: number; s: number }> = ({ x, y, r, s }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} fill={colors.ink}>
    <ellipse cx={0} cy={10} rx={16} ry={13} />
    <ellipse cx={-17} cy={-8} rx={6} ry={8} />
    <ellipse cx={-6} cy={-17} rx={6} ry={8} />
    <ellipse cx={6} cy={-17} rx={6} ry={8} />
    <ellipse cx={17} cy={-8} rx={6} ry={8} />
  </g>
);

const paws: [number, number, number, number][] = [
  [120, 980, -20, 1.4], [230, 900, -10, 1.2], [1780, 160, 30, 1.3], [1680, 250, 20, 1.1],
  [1820, 860, 10, 1.2], [80, 420, -30, 1], [1000, 1030, 0, 1], [1450, 1000, 15, 1.1],
];

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 12;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #FFF8EC 0%, #FBEFDC 55%, #F5E3CB 100%)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <circle cx={1750 + drift} cy={120} r={260} fill={colors.cs} opacity={0.07} />
        <circle cx={140 - drift} cy={1000} r={300} fill={colors.ucs} opacity={0.08} />
        <circle cx={1650} cy={980 + drift} r={140} fill="#F4C542" opacity={0.1} />
        <g opacity={0.05}>
          {paws.map(([x, y, r, s], i) => (
            <Paw key={i} x={x} y={y + Math.sin((frame + i * 20) / 60) * 6} r={r} s={s} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** Gezeichnete Wellenlinie unter Überschriften */
export const Squiggle: React.FC<{ width?: number; color?: string; delay?: number }> = ({
  width = 260,
  color = colors.ucs,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const segs = Math.floor(width / 30);
  let d = "M4,10";
  for (let i = 0; i < segs; i++) d += ` q7.5,-10 15,0 q7.5,10 15,0`;
  const len = segs * 40;
  return (
    <svg width={width} height={20} viewBox={`0 0 ${width} 20`}>
      <path d={d} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
    </svg>
  );
};
