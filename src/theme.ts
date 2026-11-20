import {continueRender, delayRender, staticFile} from 'remotion';

// Jost (SIL Open Font License) lokal eingebunden – geometrische Schrift ähnlich der Präsentation
const FAMILY = 'Jost';
if (typeof document !== 'undefined') {
  const handle = delayRender('Schrift laden');
  const faces = [
    new FontFace(FAMILY, `url(${staticFile('fonts/jost-latin.woff2')}) format('woff2')`, {
      weight: '100 900',
      unicodeRange:
        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
    }),
    new FontFace(FAMILY, `url(${staticFile('fonts/jost-latin-ext.woff2')}) format('woff2')`, {
      weight: '100 900',
    }),
  ];
  Promise.all(faces.map((f) => f.load()))
    .then((loaded) => {
      loaded.forEach((f) => document.fonts.add(f));
      continueRender(handle);
    })
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
}

export const FONT = `${FAMILY}, Inter, sans-serif`;

// Farben angelehnt an die Präsentation „KI-Startpaket · Modul 1“
export const C = {
  petrol: '#00756F',
  petrolDark: '#00504B',
  petrolMid: '#41A49E',
  petrolLight: '#E1EEED',
  amber: '#F4B03A',
  ink: '#182020',
  inkSoft: '#2A3536',
  bg: '#F9FAF9',
  grey: '#F3F4F3',
  greyLine: '#D3DAD9',
  text: '#1E2A2A',
  muted: '#5E6B6B',
  white: '#FFFFFF',
};

export const FPS = 30;
