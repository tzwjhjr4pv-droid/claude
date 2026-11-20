import React from "react";
import { Composition, Series } from "remotion";
import { CardAScene, CardBScene, CardCScene, ClassRulesScene, DUR, MerkeScene, ProblemScene, RulesScene, TitleScene } from "./Scenes";

const scenes: [keyof typeof DUR, React.FC][] = [
  ["title", TitleScene],
  ["problem", ProblemScene],
  ["rules", RulesScene],
  ["cardA", CardAScene],
  ["cardB", CardBScene],
  ["cardC", CardCScene],
  ["classRules", ClassRulesScene],
  ["merke", MerkeScene],
];

export const Modul4Video: React.FC = () => (
  <Series>
    {scenes.map(([key, Comp]) => (
      <Series.Sequence key={key} durationInFrames={DUR[key]}>
        <Comp />
      </Series.Sequence>
    ))}
  </Series>
);

export const Modul4Composition: React.FC = () => (
  <Composition
    id="KiImKlassenraum"
    component={Modul4Video}
    durationInFrames={Object.values(DUR).reduce((a, b) => a + b, 0)}
    fps={30}
    width={1920}
    height={1080}
  />
);
