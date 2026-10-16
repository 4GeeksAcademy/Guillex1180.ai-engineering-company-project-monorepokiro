export function linearSearch<T, Value>(
  items: readonly T[] | null | undefined,
  target: Value,
  select: (item: T) => Value,
): number {
  const collection = items ?? [];
  for (let index = 0; index < collection.length; index += 1) {
    if (Object.is(select(collection[index]), target)) return index;
  }
  return -1;
}

export function binarySearch<T, Value>(
  sortedItems: readonly T[] | null | undefined,
  target: Value,
  select: (item: T) => Value,
  compare: (left: Value, right: Value) => number,
): number {
  const collection = sortedItems ?? [];
  let low = 0;
  let high = collection.length - 1;

  while (low <= high) {
    const middle = low + Math.floor((high - low) / 2);
    const comparison = compare(select(collection[middle]), target);
    if (comparison === 0) return middle;
    if (comparison < 0) low = middle + 1;
    else high = middle - 1;
  }

  return -1;
}