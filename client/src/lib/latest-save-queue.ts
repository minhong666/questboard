export type LatestSaveQueue<T> = {
  enqueue: (value: T) => void;
  dispose: () => void;
};

/**
 * Serializes writes and keeps only the newest pending snapshot while a write is
 * in flight. This prevents an older slow request from finishing after and
 * overwriting a newer snapshot from the same client.
 */
export function createLatestSaveQueue<T>(
  write: (value: T) => Promise<unknown>,
  onSuccess: (value: T) => void,
  onError: (error: unknown, value: T) => void
): LatestSaveQueue<T> {
  let pending: T | null = null;
  let running = false;
  let disposed = false;

  const drain = async () => {
    if (running || disposed) return;
    running = true;

    try {
      while (pending !== null && !disposed) {
        const current = pending;
        pending = null;
        try {
          await write(current);
        } catch (error) {
          if (pending === null && !disposed) onError(error, current);
          continue;
        }
        if (pending === null && !disposed) onSuccess(current);
      }
    } finally {
      running = false;
    }
  };

  return {
    enqueue(value) {
      if (disposed) return;
      pending = value;
      void drain();
    },
    dispose() {
      disposed = true;
      pending = null;
    },
  };
}
