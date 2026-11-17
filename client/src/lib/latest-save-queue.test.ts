import { describe, expect, it, vi } from "vitest";
import { createLatestSaveQueue } from "./latest-save-queue";

describe("latest save queue", () => {
  it("serializes writes and coalesces pending snapshots to the newest one", async () => {
    let finishFirst!: () => void;
    const firstWrite = new Promise<void>(resolve => {
      finishFirst = resolve;
    });
    const writes: string[] = [];
    const queue = createLatestSaveQueue(
      async value => {
        writes.push(value);
        if (value === "first") await firstWrite;
      },
      vi.fn(),
      vi.fn()
    );

    queue.enqueue("first");
    expect(writes).toEqual(["first"]);

    queue.enqueue("stale-pending");
    queue.enqueue("latest");
    expect(writes).toEqual(["first"]);

    finishFirst();
    await vi.waitFor(() => expect(writes).toEqual(["first", "latest"]));
    queue.dispose();
  });

  it("continues with a newer snapshot after a write fails", async () => {
    const writes: string[] = [];
    const onError = vi.fn();
    const queue = createLatestSaveQueue(
      async value => {
        writes.push(value);
        if (value === "first") {
          await Promise.resolve();
          throw new Error("temporary failure");
        }
      },
      vi.fn(),
      onError
    );

    queue.enqueue("first");
    queue.enqueue("latest");

    await vi.waitFor(() => expect(writes).toEqual(["first", "latest"]));
    expect(onError).not.toHaveBeenCalled();
    queue.dispose();
  });
});
