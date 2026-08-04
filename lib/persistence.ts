"use client";

import type { AnalyticsEvent, Configuration, Project } from "./types";
import { dealers, materials, products, projects as seedProjects } from "./data";
import { createConfiguration, priceConfiguration } from "./configurator";

const keys = {
  products: "musterring.savedProducts",
  configurations: "musterring.configurations",
  projects: "musterring.projects",
  comparisons: "musterring.comparisons",
  events: "musterring.analytics",
  dealer: "musterring.selectedDealer",
  lead: "musterring.lastLead",
  fitReports: "musterring.fitReports",
  fitDrafts: "musterring.fitDrafts",
  roomScenes: "musterring.roomScenes",
  consent: "musterring.consent",
  recentSearches: "musterring.recentSearches",
  materials: "musterring.savedMaterials",
  consentRecords: "musterring.consentRecords",
  leads: "musterring.leads"
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  savedProducts: () => read<string[]>(keys.products, []),
  toggleProduct: (id: string) => {
    const next = storage.savedProducts().includes(id) ? storage.savedProducts().filter((item) => item !== id) : [...storage.savedProducts(), id];
    write(keys.products, next);
    return next;
  },
  configurations: () => read<Configuration[]>(keys.configurations, []),
  saveConfiguration: (configuration: Configuration) => {
    const existing = storage.configurations().filter((item) => item.id !== configuration.id);
    write(keys.configurations, [...existing, configuration]);
  },
  projects: () => read<Project[]>(keys.projects, seedProjects),
  saveProject: (project: Project) => {
    const existing = storage.projects().filter((item) => item.id !== project.id);
    write(keys.projects, [...existing, project]);
  },
  deleteProject: (id: string) => {
    write(keys.projects, storage.projects().filter((item) => item.id !== id));
  },
  comparisons: () => read<string[]>(keys.comparisons, []),
  setComparison: (ids: string[]) => write(keys.comparisons, ids.slice(0, 3)),
  selectedDealer: () => read<string | null>(keys.dealer, null),
  setDealer: (id: string) => write(keys.dealer, id),
  saveLead: (lead: unknown) => {
    write(keys.lead, lead);
    write(keys.leads, [...read<unknown[]>(keys.leads, []), lead]);
  },
  lastLead: () => read<Record<string, unknown> | null>(keys.lead, null),
  leads: () => read<Record<string, unknown>[]>(keys.leads, []),
  fitReports: () => read<Record<string, unknown>[]>(keys.fitReports, []),
  saveFitReport: (report: unknown) => {
    const reports = read<unknown[]>(keys.fitReports, []);
    const id = typeof report === "object" && report && "id" in report ? (report as { id: unknown }).id : undefined;
    write(keys.fitReports, [...reports.filter((item) => !(typeof item === "object" && item && "id" in item && (item as { id: unknown }).id === id)), report]);
  },
  fitDraft: (productId: string) => read<Record<string, Record<string, unknown>>>(keys.fitDrafts, {})[productId] ?? null,
  saveFitDraft: (productId: string, draft: unknown) => {
    write(keys.fitDrafts, { ...read<Record<string, unknown>>(keys.fitDrafts, {}), [productId]: draft });
  },
  roomScenes: () => read<unknown[]>(keys.roomScenes, []),
  saveRoomScene: (scene: unknown) => {
    write(keys.roomScenes, [...storage.roomScenes(), scene]);
  },
  consent: () => read(keys.consent, false),
  setConsent: (allowed: boolean) => {
    write(keys.consent, allowed);
    write(keys.consentRecords, [...read<unknown[]>(keys.consentRecords, []), {
      id: crypto.randomUUID(),
      scope: "analytics",
      granted: allowed,
      timestamp: new Date().toISOString(),
      policyVersion: "2027-demo-1"
    }]);
    if (!allowed) write(keys.events, []);
  },
  consentRecords: () => read<Record<string, unknown>[]>(keys.consentRecords, []),
  recordConsent: (scope: string, granted: boolean) => {
    const record = { id: crypto.randomUUID(), scope, granted, timestamp: new Date().toISOString(), policyVersion: "2027-demo-1" };
    write(keys.consentRecords, [...storage.consentRecords(), record]);
    return record;
  },
  recentSearches: () => read<string[]>(keys.recentSearches, []),
  saveRecentSearch: (query: string) => {
    const next = [query, ...storage.recentSearches().filter((item) => item !== query)].slice(0, 5);
    write(keys.recentSearches, next);
    return next;
  },
  savedMaterials: () => read<string[]>(keys.materials, []),
  toggleMaterial: (id: string) => {
    const current = storage.savedMaterials();
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    write(keys.materials, next);
    return next;
  },
  events: () => read<AnalyticsEvent[]>(keys.events, []),
  track: (event: Omit<AnalyticsEvent, "id" | "timestamp" | "sessionId" | "locale" | "consent">) => {
    if (!storage.consent()) return false;
    const sessionId = read("musterring.session", crypto.randomUUID());
    write("musterring.session", sessionId);
    const next = [...storage.events(), { ...event, id: crypto.randomUUID(), timestamp: new Date().toISOString(), sessionId, locale: navigator.language || "en", consent: true }].slice(-5000);
    write(keys.events, next);
    return true;
  },
  resetPresentationDemo: () => {
    const sofa = products.find((product) => product.id === "p1" && product.active)
      ?? products.find((product) => product.active && product.category === "sofa")!;
    const complementary = products.filter((product) => product.active && ["dining-table", "storage", "armchair"].includes(product.category)).slice(0, 2);
    const selectedProducts = [sofa, ...complementary];
    const configuration = createConfiguration(sofa);
    configuration.id = "CFG-MR2875-PRESENTATION";
    configuration.modules = ["left seat", "centre seat", "centre seat", "right seat"];
    configuration.relax = true;
    configuration.electric = false;
    configuration.color = sofa.colors.includes("beige") ? "beige" : sofa.colors[0];
    configuration.materialId = sofa.materials.find((id) => materials.find((material) => material.id === id)?.easyCare) ?? sofa.materials[0];
    configuration.dimensions = { widthMm: Math.min(2860, sofa.widthMm), depthMm: sofa.depthMm, heightMm: sofa.heightMm };
    configuration.indicativePriceCents = priceConfiguration(configuration);
    configuration.updatedAt = new Date().toISOString();
    const roomScene = {
      id: "scene-presentation-living",
      name: "Living Room Presentation Concept",
      version: 1,
      planningMode: "inspiration",
      roomSize: { widthMm: 4200, lengthMm: 5600 },
      configurationId: configuration.id,
      items: selectedProducts.map((product, index) => ({
        id: `presentation-item-${index + 1}`,
        productId: product.id,
        configurationId: product.id === sofa.id ? configuration.id : undefined,
        x: [48, 68, 28][index] ?? 50,
        y: [68, 52, 48][index] ?? 60,
        rotation: [0, 8, -5][index] ?? 0,
        scale: [1, .72, .78][index] ?? .8,
        materialId: product.materials[0],
        color: product.colors[0],
        dimensions: { widthMm: product.widthMm, depthMm: product.depthMm, heightMm: product.heightMm },
        zIndex: index + 1
      })),
      hasLocalRoomPhoto: false,
      createdAt: new Date().toISOString(),
      demoData: true
    };
    const fitReport = {
      id: "fit-presentation-mr2875",
      productId: sofa.id,
      projectId: "project-living",
      status: "likely",
      reasons: ["Entered room dimensions accommodate the configured footprint.", "Delivery access remains subject to retailer verification."],
      savedAt: new Date().toISOString(),
      demoData: true
    };
    const project: Project = {
      ...seedProjects[0],
      id: "project-living",
      name: "Living Room Project",
      status: "Ready for Consultation",
      coverImage: "/stitch-assets/original/room-living-clean.jpg",
      savedProductIds: selectedProducts.map((product) => product.id),
      savedConfigurationIds: [configuration.id],
      savedComparisonIds: [],
      preferredDealerId: dealers[0].id,
      savedMaterialIds: configuration.materialId ? [configuration.materialId] : [],
      notes: "Presentation project: easy-care beige seating, complementary furniture and retailer fit confirmation requested.",
      updatedAt: new Date().toISOString(),
      demoData: true
    };
    const resetKeys = [
      keys.products, keys.configurations, keys.projects, keys.comparisons, keys.events,
      keys.dealer, keys.lead, keys.fitReports, keys.fitDrafts, keys.roomScenes,
      keys.recentSearches, keys.materials, keys.leads
    ];
    resetKeys.forEach((key) => window.localStorage.removeItem(key));
    write(keys.products, selectedProducts.map((product) => product.id));
    write(keys.configurations, [configuration]);
    write(keys.projects, [project]);
    write(keys.comparisons, selectedProducts.map((product) => product.id).slice(0, 3));
    write(keys.dealer, dealers[0].id);
    write(keys.fitReports, [fitReport]);
    write(keys.roomScenes, [roomScene]);
    write(keys.materials, configuration.materialId ? [configuration.materialId] : []);
    return { project, configuration, roomScene, fitReport, dealer: dealers[0], products: selectedProducts };
  }
};
