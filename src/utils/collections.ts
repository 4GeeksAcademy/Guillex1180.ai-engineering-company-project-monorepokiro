export type SortDirection = "asc" | "desc";

export type SortValue = string | number | boolean | Date | null | undefined;

export interface SortCriterion<T> {
  readonly select: (item: T) => SortValue;
  readonly direction?: SortDirection;
}

export function filterBy<T>(
  items: readonly T[] | null | undefined,
  predicate: (item: T, index: number) => boolean,
): T[] {
  return (items ?? []).filter(predicate);
}

function compareValues(left: SortValue, right: SortValue): number {
  if (left == null && right == null) return 0;
  if (left == null) return 1;
  if (right == null) return -1;

  const leftValue = left instanceof Date ? left.getTime() : left;
  const rightValue = right instanceof Date ? right.getTime() : right;

  if (typeof leftValue === "number" && typeof rightValue === "number") {
    return leftValue - rightValue;
  }
  if (typeof leftValue === "boolean" && typeof rightValue === "boolean") {
    return Number(leftValue) - Number(rightValue);
  }
  return String(leftValue).localeCompare(String(rightValue));
}

export function sortBy<T>(
  items: readonly T[] | null | undefined,
  select: (item: T) => SortValue,
  direction: SortDirection = "asc",
): T[] {
  const multiplier = direction === "asc" ? 1 : -1;

  return (items ?? [])
    .map((item, originalIndex) => ({ item, originalIndex }))
    .sort((left, right) => {
      const comparison = compareValues(select(left.item), select(right.item));
      return comparison === 0 ? left.originalIndex - right.originalIndex : comparison * multiplier;
    })
    .map(({ item }) => item);
}

export function sortByMultiple<T>(
  items: readonly T[] | null | undefined,
  criteria: readonly SortCriterion<T>[],
): T[] {
  return (items ?? [])
    .map((item, originalIndex) => ({ item, originalIndex }))
    .sort((left, right) => {
      for (const criterion of criteria) {
        const multiplier = criterion.direction === "desc" ? -1 : 1;
        const comparison = compareValues(
          criterion.select(left.item),
          criterion.select(right.item),
        );
        if (comparison !== 0) return comparison * multiplier;
      }
      return left.originalIndex - right.originalIndex;
    })
    .map(({ item }) => item);
}