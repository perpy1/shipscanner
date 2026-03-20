import { Idea } from "@/types";
import { IdeaCardModal } from "./idea-card-modal";

export function IdeaCard({ idea }: { idea: Idea }) {
  return <IdeaCardModal idea={idea} />;
}
