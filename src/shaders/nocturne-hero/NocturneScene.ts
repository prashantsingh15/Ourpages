export const NOCTURNE_CONTROL_KEYS = ["starDensity", "glowFalloff", "spectralDrift", "nebulaTurbulence"] as const;
export type NocturneControlKey = (typeof NOCTURNE_CONTROL_KEYS)[number];
export const NOCTURNE_VARIANTS: readonly string[] = ["midnight", "golden-hour", "eclipse", "aurora"];
export type NocturneVariant = string;
export const NOCTURNE_TITLES: Record<string, string> = {
  midnight: "Nocturne — Where light bends to darkness",
};
export function buildNocturneDocument(...args: any[]): string {
  return "";
}
