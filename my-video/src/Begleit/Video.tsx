import React from "react";
import { Composition, Series } from "remotion";
import { BeforeAfterScene, DUR, FormulaScene, IntroScene, MerkeScene, SortScene, TipsScene, TitleScene, ToolsScene } from "./Scenes";

const scenes: [keyof typeof DUR, React.FC][] = [
  ["title", TitleScene],
  ["intro", IntroScene],
  ["formula", FormulaScene],
  ["beforeAfter", BeforeAfterScene],
  ["tips", TipsScene],
  ["tools", ToolsScene],
  ["sort", SortScene],
  ["merke", MerkeScene],
];

export const BegleitVideo: React.FC = () => (
  <Series>
    {scenes.map(([key, Comp]) => (
      <Series.Sequence key={key} durationInFrames={DUR[key]}>
        <Comp />
      </Series.Sequence>
    ))}
  </Series>
);

export const BegleitComposition: React.FC = () => (
  <Composition
    id="PromptFormelUndWerkzeuge"
    component={BegleitVideo}
    durationInFrames={Object.values(DUR).reduce((a, b) => a + b, 0)}
    fps={30}
    width={1920}
    height={1080}
  />
);
