import type { LeadApplication } from "../types/models.js";

export interface NumericAggregate {
  readonly total: number;
  readonly average: number | null;
  readonly maximum: number | null;
  readonly minimum: number | null;
  readonly count: number;
}

export interface LeadAggregates {
  readonly totalLeads: number;
  readonly byCountry: Readonly<Record<string, number>>;
  readonly byProductType: Readonly<Record<string, number>>;
  readonly byShipmentVolume: Readonly<Record<string, number>>;
  readonly byService: Readonly<Record<string, number>>;
}

export function aggregateNumbers(
  values: readonly (number | null | undefined)[] | null | undefined,
): NumericAggregate {
  const numbers = (values ?? []).filter(
    (value): value is number => value !== null && value !== undefined && Number.isFinite(value),
  );
  const total = numbers.reduce((sum, value) => sum + value, 0);

  return {
    total,
    average: numbers.length === 0 ? null : total / numbers.length,
    maximum: numbers.length === 0 ? null : Math.max(...numbers),
    minimum: numbers.length === 0 ? null : Math.min(...numbers),
    count: numbers.length,
  };
}

export function countBy<T>(
  items: readonly T[] | null | undefined,
  selectCategory: (item: T) => string | null | undefined,
): Readonly<Record<string, number>> {
  return (items ?? []).reduce<Record<string, number>>((counts, item) => {
    const category = selectCategory(item);
    if (category != null) counts[category] = (counts[category] ?? 0) + 1;
    return counts;
  }, {});
}

export function summarizeLeads(
  leads: readonly LeadApplication[] | null | undefined,
): LeadAggregates {
  const collection = leads ?? [];
  const services = collection.flatMap((lead) => lead.servicesOfInterest);

  return {
    totalLeads: collection.length,
    byCountry: countBy(collection, (lead) => lead.primaryOperatingCountry),
    byProductType: countBy(collection, (lead) => lead.productType),
    byShipmentVolume: countBy(collection, (lead) => lead.monthlyShipmentVolume),
    byService: countBy(services, (service) => service),
  };
}