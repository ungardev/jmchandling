/**
 * src/data/media.generated.ts
 *
 * GENERADO AUTOMATICAMENTE por scripts/optimize-assets.mjs — no editar a mano.
 * Fuente: scripts/media-map.json
 *
 * Cada activo se exporta por separado para que el bundler pueda eliminar
 * (tree-shake) los que una pagina no usa. La biblioteca completa vive en
 * public/assets/photos/manifest.json (publica, sin coste de JS).
 */

export interface MediaAsset {
  src: string;
  width: number;
  height: number;
  altKey: string;
  srcset: string;
}

/** Variante de un activo con recortes art-dirigidos (un set por breakpoint). */
export interface MediaVariant {
  src: string;
  width: number;
  height: number;
  srcset: string;
}

export interface ArtDirectedAsset {
  id: string;
  altKey: string;
  sets: Record<string, MediaVariant>;
}

export const heroRampNight: MediaAsset = {
  src: "/assets/photos/hero/hero-ramp-night-1920.webp",
  width: 1920,
  height: 1440,
  altKey: "media.alt.heroRampNight",
  srcset: "/assets/photos/hero/hero-ramp-night-1280.webp 1280w, /assets/photos/hero/hero-ramp-night-1920.webp 1920w",
};

export const heroGseRamp: ArtDirectedAsset = {
  id: "hero-gse-ramp",
  altKey: "media.alt.heroGseRamp",
  sets: {
  "wide": {
    src: "/assets/photos/hero/hero-gse-ramp-wide-2400.webp",
    width: 2400,
    height: 1350,
    srcset: "/assets/photos/hero/hero-gse-ramp-wide-1280.webp 1280w, /assets/photos/hero/hero-gse-ramp-wide-1920.webp 1920w, /assets/photos/hero/hero-gse-ramp-wide-2400.webp 2400w",
  },
  "tall": {
    src: "/assets/photos/hero/hero-gse-ramp-tall-1080.webp",
    width: 1080,
    height: 1350,
    srcset: "/assets/photos/hero/hero-gse-ramp-tall-720.webp 720w, /assets/photos/hero/hero-gse-ramp-tall-1080.webp 1080w",
  },
  },
};

export const equipmentCarrucha: MediaAsset = {
  src: "/assets/photos/equipment/equipment-carrucha-1280.webp",
  width: 1280,
  height: 1919,
  altKey: "media.alt.equipmentCarrucha",
  srcset: "/assets/photos/equipment/equipment-carrucha-640.webp 640w, /assets/photos/equipment/equipment-carrucha-1280.webp 1280w",
};

export const equipmentTractor: MediaAsset = {
  src: "/assets/photos/equipment/equipment-tractor-1280.webp",
  width: 1280,
  height: 1919,
  altKey: "media.alt.equipmentTractor",
  srcset: "/assets/photos/equipment/equipment-tractor-640.webp 640w, /assets/photos/equipment/equipment-tractor-1280.webp 1280w",
};

export const equipmentTractorService: MediaAsset = {
  src: "/assets/photos/equipment/equipment-tractor-service-1280.webp",
  width: 1280,
  height: 1919,
  altKey: "media.alt.equipmentTractorService",
  srcset: "/assets/photos/equipment/equipment-tractor-service-640.webp 640w, /assets/photos/equipment/equipment-tractor-service-1280.webp 1280w",
};

export const equipmentWaterCart: MediaAsset = {
  src: "/assets/photos/equipment/equipment-water-cart-1280.webp",
  width: 1280,
  height: 1919,
  altKey: "media.alt.equipmentWaterCart",
  srcset: "/assets/photos/equipment/equipment-water-cart-640.webp 640w, /assets/photos/equipment/equipment-water-cart-1280.webp 1280w",
};

export const equipmentBeltLoader: MediaAsset = {
  src: "/assets/photos/equipment/equipment-belt-loader-1280.webp",
  width: 1280,
  height: 1919,
  altKey: "media.alt.equipmentBeltLoader",
  srcset: "/assets/photos/equipment/equipment-belt-loader-640.webp 640w, /assets/photos/equipment/equipment-belt-loader-1280.webp 1280w",
};

export const equipmentGpu: MediaAsset = {
  src: "/assets/photos/equipment/equipment-gpu-1280.webp",
  width: 1280,
  height: 1919,
  altKey: "media.alt.equipmentGpu",
  srcset: "/assets/photos/equipment/equipment-gpu-640.webp 640w, /assets/photos/equipment/equipment-gpu-1280.webp 1280w",
};

