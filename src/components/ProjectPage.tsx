import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {clamp, DocIcon} from './ui';

export const PROJECT_NAME = 'Psychologie FOS 11';

export type FileItem = {name: string; type: 'PDF' | 'DOCX'; from: number};

/**
 * Projektseite (Hauptbereich des App-Fensters, 950 × 612).
 * Koordinaten der Schaltflächen relativ zum Fenster:
 *  - Anweisungen bearbeiten: (1110, 112)
 *  - Dateien „+“: (1110, 342)
 *  - Chat-Eingabe im Projekt: (520, 240)
 */
export const ProjectPage: React.FC<{
  instructions?: string | null;
  files?: FileItem[];
  highlight?: 'anweisungen' | 'dateien' | 'chat' | null;
  chatText?: string;
  chats?: string[];
}> = ({instructions = null, files = [], highlight = null, chatText = '', chats = []}) => {
  const frame = useCurrentFrame();
  const ring = (on: boolean): React.CSSProperties =>
    on ? {boxShadow: `0 0 0 4px ${C.amber}`} : {};

  return (
    <div style={{position: 'absolute', inset: 0, padding: 0}}>
      {/* linke Spalte */}
      <div style={{position: 'absolute', left: 40, top: 30, width: 560}}>
        <div style={{fontSize: 18, color: C.muted, letterSpacing: 1}}>Projekte ›</div>
        <div style={{fontSize: 40, fontWeight: 600, color: C.petrolDark, marginTop: 4}}>{PROJECT_NAME}</div>
        <div style={{fontSize: 21, color: C.muted, marginTop: 4}}>Materialien für die 11. Klasse</div>
        <div
          style={{
            marginTop: 26,
            height: 110,
            borderRadius: 18,
            border: `2px solid ${C.greyLine}`,
            padding: '18px 22px',
            boxSizing: 'border-box',
            fontSize: 23,
            color: chatText ? C.text : '#9AA6A5',
            backgroundColor: '#fff',
            ...ring(highlight === 'chat'),
          }}
        >
          {chatText || 'Neuer Chat in diesem Projekt …'}
          {chatText && frame % 30 < 15 ? <span style={{color: C.petrol}}>|</span> : null}
        </div>
        <div style={{marginTop: 30, fontSize: 18, letterSpacing: 2, color: C.muted}}>CHATS IN DIESEM PROJEKT</div>
        {chats.length === 0 ? (
          <div style={{marginTop: 12, fontSize: 21, color: '#9AA6A5'}}>Noch keine Chats</div>
        ) : (
          chats.map((c) => (
            <div key={c} style={{marginTop: 12, fontSize: 22, padding: '12px 16px', borderRadius: 12, background: C.grey}}>
              {c}
            </div>
          ))
        )}
      </div>

      {/* rechte Spalte: Anweisungen */}
      <div
        style={{
          position: 'absolute',
          left: 630,
          top: 30,
          width: 300,
          height: 200,
          borderRadius: 18,
          backgroundColor: C.petrolLight,
          padding: '18px 20px',
          boxSizing: 'border-box',
          ...ring(highlight === 'anweisungen'),
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontSize: 22, fontWeight: 600, color: C.petrolDark}}>Anweisungen</div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d="M4 20 l1-5 L16 4 l4 4 L9 19z" fill="none" stroke={C.petrolDark} strokeWidth="2.2" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div style={{fontSize: 17, lineHeight: 1.4, marginTop: 10, color: instructions ? C.text : C.muted}}>
          {instructions ?? 'Lege fest, wie Claude in diesem Projekt antworten soll.'}
        </div>
      </div>

      {/* rechte Spalte: Dateien */}
      <div
        style={{
          position: 'absolute',
          left: 630,
          top: 250,
          width: 300,
          height: 340,
          borderRadius: 18,
          backgroundColor: C.grey,
          padding: '18px 20px',
          boxSizing: 'border-box',
          ...ring(highlight === 'dateien'),
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontSize: 22, fontWeight: 600, color: C.petrolDark}}>Dateien</div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: C.petrol,
              color: '#fff',
              fontSize: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            +
          </div>
        </div>
        {files.length === 0 ? (
          <div style={{fontSize: 17, marginTop: 10, color: C.muted}}>Noch keine Dateien</div>
        ) : null}
        {files.map((f) => {
          const p = interpolate(frame, [f.from, f.from + 12], [0, 1], clamp);
          const load = interpolate(frame, [f.from + 6, f.from + 40], [0, 1], clamp);
          if (frame < f.from) return null;
          return (
            <div
              key={f.name}
              style={{
                marginTop: 14,
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: '10px 12px',
                opacity: p,
                transform: `translateY(${(1 - p) * 20}px)`,
              }}
            >
              <DocIcon size={34} label={f.type} color={f.type === 'PDF' ? C.petrolDark : C.petrolMid} />
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontSize: 16, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                  {f.name}
                </div>
                <div style={{height: 6, borderRadius: 3, backgroundColor: C.greyLine, marginTop: 6}}>
                  <div style={{height: 6, borderRadius: 3, width: `${load * 100}%`, backgroundColor: load >= 1 ? C.petrol : C.amber}} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
