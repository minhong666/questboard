export const ESCAPE_FAILURE_CHANCE = 0.3;

export function isEscapeSuccessful(randomValue: number): boolean {
  return randomValue >= ESCAPE_FAILURE_CHANCE;
}