export const familyRampGse: MediaAsset = {
  src: "/assets/photos/families/family-ramp-gse-1280.webp",
  width: 1280,
  height: 960,
  altKey: "media.alt.familyRampGse",
  srcset: "/assets/photos/families/family-ramp-gse-640.webp 640w, /assets/photos/families/family-ramp-gse-1280.webp 1280w",
};

export const familyAircraftCare: MediaAsset = {
  src: "/assets/photos/families/family-aircraft-care-1280.webp",
  width: 1280,
  height: 960,
  altKey: "media.alt.familyAircraftCare",
  srcset: "/assets/photos/families/family-aircraft-care-640.webp 640w, /assets/photos/families/family-aircraft-care-1280.webp 1280w",
};

export const familyFboOperations: MediaAsset = {
  src: "/assets/photos/families/family-fbo-operations-1280.webp",
  width: 1280,
  height: 960,
  altKey: "media.alt.familyFboOperations",
  srcset: "/assets/photos/families/family-fbo-operations-640.webp 640w, /assets/photos/families/family-fbo-operations-1280.webp 1280w",
};

export const familyPassengerServices: MediaAsset = {
  src: "/assets/photos/families/family-passenger-services-1280.webp",
  width: 1280,
  height: 960,
  altKey: "media.alt.familyPassengerServices",
  srcset: "/assets/photos/families/family-passenger-services-640.webp 640w, /assets/photos/families/family-passenger-services-1280.webp 1280w",
};

export const familyGseMaintenance: MediaAsset = {
  src: "/assets/photos/families/family-gse-maintenance-1280.webp",
  width: 720,
  height: 1280,
  altKey: "media.alt.familyGseMaintenance",
  srcset: "/assets/photos/families/family-gse-maintenance-640.webp 640w, /assets/photos/families/family-gse-maintenance-1280.webp 720w",
};

export const galleryCargoHold: MediaAsset = {
  src: "/assets/photos/services/gallery-cargo-hold-1280.webp",
  width: 1280,
  height: 2276,
  altKey: "media.alt.galleryCargoHold",
  srcset: "/assets/photos/services/gallery-cargo-hold-640.webp 640w, /assets/photos/services/gallery-cargo-hold-1280.webp 1280w",
};

export const galleryCargoHoldContainer: MediaAsset = {
  src: "/assets/photos/services/gallery-cargo-hold-container-1280.webp",
  width: 1280,
  height: 2276,
  altKey: "media.alt.galleryCargoHoldContainer",
  srcset: "/assets/photos/services/gallery-cargo-hold-container-640.webp 640w, /assets/photos/services/gallery-cargo-hold-container-1280.webp 1280w",
};

export const galleryConsolidation: MediaAsset = {
  src: "/assets/photos/services/gallery-consolidation-1280.webp",
  width: 1280,
  height: 2276,
  altKey: "media.alt.galleryConsolidation",
  srcset: "/assets/photos/services/gallery-consolidation-640.webp 640w, /assets/photos/services/gallery-consolidation-1280.webp 1280w",
};

export const galleryUldStore: MediaAsset = {
  src: "/assets/photos/services/gallery-uld-store-1280.webp",
  width: 1280,
  height: 2276,
  altKey: "media.alt.galleryUldStore",
  srcset: "/assets/photos/services/gallery-uld-store-640.webp 640w, /assets/photos/services/gallery-uld-store-1280.webp 1280w",
};

export const galleryBaggageSorting: MediaAsset = {
  src: "/assets/photos/services/gallery-baggage-sorting-1280.webp",
  width: 1280,
  height: 2276,
  altKey: "media.alt.galleryBaggageSorting",
  srcset: "/assets/photos/services/gallery-baggage-sorting-640.webp 640w, /assets/photos/services/gallery-baggage-sorting-1280.webp 1280w",
};

export const galleryNightOps: MediaAsset = {
  src: "/assets/photos/services/gallery-night-ops-1280.webp",
  width: 1280,
  height: 2276,
  altKey: "media.alt.galleryNightOps",
  srcset: "/assets/photos/services/gallery-night-ops-640.webp 640w, /assets/photos/services/gallery-night-ops-1280.webp 1280w",
};

export const galleryNightAircraft: MediaAsset = {
  src: "/assets/photos/services/gallery-night-aircraft-1280.webp",
  width: 1280,
  height: 2276,
  altKey: "media.alt.galleryNightAircraft",
  srcset: "/assets/photos/services/gallery-night-aircraft-640.webp 640w, /assets/photos/services/gallery-night-aircraft-1280.webp 1280w",
};

export const galleryBeltLoading: MediaAsset = {
  src: "/assets/photos/services/gallery-belt-loading-1280.webp",
  width: 1280,
  height: 1707,
  altKey: "media.alt.galleryBeltLoading",
  srcset: "/assets/photos/services/gallery-belt-loading-640.webp 640w, /assets/photos/services/gallery-belt-loading-1280.webp 1280w",
};

