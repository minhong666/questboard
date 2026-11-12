import { describe, expect, it } from "vitest";
import {
  createSaveArchive,
  CURRENT_SAVE_SCHEMA_VERSION,
  parseSaveArchive,
} from "./save-format";

describe("save archive format", () => {
  it("creates the current versioned envelope", () => {
    const archive = createSaveArchive({
      savedAt: 123,
      profiles: [{ id: "save-1" }],
      activeProfileId: "save-1",
      boardSize: 5,
      discoveredEquipmentNames: ["晨星"],
      sharedAchievementClaimedIds: ["first"],
      notificationSettings: { enabled: true },
      backgroundThemeId: "forest",
    });

    expect(archive.format).toBe("questboard-save");
    expect(archive.schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
  });

  it("migrates a legacy bare profile array", () => {
    const archive = parseSaveArchive(JSON.stringify([{ id: "legacy" }]));
    expect(archive.schemaVersion).toBe(CURRENT_SAVE_SCHEMA_VERSION);
    expect(archive.profiles).toEqual([{ id: "legacy" }]);
    expect(archive.boardSize).toBe(4);
  });

  it("rejects invalid or future formats", () => {
    expect(() => parseSaveArchive("not-json")).toThrow("有效的 JSON");
    expect(() =>
      parseSaveArchive(JSON.stringify({ format: "other-game" }))
    ).toThrow("QuestBoard 存檔");
    expect(() =>
      parseSaveArchive(JSON.stringify({ schemaVersion: 99 }))
    ).toThrow("不支援");
  });
});
