import type {
  Current3PLStatus,
  LeadApplication,
  LeadCountry,
  ProductCategory,
  ServiceInterest,
  ShipmentVolume,
} from "../types/models.js";

export interface LeadValidationResult {
  readonly isValid: boolean;
  readonly errors: Readonly<Partial<Record<keyof LeadApplication, string>>>;
  readonly warnings: readonly string[];
}

const leadCountries: readonly LeadCountry[] = ["Estados Unidos", "España", "Ambos", "Otro"];
const productCategories: readonly ProductCategory[] = [
  "Moda",
  "Electrónica",
  "Cosmética",
  "Alimentación",
  "Otro",
];
const shipmentVolumes: readonly ShipmentVolume[] = [
  "0-100",
  "101-500",
  "501-2000",
  "2000+",
  "No estoy seguro",
];
const serviceInterests: readonly ServiceInterest[] = [
  "Almacenaje",
  "Última milla",
  "Logística inversa",
];
const current3PLStatuses: readonly Current3PLStatus[] = [
  "Sí",
  "No",
  "Estoy evaluando opciones",
];

export function isValidCorporateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function isValidInternationalPhone(value: string): boolean {
  return /^\+\d{1,4}(?:[\s.-]\d+)+$/.test(value.trim());
}

export function isValidWebsiteUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname.length > 0;
  } catch {
    return false;
  }
}

export function validateLeadApplication(
  lead: Partial<LeadApplication> | null | undefined,
): LeadValidationResult {
  const errors: Partial<Record<keyof LeadApplication, string>> = {};
  const warnings: string[] = [];
  const input = lead ?? {};

  if (typeof input.companyName !== "string" || input.companyName.trim().length < 2) {
    errors.companyName = "El nombre de la empresa debe tener al menos 2 caracteres";
  }
  if (
    typeof input.contactPerson !== "string" ||
    input.contactPerson.trim().split(/\s+/).filter(Boolean).length < 2
  ) {
    errors.contactPerson = "Ingresa nombre y apellido del contacto";
  }
  if (
    typeof input.corporateEmail !== "string" ||
    !isValidCorporateEmail(input.corporateEmail)
  ) {
    errors.corporateEmail =
      "Ingresa un email corporativo válido (ejemplo: <nombre@empresa.com>)";
  }
  if (typeof input.phone !== "string" || !isValidInternationalPhone(input.phone)) {
    errors.phone = "El teléfono debe incluir código de país (ejemplo: +1 213 555 0147)";
  }
  if (input.website != null && input.website !== "" && !isValidWebsiteUrl(input.website)) {
    errors.website = "Si incluyes sitio web, debe ser una URL válida";
  }
  if (input.primaryOperatingCountry == null || !leadCountries.includes(input.primaryOperatingCountry)) {
    errors.primaryOperatingCountry = "Selecciona el país de operación principal";
  }
  if (input.productType == null || !productCategories.includes(input.productType)) {
    errors.productType = "Selecciona el tipo de producto que manejas";
  }
  if (input.monthlyShipmentVolume == null || !shipmentVolumes.includes(input.monthlyShipmentVolume)) {
    errors.monthlyShipmentVolume = "Selecciona el volumen mensual estimado";
  }
  if (
    !Array.isArray(input.servicesOfInterest) ||
    !input.servicesOfInterest.some((service) => serviceInterests.includes(service))
  ) {
    errors.servicesOfInterest = "Selecciona al menos un servicio de interés";
  }
  if (input.current3PL == null || !current3PLStatuses.includes(input.current3PL)) {
    errors.current3PL = "Indica si actualmente trabajas con otro proveedor logístico";
  }
  if (input.comments != null && input.comments.length > 500) {
    errors.comments =
      "Los comentarios no pueden exceder 500 caracteres (quedan " +
      (500 - input.comments.length) +
      ")";
  }
  if (input.privacyAccepted !== true) {
    errors.privacyAccepted = "Debes aceptar la política de privacidad para continuar";
  }

  if (
    input.monthlyShipmentVolume === "0-100" &&
    input.productType != null &&
    productCategories.includes(input.productType)
  ) {
    warnings.push(
      "Para volúmenes menores a 100 envíos mensuales, nuestros servicios podrían no ser la solución más eficiente. ¿Seguro que quieres continuar?",
    );
  }

  return { isValid: Object.keys(errors).length === 0, errors, warnings };
}