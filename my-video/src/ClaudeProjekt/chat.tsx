import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, Caret, WIN } from "./kit";

export type Msg = { role: "user" | "ai"; at: number; h: number; node: React.ReactNode; think?: number };
export type PromptT = { text: React.ReactNode; plain: string; start: number; send: number; cps?: number };

const AREA = { left: 110, top: 86, width: 1110, height: 548 };
const GAPY = 22;
export const CHAT_INPUT = { x: WIN.sidebar + 110 + 540, y: 712 };
export const CHAT_SEND = { x: WIN.sidebar + 110 + 1110 - 37, y: 725 };

const showStart = (m: Msg) => (m.role === "ai" ? m.at - (m.think ?? 30) : m.at);

/** Scroll-Versatz der Nachrichtenliste zum Zeitpunkt `frame` */
export const chatOffset = (msgs: Msg[], frame: number) => {
  let total = 0;
  for (const m of msgs) {
    const p = Math.max(0, Math.min(1, (frame - showStart(m)) / 15));
    total += (m.h + GAPY) * p;
  }
  return Math.max(0, total - AREA.height);
};

/** Oberkante einer Nachricht in Fensterkoordinaten (für Cursor-Ziele) */
export const msgTopInWindow = (msgs: Msg[], index: number, frame: number) => {
  let top = 0;
  for (let i = 0; i < index; i++) top += msgs[i].h + GAPY;
  return AREA.top + top - chatOffset(msgs, frame);
};
export const msgLeftInWindow = (role: "user" | "ai") => WIN.sidebar + AREA.left + (role === "ai" ? 56 : 0);

const Thinking: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 8, paddingTop: 14 }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 12,
            height: 12,
            borderRadius: 99,
            background: C.muted,
            opacity: 0.3 + 0.7 * Math.max(0, Math.sin((frame - i * 5) / 5)),
          }}
        />
      ))}
    </div>
  );
};

export const ChatView: React.FC<{
  project?: string;
  title: string;
  msgs: Msg[];
  prompts?: PromptT[];
  inputOverlay?: React.ReactNode;
  empty?: React.ReactNode;
}> = ({ project = "FOS 11 Psychologie", title, msgs, prompts = [], inputOverlay, empty }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const offset = chatOffset(msgs, frame);
  const active = prompts.find((p) => frame >= p.start && frame < p.send + 2);
  let typed: string | null = null;
  if (active) {
    const n = Math.max(0, Math.min(active.plain.length, Math.floor(((frame - active.start) / 30) * (active.cps ?? 26))));
    typed = active.plain.slice(0, n);
  }
  const anyVisible = msgs.some((m) => frame >= showStart(m));
  let top = 0;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: AREA.left, top: 26, fontSize: 24, color: C.muted, fontWeight: 600 }}>
        📁 {project} <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: C.ink, fontWeight: 800 }}>{title}</span>
      </div>
      <div style={{ position: "absolute", left: AREA.left, top: AREA.top, width: AREA.width, height: AREA.height, overflow: "hidden" }}>
        {!anyVisible && empty}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${-offset}px)` }}>
          {msgs.map((m, i) => {
            const myTop = top;
            top += m.h + GAPY;
            const s0 = showStart(m);
            if (frame < s0) return null;
            const p = spring({ frame: frame - s0, fps, config: { damping: 200 } });
            const thinking = m.role === "ai" && frame < m.at;
            const pc = spring({ frame: frame - m.at, fps, config: { damping: 200 } });
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: myTop,
                  left: 0,
                  right: 0,
                  height: m.h,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 20}px)`,
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                {m.role === "user" ? (
                  <div
                    style={{
                      background: C.petrolLight,
                      borderRadius: "22px 22px 6px 22px",
                      padding: "14px 22px",
                      fontSize: 24,
                      lineHeight: 1.4,
                      maxWidth: 820,
                      alignSelf: "flex-start",
                    }}
                  >
                    {m.node}
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 18, width: "100%" }}>
                    <div style={{ fontSize: 34, color: C.amber, width: 38 }}>✳︎</div>
                    <div style={{ flex: 1 }}>
                      {thinking ? <Thinking /> : <div style={{ opacity: pc, transform: `translateY(${(1 - pc) * 14}px)` }}>{m.node}</div>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Eingabe */}
      <div
        style={{
          position: "absolute",
          left: AREA.left,
          top: 660,
          width: AREA.width,
          height: 100,
          borderRadius: 18,
          border: `2px solid ${typed !== null ? C.petrol : C.line}`,
          boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
          padding: "16px 80px 16px 22px",
          fontSize: 24,
          lineHeight: 1.4,
          color: typed !== null ? C.ink : C.muted,
          background: "#fff",
          overflow: "hidden",
        }}
      >
        {typed !== null ? (
          <>
            {active && typeof active.text !== "string" && typed.length >= active.plain.length ? active.text : typed}
            <Caret visible={frame < (active?.send ?? 0)} />
          </>
        ) : (
          "Antworte Claude …"
        )}
        <div
          style={{
            position: "absolute",
            right: 14,
            bottom: 14,
            width: 46,
            height: 46,
            borderRadius: 12,
            background: C.petrol,
            color: "#fff",
            fontSize: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ↑
        </div>
      </div>
      {inputOverlay}
    </div>
  );
};

/** Kleines Anhang-Kärtchen in einer Nachricht */
export const Attach: React.FC<{ name: string; kind?: string }> = ({ name, kind = "DOCX" }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      background: "#fff",
      border: `2px solid ${C.line}`,
      borderRadius: 10,
      padding: "4px 12px",
      fontSize: 20,
      fontWeight: 700,
      marginTop: 8,
    }}
  >
    <span style={{ background: kind === "PDF" ? C.red : "#2F6DB5", color: "#fff", borderRadius: 4, padding: "1px 6px", fontSize: 14 }}>{kind}</span>
    {name}
  </span>
);
