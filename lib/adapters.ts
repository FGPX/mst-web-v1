import { dealers, products } from "./data";
import { parseSearchQuery } from "./search";

export interface AiProvider { parseSearch(input: string): Promise<unknown>; tagImage(file: File): Promise<unknown>; }
export interface ProductProvider { listProducts(): Promise<unknown[]>; }
export interface DatabaseProvider { save(entity: string, value: unknown): Promise<void>; read(entity: string): Promise<unknown>; }
export interface FileStorageProvider { save(file: File): Promise<string>; delete(id: string): Promise<void>; }
export interface EmailProvider { sendLead(value: unknown): Promise<{ reference: string }>; }
export interface MapProvider { geocode(input: string): Promise<{ latitude: number; longitude: number; label: string } | null>; }
export interface AnalyticsProvider { track(event: unknown): Promise<void>; }

const localDatabase = new Map<string, unknown>();
const localFiles = new Map<string, { name: string; type: string; size: number }>();
const localEvents: unknown[] = [];
const dealerCoordinates: Record<string, [number, number]> = {
  Hannover: [52.3759, 9.732],
  Berlin: [52.52, 13.405],
  Hamburg: [53.5511, 9.9937],
  München: [48.1351, 11.582],
  Köln: [50.9375, 6.9603],
  Frankfurt: [50.1109, 8.6821],
  Stuttgart: [48.7758, 9.1829],
  Düsseldorf: [51.2277, 6.7735]
};

export const localAdapters = {
  ai: {
    parseSearch: async (input: string) => parseSearchQuery(input),
    tagImage: async (file: File) => ({
      category: /chair/i.test(file.name) ? "armchair" : /cabinet|wall/i.test(file.name) ? "storage" : "sofa",
      source: "local-filename-fallback"
    })
  } satisfies AiProvider,
  product: { listProducts: async () => products.filter((product) => product.active) } satisfies ProductProvider,
  database: {
    save: async (entity, value) => { localDatabase.set(entity, value); },
    read: async (entity) => localDatabase.get(entity)
  } satisfies DatabaseProvider,
  fileStorage: {
    save: async (file) => {
      const id = `demo-file-${Date.now()}`;
      localFiles.set(id, { name: file.name, type: file.type, size: file.size });
      return id;
    },
    delete: async (id) => { localFiles.delete(id); }
  } satisfies FileStorageProvider,
  email: { sendLead: async () => ({ reference: `MR-DEMO-${Date.now().toString().slice(-6)}` }) } satisfies EmailProvider,
  map: {
    geocode: async (input) => {
      const dealer = dealers.find((item) => `${item.postcode} ${item.city}`.toLowerCase().includes(input.toLowerCase()));
      const coordinates = dealer ? dealerCoordinates[dealer.city] : undefined;
      return dealer && coordinates ? { latitude: coordinates[0], longitude: coordinates[1], label: `${dealer.city}, ${dealer.postcode}` } : null;
    }
  } satisfies MapProvider,
  analytics: { track: async (event) => { localEvents.push(event); } } satisfies AnalyticsProvider
};

export const mockAdapters = localAdapters;
