import type { NeedId } from "./types";

export type Question = {
  id: string;
  prompt: string;
  options: { value: string; label: string }[];
  showIf?: (needs: NeedId[]) => boolean;
};

export const FOLLOW_UP_QUESTIONS: Question[] = [
  {
    id: "caringUnpaid",
    prompt: "Are you currently providing regular unpaid care for someone?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not_sure", label: "Not sure" },
    ],
    showIf: (needs) => needs.includes("caring"),
  },
  {
    id: "moneyPressure",
    prompt: "Is money, rent or bills part of what is feeling difficult?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not_sure", label: "Not sure" },
    ],
    showIf: (needs) => needs.includes("money") || needs.includes("caring"),
  },
  {
    id: "workSituation",
    prompt: "What is closest to your work or training situation?",
    options: [
      { value: "job_lost", label: "I have lost work, or hours have reduced" },
      { value: "looking", label: "I want work, training or a next step" },
      { value: "stable", label: "Work is okay for now" },
      { value: "not_sure", label: "Not sure" },
    ],
    showIf: (needs) => needs.includes("work") || needs.includes("caring"),
  },
  {
    id: "digitalConfidence",
    prompt: "How confident do you feel using websites and online forms?",
    options: [
      { value: "low", label: "Not confident — I would like help" },
      { value: "ok", label: "I can manage with clear instructions" },
      { value: "high", label: "I am comfortable online" },
    ],
  },
  {
    id: "travel",
    prompt: "Is getting there (travel) likely to be a problem?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not_sure", label: "Not sure" },
    ],
  },
];

export function questionsForNeeds(needs: NeedId[]) {
  return FOLLOW_UP_QUESTIONS.filter(
    (question) => !question.showIf || question.showIf(needs),
  );
}

export function refineNeeds(
  needs: NeedId[],
  answers: Record<string, string>,
): NeedId[] {
  const next = new Set(needs);
  if (answers.caringUnpaid === "yes") next.add("caring");
  if (answers.moneyPressure === "yes") next.add("money");
  if (answers.workSituation === "job_lost" || answers.workSituation === "looking") {
    next.add("work");
  }
  if (answers.digitalConfidence === "low") next.add("digital");
  if (answers.travel === "yes") next.add("independent");
  return Array.from(next);
}
