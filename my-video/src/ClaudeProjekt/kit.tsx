import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { Html5Audio, staticFile } from "remotion";
import { Appear, useAppear } from "../Konditionierung/ui";

/* ------------------------------------------------------------------ */
/* Farben im Stil der Merkblätter                                      */
/* ------------------------------------------------------------------ */
export const C = {
  petrol: "#0B6B67",
  petrolLight: "#E1EEED",
  dark: "#18211F",
  amber: "#F2B33D",
  amberLight: "#FDF2D8",
  ink: "#1A2321",
  muted: "#6B7774",
  line: "#D6DEDC",
  bg: "#FAF9F5",
  red: "#D2463C",
  green: "#2E9E5B",
  sidebar: "#F3F1EA",
};
export const FONT = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";

export const Sfx: React.FC<{ name: string; at: number; volume?: number; frames?: number }> = ({
  name,
  at,
  volume = 1,
  frames,
}) => (
  <Sequence from={at} durationInFrames={frames} layout="none">
    <Html5Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

export const Voice: React.FC<{ name: string; at: number; folder?: string }> = ({ name, at, folder = "claude-projekt" }) => (
  <Sequence from={at} layout="none">
    <Html5Audio src={staticFile(`voice/${folder}/${name}.wav`)} />
  </Sequence>
);

/* ------------------------------------------------------------------ */
/* Szene mit Kopfzeile                                                 */
/* ------------------------------------------------------------------ */
export const Scene: React.FC<{
  duration: number;
  kicker?: string;
  title?: React.ReactNode;
  step?: number;
  path?: string;
  children: React.ReactNode;
}> = ({ duration, kicker, title, step, path, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12, duration - 12, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT, color: C.ink, opacity }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="dots" width={36} height={36} patternUnits="userSpaceOnUse">
            <circle cx={2} cy={2} r={2} fill={C.petrol} opacity={0.08} />
          </pattern>
        </defs>
        <rect width={1920} height={1080} fill="url(#dots)" />
      </svg>
      <Sfx name="whoosh" at={0} volume={0.5} />
      {title && (
        <div style={{ position: "absolute", top: 44, left: 160, right: 160 }}>
          <Appear>
            {kicker && (
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
                <div style={{ width: 8, height: 30, background: C.amber, borderRadius: 2 }} />
                <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 3, color: C.petrol, textTransform: "uppercase" }}>
                  {kicker}
                </div>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              {step !== undefined && (
                <div
                  style={{
                    width: 74,
                    height: 74,
                    borderRadius: 999,
                    background: step === 4 ? C.amber : C.petrol,
                    color: step === 4 ? C.dark : "#fff",
                    fontSize: 42,
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {step}
                </div>
              )}
              <div style={{ fontSize: 62, fontWeight: 800, color: C.petrol }}>{title}</div>
              {path && <PathPill text={path} />}
            </div>
            <div style={{ height: 4, background: C.amber, borderRadius: 2, marginTop: 16, width: "100%" }} />
          </Appear>
        </div>
      )}
      {children}
    </AbsoluteFill>
  );
};

export const PathPill: React.FC<{ text: string; delay?: number }> = ({ text, delay = 10 }) => {
  const p = useAppear(delay, true);
  return (
    <div
      style={{
        marginLeft: 12,
        border: `3px solid ${C.petrol}`,
        color: C.petrol,
        background: "#fff",
        borderRadius: 14,
        padding: "8px 20px",
        fontSize: 30,
        fontWeight: 700,
        transform: `scale(${0.6 + p * 0.4})`,
        opacity: Math.min(1, p * 1.5),
      }}
    >
      {text}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Mauszeiger                                                          */
/* ------------------------------------------------------------------ */
export type CursorKey = { f: number; x: number; y: number; click?: boolean };

export const Cursor: React.FC<{ keys: CursorKey[] }> = ({ keys }) => {
  const frame = useCurrentFrame();
  const fs = keys.map((k) => k.f);
  const opts = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.inOut(Easing.cubic) };
  // stückweise Interpolation mit Easing pro Abschnitt
  let x = keys[0].x;
  let y = keys[0].y;
  for (let i = 0; i < keys.length - 1; i++) {
    if (frame >= fs[i]) {
      x = interpolate(frame, [fs[i], fs[i + 1]], [keys[i].x, keys[i + 1].x], opts);
      y = interpolate(frame, [fs[i], fs[i + 1]], [keys[i].y, keys[i + 1].y], opts);
    }
  }
  const clicks = keys.filter((k) => k.click);
  const press = clicks.some((k) => frame >= k.f && frame < k.f + 5);
  const appear = interpolate(frame, [fs[0], fs[0] + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", zIndex: 50, opacity: appear }}>
      {clicks.map((k) => {
        const t = frame - k.f;
        if (t < 0 || t > 18) return null;
        return (
          <div
            key={k.f}
            style={{
              position: "absolute",
              left: k.x - 30,
              top: k.y - 30,
              width: 60,
              height: 60,
              borderRadius: 999,
              border: `4px solid ${C.amber}`,
              transform: `scale(${0.3 + t / 12})`,
              opacity: 1 - t / 18,
            }}
          />
        );
      })}
      <svg
        width={44}
        height={52}
        viewBox="0 0 44 52"
        style={{ position: "absolute", left: x - 4, top: y - 2, transform: `scale(${press ? 0.85 : 1})`, transformOrigin: "4px 2px" }}
      >
        <path d="M4,2 L4,40 L14,31 L21,48 L28,45 L21,28 L35,28 Z" fill="#fff" stroke={C.dark} strokeWidth={3} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Klick-Geräusche zu allen Klicks eines Cursor-Pfads */
export const CursorClicks: React.FC<{ keys: CursorKey[] }> = ({ keys }) => (
  <>
    {keys
      .filter((k) => k.click)
      .map((k) => (
        <Sfx key={k.f} name="click" at={k.f} volume={0.9} />
      ))}
  </>
);

/* ------------------------------------------------------------------ */
/* Tippender Text                                                      */
/* ------------------------------------------------------------------ */
export const useTyped = (text: string, start: number, cps = 16) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor(((frame - start) / 30) * cps)));
  return { shown: text.slice(0, n), done: n >= text.length, started: frame >= start };
};

export const typingFrames = (text: string, cps = 16) => Math.ceil((text.length / cps) * 30);

export const Caret: React.FC<{ visible?: boolean }> = ({ visible = true }) => {
  const frame = useCurrentFrame();
  if (!visible) return null;
  return (
    <span
      style={{
        display: "inline-block",
        width: 3,
        height: "1.1em",
        background: C.ink,
        marginLeft: 2,
        verticalAlign: "text-bottom",
        opacity: Math.floor(frame / 15) % 2 ? 0 : 1,
      }}
    />
  );
};

/* ------------------------------------------------------------------ */
/* App-Fenster (vereinfachte Darstellung)                              */
/* ------------------------------------------------------------------ */
export const WIN = { left: 160, top: 205, width: 1600, height: 800, sidebar: 270 };

const SideItem: React.FC<{ label: string; icon: string; active?: boolean; y: number }> = ({ label, icon, active, y }) => (
  <div
    style={{
      position: "absolute",
      left: 18,
      right: 18,
      top: y - 24,
      height: 48,
      borderRadius: 12,
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "0 16px",
      fontSize: 24,
      fontWeight: active ? 700 : 500,
      background: active ? C.petrolLight : "transparent",
      color: active ? C.petrol : C.ink,
    }}
  >
    <span style={{ width: 26, textAlign: "center" }}>{icon}</span>
    {label}
  </div>
);

export const SIDE_Y = { newChat: 110, chats: 165, projects: 220, settings: 750 };

export const AppWindow: React.FC<{
  active?: "chats" | "projects" | "settings";
  children: React.ReactNode;
  delay?: number;
}> = ({ active, children, delay = 0 }) => {
  const p = useAppear(delay);
  return (
    <div
      style={{
        position: "absolute",
        left: WIN.left,
        top: WIN.top,
        width: WIN.width,
        height: WIN.height,
        borderRadius: 22,
        background: "#fff",
        border: `2px solid ${C.line}`,
        boxShadow: "0 30px 60px rgba(24,33,31,0.16)",
        overflow: "hidden",
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px)`,
      }}
    >
      {/* Seitenleiste */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: WIN.sidebar, background: C.sidebar, borderRight: `2px solid ${C.line}` }}>
        <div style={{ position: "absolute", left: 34, top: 26, display: "flex", gap: 8 }}>
          {["#E8685B", "#F2B33D", "#5DBB6A"].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: 99, background: c }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 34, top: 52, fontSize: 30, fontWeight: 800, fontFamily: "Georgia, serif", color: C.ink }}>
          Claude
        </div>
        <SideItem label="Neuer Chat" icon="＋" y={SIDE_Y.newChat} />
        <SideItem label="Chats" icon="💬" y={SIDE_Y.chats} active={active === "chats"} />
        <SideItem label="Projekte" icon="📁" y={SIDE_Y.projects} active={active === "projects"} />
        <SideItem label="Einstellungen" icon="⚙️" y={SIDE_Y.settings} active={active === "settings"} />
      </div>
      <div style={{ position: "absolute", left: WIN.sidebar, top: 0, right: 0, bottom: 0 }}>{children}</div>
      <div style={{ position: "absolute", right: 18, bottom: 10, fontSize: 16, color: C.muted, opacity: 0.8 }}>
        vereinfachte Darstellung
      </div>
    </div>
  );
};

/** Overlay-Ebene über dem Fenster in Fensterkoordinaten (für Cursor, Bursts, fliegende Dateien) */
export const WinLayer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: WIN.left, top: WIN.top, width: WIN.width, height: WIN.height, zIndex: 40 }}>
    {children}
  </div>
);

export const Button: React.FC<{ children: React.ReactNode; primary?: boolean; style?: React.CSSProperties; glow?: number }> = ({
  children,
  primary,
  style,
  glow = 0,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: 12,
      padding: "10px 22px",
      fontSize: 24,
      fontWeight: 700,
      background: primary ? C.petrol : "#fff",
      color: primary ? "#fff" : C.ink,
      border: `2px solid ${primary ? C.petrol : C.line}`,
      boxShadow: glow > 0 ? `0 0 0 ${6 * glow}px rgba(242,179,61,${0.6 * glow})` : "none",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Pulsierendes Hervorheben (0–1) in einem Zeitfenster */
export const usePulse = (from: number, to: number) => {
  const frame = useCurrentFrame();
  if (frame < from || frame > to) return 0;
  return 0.5 + 0.5 * Math.sin(((frame - from) / 8) * Math.PI);
};

export const Modal: React.FC<{
  at: number;
  until?: number;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  children: React.ReactNode;
}> = ({ at, until = 99999, x, y, w, h, title, children }) => {
  const frame = useCurrentFrame();
  const pIn = useAppear(at, true);
  const out = interpolate(frame, [until, until + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < at || frame > until + 8) return null;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "rgba(24,33,31,0.35)", opacity: Math.min(1, pIn) * out, zIndex: 20 }} />
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          padding: "28px 34px",
          zIndex: 21,
          transform: `scale(${(0.85 + pIn * 0.15) * (0.9 + out * 0.1)})`,
          opacity: Math.min(1, pIn * 1.5) * out,
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 18 }}>{title}</div>
        {children}
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Datei-Zeile                                                         */
/* ------------------------------------------------------------------ */
export const FileRow: React.FC<{ name: string; kind: "pdf" | "docx" | "xlsx"; progress?: number }> = ({
  name,
  kind,
  progress = 1,
}) => {
  const color = kind === "pdf" ? C.red : kind === "docx" ? "#2F6DB5" : C.green;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: "#fff",
        border: `2px solid ${C.line}`,
        borderRadius: 14,
        padding: "10px 14px",
        width: 360,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 46,
          height: 54,
          borderRadius: 8,
          background: color,
          color: "#fff",
          fontSize: 15,
          fontWeight: 800,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 6,
          flexShrink: 0,
        }}
      >
        {kind.toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 21, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
        <div style={{ height: 8, background: C.petrolLight, borderRadius: 4, marginTop: 8 }}>
          <div style={{ height: 8, width: `${progress * 100}%`, background: C.petrol, borderRadius: 4 }} />
        </div>
      </div>
      <div style={{ width: 30, fontSize: 26, color: C.green, opacity: progress >= 1 ? 1 : 0 }}>✓</div>
    </div>
  );
};
