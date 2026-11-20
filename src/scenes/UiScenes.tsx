import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {
  AppWindow,
  Caption,
  Check,
  clamp,
  Cursor,
  fadeUp,
  Header,
  Progress,
  Scene,
  SideNote,
  typed,
  usePop,
  WIN,
} from '../components/ui';
import {FileItem, PROJECT_NAME, ProjectPage} from '../components/ProjectPage';

const Breadcrumb: React.FC<{start: number; parts: string[]}> = ({start, parts}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', fontSize: 27}}>
      {parts.map((p, i) => (
        <React.Fragment key={p}>
          {i > 0 ? <span style={{color: C.muted, ...fadeUp(frame, start + i * 10, 10, 0)}}>›</span> : null}
          <span
            style={{
              padding: '6px 14px',
              borderRadius: 10,
              backgroundColor: '#fff',
              color: C.petrolDark,
              fontWeight: 500,
              ...fadeUp(frame, start + i * 10, 10, 10),
            }}
          >
            {p}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

/* ================= 5 · Training ausschalten ================= */

export const Training: React.FC = () => {
  const frame = useCurrentFrame();
  const clickF = 150;
  const on = frame < clickF + 4;
  const knob = interpolate(frame, [clickF + 2, clickF + 12], [1, 0], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const sections = ['Allgemein', 'Konto', 'Datenschutz', 'Funktionen'];
  const datenschutzActive = frame >= 80;
  return (
    <Scene>
      <Header pill="Vor dem Start" pillBg={C.ink} pillColor={C.amber} title="Training ausschalten" />
      <AppWindow start={6}>
        <div style={{position: 'absolute', inset: 0, padding: '34px 44px'}}>
          <div style={{fontSize: 38, fontWeight: 600, color: C.petrolDark}}>Einstellungen</div>
          <div style={{display: 'flex', marginTop: 26, gap: 40}}>
            <div style={{width: 230}}>
              {sections.map((s) => {
                const act = s === 'Datenschutz' ? datenschutzActive : s === 'Allgemein' && !datenschutzActive;
                return (
                  <div
                    key={s}
                    style={{
                      height: 52,
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: 18,
                      borderRadius: 12,
                      fontSize: 24,
                      backgroundColor: act ? C.petrolLight : 'transparent',
                      fontWeight: act ? 600 : 400,
                      color: act ? C.petrolDark : C.text,
                      marginBottom: 6,
                    }}
                  >
                    {s}
                  </div>
                );
              })}
            </div>
            <div style={{flex: 1, opacity: datenschutzActive ? 1 : 0.25}}>
              <div style={{fontSize: 28, fontWeight: 600}}>Datenschutz</div>
              <div
                style={{
                  marginTop: 22,
                  padding: '24px 26px',
                  borderRadius: 16,
                  border: `2px solid ${frame > 110 && frame < 230 ? C.amber : C.greyLine}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 30,
                }}
              >
                <div>
                  <div style={{fontSize: 26, fontWeight: 600}}>Claude verbessern</div>
                  <div style={{fontSize: 20, color: C.muted, marginTop: 6, lineHeight: 1.35}}>
                    Erlaube, dass deine Chats zum Training künftiger Modelle verwendet werden.
                  </div>
                </div>
                <div
                  style={{
                    width: 84,
                    height: 46,
                    borderRadius: 23,
                    backgroundColor: on ? C.petrol : C.greyLine,
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 5,
                      left: 5 + knob * 38,
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 4px rgba(0,0,0,.2)',
                    }}
                  />
                </div>
              </div>
              <div style={{marginTop: 18, fontSize: 22, color: C.muted, opacity: frame > clickF + 14 ? 1 : 0}}>
                Aus – deine Chats werden nicht zum Training verwendet.
              </div>
            </div>
          </div>
        </div>
        <Cursor
          keys={[
            {f: 30, x: 600, y: 500},
            {f: 70, x: 120, y: 245 - 48, click: true},
            {f: 120, x: 820, y: 240},
            {f: clickF, x: 860, y: 225, click: true},
            {f: 200, x: 900, y: 330},
          ]}
        />
      </AppWindow>
      <SideNote start={60} top={290} label="So geht's">
        <Breadcrumb start={70} parts={['Einstellungen', 'Datenschutz', '„Claude verbessern“ aus']} />
      </SideNote>
      <SideNote start={170} top={520} label="Warum?" variant="petrol">
        Was du in Projekte lädst, soll nicht zum Training der KI verwendet werden.
      </SideNote>
      <Caption
        items={[
          {from: 20, to: 140, text: 'Bevor du loslegst: Öffne die Einstellungen und gehe zu „Datenschutz“.'},
          {from: 140, to: 270, text: 'Schalte „Claude verbessern“ aus. Das musst du nur einmal machen.'},
        ]}
      />
    </Scene>
  );
};

/* ================= 6 · Schritt 1: Anlegen ================= */

export const Step1: React.FC = () => {
  const frame = useCurrentFrame();
  const clickProjects = 60;
  const clickNew = 120;
  const nameStart = 160;
  const descStart = 225;
  const clickCreate = 300;
  const modal = frame >= clickNew + 4 && frame < clickCreate + 6;
  const modalP = interpolate(frame, [clickNew + 4, clickNew + 16], [0, 1], clamp);
  const created = frame >= clickCreate + 6;
  const name = typed(PROJECT_NAME, frame, nameStart, 0.55);
  const desc = typed('Materialien für die 11. Klasse', frame, descStart, 0.75);
  const toast = usePop(clickCreate + 12);

  return (
    <Scene>
      <Header pill="Schritt 1" title="Projekt anlegen" />
      <AppWindow
        start={4}
        activeNav={frame >= clickProjects ? 'projekte' : null}
        projects={created ? [PROJECT_NAME] : []}
      >
        {!created && frame < clickProjects ? (
          <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontSize: 40, color: C.petrolDark, fontWeight: 500}}>Womit fangen wir an?</div>
            <div style={{marginTop: 30, width: 640, height: 96, borderRadius: 18, border: `2px solid ${C.greyLine}`}} />
          </div>
        ) : null}
        {!created && frame >= clickProjects ? (
          <div style={{position: 'absolute', inset: 0, padding: '30px 40px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{fontSize: 40, fontWeight: 600, color: C.petrolDark}}>Projekte</div>
              <div
                style={{
                  padding: '14px 24px',
                  borderRadius: 14,
                  backgroundColor: C.petrol,
                  color: '#fff',
                  fontSize: 24,
                  fontWeight: 600,
                  boxShadow: frame > 90 && frame < clickNew + 4 ? `0 0 0 4px ${C.amber}` : 'none',
                }}
              >
                + Neues Projekt
              </div>
            </div>
            <div
              style={{
                marginTop: 40,
                height: 200,
                borderRadius: 18,
                border: `2px dashed ${C.greyLine}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                color: C.muted,
              }}
            >
              Noch keine Projekte
            </div>
          </div>
        ) : null}
        {modal ? (
          <div style={{position: 'absolute', inset: 0, backgroundColor: `rgba(24,32,32,${0.35 * modalP})`}}>
            <div
              style={{
                position: 'absolute',
                left: 115,
                top: 50,
                width: 720,
                padding: '34px 40px',
                borderRadius: 22,
                backgroundColor: '#fff',
                boxSizing: 'border-box',
                opacity: modalP,
                transform: `scale(${0.94 + 0.06 * modalP})`,
              }}
            >
              <div style={{fontSize: 32, fontWeight: 600, color: C.petrolDark}}>Neues Projekt erstellen</div>
              <div style={{fontSize: 20, color: C.muted, marginTop: 24}}>Wie soll dein Projekt heißen?</div>
              <div
                style={{
                  marginTop: 8,
                  height: 62,
                  borderRadius: 12,
                  border: `2px solid ${frame >= nameStart - 10 && frame < descStart ? C.petrol : C.greyLine}`,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 18,
                  fontSize: 26,
                }}
              >
                {name}
                {frame >= nameStart - 10 && frame < descStart && frame % 30 < 15 ? <span style={{color: C.petrol}}>|</span> : null}
              </div>
              <div style={{fontSize: 20, color: C.muted, marginTop: 22}}>Worum geht es? (optional)</div>
              <div
                style={{
                  marginTop: 8,
                  height: 100,
                  borderRadius: 12,
                  border: `2px solid ${frame >= descStart ? C.petrol : C.greyLine}`,
                  padding: '16px 18px',
                  boxSizing: 'border-box',
                  fontSize: 24,
                }}
              >
                {desc}
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 28}}>
                <div style={{padding: '14px 24px', fontSize: 22, color: C.muted}}>Abbrechen</div>
                <div
                  style={{
                    padding: '14px 26px',
                    borderRadius: 14,
                    backgroundColor: C.petrol,
                    color: '#fff',
                    fontSize: 22,
                    fontWeight: 600,
                    boxShadow: frame > 270 ? `0 0 0 4px ${C.amber}` : 'none',
                  }}
                >
                  Projekt erstellen
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {created ? (
          <>
            <ProjectPage />
            <div
              style={{
                position: 'absolute',
                left: 230,
                bottom: 40,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 24px',
                borderRadius: 14,
                backgroundColor: C.ink,
                color: '#fff',
                fontSize: 22,
                transform: `translateY(${(1 - toast) * 80}px)`,
                opacity: toast,
              }}
            >
              <Check size={28} color={C.petrolMid} /> Projekt erstellt
            </div>
          </>
        ) : null}
        <Cursor
          keys={[
            {f: 20, x: 600, y: 520},
            {f: clickProjects, x: 110, y: 172, click: true},
            {f: 100, x: 1000, y: 120},
            {f: clickNew, x: 1040, y: 106, click: true},
            {f: 150, x: 520, y: 240, click: true},
            {f: 280, x: 880, y: 545},
            {f: clickCreate, x: 885, y: 540, click: true},
            {f: 360, x: 900, y: 600},
          ]}
        />
      </AppWindow>
      <SideNote start={100} top={290} label="Wo?">
        Seitenleiste › <b>Projekte</b> › <b>Neues Projekt</b>
      </SideNote>
      <SideNote start={190} top={470} label="Tipp" variant="petrol">
        Klarer Name, z. B. „{PROJECT_NAME}“. Ein Projekt pro Fach oder Bildungsgang.
      </SideNote>
      <Caption
        items={[
          {from: 20, to: 120, text: <>Links in der Seitenleiste findest du <b>Projekte</b>.</>},
          {from: 120, to: 300, text: <>Klicke auf <b>Neues Projekt</b> und gib einen klaren Namen ein.</>},
          {from: 300, to: 420, text: 'Fertig – das Projekt ist angelegt. Noch ist es leer.'},
        ]}
      />
      <Progress step={0} total={4} />
    </Scene>
  );
};

/* ================= 7 · Schritt 2: Anweisung ================= */

type Seg = {t: string} | {tpl: string; fill: string; at: number};

const SEGMENTS: Seg[] = [
  {t: '„Alles in diesem Projekt ist Unterricht in '},
  {tpl: '[Fach]', fill: 'Psychologie', at: 190},
  {t: ', '},
  {tpl: '[Bildungsgang, Klassenstufe]', fill: 'Fachoberschule Sozialwesen, Klasse 11', at: 250},
  {t: ', an einem Oberstufenzentrum. Die Lerngruppe: '},
  {
    tpl: '[Sprachstand, Vorwissen, Besonderheiten]',
    fill: 'gemischter Sprachstand, erstes Jahr Psychologie, viele Praxistage',
    at: 330,
  },
  {
    t: '. Orientiere dich am hochgeladenen Material: Der Rahmenlehrplan gibt die Inhalte vor, das Musterblatt zeigt Aufbau und Layout. Antworte knapp und frag nach, wenn dir für eine größere Aufgabe etwas Wichtiges fehlt.“',
  },
];

export const INSTRUCTION_SNIPPET =
  '„Alles in diesem Projekt ist Unterricht in Psychologie, Fachoberschule Sozialwesen, Klasse 11 …“';

export const Step2: React.FC = () => {
  const frame = useCurrentFrame();
  const clickEdit = 60;
  const pasteAt = 110;
  const clickSave = 470;
  const modal = frame >= clickEdit + 4 && frame < clickSave + 6;
  const modalP = interpolate(frame, [clickEdit + 4, clickEdit + 16], [0, 1], clamp);
  const pasted = interpolate(frame, [pasteAt, pasteAt + 10], [0, 1], clamp);
  const saved = frame >= clickSave + 6;

  return (
    <Scene>
      <Header pill="Schritt 2" title="Anweisung einfügen" />
      <AppWindow start={4} activeNav="projekte" projects={[PROJECT_NAME]}>
        <ProjectPage
          instructions={saved ? INSTRUCTION_SNIPPET : null}
          highlight={frame > 30 && frame < clickEdit + 4 ? 'anweisungen' : saved && frame < clickSave + 60 ? 'anweisungen' : null}
        />
        {modal ? (
          <div style={{position: 'absolute', inset: 0, backgroundColor: `rgba(24,32,32,${0.35 * modalP})`}}>
            <div
              style={{
                position: 'absolute',
                left: 40,
                top: 24,
                width: 870,
                height: 560,
                padding: '28px 36px',
                borderRadius: 22,
                backgroundColor: '#fff',
                boxSizing: 'border-box',
                opacity: modalP,
                transform: `scale(${0.94 + 0.06 * modalP})`,
              }}
            >
              <div style={{fontSize: 30, fontWeight: 600, color: C.petrolDark}}>Projektanweisungen</div>
              <div style={{fontSize: 19, color: C.muted, marginTop: 6}}>
                Was soll Claude in jedem Chat dieses Projekts wissen?
              </div>
              <div
                style={{
                  marginTop: 16,
                  height: 360,
                  borderRadius: 14,
                  border: `2px solid ${C.petrol}`,
                  padding: '18px 22px',
                  boxSizing: 'border-box',
                  fontSize: 23.5,
                  lineHeight: 1.5,
                  opacity: pasted,
                }}
              >
                {frame >= pasteAt
                  ? SEGMENTS.map((s, i) => {
                      if ('t' in s) return <span key={i}>{s.t}</span>;
                      const filling = frame >= s.at;
                      const txt = filling ? typed(s.fill, frame, s.at, 1.4) : s.tpl;
                      const done = filling && txt.length === s.fill.length;
                      return (
                        <span
                          key={i}
                          style={{
                            fontWeight: 600,
                            color: filling ? C.ink : C.petrol,
                            backgroundColor: filling ? (done ? '#FBE3B4' : C.amber) : C.petrolLight,
                            borderRadius: 6,
                            padding: '0 4px',
                          }}
                        >
                          {txt || ' '}
                        </span>
                      );
                    })
                  : null}
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 20}}>
                <div style={{padding: '12px 22px', fontSize: 22, color: C.muted}}>Abbrechen</div>
                <div
                  style={{
                    padding: '12px 26px',
                    borderRadius: 14,
                    backgroundColor: C.petrol,
                    color: '#fff',
                    fontSize: 22,
                    fontWeight: 600,
                    boxShadow: frame > 440 ? `0 0 0 4px ${C.amber}` : 'none',
                  }}
                >
                  Anweisungen speichern
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <Cursor
          keys={[
            {f: 20, x: 500, y: 500},
            {f: clickEdit, x: 1120, y: 98, click: true},
            {f: 95, x: 500, y: 300},
            {f: pasteAt, x: 500, y: 300, click: true},
            {f: 180, x: 760, y: 220},
            {f: 440, x: 1020, y: 570},
            {f: clickSave, x: 1030, y: 565, click: true},
            {f: 540, x: 1060, y: 420},
          ]}
        />
      </AppWindow>
      <SideNote start={70} top={290} label="Wo?">
        Im Projekt › <b>Anweisungen</b> › Stift-Symbol
      </SideNote>
      <SideNote start={150} top={450} label="Vorlage" variant="petrol">
        Muster-Anweisung aus dem Merkblatt einfügen – dann die <span style={{color: C.amber, fontWeight: 600}}>drei Klammern</span> ausfüllen.
      </SideNote>
      <SideNote start={400} top={680} label="Achtung" variant="amber">
        Die Lerngruppe beschreiben – ohne Namen.
      </SideNote>
      <Caption
        items={[
          {from: 20, to: 110, text: <>Öffne im Projekt die <b>Anweisungen</b>.</>},
          {from: 110, to: 185, text: 'Füge die Muster-Anweisung ein. Die Klammern sind Platzhalter.'},
          {from: 185, to: 250, text: <>Erste Klammer: dein <b>Fach</b>.</>},
          {from: 250, to: 330, text: <>Zweite Klammer: <b>Bildungsgang und Klassenstufe</b>.</>},
          {from: 330, to: 470, text: <>Dritte Klammer: Was zeichnet die <b>Lerngruppe</b> aus?</>},
          {from: 470, to: 660, text: 'Speichern – ab jetzt gilt diese Anweisung in jedem Chat dieses Projekts.'},
        ]}
      />
      <Progress step={1} total={4} />
    </Scene>
  );
};

/* ================= 8 · Schritt 3: Hochladen ================= */

export const Step3: React.FC = () => {
  const frame = useCurrentFrame();
  const clickPlus = 55;
  const clickUpload = 100;
  const menu = frame >= clickPlus + 4 && frame < clickUpload + 6;
  const menuP = interpolate(frame, [clickPlus + 4, clickPlus + 12], [0, 1], clamp);
  const files: FileItem[] = [
    {name: 'Rahmenlehrplan_Psychologie.pdf', type: 'PDF', from: 130},
    {name: 'Musterblatt_Arbeitsblatt.docx', type: 'DOCX', from: 175},
  ];
  // fliegende Dateien von rechts unten ins Fenster
  const fly = (start: number) =>
    interpolate(frame, [start - 30, start], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

  return (
    <Scene>
      <Header pill="Schritt 3" title="Material hochladen" />
      <AppWindow start={4} activeNav="projekte" projects={[PROJECT_NAME]}>
        <ProjectPage
          instructions={INSTRUCTION_SNIPPET}
          files={files}
          highlight={frame > 25 && frame < 240 ? 'dateien' : null}
        />
        {menu ? (
          <div
            style={{
              position: 'absolute',
              left: 820,
              top: 140,
              width: 300,
              borderRadius: 16,
              backgroundColor: '#fff',
              boxShadow: '0 12px 30px rgba(0,0,0,.18)',
              padding: 10,
              opacity: menuP,
            }}
          >
            {['Vom Gerät hochladen', 'Text hinzufügen', 'Aus Google Drive'].map((m, i) => (
              <div
                key={m}
                style={{
                  height: 52,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 16,
                  fontSize: 22,
                  borderRadius: 10,
                  backgroundColor: i === 0 && frame > 85 ? C.petrolLight : 'transparent',
                }}
              >
                {m}
              </div>
            ))}
          </div>
        ) : null}
        <Cursor
          keys={[
            {f: 15, x: 500, y: 520},
            {f: clickPlus, x: 1120, y: 300, click: true},
            {f: 85, x: 960, y: 210},
            {f: clickUpload, x: 965, y: 215, click: true},
            {f: 200, x: 1080, y: 560},
          ]}
        />
      </AppWindow>
      {/* fliegende Datei-Symbole */}
      {[0, 1].map((i) => {
        const p = fly(files[i].from);
        if (p <= 0 || p >= 1) return null;
        const sx = 1500;
        const sy = 900;
        const tx = WIN.x + WIN.side + 670;
        const ty = WIN.y + WIN.bar + 330 + i * 70;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: sx + (tx - sx) * p,
              top: sy + (ty - sy) * p - Math.sin(p * Math.PI) * 140,
              width: 70,
              height: 84,
              borderRadius: 10,
              backgroundColor: i === 0 ? C.petrolDark : C.petrolMid,
              color: '#fff',
              fontSize: 18,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: 10,
              boxSizing: 'border-box',
              transform: `rotate(${(1 - p) * 20}deg) scale(${1 - p * 0.4})`,
              zIndex: 50,
            }}
          >
            {files[i].type}
          </div>
        );
      })}
      <SideNote start={60} top={290} label="Wo?">
        Im Projekt › <b>Dateien</b> › <b>+</b>
      </SideNote>
      <SideNote start={150} top={450} label="Was?" variant="petrol">
        Rahmenlehrplan (Inhalte) und ein Musterblatt (Aufbau, Layout) – als PDF oder Word.
      </SideNote>
      <SideNote start={260} top={690} label="Tipp" variant="amber">
        In der Anweisung sagen, wofür jede Datei da ist.
      </SideNote>
      <Caption
        items={[
          {from: 15, to: 120, text: <>Jetzt das Material: Klicke bei <b>Dateien</b> auf das Plus.</>},
          {from: 120, to: 250, text: 'Lade den Rahmenlehrplan und ein Musterblatt hoch.'},
          {from: 250, to: 480, text: 'Die KI greift in jedem Chat dieses Projekts darauf zurück. Alles ohne Schülernamen!'},
        ]}
      />
      <Progress step={2} total={4} />
    </Scene>
  );
};

/* ================= 10 · Schritt 4: Testen ================= */

const PROMPT =
  'Erstelle ein Arbeitsblatt zum Vier-Seiten-Modell. Was du wissen musst: 45 Minuten, Einzelarbeit. Stelle mir so lange Rückfragen, bis alles klar ist.';

const ANSWER_LINES = [
  'Gern! Ich orientiere mich am Musterblatt und an den Vorgaben des Rahmenlehrplans für Psychologie, FOS 11.',
  'Zwei Rückfragen, bevor ich loslege:',
  '1. Soll das Fallbeispiel aus einem sozialen Berufsfeld kommen, z. B. aus der Kita?',
  '2. Brauchst du ein Lösungsblatt dazu?',
];

export const Step4: React.FC = () => {
  const frame = useCurrentFrame();
  const clickInput = 45;
  const typeStart = 60;
  const send = 200;
  const chatView = frame >= send;
  const prompt = typed(PROMPT, frame, typeStart, 1.15);
  const answerStart = send + 40;

  return (
    <Scene>
      <Header pill="Schritt 4" title="Testen" />
      <AppWindow start={4} activeNav="projekte" projects={[PROJECT_NAME]}>
        {!chatView ? (
          <ProjectPage
            instructions={INSTRUCTION_SNIPPET}
            files={[
              {name: 'Rahmenlehrplan_Psychologie.pdf', type: 'PDF', from: -100},
              {name: 'Musterblatt_Arbeitsblatt.docx', type: 'DOCX', from: -100},
            ]}
            highlight={frame > 20 && frame < send ? 'chat' : null}
            chatText={frame >= typeStart ? prompt : ''}
          />
        ) : (
          <div style={{position: 'absolute', inset: 0, padding: '24px 40px'}}>
            <div style={{fontSize: 20, color: C.muted}}>
              {PROJECT_NAME} › <span style={{color: C.petrolDark, fontWeight: 600}}>Arbeitsblatt Vier-Seiten-Modell</span>
            </div>
            <div
              style={{
                marginLeft: 220,
                marginTop: 20,
                padding: '16px 22px',
                borderRadius: 18,
                backgroundColor: C.petrolLight,
                fontSize: 22,
                lineHeight: 1.4,
                ...fadeUp(frame, send, 12, 20),
              }}
            >
              {PROMPT}
            </div>
            <div style={{display: 'flex', gap: 18, marginTop: 26}}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  backgroundColor: C.amber,
                  flexShrink: 0,
                  ...fadeUp(frame, send + 20, 10, 0),
                }}
              />
              <div style={{fontSize: 23, lineHeight: 1.45}}>
                {frame >= send + 20 && frame < answerStart ? (
                  <span style={{color: C.muted}}>{'• • •'.slice(0, 1 + ((frame >> 3) % 3) * 2)}</span>
                ) : null}
                {ANSWER_LINES.map((l, i) => {
                  const s = answerStart + i * 28;
                  if (frame < s) return null;
                  return (
                    <div
                      key={i}
                      style={{
                        marginTop: i === 0 ? 0 : 10,
                        fontWeight: i === 1 ? 600 : 400,
                        ...fadeUp(frame, s, 10, 8),
                      }}
                    >
                      {l}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        <Cursor
          keys={[
            {f: 10, x: 800, y: 520},
            {f: clickInput, x: 520, y: 260, click: true},
            {f: 180, x: 790, y: 300},
            {f: send - 4, x: 790, y: 300, click: true},
            {f: 260, x: 1100, y: 600},
          ]}
        />
      </AppWindow>
      <SideNote start={answerStart + 10} top={290} label="kennt Fach & Klasse">
        … aus der <b>Anweisung</b>
      </SideNote>
      <SideNote start={answerStart + 40} top={445} label="nutzt Material">
        … aus den <b>Dateien</b>
      </SideNote>
      <SideNote start={answerStart + 80} top={600} label="fragt nach" variant="petrol">
        … weil du <b>Rückfragen</b> erlaubt hast
      </SideNote>
      <Caption
        items={[
          {from: 15, to: send, text: 'Öffne einen neuen Chat im Projekt und stelle eine echte Anfrage.'},
          {from: send, to: answerStart + 130, text: 'Du musst Fach und Klasse nicht mehr erklären – das steht schon im Projekt.'},
          {from: answerStart + 130, to: 540, text: <>Passt es? Sonst <b>Anweisung nachschärfen</b> – und jedes Ergebnis prüfen.</>},
        ]}
      />
      <Progress step={3} total={4} />
    </Scene>
  );
};
