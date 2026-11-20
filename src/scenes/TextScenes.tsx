import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {Caption, Check, clamp, fadeUp, FolderIcon, Header, Pill, Progress, Scene, usePop} from '../components/ui';

/* ================= 1 · Intro ================= */

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const circle = usePop(4);
  const docIn = interpolate(frame, [30, 70], [-140, 0], {...clamp, easing: Easing.out(Easing.back(1.6))});
  const bubble = usePop(70);
  return (
    <Scene bg={C.petrol}>
      <div style={{position: 'absolute', left: 130, top: 90, ...fadeUp(frame, 0)}}>
        <div style={{color: C.amber, fontSize: 28, fontWeight: 600, letterSpacing: 4}}>
          KI-STARTPAKET · ERKLÄRVIDEO
        </div>
      </div>
      <div style={{position: 'absolute', left: 130, top: 360, width: 1000}}>
        <div style={{...fadeUp(frame, 8), color: C.amber, fontSize: 36, fontWeight: 600, letterSpacing: 4}}>MODUL 1</div>
        <div style={{...fadeUp(frame, 14), color: '#fff', fontSize: 104, fontWeight: 600, lineHeight: 1.05, marginTop: 20, letterSpacing: -2}}>
          Ein Projekt in Claude anlegen
        </div>
        <div style={{...fadeUp(frame, 26), color: '#E3F1EF', fontSize: 40, lineHeight: 1.4, marginTop: 34}}>
          … und mit Anweisungen und Material füllen.
          <br />
          Einmal einrichten – dann nicht mehr bei jeder Anfrage alles neu erklären.
        </div>
      </div>
      {/* Illustration: Ordner, Blatt, Sprechblase */}
      <svg
        width="640"
        height="640"
        viewBox="0 0 640 640"
        style={{position: 'absolute', right: 120, top: 220}}
      >
        <circle cx="320" cy="320" r={300 * circle} fill={C.petrolDark} />
        <g style={{opacity: circle}}>
          <rect x="130" y="250" width="70" height="260" rx="14" fill="#E3EFED" transform="rotate(-8 170 380)" />
          <g transform={`translate(0 ${docIn})`}>
            <rect x="190" y="110" width="200" height="260" rx="14" fill="#fff" />
            <rect x="220" y="150" width="120" height="14" rx="7" fill={C.petrol} />
            {[190, 220, 250, 280].map((y, i) => (
              <rect key={y} x="220" y={y} width={i % 2 ? 110 : 140} height="11" rx="5.5" fill={C.petrolMid} />
            ))}
          </g>
          <path d="M70 290 a14 14 0 0 1 14-14 h100 l26 26 h228 a14 14 0 0 1 14 14 v30 H70z" fill={C.petrolMid} />
          <rect x="70" y="320" width="382" height="210" rx="16" fill="#E3EFED" />
          <rect x="220" y="400" width="96" height="22" rx="11" fill={C.amber} />
        </g>
        <g style={{transform: `scale(${bubble})`, transformOrigin: '500px 240px'}}>
          <rect x="420" y="100" width="180" height="150" rx="20" fill={C.amber} />
          <path d="M470 248 l-12 40 l40-40z" fill={C.amber} />
          <rect x="452" y="145" width="115" height="16" rx="8" fill={C.ink} />
          <rect x="452" y="180" width="80" height="16" rx="8" fill={C.ink} />
        </g>
      </svg>
    </Scene>
  );
};

