import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {C, FONT} from '../theme';

/* ---------- Hilfsfunktionen ---------- */

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const fadeUp = (frame: number, start: number, dur = 18, dist = 30) => {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return {opacity: p, transform: `translateY(${(1 - p) * dist}px)`};
};

export const typed = (text: string, frame: number, start: number, charsPerFrame = 1.2) => {
  const n = Math.max(0, Math.floor((frame - start) * charsPerFrame));
  return text.slice(0, n);
};

export const usePop = (start: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - start, fps, config: {damping: 14, stiffness: 140}});
};

/* ---------- Grundlayout ---------- */

export const Scene: React.FC<{
  bg?: string;
  children: React.ReactNode;
}> = ({bg = C.bg, children}) => (
  <AbsoluteFill style={{backgroundColor: bg, fontFamily: FONT, color: C.text}}>
    {children}
  </AbsoluteFill>
);

export const Pill: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  style?: React.CSSProperties;
  size?: number;
}> = ({children, bg = C.petrol, color = C.white, style, size = 26}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: `${size * 0.42}px ${size * 1.25}px`,
      borderRadius: 999,
      backgroundColor: bg,
      color,
      fontSize: size,
      fontWeight: 600,
      letterSpacing: size * 0.14,
      textTransform: 'uppercase',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Header: React.FC<{
  pill: string;
  pillBg?: string;
  pillColor?: string;
  title: React.ReactNode;
  titleColor?: string;
  start?: number;
}> = ({pill, pillBg = C.petrol, pillColor = C.white, title, titleColor = C.petrolDark, start = 0}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 130, top: 90}}>
      <div style={fadeUp(frame, start)}>
        <Pill bg={pillBg} color={pillColor}>
          {pill}
        </Pill>
      </div>
      <div
        style={{
          ...fadeUp(frame, start + 6),
          marginTop: 26,
          fontSize: 72,
          fontWeight: 600,
          color: titleColor,
          letterSpacing: -1,
          lineHeight: 1.1,
        }}
      >
        {title}
      </div>
    </div>
  );
};

/** Fortschrittsbalken unten rechts – wie in der Präsentation */
export const Progress: React.FC<{step: number; total?: number; dark?: boolean}> = ({
  step,
  total = 5,
  dark,
}) => (
  <div style={{position: 'absolute', right: 130, bottom: 70, display: 'flex', gap: 12}}>
    {Array.from({length: total}).map((_, i) => (
      <div
        key={i}
        style={{
          width: 58,
          height: 12,
          borderRadius: 6,
          backgroundColor:
            i === step ? C.amber : i < step ? (dark ? C.petrolMid : C.petrol) : dark ? '#2F3B3C' : C.greyLine,
        }}
      />
    ))}
  </div>
);

/** Untertitel-Leiste: erzählt, was gerade passiert */
export const Caption: React.FC<{
  items: {from: number; to: number; text: React.ReactNode}[];
  dark?: boolean;
}> = ({items, dark}) => {
  const frame = useCurrentFrame();
  const current = items.find((i) => frame >= i.from && frame < i.to);
  if (!current) return null;
  const o = Math.min(
    interpolate(frame, [current.from, current.from + 8], [0, 1], clamp),
    interpolate(frame, [current.to - 8, current.to], [1, 0], clamp),
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: 130,
        bottom: 46,
        maxWidth: 1250,
        opacity: o,
        fontSize: 34,
        lineHeight: 1.35,
        color: dark ? '#E9EFEE' : C.text,
        display: 'flex',
        gap: 18,
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          width: 8,
          alignSelf: 'stretch',
          borderRadius: 4,
          backgroundColor: C.amber,
          flexShrink: 0,
        }}
      />
      <div>{current.text}</div>
    </div>
  );
};

/* ---------- Mauszeiger mit Klick-Welle ---------- */

export type CursorKey = {f: number; x: number; y: number; click?: boolean};

