export type LegacyProfileCandidate = {
  name: string;
};

/** Returns a profile name only when the legacy save contains recognizable state. */
export function getLegacyProfileCandidate(
  raw: string | null
): LegacyProfileCandidate | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed) ||
      typeof (parsed as { totalXp?: unknown }).totalXp !== "number" ||
      !Number.isFinite((parsed as { totalXp: number }).totalXp)
    ) {
      return null;
    }

    const savedName = (parsed as { userName?: unknown }).userName;
    return {
      name:
        typeof savedName === "string" && savedName.trim()
          ? savedName.trim().slice(0, 24)
          : "我的冒險",
    };
  } catch {
    return null;
  }
}
