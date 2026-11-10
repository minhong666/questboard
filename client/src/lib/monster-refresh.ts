export function getDailyMonsterRefreshKey(date: Date) {
  return `small-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function getNextDailyMonsterRefreshAt(timestamp: number) {
  const next = new Date(timestamp);
  next.setHours(0, 0, 0, 0);
  if (next.getTime() <= timestamp) next.setDate(next.getDate() + 1);
  return next.getTime();
}
