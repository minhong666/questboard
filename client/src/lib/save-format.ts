export const SAVE_FORMAT = "questboard-save" as const;
export const CURRENT_SAVE_SCHEMA_VERSION = 2 as const;

export type SaveArchive = {
  format: typeof SAVE_FORMAT;
  schemaVersion: typeof CURRENT_SAVE_SCHEMA_VERSION;
  savedAt: number;
  profiles: unknown[];
  activeProfileId: string | null;
  boardSize: 3 | 4 | 5;
  discoveredEquipmentNames: string[];
  sharedAchievementClaimedIds: string[];
  notificationSettings: unknown;
  backgroundThemeId: string;
};

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};
}

function normalizeBoardSize(value: unknown): 3 | 4 | 5 {
  return value === 3 || value === 5 ? value : 4;
}

function normalizeStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function migrateToCurrent(value: unknown): SaveArchive {
  const source = asRecord(value);
  const legacyProfiles = Array.isArray(value)
    ? value
    : Array.isArray(source.profiles)
      ? source.profiles
      : [];
  const savedAt =
    typeof source.savedAt === "number" && Number.isFinite(source.savedAt)
      ? source.savedAt
      : Date.now();

  return {
    format: SAVE_FORMAT,
    schemaVersion: CURRENT_SAVE_SCHEMA_VERSION,
    savedAt,
    profiles: legacyProfiles,
    activeProfileId:
      typeof source.activeProfileId === "string"
        ? source.activeProfileId
        : null,
    boardSize: normalizeBoardSize(source.boardSize),
    discoveredEquipmentNames: normalizeStringArray(
      source.discoveredEquipmentNames
    ),
    sharedAchievementClaimedIds: normalizeStringArray(
      source.sharedAchievementClaimedIds
    ),
    notificationSettings: source.notificationSettings ?? null,
    backgroundThemeId:
      typeof source.backgroundThemeId === "string"
        ? source.backgroundThemeId
        : "midnight",
  };
}

export function createSaveArchive(
  input: Omit<SaveArchive, "format" | "schemaVersion">
): SaveArchive {
  return {
    format: SAVE_FORMAT,
    schemaVersion: CURRENT_SAVE_SCHEMA_VERSION,
    ...input,
  };
}

/**
 * Parse version 1/2 exports and migrate them to the current envelope.
 * Version 1 was either a bare profile array or an object without a schemaVersion.
 */
export function parseSaveArchive(raw: string): SaveArchive {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("存檔檔案不是有效的 JSON");
  }

  const source = asRecord(parsed);
  if (source.format !== undefined && source.format !== SAVE_FORMAT) {
    throw new Error("這不是 QuestBoard 存檔");
  }
  const version =
    typeof source.schemaVersion === "number" ? source.schemaVersion : 1;
  if (
    !Number.isInteger(version) ||
    version < 1 ||
    version > CURRENT_SAVE_SCHEMA_VERSION
  ) {
    throw new Error("不支援的 QuestBoard 存檔版本");
  }

  return migrateToCurrent(parsed);
}