/* ================= 2 · Problem ================= */

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const rot = interpolate(frame, [40, 260], [0, 720], clamp);
  const bubbles = [50, 100, 150];
  return (
    <Scene>
      <div style={{position: 'absolute', left: 130, top: 90, ...fadeUp(frame, 0)}}>
        <Pill bg={C.amber} color={C.ink}>Einstieg</Pill>
      </div>
      <div style={{position: 'absolute', left: 130, top: 200, ...fadeUp(frame, 4), fontSize: 26, letterSpacing: 4, color: C.muted, fontWeight: 600}}>
        DAS PROBLEM
      </div>
      <div
        style={{
          position: 'absolute',
          left: 130,
          top: 260,
          width: 1080,
          fontSize: 76,
          fontWeight: 600,
          color: C.petrolDark,
          lineHeight: 1.15,
          ...fadeUp(frame, 10),
        }}
      >
        „Ich muss der KI jedes Mal neu erklären, wer meine Klasse ist und was ich brauche.“
      </div>
      {/* Chatfenster mit sich wiederholenden Erklärungen */}
      <div
        style={{
          position: 'absolute',
          right: 130,
          top: 250,
          width: 470,
          height: 460,
          borderRadius: 26,
          overflow: 'hidden',
          backgroundColor: C.petrolLight,
          ...fadeUp(frame, 20, 20, 40),
        }}
      >
        <div style={{height: 62, background: C.petrol, display: 'flex', gap: 12, alignItems: 'center', paddingLeft: 26}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.amber}} />
          <div style={{width: 18, height: 18, borderRadius: 9, background: '#D6E8E6'}} />
          <div style={{width: 18, height: 18, borderRadius: 9, background: '#D6E8E6'}} />
        </div>
        {bubbles.map((b, i) => (
          <div
            key={b}
            style={{
              position: 'absolute',
              right: 28,
              top: 92 + i * 118,
              width: 330,
              padding: '16px 20px',
              borderRadius: 18,
              backgroundColor: C.petrolMid,
              color: '#fff',
              fontSize: 21,
              lineHeight: 1.3,
              ...fadeUp(frame, b, 14, 20),
            }}
          >
            {['Ich unterrichte Psychologie, FOS 11 …', 'Also nochmal: FOS 11, Psychologie …', 'Wie gesagt: meine Klasse ist …'][i]}
          </div>
        ))}
        <svg width="120" height="160" viewBox="0 0 120 160" style={{position: 'absolute', left: 8, top: 180}}>
          <g style={{transform: `rotate(${rot}deg)`, transformOrigin: '60px 80px'}}>
            <path d="M60 25 A55 55 0 1 0 110 70" fill="none" stroke={C.amber} strokeWidth="12" strokeLinecap="round" />
            <path d="M92 52 l26 22 l-30 8z" fill={C.amber} />
          </g>
        </svg>
      </div>
      <Caption
        items={[
          {from: 40, to: 150, text: 'Kennst du das? In einem leeren Chat weiß die KI nichts über dein Fach und deine Lerngruppe.'},
          {from: 150, to: 270, text: <>Die Lösung: ein <b>Projekt</b>. Dort steht einmal, was immer gilt.</>},
        ]}
      />
    </Scene>
  );
};

/* ================= 3 · Projekt oder Chat ================= */

const Card: React.FC<{start: number; bg: string; left: number; children: React.ReactNode}> = ({start, bg, left, children}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: 300,
        width: 810,
        height: 520,
        borderRadius: 24,
        backgroundColor: bg,
        padding: '44px 48px',
        boxSizing: 'border-box',
        ...fadeUp(frame, start, 20, 50),
      }}
    >
      {children}
    </div>
  );
};

const Line: React.FC<{start: number; children: React.ReactNode}> = ({start, children}) => {
  const frame = useCurrentFrame();
  return <div style={{...fadeUp(frame, start, 14, 14), fontSize: 30, lineHeight: 1.4, marginTop: 18}}>{children}</div>;
};

