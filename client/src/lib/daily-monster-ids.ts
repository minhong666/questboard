export function getDailyMonsterId(refreshKey: string, catalogIndex: number) {
  return `daily-${refreshKey}-${catalogIndex}`;
}

/**
 * Converts both the current stable ID and the legacy level-dependent ID to
 * the stable daily monster ID. Legacy IDs looked like:
 * daily-small-YYYY-M-D-catalogIndex-playerLevel
 */
export function normalizeDailyMonsterId(id: string) {
  const match = id.match(
    /^daily-(small-\d+-\d+-\d+)-(\d+)(?:-\d+)?$/
  );
  return match ? `daily-${match[1]}-${match[2]}` : id;
}
