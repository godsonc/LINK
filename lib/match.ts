import { SERVICES } from "./catalog";
import { localityById } from "./localities";
import { NEED_COPY } from "./needs";
import type {
  LocalityId,
  Match,
  NeedId,
  NextStep,
  PathwayStep,
  Service,
  SessionState,
} from "./types";

function applyOverrides(
  service: Service,
  overrides: SessionState extends never ? never : Record<string, Partial<Service>>,
): Service {
  return { ...service, ...overrides[service.id] };
}

export function rankServices(input: {
  needs: NeedId[];
  locality: LocalityId;
  answers: Record<string, string>;
  overrides?: Record<string, Partial<Service>>;
}): Match[] {
  const place = localityById(input.locality);
  const wantsPhone =
    input.answers.digitalConfidence === "low" ||
    input.answers.channel === "phone";
  const rural = place.rural || input.answers.rural === "yes";

  const matches: Match[] = SERVICES.map((raw) => {
    const service = applyOverrides(raw, input.overrides ?? {});
    if (service.verification !== "verified") return null;

    const overlap = service.categories.filter((need) =>
      input.needs.includes(need),
    );
    if (overlap.length === 0) return null;

    let score = overlap.length * 12;
    const reasons: string[] = [
      `Helps with ${overlap.map((need) => NEED_COPY[need].short.toLowerCase()).join(" and ")}.`,
    ];

    if (service.locality === input.locality) {
      score += 20;
      reasons.push(`Based in ${place.name}.`);
    } else if (service.district === place.district) {
      score += 12;
      reasons.push(`Serves ${place.district}.`);
    } else if (service.locality === "online" || service.phoneAndOnline) {
      score += 6;
      reasons.push("Can be reached by phone or online.");
    } else {
      score += Math.max(0, 10 - Math.round(service.milesFromPilotHub / 8));
    }

    if (service.cost === "free") {
      score += 5;
      reasons.push("Free to use.");
    }
    if (service.capacity === "available") score += 6;
    if (service.capacity === "limited") {
      score += 2;
      reasons.push("Spaces are limited.");
    }
    if (service.capacity === "full") {
      score -= 20;
      reasons.push("Currently full — we still list an alternative.");
    }
    if (rural && service.ruralReach) {
      score += 8;
      reasons.push("Can reach rural households.");
    }
    if (wantsPhone && service.phoneAndOnline) {
      score += 5;
      reasons.push("Telephone access is available.");
    }
    if (!service.acceptingReferrals) score -= 8;

    const eligibilityPhrase =
      "Based on the information you have given, you may be eligible. The organisation makes the final decision.";

    return {
      serviceId: service.id,
      score,
      reasons,
      eligibilityPhrase,
    } satisfies Match;
  })
    .filter((item): item is Match => Boolean(item))
    .sort((a, b) => b.score - a.score);

  return matches;
}

export function buildPathway(
  needs: NeedId[],
  matches: Match[],
): PathwayStep[] {
  return needs.map((needId) => {
    const match = matches.find((item) => {
      const service = SERVICES.find((row) => row.id === item.serviceId);
      return service?.categories.includes(needId);
    });
    return {
      needId,
      title: NEED_COPY[needId].pathwayTitle,
      serviceId: match?.serviceId ?? matches[0]?.serviceId ?? SERVICES[0].id,
      why: match
        ? "Potential support identified from the verified local directory."
        : "We could not find a perfect local match, so a navigator can help find an alternative.",
    };
  });
}

export function buildNextSteps(
  pathway: PathwayStep[],
  matches: Match[],
): NextStep[] {
  const first = pathway[0];
  const second = pathway[1];
  const top = matches[0];
  const steps: NextStep[] = [];

  if (first) {
    steps.push({
      id: "contact",
      title: "Take the first practical step",
      detail: `Start with ${NEED_COPY[first.needId].short.toLowerCase()} — this is usually the fastest way to reduce pressure.`,
      serviceId: first.serviceId,
    });
  }
  if (second) {
    steps.push({
      id: "prepare",
      title: "Prepare what you need for the next service",
      detail:
        "Gather any letters, bills or ID you already have. You do not need everything to begin.",
      serviceId: second.serviceId,
    });
  } else if (top) {
    steps.push({
      id: "prepare",
      title: "Prepare a short list of questions",
      detail:
        "Write down what you want help with. A navigator can do this with you if it feels too much.",
      serviceId: top.serviceId,
    });
  }
  steps.push({
    id: "human",
    title: "Ask a Community Navigator if you get stuck",
    detail:
      "If forms, travel or phone calls feel difficult, a person can help you complete the next step.",
  });
  return steps.slice(0, 3);
}