export const ProjektOderChat: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene>
      <Header pill="Grundidee" title="Projekt oder Chat?" />
      <Card start={14} bg={C.petrolLight} left={130}>
        <div style={{display: 'flex', gap: 34}}>
          <FolderIcon size={120} />
          <div>
            <div style={{fontSize: 24, letterSpacing: 4, fontWeight: 600, color: C.petrolDark}}>EINMAL EINRICHTEN</div>
            <div style={{fontSize: 56, fontWeight: 600, color: C.petrolDark, marginTop: 6}}>Projekt</div>
            <Line start={34}>ein Fach oder Bildungsgang</Line>
            <Line start={50}>
              <b>Anweisungen:</b> Wer ist deine Klasse? Wie soll die KI antworten?
            </Line>
            <Line start={66}>
              <b>Dateien:</b> Rahmenlehrplan, Jahresplanung, ein Musterblatt – alles ohne Namen
            </Line>
          </div>
        </div>
      </Card>
      <Card start={90} bg={C.grey} left={980}>
        <div style={{display: 'flex', gap: 34}}>
          <svg width="120" height="110" viewBox="0 0 120 110">
            <rect x="0" y="0" width="120" height="76" rx="12" fill={C.petrolMid} />
            <path d="M22 74 l-6 30 l30-30z" fill={C.petrolMid} />
            <rect x="20" y="22" width="78" height="10" rx="5" fill="#fff" />
            <rect x="20" y="44" width="52" height="10" rx="5" fill="#fff" />
          </svg>
          <div>
            <div style={{fontSize: 24, letterSpacing: 4, fontWeight: 600, color: C.petrolDark}}>JEDES MAL</div>
            <div style={{fontSize: 56, fontWeight: 600, color: C.petrolDark, marginTop: 6}}>Chat</div>
            <Line start={110}>eine Aufgabe</Line>
            <Line start={126}>Nur noch Aufgabe und Rückfrage. Den Rest kennt die KI aus dem Projekt.</Line>
          </div>
        </div>
      </Card>
      <div style={{position: 'absolute', left: 130, top: 860, fontSize: 32, ...fadeUp(frame, 170)}}>
        <b>Neues Thema?</b> Neuen Chat im selben Projekt öffnen.
      </div>
    </Scene>
  );
};

/* ================= 4 · Überblick ================= */

const steps = [
  {n: 1, t: 'Anlegen', d: 'Klarer Name, ein Projekt pro Fach oder Bildungsgang'},
  {n: 2, t: 'Anweisung', d: 'Muster einfügen, die Klammern ausfüllen'},
  {n: 3, t: 'Hochladen', d: 'Rahmenlehrplan und Musterblatt als PDF oder Word'},
  {n: 4, t: 'Testen', d: 'Neuer Chat im Projekt, erste Anfrage. Passt es?'},
];

export const Overview: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene>
      <Header pill="Fahrplan" title="Dein Projekt in vier Schritten" />
      {steps.map((s, i) => {
        const last = i === 3;
        return (
          <div
            key={s.n}
            style={{
              position: 'absolute',
              left: 130 + i * 425,
              top: 330,
              width: 395,
              height: 360,
              borderRadius: 22,
              padding: '36px 34px',
              boxSizing: 'border-box',
              backgroundColor: last ? C.petrol : C.petrolLight,
              color: last ? '#fff' : C.petrolDark,
              ...fadeUp(frame, 16 + i * 22, 18, 40),
            }}
          >
            <div style={{fontSize: 24, letterSpacing: 4, fontWeight: 600, color: last ? C.amber : C.petrolDark}}>
              SCHRITT {s.n}
            </div>
            <div style={{fontSize: 52, fontWeight: 600, marginTop: 12}}>{s.t}</div>
            <div style={{fontSize: 29, lineHeight: 1.4, marginTop: 14, color: last ? '#E6F3F1' : C.text}}>{s.d}</div>
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 130,
          top: 740,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          ...fadeUp(frame, 120),
        }}
      >
        <Pill bg={C.ink} color={C.amber} size={24}>Vorher</Pill>
        <div style={{fontSize: 32}}>Einmal in den Einstellungen das Training ausschalten.</div>
      </div>
    </Scene>
  );
};

