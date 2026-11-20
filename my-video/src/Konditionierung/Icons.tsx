import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "./theme";

const OUT = "#3A2A1E"; // Konturfarbe
const useSvgId = (prefix: string) => prefix + React.useId().replace(/[^a-zA-Z0-9]/g, "");

/* ------------------------------------------------------------------ */
/* Hund                                                                */
/* ------------------------------------------------------------------ */
export type DogMood = "neutral" | "alert" | "hungry";

export const Dog: React.FC<{
  size?: number;
  mood?: DogMood;
  /** Frame (relativ zur Szene), ab dem der Doktorhut auf den Kopf fällt */
  capAt?: number;
  /** Frame, ab dem sich die Speichelpfütze bildet */
  droolSince?: number;
}> = ({ size = 300, mood = "neutral", capAt, droolSince = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fur = useSvgId("fur");
  const hungry = mood === "hungry";
  const alert = mood === "alert" || hungry;

  const wag = Math.sin(frame / (hungry ? 2.5 : 5)) * (hungry ? 22 : 10);
  const tilt = mood === "alert" ? -9 : hungry ? 4 : Math.sin(frame / 40) * 2;
  const blink = frame % 96 < 5 ? 0.1 : 1;
  const tongue = Math.sin(frame / 3) * 2;
  const breathe = 1 + Math.sin(frame / 12) * 0.012;

  const capP = capAt === undefined ? 0 : spring({ frame: frame - capAt, fps, config: { damping: 9, stiffness: 120 } });
  const puddle = hungry ? Math.min(1, Math.max(0, (frame - droolSince) / 60)) : 0;

  const pupilR = hungry ? 9.5 : mood === "alert" ? 6 : 8;
  const eyes: [number, number, number, number][] = [
    [86, 90, 16, 18],
    [128, 86, 14, 17],
  ];

  return (
    <svg width={size} height={size * (270 / 320)} viewBox="0 0 320 270" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={fur} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EDB777" />
          <stop offset="1" stopColor="#C98848" />
        </linearGradient>
      </defs>

      {/* Schatten + Pfütze */}
      <ellipse cx={170} cy={256} rx={120} ry={11} fill="rgba(0,0,0,0.12)" />
      {puddle > 0 && (
        <ellipse cx={62} cy={254} rx={34 * puddle} ry={7 * puddle} fill={colors.saliva} opacity={0.55} stroke="#3C8FC4" strokeWidth={2} />
      )}

      {/* Schwanz */}
      <g transform={`rotate(${wag}, 252, 165)`}>
        <path d="M252,165 C282,155 296,124 284,96" stroke={OUT} strokeWidth={24} strokeLinecap="round" fill="none" />
        <path d="M252,165 C282,155 296,124 284,96" stroke="#D89A5A" strokeWidth={15} strokeLinecap="round" fill="none" />
      </g>

      {/* Beine (hintere dunkler) */}
      {[
        [124, "#A86E38"],
        [206, "#A86E38"],
        [150, "#D89A5A"],
        [232, "#D89A5A"],
      ].map(([x, c]) => (
        <g key={x as number}>
          <rect x={x as number} y={185} width={32} height={62} rx={15} fill={c as string} stroke={OUT} strokeWidth={4} />
          <ellipse cx={(x as number) + 16} cy={247} rx={22} ry={11} fill={c as string} stroke={OUT} strokeWidth={4} />
        </g>
      ))}

      {/* Körper */}
      <g transform={`translate(185 175) scale(${breathe}) translate(-185 -175)`}>
        <ellipse cx={188} cy={172} rx={90} ry={56} fill={`url(#${fur})`} stroke={OUT} strokeWidth={4} />
        <ellipse cx={180} cy={202} rx={56} ry={18} fill="#F6D9AE" opacity={0.9} />
        <ellipse cx={222} cy={150} rx={30} ry={20} fill="#9C6531" opacity={0.85} />
      </g>

      {/* Kopf */}
      <g transform={`rotate(${tilt}, 120, 150)`}>
        {/* Halsband */}
        <path d="M128,126 Q150,156 178,166" stroke={OUT} strokeWidth={20} strokeLinecap="round" fill="none" />
        <path d="M128,126 Q150,156 178,166" stroke="#E04B4B" strokeWidth={12} strokeLinecap="round" fill="none" />
        <circle cx={152} cy={170} r={10} fill="#F4C542" stroke={OUT} strokeWidth={3} />

        {/* hinteres Ohr */}
        <g transform={`rotate(${alert ? -28 : 0}, 160, 52)`}>
          <path d="M150,46 C188,40 196,104 172,132 C156,116 146,84 150,46 Z" fill="#8E5A2B" stroke={OUT} strokeWidth={4} />
        </g>

        <circle cx={112} cy={100} r={64} fill={`url(#${fur})`} stroke={OUT} strokeWidth={4} />
        <ellipse cx={120} cy={66} rx={30} ry={14} fill="#fff" opacity={0.22} />

        {/* Schnauze */}
        <ellipse cx={72} cy={130} rx={44} ry={30} fill="#F6D9AE" stroke={OUT} strokeWidth={4} />

        {/* Maul */}
        {hungry ? (
          <g>
            <path d="M42,132 Q66,176 96,136 Z" fill="#7A2A2A" stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
            <g transform={`translate(0 ${tongue})`}>
              <path d="M56,146 Q58,186 72,190 Q88,188 86,150 Z" fill="#F27C8E" stroke={OUT} strokeWidth={3.5} />
              <path d="M71,156 L72,178" stroke="#C9506A" strokeWidth={3} strokeLinecap="round" />
            </g>
          </g>
        ) : (
          <path d="M44,130 Q54,144 66,136 Q78,146 90,134" stroke={OUT} strokeWidth={4} fill="none" strokeLinecap="round" />
        )}

        {/* Nase */}
        <path d="M28,114 Q28,100 44,100 Q60,100 58,116 Q52,128 42,128 Q28,126 28,114 Z" fill="#2A1D15" />
        <ellipse cx={40} cy={107} rx={7} ry={3.5} fill="#fff" opacity={0.7} />

        {/* Bäckchen */}
        <ellipse cx={104} cy={130} rx={11} ry={6} fill="#F29C9C" opacity={0.65} />

        {/* Augen */}
        {eyes.map(([cx, cy, rx, ry], i) => (
          <g key={i} transform={`translate(${cx} ${cy}) scale(1 ${blink}) translate(${-cx} ${-cy})`}>
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry * (mood === "alert" ? 1.12 : 1)} fill="#fff" stroke={OUT} strokeWidth={3.5} />
            <circle cx={cx - 4} cy={cy + 1} r={pupilR} fill="#1F1712" />
            <circle cx={cx - 7} cy={cy - 3} r={3} fill="#fff" />
            {hungry && <circle cx={cx - 1} cy={cy + 4} r={1.6} fill="#fff" />}
          </g>
        ))}

        {/* Augenbrauen */}
        {mood === "alert" && (
          <g stroke={OUT} strokeWidth={4} strokeLinecap="round" fill="none">
            <path d="M72,62 Q84,54 98,60" />
            <path d="M118,58 Q130,50 142,56" />
          </g>
        )}

        {/* vorderes Ohr */}
        <g transform={`rotate(${alert ? -22 : 0}, 150, 50)`}>
          <path d="M140,42 C178,30 190,98 166,132 C148,118 134,86 140,42 Z" fill="#A86E38" stroke={OUT} strokeWidth={4} />
        </g>

        {/* Doktorhut */}
        {capAt !== undefined && capP > 0.01 && (
          <g transform={`translate(0 ${(1 - capP) * -220}) rotate(-8, 112, 40)`}>
            <path d="M88,44 L88,60 Q112,72 136,60 L136,44 Z" fill="#26324A" stroke={OUT} strokeWidth={3.5} />
            <polygon points="66,40 112,22 158,40 112,58" fill="#34446A" stroke={OUT} strokeWidth={3.5} strokeLinejoin="round" />
            <path d="M112,40 L156,44 L158,70" stroke="#F4C542" strokeWidth={4} fill="none" strokeLinecap="round" />
            <circle cx={158} cy={74} r={6} fill="#F4C542" stroke={OUT} strokeWidth={2.5} />
          </g>
        )}
      </g>

      {/* Sabber-Tropfen */}
      {hungry &&
        [0, 11, 22].map((offset) => {
          const t = ((frame + offset) % 33) / 33;
          return (
            <path
              key={offset}
              d="M0,0 C-8,13 -8,21 0,23 C8,21 8,13 0,0 Z"
              fill={colors.saliva}
              stroke="#3C8FC4"
              strokeWidth={2}
              opacity={1 - t * 0.6}
              transform={`translate(${60 + offset / 5}, ${178 + t * 66})`}
            />
          );
        })}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Glocke                                                              */
/* ------------------------------------------------------------------ */
export const Bell: React.FC<{ size?: number; ringing?: boolean }> = ({ size = 160, ringing = false }) => {
  const frame = useCurrentFrame();
  const gold = useSvgId("gold");
  const wood = useSvgId("wood");
  const angle = ringing ? Math.sin(frame / 2) * 18 : Math.sin(frame / 30) * 2;
  const wave = (frame % 20) / 20;

  return (
    <svg width={size} height={size * (170 / 160)} viewBox="0 0 160 170" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFE58A" />
          <stop offset="0.55" stopColor="#F4C030" />
          <stop offset="1" stopColor="#D08A12" />
        </linearGradient>
        <linearGradient id={wood} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B4703A" />
          <stop offset="1" stopColor="#7E4920" />
        </linearGradient>
      </defs>
      {ringing &&
        [0, 1].map((i) => {
          const off = i * 14 + wave * 10;
          return (
            <g key={i} stroke="#F4A51C" strokeWidth={5} fill="none" strokeLinecap="round" opacity={1 - wave * 0.8}>
              <path d={`M${22 - off},70 Q${10 - off},100 ${22 - off},130`} />
              <path d={`M${138 + off},70 Q${150 + off},100 ${138 + off},130`} />
            </g>
          );
        })}
      <g transform={`rotate(${angle}, 80, 8)`}>
        <rect x={68} y={0} width={24} height={46} rx={12} fill={`url(#${wood})`} stroke={OUT} strokeWidth={4} />
        <rect x={60} y={40} width={40} height={12} rx={6} fill="#C9861A" stroke={OUT} strokeWidth={4} />
        <path
          d="M80,50 C52,50 44,80 42,114 C40,128 32,136 26,142 L134,142 C128,136 120,128 118,114 C116,80 108,50 80,50 Z"
          fill={`url(#${gold})`}
          stroke={OUT}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <path d="M60,72 C54,92 52,110 52,128" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.55} fill="none" />
        <rect x={20} y={138} width={120} height={14} rx={7} fill="#E0A021" stroke={OUT} strokeWidth={4} />
        <circle cx={80 - angle * 0.8} cy={160} r={10} fill="#8A5A10" stroke={OUT} strokeWidth={3.5} />
      </g>
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Futternapf                                                          */
/* ------------------------------------------------------------------ */
export const Bowl: React.FC<{ size?: number }> = ({ size = 210 }) => {
  const frame = useCurrentFrame();
  const blue = useSvgId("bowl");
  const kibble: [number, number][] = [
    [46, 74], [66, 66], [88, 60], [110, 58], [132, 60], [154, 66], [174, 74],
    [58, 80], [80, 74], [102, 70], [124, 70], [146, 74], [166, 80],
  ];
  return (
    <svg width={size} height={size * (160 / 220)} viewBox="0 0 220 160" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={blue} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5DA3E8" />
          <stop offset="1" stopColor="#2C66B0" />
        </linearGradient>
      </defs>
      {/* Duftlinien */}
      {[70, 110, 150].map((x, i) => {
        const t = ((frame + i * 12) % 45) / 45;
        return (
          <path
            key={x}
            d={`M${x},${40 - t * 22} q10,-10 0,-20 q-10,-10 0,-20`}
            stroke="#D59A62"
            strokeWidth={5}
            strokeLinecap="round"
            fill="none"
            opacity={Math.sin(t * Math.PI) * 0.8}
          />
        );
      })}
      {/* Knochen */}
      <g transform="rotate(-28, 150, 46)">
        <rect x={120} y={38} width={62} height={16} rx={8} fill="#FFF6E6" stroke={OUT} strokeWidth={3.5} />
        {[[120, 38], [120, 54], [182, 38], [182, 54]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={10} fill="#FFF6E6" stroke={OUT} strokeWidth={3.5} />
        ))}
        <rect x={121} y={40} width={60} height={12} fill="#FFF6E6" />
      </g>
      {kibble.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={13} fill={i % 3 === 0 ? "#8A5226" : i % 3 === 1 ? "#A8662F" : "#C27D3E"} stroke={OUT} strokeWidth={3} />
      ))}
      <path d="M18,86 L202,86 L182,146 Q110,158 38,146 Z" fill={`url(#${blue})`} stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
      <rect x={10} y={78} width={200} height={18} rx={9} fill="#7DB8F0" stroke={OUT} strokeWidth={4} />
      <text x={110} y={130} textAnchor="middle" fontSize={24} fontWeight={900} fill="#fff" fontFamily="Inter, sans-serif" letterSpacing={2}>
        BELLO
      </text>
      {/* Funkeln */}
      {[[28, 50, 0], [196, 40, 15], [100, 22, 30]].map(([x, y, o]) => {
        const s = Math.max(0, Math.sin(((frame + o) / 45) * Math.PI * 2));
        return (
          <path key={o} d="M0,-10 L3,-3 L10,0 L3,3 L0,10 L-3,3 L-10,0 L-3,-3 Z" fill="#FFD447" transform={`translate(${x} ${y}) scale(${s})`} />
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Zahnarztbohrer                                                      */
/* ------------------------------------------------------------------ */
export const Drill: React.FC<{ size?: number; active?: boolean }> = ({ size = 200, active = false }) => {
  const frame = useCurrentFrame();
  const metal = useSvgId("metal");
  const jitter = active ? Math.sin(frame * 3) * 2.5 : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={metal} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2F5F7" />
          <stop offset="0.5" stopColor="#B9C4CC" />
          <stop offset="1" stopColor="#7F8C96" />
        </linearGradient>
      </defs>
      {/* Schlauch */}
      <path d="M40,150 C20,175 30,200 70,198" stroke={OUT} strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d="M40,150 C20,175 30,200 70,198" stroke="#5D6B75" strokeWidth={8} fill="none" strokeLinecap="round" />
      <g transform={`translate(${jitter} ${-jitter}) rotate(-40, 100, 100)`}>
        <rect x={20} y={86} width={120} height={30} rx={15} fill={`url(#${metal})`} stroke={OUT} strokeWidth={4} />
        {[40, 52, 64].map((x) => (
          <line key={x} x1={x} y1={90} x2={x} y2={112} stroke="#7F8C96" strokeWidth={3} />
        ))}
        <rect x={134} y={80} width={34} height={36} rx={10} fill={`url(#${metal})`} stroke={OUT} strokeWidth={4} />
        <rect x={166} y={95} width={26} height={6} rx={3} fill="#4B5860" stroke={OUT} strokeWidth={2} />
        {active && (
          <g stroke="#F4A51C" strokeWidth={4} strokeLinecap="round">
            {[0, 1, 2, 3].map((i) => {
              const a = ((frame * 40 + i * 90) % 360) * (Math.PI / 180);
              return <line key={i} x1={196} y1={98} x2={196 + Math.cos(a) * 16} y2={98 + Math.sin(a) * 16} />;
            })}
          </g>
        )}
      </g>
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Person (Alltagsbeispiel)                                            */
/* ------------------------------------------------------------------ */
export const Person: React.FC<{ size?: number; anxious?: boolean }> = ({ size = 240, anxious = false }) => {
  const frame = useCurrentFrame();
  const skin = useSvgId("skin");
  const shake = anxious ? Math.sin(frame * 2.2) * 3 : 0;
  const tremble = anxious ? Math.sin(frame * 3.1) * 1.2 : 0;
  const sweat = (frame % 30) / 30;
  const blink = !anxious && frame % 110 < 5 ? 0.1 : 1;

  return (
    <svg width={size} height={size} viewBox="0 0 240 240" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={skin} cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#FCD8B4" />
          <stop offset="1" stopColor="#E9AE7E" />
        </radialGradient>
      </defs>
      {/* Schultern */}
      <path d="M30,240 Q120,168 210,240 Z" fill="#2E9AA0" stroke={OUT} strokeWidth={4} />
      <g transform={`translate(${shake} 0)`}>
        <circle cx={34} cy={112} r={14} fill="#E9AE7E" stroke={OUT} strokeWidth={4} />
        <circle cx={206} cy={112} r={14} fill="#E9AE7E" stroke={OUT} strokeWidth={4} />
        <circle cx={120} cy={110} r={84} fill={`url(#${skin})`} stroke={OUT} strokeWidth={4} />
        {anxious && <circle cx={120} cy={110} r={82} fill="#9CC9D9" opacity={0.25} />}
        {/* Haare */}
        {[[58, 52, 26], [86, 34, 28], [120, 28, 30], [154, 34, 28], [182, 54, 24], [70, 40, 22], [168, 42, 22]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#5A3A26" stroke={OUT} strokeWidth={4} />
        ))}
        <path d="M44,70 Q120,40 196,70 L196,58 Q120,20 44,58 Z" fill="#5A3A26" />

        {anxious ? (
          <>
            {/* weit aufgerissene Augen */}
            {[86, 154].map((x) => (
              <g key={x}>
                <circle cx={x} cy={104} r={19} fill="#fff" stroke={OUT} strokeWidth={4} />
                <circle cx={x + tremble} cy={104 + tremble} r={4.5} fill="#1F1712" />
              </g>
            ))}
            <path d="M64,76 Q80,66 102,74 M176,76 Q160,66 138,74" stroke={OUT} strokeWidth={5} fill="none" strokeLinecap="round" />
            {/* klappernde Zähne */}
            <rect x={90} y={146} width={60} height={26} rx={10} fill="#fff" stroke={OUT} strokeWidth={4} />
            <path
              d={`M92,${159 + tremble} L100,153 L108,165 L116,153 L124,165 L132,153 L140,165 L148,${159 - tremble}`}
              stroke={OUT}
              strokeWidth={3}
              fill="none"
              strokeLinejoin="round"
            />
            {/* Schweißtropfen */}
            {[[188, 70, 0], [54, 82, 0.5]].map(([x, y, o], i) => {
              const s = (sweat + o) % 1;
              return (
                <path
                  key={i}
                  d="M0,0 C-8,13 -8,21 0,23 C8,21 8,13 0,0 Z"
                  fill={colors.saliva}
                  stroke="#3C8FC4"
                  strokeWidth={2}
                  opacity={1 - s}
                  transform={`translate(${x} ${y + s * 40})`}
                />
              );
            })}
          </>
        ) : (
          <>
            {[86, 154].map((x) => (
              <g key={x} transform={`translate(${x} 104) scale(1 ${blink}) translate(${-x} -104)`}>
                <ellipse cx={x} cy={104} rx={9} ry={11} fill="#1F1712" />
                <circle cx={x - 3} cy={100} r={3} fill="#fff" />
              </g>
            ))}
            <path d="M70,82 Q86,74 100,80 M140,80 Q154,74 170,82" stroke={OUT} strokeWidth={5} fill="none" strokeLinecap="round" />
            <path d="M92,150 Q120,172 148,150" stroke={OUT} strokeWidth={5} fill="none" strokeLinecap="round" />
          </>
        )}
        <path d="M118,112 Q112,128 122,132" stroke={OUT} strokeWidth={4} fill="none" strokeLinecap="round" />
        <ellipse cx={72} cy={134} rx={12} ry={7} fill="#F29C9C" opacity={anxious ? 0 : 0.6} />
        <ellipse cx={168} cy={134} rx={12} ry={7} fill="#F29C9C" opacity={anxious ? 0 : 0.6} />
      </g>
    </svg>
  );
};
