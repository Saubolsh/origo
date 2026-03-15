import type { Product } from "../types";

export const productsData: Product[] = [
  // ─── Engineering Model ─────────────────────────────────────────────────
  {
    id: "prod-eng-1",
    name: "V8 Metal Engine Model",
    slug: "v8-metal-engine-model",
    shortDescription: "1:4 scale working replica with moving pistons.",
    description:
      "Build a fully functional 1:4 scale V8 engine from precision metal parts. Features moving pistons, crankshaft, and belt drive. Ideal for display or education.",
    price: 24900,
    currency: "USD",
    brand: "MetalWorks",
    categoryId: "cat-engineering",
    productType: "engineering-model",
    sku: "MW-V8-001",
    availability: "in-stock",
    coverImage:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    ],
    badges: ["Best Seller"],
    specifications: { Scale: "1:4", "Assembly time": "~15 hours" },
    engineType: "V8",
    partCount: 320,
    assemblyRequired: true,
    movingParts: true,
    materials: ["metal", "plastic"],
  },
  // ─── Collectible Figure ─────────────────────────────────────────────────
  {
    id: "prod-fig-1",
    name: "Anime Hero Figurine — Limited",
    slug: "anime-hero-figurine-limited",
    shortDescription: "Official licensed 1/7 scale with articulated arms.",
    description:
      "Official licensed collectible from the hit series. 1/7 scale with detailed sculpt, articulated arms, and included display base and extra hands.",
    price: 18900,
    currency: "USD",
    brand: "AnimeCollect",
    categoryId: "cat-figures",
    productType: "collectible-figure",
    sku: "AC-HERO-001",
    availability: "in-stock",
    coverImage:
      "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800",
    ],
    badges: ["Limited", "Exclusive"],
    specifications: { Scale: "1/7", Height: "24 cm" },
    character: "Hero",
    franchise: "Anime Series X",
    articulated: true,
    accessoriesIncluded: ["display base", "extra hands"],
    heightCm: 24,
  },
  // ─── Statue ─────────────────────────────────────────────────────────────
  {
    id: "prod-statue-1",
    name: "Legendary Warrior Statue",
    slug: "legendary-warrior-statue",
    shortDescription: "Premium 1/6 scale resin statue with certificate.",
    description:
      "Museum-quality resin statue by renowned sculptor. Limited run with numbered certificate of authenticity and custom display base.",
    price: 59900,
    currency: "USD",
    brand: "PrimeStatues",
    categoryId: "cat-statues",
    productType: "statue",
    sku: "PS-WAR-001",
    availability: "preorder",
    coverImage:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800",
      "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800",
    ],
    badges: ["Limited", "New"],
    specifications: { Scale: "1/6", Material: "Resin", Height: "35 cm" },
    franchise: "Epic Fantasy",
    scale: "1/6",
    artist: "Studio Legend",
    certificateIncluded: true,
    baseIncluded: true,
  },
  // ─── Toy Figure ─────────────────────────────────────────────────────────
  {
    id: "prod-toy-1",
    name: "Adventure Action Figure",
    slug: "adventure-action-figure",
    shortDescription: "Kid-friendly 6\" figure with accessories.",
    description:
      "Durable, kid-safe action figure with multiple points of articulation. Includes weapon and stand. Ages 6+.",
    price: 2499,
    currency: "USD",
    brand: "PlayLine",
    categoryId: "cat-figures",
    productType: "toy-figure",
    sku: "PL-ADV-001",
    availability: "in-stock",
    coverImage:
      "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800",
    ],
    badges: ["New"],
    specifications: { Height: "15 cm", "Recommended age": "6+" },
    character: "Adventure Hero",
    franchise: "Adventure Kids",
    recommendedAge: "6+",
    material: "PVC",
  },
  // ─── Accessory ──────────────────────────────────────────────────────────
  {
    id: "prod-acc-1",
    name: "Universal Display Stand",
    slug: "universal-display-stand",
    shortDescription: "Acrylic stand for figures and statues.",
    description:
      "Clear acrylic display stand with adjustable height. Compatible with most 1/7 and 1/6 scale figures and small statues.",
    price: 1999,
    currency: "USD",
    brand: "DisplayPro",
    categoryId: "cat-accessories",
    productType: "accessory",
    sku: "DP-STAND-01",
    availability: "in-stock",
    coverImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    ],
    specifications: { Material: "Acrylic", "Max load": "2 kg" },
    accessoryType: "display stand",
    compatibility: ["1/7 scale", "1/6 scale", "figures", "statues"],
    material: "acrylic",
  },
  // ─── Model Kit ─────────────────────────────────────────────────────────
  {
    id: "prod-kit-1",
    name: "Space Cruiser Model Kit",
    slug: "space-cruiser-model-kit",
    shortDescription: "Intermediate plastic model kit with decals.",
    description:
      "Detailed plastic model kit with decals and optional LED set. Difficulty: intermediate. Recommended for ages 14+.",
    price: 4499,
    currency: "USD",
    brand: "ModelSpace",
    categoryId: "cat-model-kits",
    productType: "model-kit",
    sku: "MS-SC-001",
    availability: "in-stock",
    coverImage:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800",
    ],
    badges: ["New"],
    specifications: { Scale: "1/144", Parts: "~180" },
    difficultyLevel: "intermediate",
    partsIncluded: 180,
    assemblyRequired: true,
    recommendedAge: "14+",
  },
];
