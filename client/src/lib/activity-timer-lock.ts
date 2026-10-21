export type ActivityTimerLockLease = {
  release: () => void;
};

type LocalLeaseRecord = {
  ownerId: string;
  leaseId: string;
  expiresAt: number;
};

const TIMER_LOCK_NAME = "questboard:activity-timer:v1";
const FALLBACK_LOCK_KEY = "questboard:activity-timer-lock-v1";
const TAB_ID_KEY = "questboard:activity-timer-tab-id-v1";
const LEASE_TTL_MS = 30_000;
const HEARTBEAT_MS = 5_000;
let memoryTabId: string | null = null;

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function getTabId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.sessionStorage.getItem(TAB_ID_KEY);
    if (saved) return saved;
    const id = createId();
    window.sessionStorage.setItem(TAB_ID_KEY, id);
    return id;
  } catch {
    memoryTabId ??= createId();
    return memoryTabId;
  }
}

function readLocalLease(): LocalLeaseRecord | null {
  try {
    const raw = window.localStorage.getItem(FALLBACK_LOCK_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (
      typeof value === "object" &&
      value !== null &&
      "ownerId" in value &&
      typeof value.ownerId === "string" &&
      "leaseId" in value &&
      typeof value.leaseId === "string" &&
      "expiresAt" in value &&
      typeof value.expiresAt === "number" &&
      Number.isFinite(value.expiresAt)
    ) {
      return {
        ownerId: value.ownerId,
        leaseId: value.leaseId,
        expiresAt: value.expiresAt,
      };
    }
  } catch {
    // Treat unreadable storage as unavailable rather than assuming ownership.
  }
  return null;
}

async function acquireLocalStorageLease(
  onLost?: () => void
): Promise<ActivityTimerLockLease | null> {
  if (typeof window === "undefined") return null;
  const ownerId = getTabId();
  if (!ownerId) return null;
  const now = Date.now();
  const existing = readLocalLease();
  if (existing && existing.expiresAt > now) return null;

  const leaseId = createId();
  const record: LocalLeaseRecord = {
    ownerId,
    leaseId,
    expiresAt: now + LEASE_TTL_MS,
  };
  try {
    window.localStorage.setItem(FALLBACK_LOCK_KEY, JSON.stringify(record));
    // A short confirmation window reduces the chance of two old-browser tabs
    // both believing they acquired the non-atomic localStorage fallback.
    await new Promise(resolve =>
      window.setTimeout(resolve, 120 + Math.floor(Math.random() * 180))
    );
    if (readLocalLease()?.leaseId !== leaseId) return null;
    await new Promise(resolve => window.setTimeout(resolve, 100));
    if (readLocalLease()?.leaseId !== leaseId) return null;
  } catch {
    return null;
  }

  let released = false;
  let lost = false;
  let heartbeat: number | undefined;
  const cleanup = () => {
    if (heartbeat !== undefined) window.clearInterval(heartbeat);
    window.removeEventListener("storage", handleStorage);
  };
  const markLost = () => {
    if (released || lost) return;
    lost = true;
    cleanup();
    onLost?.();
  };
  const handleStorage = (event: StorageEvent) => {
    if (
      event.key === FALLBACK_LOCK_KEY &&
      readLocalLease()?.leaseId !== leaseId
    ) {
      markLost();
    }
  };
  window.addEventListener("storage", handleStorage);
  heartbeat = window.setInterval(() => {
    if (released || lost) return;
    const current = readLocalLease();
    if (current?.leaseId !== leaseId) {
      markLost();
      return;
    }
    try {
      window.localStorage.setItem(
        FALLBACK_LOCK_KEY,
        JSON.stringify({
          ...record,
          expiresAt: Date.now() + LEASE_TTL_MS,
        })
      );
    } catch {
      markLost();
    }
  }, HEARTBEAT_MS);

  return {
    release: () => {
      if (released) return;
      released = true;
      cleanup();
      if (readLocalLease()?.leaseId === leaseId) {
        try {
          window.localStorage.removeItem(FALLBACK_LOCK_KEY);
        } catch {
          // The lease expires naturally if storage is no longer writable.
        }
      }
    },
  };
}

function acquireWebLock(
  lockManager: Pick<LockManager, "request">,
  onLost?: () => void
): Promise<ActivityTimerLockLease | null> {
  return new Promise(resolve => {
    let settled = false;
    let releaseHold: () => void = () => undefined;
    const holdLock = new Promise<void>(holdResolve => {
      releaseHold = holdResolve;
    });

    lockManager
      .request(
        TIMER_LOCK_NAME,
        { mode: "exclusive", ifAvailable: true },
        async lock => {
          if (!lock) {
            settled = true;
            resolve(null);
            return;
          }
          let released = false;
          settled = true;
          resolve({
            release: () => {
              if (released) return;
              released = true;
              releaseHold();
            },
          });
          await holdLock;
        }
      )
      .catch(() => {
        if (settled) {
          onLost?.();
          return;
        }
        settled = true;
        void acquireLocalStorageLease(onLost).then(resolve, () => resolve(null));
      });
  });
}

export function acquireActivityTimerLock(
  onLost?: () => void
): Promise<ActivityTimerLockLease | null> {
  if (typeof navigator !== "undefined") {
    const lockManager = Reflect.get(navigator, "locks") as
      | Partial<Pick<LockManager, "request">>
      | undefined;
    if (typeof lockManager?.request === "function") {
      return acquireWebLock(
        lockManager as Pick<LockManager, "request">,
        onLost
      );
    }
  }
  return acquireLocalStorageLease(onLost);
}
