import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "./theme";

/** Einfacher, selbst gezeichneter Hund (schaut nach links). */
export const Dog: React.FC<{
  size?: number;
  salivating?: boolean;
  alert?: boolean;
}> = ({ size = 300, salivating = false, alert = false }) => {
  const frame = useCurrentFrame();
  const wag = Math.sin(frame / 4) * (salivating ? 18 : 6);
  const earLift = alert ? -14 : 0;

  const drops = salivating
    ? [0, 13, 26].map((offset) => {
        const t = ((frame + offset) % 39) / 39;
        return (
          <path
            key={offset}
            d="M0,0 C-6,10 -6,16 0,18 C6,16 6,10 0,0 Z"
            fill={colors.saliva}
            opacity={1 - t}
            transform={`translate(36, ${112 + t * 70})`}
          />
        );
      })
    : null;

  return (
    <svg width={size} height={size * (210 / 250)} viewBox="0 0 250 210">
      {/* Schwanz */}
      <g transform={`rotate(${wag}, 205, 108)`}>
        <path
          d="M205,108 Q228,95 232,62"
          stroke={colors.dogDark}
          strokeWidth={11}
          strokeLinecap="round"
          fill="none"
        />
      </g>
      {/* Beine */}
      {[92, 114, 168, 190].map((x) => (
        <rect key={x} x={x} y={138} width={15} height={52} rx={7} fill={colors.dogDark} />
      ))}
      {/* Körper */}
      <ellipse cx={145} cy={120} rx={74} ry={42} fill={colors.dog} />
      {/* Kopf */}
      <circle cx={72} cy={80} r={40} fill={colors.dog} />
      {/* Schnauze */}
      <ellipse cx={40} cy={96} rx={26} ry={17} fill={colors.dog} />
      <ellipse cx={46} cy={100} rx={18} ry={10} fill="#E2B888" />
      <circle cx={17} cy={90} r={7} fill={colors.ink} />
      {/* Maul */}
      <path
        d={salivating ? "M22,104 Q34,118 50,108" : "M22,104 Q34,110 48,106"}
        stroke={colors.ink}
        strokeWidth={3}
        fill={salivating ? "#B5524A" : "none"}
        strokeLinecap="round"
      />
      {/* Auge */}
      <circle cx={64} cy={70} r={5.5} fill={colors.ink} />
      <circle cx={62.5} cy={68.5} r={1.8} fill="#fff" />
      {/* Ohr */}
      <ellipse
        cx={92}
        cy={66 + earLift / 2}
        rx={13}
        ry={28}
        fill={colors.dogDark}
        transform={`rotate(${alert ? -10 : 18}, 92, 50)`}
      />
      {drops}
    </svg>
  );
};

/** Glocke – schwingt, wenn ringing=true. */
export const Bell: React.FC<{ size?: number; ringing?: boolean }> = ({
  size = 150,
  ringing = false,
}) => {
  const frame = useCurrentFrame();
  const angle = ringing ? Math.sin(frame / 2.2) * 16 : 0;
  const wave = (frame % 30) / 30;

  return (
    <svg width={size} height={size} viewBox="0 0 140 140">
      {ringing &&
        [0, 1].map((i) => (
          <g key={i} opacity={ringing ? 1 - wave : 0} stroke="#E0B33A" strokeWidth={4} fill="none" strokeLinecap="round">
            <path d={`M${18 - i * 10 - wave * 6},50 Q${8 - i * 10 - wave * 6},70 ${18 - i * 10 - wave * 6},90`} />
            <path d={`M${122 + i * 10 + wave * 6},50 Q${132 + i * 10 + wave * 6},70 ${122 + i * 10 + wave * 6},90`} />
          </g>
        ))}
      <g transform={`rotate(${angle}, 70, 18)`}>
        <circle cx={70} cy={16} r={7} fill="#B8891C" />
        <path d="M70,20 C40,20 36,50 34,88 L28,100 L112,100 L106,88 C104,50 100,20 70,20 Z" fill="#F0C53D" />
        <rect x={24} y={98} width={92} height={10} rx={5} fill="#D6A92A" />
        <circle cx={70 + angle * 0.6} cy={114} r={9} fill="#B8891C" />
      </g>
    </svg>
  );
};

/** Futternapf */
export const Bowl: React.FC<{ size?: number }> = ({ size = 160 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 160 112">
    {[30, 50, 70, 90, 110, 130, 42, 62, 82, 102, 122].map((x, i) => (
      <circle key={i} cx={x} cy={i < 6 ? 46 : 36} r={12} fill={i % 2 ? "#8E5A2E" : "#A86C38"} />
    ))}
    <path d="M10,50 L150,50 L132,104 L28,104 Z" fill="#C0463E" />
    <rect x={6} y={44} width={148} height={12} rx={6} fill="#A3362F" />
  </svg>
);

/** Zahnarztbohrer (für das Alltagsbeispiel) */
export const Drill: React.FC<{ size?: number; active?: boolean }> = ({
  size = 150,
  active = false,
}) => {
  const frame = useCurrentFrame();
  const jitter = active ? Math.sin(frame * 2.5) * 2 : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 140 140">
      <g transform={`translate(${jitter}, 0) rotate(-35, 70, 70)`}>
        <rect x={20} y={58} width={80} height={24} rx={12} fill="#9AA6AE" />
        <rect x={96} y={62} width={18} height={16} rx={4} fill="#6E7A82" />
        <rect x={112} y={68} width={22} height={4} rx={2} fill="#3F4950" />
        <rect x={30} y={62} width={50} height={6} rx={3} fill="#C3CCD2" />
      </g>
      {active &&
        [0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${108 + i * 9},${18 + ((frame + i * 5) % 15)} l6,-6`}
            stroke="#E0B33A"
            strokeWidth={4}
            strokeLinecap="round"
          />
        ))}
    </svg>
  );
};

/** Einfaches Gesicht (Mensch) für das Alltagsbeispiel */
export const Face: React.FC<{ size?: number; anxious?: boolean }> = ({
  size = 220,
  anxious = false,
}) => {
  const frame = useCurrentFrame();
  const shake = anxious ? Math.sin(frame * 1.8) * 2 : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <g transform={`translate(${shake}, 0)`}>
        <circle cx={100} cy={100} r={80} fill="#F2C9A0" />
        <path d="M24,86 Q30,22 100,20 Q170,22 176,86 Q150,50 100,50 Q50,50 24,86 Z" fill="#4B3A2E" />
        {anxious ? (
          <>
            <circle cx={70} cy={96} r={11} fill="#fff" stroke={colors.ink} strokeWidth={3} />
            <circle cx={130} cy={96} r={11} fill="#fff" stroke={colors.ink} strokeWidth={3} />
            <circle cx={70} cy={96} r={4} fill={colors.ink} />
            <circle cx={130} cy={96} r={4} fill={colors.ink} />
            <path d="M54,74 L84,82 M146,74 L116,82" stroke={colors.ink} strokeWidth={4} strokeLinecap="round" />
            <path d="M74,146 Q86,134 100,146 Q114,134 126,146" stroke={colors.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d="M160,60 C154,72 154,80 160,82 C166,80 166,72 160,60 Z" fill={colors.saliva} />
          </>
        ) : (
          <>
            <circle cx={70} cy={96} r={6} fill={colors.ink} />
            <circle cx={130} cy={96} r={6} fill={colors.ink} />
            <path d="M74,138 Q100,150 126,138" stroke={colors.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
          </>
        )}
      </g>
    </svg>
  );
};
