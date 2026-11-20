import { ClaudeProjektComposition } from "./ClaudeProjekt/Video";
import { MyComposition } from "./Composition";
import { SkillsComposition } from "./Skills/Video";
import { WorkflowComposition } from "./Workflow/Video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <ClaudeProjektComposition />
      <SkillsComposition />
      <WorkflowComposition />
    </>
  );
};
