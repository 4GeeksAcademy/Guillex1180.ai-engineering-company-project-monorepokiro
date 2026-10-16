export type MarketCountry = "Estados Unidos" | "España";

export type LeadCountry = MarketCountry | "Ambos" | "Otro";

export type ProductCategory =
  | "Moda"
  | "Electrónica"
  | "Cosmética"
  | "Alimentación"
  | "Otro";

export type ShipmentVolume =
  | "0-100"
  | "101-500"
  | "501-2000"
  | "2000+"
  | "No estoy seguro";

export type ServiceInterest = "Almacenaje" | "Última milla" | "Logística inversa";

export type Current3PLStatus = "Sí" | "No" | "Estoy evaluando opciones";

export interface Office {
  readonly city: string;
  readonly country: MarketCountry;
  readonly region: string;
  readonly phone: string;
}

export interface ServiceOffering {
  readonly name: ServiceInterest;
  readonly features: readonly string[];
}

export interface MarketCoverage {
  readonly country: MarketCountry;
  readonly warehouseCity: string;
  readonly coverageDescription: string;
  readonly carriers: readonly string[];
}

export interface TrackFlowProfile {
  readonly name: "TrackFlow";
  readonly foundedYear: 2009;
  readonly foundedIn: "Los Ángeles, Estados Unidos";
  readonly offices: readonly Office[];
  readonly approximateEmployeeCount: 130;
  readonly approximateAnnualRevenueEur: 9_000_000;
  readonly customerProductCategories: readonly ("Moda" | "Electrónica" | "Cosmética")[];
  readonly services: readonly ServiceOffering[];
  readonly coverage: readonly MarketCoverage[];
}

export interface LeadApplication {
  readonly companyName: string;
  readonly contactPerson: string;
  readonly corporateEmail: string;
  readonly phone: string;
  readonly website?: string;
  readonly primaryOperatingCountry: LeadCountry;
  readonly productType: ProductCategory;
  readonly monthlyShipmentVolume: ShipmentVolume;
  readonly servicesOfInterest: readonly ServiceInterest[];
  readonly current3PL: Current3PLStatus;
  readonly comments?: string;
  readonly privacyAccepted: boolean;
}