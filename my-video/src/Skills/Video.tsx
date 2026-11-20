import React from "react";
import { Composition, Series } from "remotion";
import {
  CompareScene,
  DUR,
  MerkeScene,
  PrivacyScene,
  ProblemScene,
  Step1Scene,
  Step2Scene,
  Step3Scene,
  Step4Scene,
  TitleScene,
  UsageScene,
  WorthScene,
} from "./Scenes";

const scenes: [keyof typeof DUR, React.FC][] = [
  ["title", TitleScene],
  ["problem", ProblemScene],
  ["compare", CompareScene],
  ["step1", Step1Scene],
  ["step2", Step2Scene],
  ["step3", Step3Scene],
  ["step4", Step4Scene],
  ["usage", UsageScene],
  ["worth", WorthScene],
  ["privacy", PrivacyScene],
  ["merke", MerkeScene],
];

export const SkillsVideo: React.FC = () => (
  <Series>
    {scenes.map(([key, Comp]) => (
      <Series.Sequence key={key} durationInFrames={DUR[key]}>
        <Comp />
      </Series.Sequence>
    ))}
  </Series>
);

export const SkillsComposition: React.FC = () => (
  <Composition
    id="SkillsWiederkehrendeAufgaben"
    component={SkillsVideo}
    durationInFrames={Object.values(DUR).reduce((a, b) => a + b, 0)}
    fps={30}
    width={1920}
    height={1080}
  />
);
