import React from "react";
import { Composition, Series } from "remotion";
import { ChainScene, DemoScene, DUR, MerkeScene, ProblemScene, SelfScene, ShareScene, TitleScene } from "./Scenes";

const scenes: [keyof typeof DUR, React.FC][] = [
  ["title", TitleScene],
  ["problem", ProblemScene],
  ["chain", ChainScene],
  ["demo", DemoScene],
  ["share", ShareScene],
  ["self", SelfScene],
  ["merke", MerkeScene],
];

export const WorkflowVideo: React.FC = () => (
  <Series>
    {scenes.map(([key, Comp]) => (
      <Series.Sequence key={key} durationInFrames={DUR[key]}>
        <Comp />
      </Series.Sequence>
    ))}
  </Series>
);

export const WorkflowComposition: React.FC = () => (
  <Composition
    id="WorkflowReiheStundeMaterial"
    component={WorkflowVideo}
    durationInFrames={Object.values(DUR).reduce((a, b) => a + b, 0)}
    fps={30}
    width={1920}
    height={1080}
  />
);