/* ================= 9 · Datenschutz-Ampel ================= */

const rows = [
  {
    c: C.petrol,
    t: 'unbedenklich',
    d: 'Fachtexte, eigene Arbeitsblätter, Entwürfe ohne Namen, erfundene Fälle („eine Schülerin mit Sprachförderbedarf“)',
  },
  {c: C.amber, t: 'nur anonymisiert', d: 'Schülertexte ohne Namen und erkennbare Details, Beschreibung einer Lerngruppe, Konflikte in der Klasse'},
  {
    c: C.ink,
    t: 'unzulässig',
    d: 'Namen mit Noten, Diagnosen und Förderbedarfe Einzelner, Gutachten, Zeugnisbemerkungen, Kontaktdaten, Elternpost mit Namen',
  },
];

export const Ampel: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene>
      <Header pill="Datenschutz" title="Was darf ins Projekt?" />
      <div style={{position: 'absolute', left: 130, top: 290, fontSize: 32, ...fadeUp(frame, 10)}}>
        Claude nur für die Unterrichtsvorbereitung nutzen. Die Daten liegen auf US-Servern.
      </div>
      {rows.map((r, i) => (
        <div
          key={r.t}
          style={{
            position: 'absolute',
            left: 130,
            top: 380 + i * 160,
            width: 1660,
            height: 135,
            borderRadius: 16,
            backgroundColor: C.grey,
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            ...fadeUp(frame, 30 + i * 40, 18, 30),
          }}
        >
          <div style={{width: 16, alignSelf: 'stretch', backgroundColor: r.c}} />
          <div style={{width: 420, paddingLeft: 40, fontSize: 42, fontWeight: 600, color: i === 0 ? C.petrol : C.ink}}>{r.t}</div>
          <div style={{flex: 1, fontSize: 29, lineHeight: 1.35, paddingRight: 40}}>{r.d}</div>
        </div>
      ))}
      <Caption
        items={[
          {from: 160, to: 330, text: <>Faustregel für hochgeladene Dateien: <b>keine personenbezogenen Daten</b> – im Zweifel weglassen oder anonymisieren.</>},
        ]}
      />
      <Progress step={2} total={4} />
    </Scene>
  );
};

/* ================= 11 · Merke ================= */

export const Merke: React.FC = () => {
  const frame = useCurrentFrame();
  const chips = ['Keine personenbezogenen Daten', 'Training ausschalten', 'Jedes Ergebnis prüfen'];
  return (
    <Scene bg={C.amber}>
      <div style={{position: 'absolute', left: 130, top: 90, ...fadeUp(frame, 0)}}>
        <Pill bg={C.ink} color={C.amber}>Merke</Pill>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 130,
          top: 210,
          width: 1660,
          fontSize: 80,
          fontWeight: 600,
          color: C.ink,
          lineHeight: 1.15,
          ...fadeUp(frame, 8),
        }}
      >
        Ins Projekt gehört, was immer gilt. Im Chat bleiben nur Aufgabe und Rückfrage.
      </div>
      <div style={{position: 'absolute', left: 130, top: 470, display: 'flex', gap: 22}}>
        {chips.map((c, i) => (
          <div key={c} style={fadeUp(frame, 40 + i * 14)}>
            <Pill bg={C.ink} color={C.amber} size={28} style={{letterSpacing: 1.5, textTransform: 'none'}}>
              {c}
            </Pill>
          </div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 130,
          top: 620,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          padding: '28px 36px',
          borderRadius: 22,
          backgroundColor: 'rgba(24,32,32,.08)',
          ...fadeUp(frame, 100),
        }}
      >
        <Check size={52} color={C.ink} />
        <div style={{fontSize: 36, color: C.ink}}>
          <b>Dein Ergebnis:</b> ein Projekt für ein Fach – mit Anweisung und mindestens einer Datei.
        </div>
      </div>
    </Scene>
  );
};
