import React from 'react';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {Ampel, Intro, Merke, Overview, Problem, ProjektOderChat} from './scenes/TextScenes';
import {Step1, Step2, Step3, Step4, Training} from './scenes/UiScenes';

const T = 15; // Überblendung in Frames

export const SCENES: {c: React.FC; d: number}[] = [
  {c: Intro, d: 180},
  {c: Problem, d: 270},
  {c: ProjektOderChat, d: 300},
  {c: Overview, d: 240},
  {c: Training, d: 270},
  {c: Step1, d: 420},
  {c: Step2, d: 660},
  {c: Step3, d: 480},
  {c: Ampel, d: 330},
  {c: Step4, d: 540},
  {c: Merke, d: 300},
];

export const TOTAL = SCENES.reduce((a, s) => a + s.d, 0) - T * (SCENES.length - 1);

export const Video: React.FC = () => (
  <TransitionSeries>
    {SCENES.flatMap(({c: C, d}, i) => {
      const seq = (
        <TransitionSeries.Sequence key={`s${i}`} durationInFrames={d}>
          <C />
        </TransitionSeries.Sequence>
      );
      return i === 0
        ? [seq]
        : [<TransitionSeries.Transition key={`t${i}`} presentation={fade()} timing={linearTiming({durationInFrames: T})} />, seq];
    })}
  </TransitionSeries>
);
