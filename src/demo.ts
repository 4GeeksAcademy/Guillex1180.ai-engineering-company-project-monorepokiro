import type { LeadApplication, TrackFlowProfile } from "./types/models.js";
import { filterBy, sortBy, sortByMultiple } from "./utils/collections.js";
import { binarySearch, linearSearch } from "./utils/search.js";
import { aggregateNumbers, summarizeLeads } from "./utils/transformations.js";
import { validateLeadApplication } from "./utils/validations.js";

const trackFlow: TrackFlowProfile = {
  name: "TrackFlow",
  foundedYear: 2009,
  foundedIn: "Los Ángeles, Estados Unidos",
  offices: [
    { city: "Los Ángeles", country: "Estados Unidos", region: "California", phone: "+1 213 555 0147" },
    { city: "Zaragoza", country: "España", region: "Aragón", phone: "+34 976 123 456" },
  ],
  approximateEmployeeCount: 130,
  approximateAnnualRevenueEur: 9_000_000,
  customerProductCategories: ["Moda", "Electrónica", "Cosmética"],
  services: [
    {
      name: "Almacenaje",
      features: [
        "Almacenamiento, picking y packing",
        "Inventario en tiempo real",
        "Operamos almacenes en Los Ángeles y Zaragoza",
      ],
    },
    {
      name: "Última milla",
      features: [
        "Red de carriers certificados en ambos países",
        "Seguimiento unificado de envíos",
        "Gestión de incidencias y devoluciones",
      ],
    },
    {
      name: "Logística inversa",
      features: [
        "Gestión completa de devoluciones",
        "Inspección y reacondicionamiento",
        "Integración con tu plataforma de ventas",
      ],
    },
  ],
  coverage: [
    {
      country: "Estados Unidos",
      warehouseCity: "Los Ángeles",
      coverageDescription: "Cobertura nacional",
      carriers: ["UPS", "FedEx", "DHL"],
    },
    {
      country: "España",
      warehouseCity: "Zaragoza",
      coverageDescription: "Cobertura peninsular e islas",
      carriers: ["MRW", "SEUR", "DHL"],
    },
  ],
};

const demoLeads: readonly LeadApplication[] = [
  {
    companyName: "Moda Norte",
    contactPerson: "Lucía Martín",
    corporateEmail: "lucia@modanorte.example",
    phone: "+34 976 123 111",
    website: "https://modanorte.example",
    primaryOperatingCountry: "España",
    productType: "Moda",
    monthlyShipmentVolume: "501-2000",
    servicesOfInterest: ["Almacenaje", "Última milla"],
    current3PL: "Sí",
    comments: "Interés en operar desde Zaragoza.",
    privacyAccepted: true,
  },
  {
    companyName: "Electro Global",
    contactPerson: "Carlos Ruiz",
    corporateEmail: "carlos@electroglobal.example",
    phone: "+1 213 555 0188",
    primaryOperatingCountry: "Ambos",
    productType: "Electrónica",
    monthlyShipmentVolume: "2000+",
    servicesOfInterest: ["Última milla", "Logística inversa"],
    current3PL: "Estoy evaluando opciones",
    privacyAccepted: true,
  },
  {
    companyName: "Cosmética Sur",
    contactPerson: "Elena Pérez",
    corporateEmail: "elena@cosmeticasur.example",
    phone: "+34 976 123 222",
    primaryOperatingCountry: "España",
    productType: "Cosmética",
    monthlyShipmentVolume: "0-100",
    servicesOfInterest: ["Almacenaje"],
    current3PL: "No",
    privacyAccepted: true,
  },
];

const sortedLeads = sortBy(demoLeads, (lead) => lead.companyName);
const sortedByCountryThenCompany = sortByMultiple(demoLeads, [
  { select: (lead) => lead.primaryOperatingCountry },
  { select: (lead) => lead.companyName },
]);
const spanishLeads = filterBy(demoLeads, (lead) => lead.primaryOperatingCountry === "España");
const leadSummary = summarizeLeads(demoLeads);
const commentLengthSummary = aggregateNumbers(
  demoLeads.map((lead) => lead.comments?.length ?? 0),
);
const emptySummary = aggregateNumbers([]);

console.log("TrackFlow (datos del CONTEXT.es.md):", trackFlow);
console.log("Orden alfabético:", sortedLeads.map((lead) => lead.companyName));
console.log(
  "Orden por país y empresa:",
  sortedByCountryThenCompany.map((lead) => `${lead.primaryOperatingCountry}: ${lead.companyName}`),
);
console.log("Solicitudes de España:", spanishLeads.length);
console.log(
  "Búsqueda lineal de Electro Global:",
  linearSearch(demoLeads, "Electro Global", (lead) => lead.companyName),
);
console.log(
  "Búsqueda binaria de Electro Global:",
  binarySearch(
    sortedLeads,
    "Electro Global",
    (lead) => lead.companyName,
    (left, right) => left.localeCompare(right),
  ),
);
console.log(
  "Búsqueda sin coincidencia:",
  linearSearch(demoLeads, "No existe", (lead) => lead.companyName),
);
console.log("Agregaciones de solicitudes:", leadSummary);
console.log("Resumen numérico de longitudes de comentarios:", commentLengthSummary);
console.log("Agregación vacía (promedio/máximo/mínimo nulos):", emptySummary);
console.log("Validación de lead correcto:", validateLeadApplication(demoLeads[0]));
console.log("Validación del aviso 0-100:", validateLeadApplication(demoLeads[2]));
console.log("Validación de datos incompletos:", validateLeadApplication(null));