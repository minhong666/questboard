export type EquipmentCodexItem = {
  kind?: unknown;
  name?: unknown;
};

export function parseDiscoveredEquipmentNames(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value.filter(
        (name): name is string =>
          typeof name === "string" && name.trim().length > 0
      )
    )
  );
}

export function mergeDiscoveredEquipmentNames(
  previouslyDiscovered: readonly string[],
  inventories: readonly (readonly EquipmentCodexItem[])[]
): string[] {
  const names = new Set(parseDiscoveredEquipmentNames(previouslyDiscovered));
  for (const inventory of inventories) {
    for (const item of inventory) {
      if (
        item.kind === "equipment" &&
        typeof item.name === "string" &&
        item.name.trim().length > 0
      ) {
        names.add(item.name);
      }
    }
  }
  return Array.from(names);
}
