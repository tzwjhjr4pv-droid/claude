import { Composition, Series } from "remotion";
import {
  AlltagScene,
  BegriffeScene,
  DUR,
  MerkeScene,
  NachherScene,
  TitleScene,
  VorherScene,
  WaehrendScene,
} from "./Konditionierung/Scenes";

const total = Object.values(DUR).reduce((a, b) => a + b, 0);

export const MyComposition = () => {
  return (
    <Composition
      id="KlassischeKonditionierung"
      component={KlassischeKonditionierung}
      durationInFrames={total}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

export const KlassischeKonditionierung: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={DUR.title}>
        <TitleScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={DUR.vorher}>
        <VorherScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={DUR.waehrend}>
        <WaehrendScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={DUR.nachher}>
        <NachherScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={DUR.begriffe}>
        <BegriffeScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={DUR.alltag}>
        <AlltagScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={DUR.merke}>
        <MerkeScene />
      </Series.Sequence>
    </Series>
  );
};
