export function clampCurrentHealth(currentHealth: number, maxHealth: number): number {
  const safeMaxHealth = Number.isFinite(maxHealth)
    ? Math.max(1, Math.floor(maxHealth))
    : 1;
  const safeCurrentHealth = Number.isFinite(currentHealth)
    ? Math.floor(currentHealth)
    : safeMaxHealth;
  return Math.max(0, Math.min(safeCurrentHealth, safeMaxHealth));
}