export const galleryCargoContainer: MediaAsset = {
  src: "/assets/photos/services/gallery-cargo-container-1280.webp",
  width: 1280,
  height: 1707,
  altKey: "media.alt.galleryCargoContainer",
  srcset: "/assets/photos/services/gallery-cargo-container-640.webp 640w, /assets/photos/services/gallery-cargo-container-1280.webp 1280w",
};

export const galleryLoadedCart: MediaAsset = {
  src: "/assets/photos/services/gallery-loaded-cart-1280.webp",
  width: 1280,
  height: 2276,
  altKey: "media.alt.galleryLoadedCart",
  srcset: "/assets/photos/services/gallery-loaded-cart-640.webp 640w, /assets/photos/services/gallery-loaded-cart-1280.webp 1280w",
};

export const galleryRampTeam: MediaAsset = {
  src: "/assets/photos/services/gallery-ramp-team-1280.webp",
  width: 1280,
  height: 1707,
  altKey: "media.alt.galleryRampTeam",
  srcset: "/assets/photos/services/gallery-ramp-team-640.webp 640w, /assets/photos/services/gallery-ramp-team-1280.webp 1280w",
};

export const galleryBeltLoaderOps: MediaAsset = {
  src: "/assets/photos/services/gallery-belt-loader-ops-1280.webp",
  width: 1280,
  height: 1707,
  altKey: "media.alt.galleryBeltLoaderOps",
  srcset: "/assets/photos/services/gallery-belt-loader-ops-640.webp 640w, /assets/photos/services/gallery-belt-loader-ops-1280.webp 1280w",
};

export const galleryUldRamp: MediaAsset = {
  src: "/assets/photos/services/gallery-uld-ramp-1280.webp",
  width: 1280,
  height: 1707,
  altKey: "media.alt.galleryUldRamp",
  srcset: "/assets/photos/services/gallery-uld-ramp-640.webp 640w, /assets/photos/services/gallery-uld-ramp-1280.webp 1280w",
};

export const galleryAircraftDay: MediaAsset = {
  src: "/assets/photos/services/gallery-aircraft-day-1280.webp",
  width: 1280,
  height: 1707,
  altKey: "media.alt.galleryAircraftDay",
  srcset: "/assets/photos/services/gallery-aircraft-day-640.webp 640w, /assets/photos/services/gallery-aircraft-day-1280.webp 1280w",
};

export const galleryAircraftRamp: MediaAsset = {
  src: "/assets/photos/services/gallery-aircraft-ramp-1280.webp",
  width: 1280,
  height: 1707,
  altKey: "media.alt.galleryAircraftRamp",
  srcset: "/assets/photos/services/gallery-aircraft-ramp-640.webp 640w, /assets/photos/services/gallery-aircraft-ramp-1280.webp 1280w",
};

export const media = {
  "hero-ramp-night": heroRampNight,
  "equipment-carrucha": equipmentCarrucha,
  "equipment-tractor": equipmentTractor,
  "equipment-tractor-service": equipmentTractorService,
  "equipment-water-cart": equipmentWaterCart,
  "equipment-belt-loader": equipmentBeltLoader,
  "equipment-gpu": equipmentGpu,
  "family-ramp-gse": familyRampGse,
  "family-aircraft-care": familyAircraftCare,
  "family-fbo-operations": familyFboOperations,
  "family-passenger-services": familyPassengerServices,
  "family-gse-maintenance": familyGseMaintenance,
  "gallery-cargo-hold": galleryCargoHold,
  "gallery-cargo-hold-container": galleryCargoHoldContainer,
  "gallery-consolidation": galleryConsolidation,
  "gallery-uld-store": galleryUldStore,
  "gallery-baggage-sorting": galleryBaggageSorting,
  "gallery-night-ops": galleryNightOps,
  "gallery-night-aircraft": galleryNightAircraft,
  "gallery-belt-loading": galleryBeltLoading,
  "gallery-cargo-container": galleryCargoContainer,
  "gallery-loaded-cart": galleryLoadedCart,
  "gallery-ramp-team": galleryRampTeam,
  "gallery-belt-loader-ops": galleryBeltLoaderOps,
  "gallery-uld-ramp": galleryUldRamp,
  "gallery-aircraft-day": galleryAircraftDay,
  "gallery-aircraft-ramp": galleryAircraftRamp,
} as const satisfies Record<string, MediaAsset>;

/** Slides del hero en orden de rotacion. */
export const heroSlides: ArtDirectedAsset[] = [
  heroGseRamp,
];

export type MediaId = keyof typeof media;

export function getMedia(id: MediaId): MediaAsset {
  return media[id];
}
