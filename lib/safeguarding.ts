const CRISIS_PATTERNS = [
  /suicid/i,
  /kill myself/i,
  /end my life/i,
  /want to die/i,
  /hurt myself/i,
  /self[- ]harm/i,
  /going to hurt/i,
  /\b999\b/,
  /immediate danger/i,
  /being (hit|hurt|beaten)/i,
  /domestic abuse/i,
  /he hits me/i,
  /she hits me/i,
  /child (is |in )?danger/i,
  /being abused/i,
  /sexual abuse/i,
  /don't feel safe/i,
  /do not feel safe/i,
  /not safe at home/i,
];

export function detectSafeguarding(text: string) {
  return CRISIS_PATTERNS.some((pattern) => pattern.test(text));
}
