import { NEED_COPY, NEED_ORDER } from "./needs";
import { detectSafeguarding } from "./safeguarding";
import type { ClassifiedNeed, NeedId } from "./types";

const SIGNALS: Record<NeedId, RegExp[]> = {
  money: [
    /bill/i,
    /rent/i,
    /debt/i,
    /money/i,
    /afford/i,
    /broke/i,
    /universal credit/i,
    /benefit/i,
    /food bank/i,
    /behind on/i,
    /struggling financially/i,
    /pay(ing)? (the )?(bills|rent)/i,
  ],
  work: [
    /job/i,
    /unemploy/i,
    /work/i,
    /hours/i,
    /college/i,
    /apprentice/i,
    /cv\b/i,
    /career/i,
    /training/i,
    /left school/i,
    /don't know what to do/i,
    /redundan/i,
  ],
  caring: [
    /carer/i,
    /caring/i,
    /look after/i,
    /looking after/i,
    /husband/i,
    /wife/i,
    /mum/i,
    /mother/i,
    /dad/i,
    /father/i,
    /partner/i,
    /exhausted/i,
    /respite/i,
  ],
  digital: [
    /computer/i,
    /internet/i,
    /online/i,
    /smartphone/i,
    /digital/i,
    /can't use/i,
    /cannot use/i,
    /form/i,
    /wifi/i,
    /wi-fi/i,
  ],
  community: [
    /lonely/i,
    /isolat/i,
    /on my own/i,
    /nobody/i,
    /friends/i,
    /company/i,
    /village/i,
    /left out/i,
  ],
  independent: [
    /travel/i,
    /bus/i,
    /transport/i,
    /drive/i,
    /can't get there/i,
    /cannot get there/i,
    /rural/i,
    /live alone/i,
    /stairs/i,
    /home/i,
    /housing/i,
  ],
};

export function classifyStory(story: string): {
  safeguarding: boolean;
  needs: ClassifiedNeed[];
} {
  const text = story.trim();
  const safeguarding = detectSafeguarding(text);
  const scores = NEED_ORDER.map((id) => {
    const hits = SIGNALS[id].filter((pattern) => pattern.test(text));
    return {
      id,
      label: NEED_COPY[id].label,
      score: hits.length,
      reason:
        hits.length > 0
          ? `We noticed language about ${NEED_COPY[id].short.toLowerCase()}.`
          : "",
    };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scores.length === 0 && text.length > 0) {
    return {
      safeguarding,
      needs: [
        {
          id: "community",
          label: NEED_COPY.community.label,
          score: 1,
          reason:
            "We were not sure of the main issue, so we included community support as a starting point.",
        },
      ],
    };
  }

  return { safeguarding, needs: scores };
}
