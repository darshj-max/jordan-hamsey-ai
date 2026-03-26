export type Personality =
  | "Gordon Ramsay"
  | "Italian Chef"
  | "Grandma's Kitchen"
  | "Street Food Chef"
  | "Minimalist Chef";

export const PERSONALITIES: Personality[] = [
  "Gordon Ramsay",
  "Italian Chef",
  "Grandma's Kitchen",
  "Street Food Chef",
  "Minimalist Chef",
];

export const PERSONALITY_EMOJIS: Record<Personality, string> = {
  "Gordon Ramsay": "🔥",
  "Italian Chef": "🇮🇹",
  "Grandma's Kitchen": "🤗",
  "Street Food Chef": "🌮",
  "Minimalist Chef": "⚪",
};

const gordonPrefixes = [
  "LISTEN UP! ",
  "Pay attention! ",
  "This is CRITICAL — ",
  "Don't you dare skip this step: ",
  "This is where home cooks fail — ",
  "Absolutely beautiful — ",
  "Come on! Focus! ",
];

const italianPrefixes = [
  "Mamma mia! ",
  "Caro mio, ",
  "Like my Nonna always said: ",
  "Bellissimo! ",
  "With passion! ",
  "Nonna would cry with joy — ",
  "Per favore! ",
];

const grandmaPrefixes = [
  "Now sweetheart, ",
  "The secret, honey, is — ",
  "Just like I used to make — ",
  "Don't rush this, dear — ",
  "A little love goes a long way: ",
  "My mother always said: ",
  "You're doing wonderfully! ",
];

const streetPrefixes = [
  "Aight, real talk: ",
  "Check it — ",
  "No cap, ",
  "Pro move right here: ",
  "Street tip: ",
  "Straight up: ",
  "Real ones know: ",
];

export function applyPersonality(
  step: string,
  personality: Personality,
  index: number,
): string {
  switch (personality) {
    case "Gordon Ramsay":
      return `${gordonPrefixes[index % gordonPrefixes.length]}${step}`;
    case "Italian Chef":
      return `${italianPrefixes[index % italianPrefixes.length]}${step}`;
    case "Grandma's Kitchen":
      return `${grandmaPrefixes[index % grandmaPrefixes.length]}${step}`;
    case "Street Food Chef":
      return `${streetPrefixes[index % streetPrefixes.length]}${step}`;
    case "Minimalist Chef":
      return `${step.split(".")[0]}.`;
    default:
      return step;
  }
}

export function applyPersonalityToSteps(
  steps: string[],
  personality: Personality,
): string[] {
  return steps.map((s, i) => applyPersonality(s, personality, i));
}
