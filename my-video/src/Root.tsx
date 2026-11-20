import { ClaudeProjektComposition } from "./ClaudeProjekt/Video";
import { MyComposition } from "./Composition";
import { SkillsComposition } from "./Skills/Video";
import { WorkflowComposition } from "./Workflow/Video";
import { Modul4Composition } from "./Modul4/Video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <ClaudeProjektComposition />
      <SkillsComposition />
      <WorkflowComposition />
      <Modul4Composition />
    </>
  );
};
