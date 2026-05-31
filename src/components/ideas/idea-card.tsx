import { Idea } from "@/types";
import { IdeaCardModal } from "./idea-card-modal";

export function IdeaCard({ idea, index, featured }: { idea: Idea; index?: number; featured?: boolean }) {
  return <IdeaCardModal idea={idea} index={index} featured={featured} />;
}