export const Cursor: React.FC<{keys: CursorKey[]}> = ({keys}) => {
  const frame = useCurrentFrame();
  if (keys.length === 0) return null;
  let x = keys[0].x;
  let y = keys[0].y;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame >= a.f && frame <= b.f) {
      const p = interpolate(frame, [a.f, b.f], [0, 1], {
        ...clamp,
        easing: Easing.inOut(Easing.cubic),
      });
      x = a.x + (b.x - a.x) * p;
      y = a.y + (b.y - a.y) * p;
    } else if (frame > b.f) {
      x = b.x;
      y = b.y;
    }
  }
  const lastClick = [...keys].reverse().find((k) => k.click && frame >= k.f && frame < k.f + 18);
  const press = lastClick ? interpolate(frame - lastClick.f, [0, 4, 10], [1, 0.82, 1], clamp) : 1;
  const ripple = lastClick ? (frame - lastClick.f) / 18 : 0;
  const appear = interpolate(frame, [keys[0].f - 10, keys[0].f], [0, 1], clamp);

  return (
    <div style={{position: 'absolute', left: x, top: y, zIndex: 100, opacity: appear, pointerEvents: 'none'}}>
      {lastClick ? (
        <div
          style={{
            position: 'absolute',
            left: -30 * (0.4 + ripple),
            top: -30 * (0.4 + ripple),
            width: 60 * (0.4 + ripple),
            height: 60 * (0.4 + ripple),
            borderRadius: '50%',
            border: `4px solid ${C.amber}`,
            opacity: 1 - ripple,
          }}
        />
      ) : null}
      <svg
        width={40}
        height={46}
        viewBox="0 0 20 23"
        style={{transform: `scale(${press})`, transformOrigin: '0 0', filter: 'drop-shadow(0 3px 4px rgba(0,0,0,.3))'}}
      >
        <path d="M1 1 L1 18 L5.5 13.8 L8.6 21 L11.6 19.7 L8.6 12.6 L14.6 12.6 Z" fill={C.ink} stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/* ---------- Schematisches App-Fenster ---------- */

export const WIN = {x: 130, y: 290, w: 1180, h: 660, bar: 48, side: 230};

export const AppWindow: React.FC<{
  children: React.ReactNode;
  activeNav?: 'chat' | 'projekte' | null;
  start?: number;
  projects?: string[];
  style?: React.CSSProperties;
}> = ({children, activeNav = null, start = 0, projects = [], style}) => {
  const frame = useCurrentFrame();
  const nav = [
    {id: 'neu', label: '+  Neuer Chat'},
    {id: 'chat', label: 'Chats'},
    {id: 'projekte', label: 'Projekte'},
  ];
  return (
    <div
      style={{
        position: 'absolute',
        left: WIN.x,
        top: WIN.y,
        width: WIN.w,
        height: WIN.h,
        borderRadius: 22,
        overflow: 'hidden',
        backgroundColor: C.white,
        boxShadow: '0 30px 70px rgba(0,60,55,.18), 0 0 0 2px rgba(0,80,75,.08)',
        ...fadeUp(frame, start, 20, 50),
        ...style,
      }}
    >
      <div
        style={{
          height: WIN.bar,
          backgroundColor: C.petrol,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          paddingLeft: 22,
        }}
      >
        <div style={{width: 14, height: 14, borderRadius: 7, background: C.amber}} />
        <div style={{width: 14, height: 14, borderRadius: 7, background: '#CFE3E1'}} />
        <div style={{width: 14, height: 14, borderRadius: 7, background: '#CFE3E1'}} />
        <div style={{marginLeft: 30, color: '#D9ECEA', fontSize: 20, letterSpacing: 1}}>claude.ai</div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: WIN.bar,
          width: WIN.side,
          bottom: 0,
          backgroundColor: C.grey,
          borderRight: `2px solid ${C.greyLine}`,
          padding: '24px 16px',
          boxSizing: 'border-box',
        }}
      >
        {nav.map((n) => (
          <div
            key={n.id}
            style={{
              height: 50,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 16,
              fontSize: 23,
              fontWeight: activeNav === n.id ? 600 : 400,
              backgroundColor: activeNav === n.id ? C.petrolLight : 'transparent',
              color: activeNav === n.id ? C.petrolDark : C.text,
              marginBottom: 4,
            }}
          >
            {n.label}
          </div>
        ))}
        {projects.length > 0 ? (
          <div style={{marginTop: 26}}>
            <div style={{fontSize: 16, letterSpacing: 2, color: C.muted, paddingLeft: 16, marginBottom: 8}}>
              PROJEKTE
            </div>
            {projects.map((p) => (
              <div key={p} style={{fontSize: 20, paddingLeft: 16, height: 40, display: 'flex', alignItems: 'center', gap: 10}}>
                <FolderIcon size={22} /> {p}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div
        style={{
          position: 'absolute',
          left: WIN.side,
          top: WIN.bar,
          right: 0,
          bottom: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ---------- Icons ---------- */

export const FolderIcon: React.FC<{size?: number}> = ({size = 40}) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 50 40">
    <path d="M2 6 a4 4 0 0 1 4-4 h13 l5 5 h20 a4 4 0 0 1 4 4 v25 a4 4 0 0 1-4 4 H6 a4 4 0 0 1-4-4z" fill={C.petrolDark} />
    <rect x="19" y="20" width="12" height="4" rx="2" fill={C.amber} />
  </svg>
);

export const DocIcon: React.FC<{size?: number; label: string; color?: string}> = ({size = 46, label, color = C.petrol}) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 40 48">
    <path d="M4 2 h22 l10 10 v32 a2 2 0 0 1-2 2 H4 a2 2 0 0 1-2-2 V4 a2 2 0 0 1 2-2z" fill="#fff" stroke={color} strokeWidth={2.5} />
    <path d="M26 2 v10 h10" fill="none" stroke={color} strokeWidth={2.5} />
    <rect x="5" y="28" width="30" height="13" rx="3" fill={color} />
    <text x="20" y="38" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#fff" fontFamily="sans-serif">
      {label}
    </text>
  </svg>
);

export const Check: React.FC<{size?: number; color?: string}> = ({size = 34, color = C.petrol}) => (
  <svg width={size} height={size} viewBox="0 0 34 34">
    <circle cx="17" cy="17" r="17" fill={color} />
    <path d="M9 17.5 l5.5 5.5 L25 12" stroke="#fff" strokeWidth={3.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Hinweis-Karte in der rechten Spalte neben dem App-Fenster */
export const SideNote: React.FC<{
  start: number;
  top: number;
  label: string;
  children: React.ReactNode;
  variant?: 'light' | 'petrol' | 'amber';
}> = ({start, top, label, children, variant = 'light'}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + 16], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.4))});
  const bg = variant === 'petrol' ? C.petrol : variant === 'amber' ? C.amber : C.petrolLight;
  const fg = variant === 'petrol' ? C.white : C.ink;
  const lab = variant === 'petrol' ? C.amber : C.petrolDark;
  return (
    <div
      style={{
        position: 'absolute',
        left: 1350,
        top,
        width: 440,
        padding: '26px 30px',
        borderRadius: 20,
        backgroundColor: bg,
        color: fg,
        opacity: p,
        transform: `translateX(${(1 - p) * 60}px)`,
        boxSizing: 'border-box',
      }}
    >
      <div style={{fontSize: 20, fontWeight: 600, letterSpacing: 3, color: lab, textTransform: 'uppercase', marginBottom: 10}}>
        {label}
      </div>
      <div style={{fontSize: 28, lineHeight: 1.35}}>{children}</div>
    </div>
  );
};
