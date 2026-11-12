import { describe, expect, it } from "vitest";
import { getLegacyProfileCandidate } from "./profile-migration";

describe("legacy profile migration", () => {
  it("recognizes a saved character and keeps its name", () => {
    expect(
      getLegacyProfileCandidate(
        JSON.stringify({ totalXp: 4200, userName: "  勇者小明  " })
      )
    ).toEqual({ name: "勇者小明" });
  });

  it("uses a default name when the legacy save has no usable name", () => {
    expect(getLegacyProfileCandidate(JSON.stringify({ totalXp: 0 }))).toEqual({
      name: "我的冒險",
    });
  });

  it.each([null, "", "not-json", "[]", "{}", "{\"totalXp\":\"1\"}"])(
    "ignores missing or invalid legacy saves: %s",
    raw => {
      expect(getLegacyProfileCandidate(raw)).toBeNull();
    }
  );
});
