import React from "react";
import { C, FileRow } from "./kit";
import { TOOL } from "../platform";

/* Positionen (Fensterkoordinaten) für Cursor-Pfade */
export const PP = {
  instrEdit: { x: 1440, y: 78 },
  filesPlus: { x: 1494, y: 318 },
  input: { x: 700, y: 185 },
  send: { x: 1043, y: 203 },
  fileSlot: (i: number) => ({ x: 1142, y: 348 + i * 92 }),
};

export type FileSpec = { name: string; kind: "pdf" | "docx" | "xlsx"; progress: number; visible: boolean };

const Card: React.FC<{ title: string; action: string; top: number; height: number; glow?: number; children?: React.ReactNode }> = ({
  title,
  action,
  top,
  height,
  glow = 0,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: 850,
      width: 420,
      top,
      height,
      border: `2px solid ${glow > 0 ? C.amber : C.line}`,
      boxShadow: glow > 0 ? `0 0 0 ${8 * glow}px rgba(242,179,61,${0.35 * glow})` : "none",
      borderRadius: 18,
      background: "#fff",
      padding: "18px 20px",
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <div style={{ fontSize: 26, fontWeight: 800 }}>{title}</div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: C.petrol,
          border: `2px solid ${C.line}`,
          borderRadius: 10,
          padding: "4px 12px",
        }}
      >
        {action}
      </div>
    </div>
    {children}
  </div>
);

export const ProjectPage: React.FC<{
  name: string;
  instructions?: boolean;
  files?: FileSpec[];
  inputText?: React.ReactNode;
  chat?: React.ReactNode;
  glow?: number;
}> = ({ name, instructions = false, files = [], inputText, chat, glow = 0 }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <div style={{ position: "absolute", left: 50, top: 30, fontSize: 18, color: C.muted, fontWeight: 600, letterSpacing: 1 }}>
      PROJEKTE ›
    </div>
    <div style={{ position: "absolute", left: 50, top: 56, fontSize: 42, fontWeight: 800 }}>📁 {name}</div>

    {chat ?? (
      <>
        <div
          style={{
            position: "absolute",
            left: 50,
            top: 130,
            width: 760,
            height: 110,
            borderRadius: 18,
            border: `2px solid ${C.line}`,
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
            padding: "18px 22px",
            fontSize: 26,
            color: inputText ? C.ink : C.muted,
          }}
        >
          {inputText ?? "Wie kann ich dir helfen?"}
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
        <div style={{ position: "absolute", left: 50, top: 290, fontSize: 22, color: C.muted, fontWeight: 600 }}>
          Chats in diesem Projekt
        </div>
        <div style={{ position: "absolute", left: 50, top: 330, width: 760, fontSize: 22, color: C.muted, borderTop: `2px solid ${C.line}`, paddingTop: 16 }}>
          Noch keine Chats – starte oben deinen ersten.
        </div>
      </>
    )}

    <Card title="Anweisungen" action={instructions ? "Bearbeiten" : "＋ Hinzufügen"} top={40} height={220} glow={glow}>
      {instructions ? (
        <div style={{ fontSize: 19, lineHeight: 1.45, color: C.ink }}>
          <span style={{ color: C.green, fontWeight: 800 }}>✓ </span>
          Alles in diesem Projekt ist Unterricht in Psychologie, FOS, Klasse 11, an einem Oberstufenzentrum. Die Lerngruppe: …
        </div>
      ) : (
        <div style={{ fontSize: 20, color: C.muted, lineHeight: 1.4 }}>Sag {TOOL}, wie es in diesem Projekt antworten soll.</div>
      )}
    </Card>

    <Card title="Dateien" action="＋" top={280} height={480} glow={glow}>
      {files.filter((f) => f.visible).length === 0 && (
        <div style={{ fontSize: 20, color: C.muted, lineHeight: 1.4 }}>Lade Material hoch, auf das sich {TOOL} stützen soll.</div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {files.map((f) => (
          <div key={f.name} style={{ opacity: f.visible ? 1 : 0, height: 78 }}>
            <FileRow name={f.name} kind={f.kind} progress={f.progress} />
          </div>
        ))}
      </div>
    </Card>
  </div>
);
