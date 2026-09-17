import type { NeedId } from "./types";

export const NEED_COPY: Record<
  NeedId,
  { label: string; short: string; pathwayTitle: string }
> = {
  money: {
    label: "Money and bills",
    short: "Money",
    pathwayTitle: "Financial support",
  },
  work: {
    label: "Work, training and skills",
    short: "Work",
    pathwayTitle: "Employment and skills",
  },
  caring: {
    label: "Caring for someone",
    short: "Caring",
    pathwayTitle: "Carer support",
  },
  digital: {
    label: "Using phones, computers or the internet",
    short: "Digital access",
    pathwayTitle: "Digital assistance",
  },
  community: {
    label: "Feeling isolated or wanting local connection",
    short: "Community",
    pathwayTitle: "Community connection",
  },
  independent: {
    label: "Living independently, including travel",
    short: "Independent living",
    pathwayTitle: "Independent living and travel",
  },
};

export const NEED_ORDER: NeedId[] = [
  "money",
  "work",
  "caring",
  "digital",
  "community",
  "independent",
];
