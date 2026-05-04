import cementOpc from "@/assets/product-cement-opc.jpg";
import cementPpc from "@/assets/product-cement-ppc.jpg";
import tmtBars from "@/assets/product-tmt-bars.jpg";
import bricks from "@/assets/product-bricks.jpg";
import sand from "@/assets/product-sand.jpg";
import aggregate from "@/assets/product-aggregate.jpg";

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: "cement" | "tmt-bars" | "bricks" | "aggregates";
  price: number;
  unit: string;
  minOrder: number;
  image: string;
  rating: number;
  description: string;
  specs: { label: string; value: string }[];
  inStock: boolean;
};

export const CATEGORIES = [
  { slug: "cement", name: "Cement", description: "OPC, PPC & specialty cement" },
  { slug: "tmt-bars", name: "TMT Bars", description: "High-strength steel reinforcement" },
  { slug: "bricks", name: "Bricks & Blocks", description: "Red clay, fly ash & AAC blocks" },
  { slug: "aggregates", name: "Sand & Aggregates", description: "River sand, M-sand, gravel" },
] as const;

export const PRODUCTS: Product[] = [
  {
    id: "p1", slug: "ultratech-opc-53", name: "UltraTech OPC 53 Grade Cement",
    brand: "UltraTech", category: "cement", price: 410, unit: "bag (50 kg)", minOrder: 10,
    image: cementOpc, rating: 4.7, inStock: true,
    description: "Premium grade Ordinary Portland Cement engineered for high-strength structural applications including foundations, beams, and columns.",
    specs: [
      { label: "Grade", value: "OPC 53" },
      { label: "Weight", value: "50 kg" },
      { label: "Setting Time", value: "30 min (initial)" },
      { label: "Compressive Strength", value: "53 MPa" },
    ],
  },
  {
    id: "p2", slug: "ambuja-ppc", name: "Ambuja Plus PPC Cement",
    brand: "Ambuja", category: "cement", price: 385, unit: "bag (50 kg)", minOrder: 10,
    image: cementPpc, rating: 4.6, inStock: true,
    description: "Portland Pozzolana Cement ideal for plastering, masonry and general construction. Excellent durability and workability.",
    specs: [
      { label: "Grade", value: "PPC" },
      { label: "Weight", value: "50 kg" },
      { label: "Setting Time", value: "60 min (initial)" },
      { label: "Best For", value: "Plastering, Masonry" },
    ],
  },
  {
    id: "p3", slug: "acc-gold-ppc", name: "ACC Gold Water Shield Cement",
    brand: "ACC", category: "cement", price: 395, unit: "bag (50 kg)", minOrder: 10,
    image: cementOpc, rating: 4.5, inStock: true,
    description: "Water-resistant cement engineered for areas exposed to moisture. Reduces seepage and increases durability.",
    specs: [
      { label: "Grade", value: "PPC" },
      { label: "Weight", value: "50 kg" },
      { label: "Special Feature", value: "Water Repellent" },
      { label: "Setting Time", value: "45 min" },
    ],
  },
  {
    id: "p4", slug: "tata-tiscon-fe550-12mm", name: "Tata Tiscon SD TMT Bar Fe550 — 12mm",
    brand: "Tata Tiscon", category: "tmt-bars", price: 62, unit: "kg", minOrder: 100,
    image: tmtBars, rating: 4.8, inStock: true,
    description: "Super ductile TMT rebar with superior earthquake resistance. Ideal for slabs, beams, and columns.",
    specs: [
      { label: "Grade", value: "Fe 550 SD" },
      { label: "Diameter", value: "12 mm" },
      { label: "Length", value: "12 m" },
      { label: "Yield Strength", value: "550 N/mm²" },
    ],
  },
  {
    id: "p5", slug: "jsw-neosteel-fe500-16mm", name: "JSW Neosteel Fe500D TMT — 16mm",
    brand: "JSW", category: "tmt-bars", price: 60, unit: "kg", minOrder: 100,
    image: tmtBars, rating: 4.7, inStock: true,
    description: "High-strength corrosion-resistant TMT bars with consistent dimensional accuracy. Best for structural reinforcement.",
    specs: [
      { label: "Grade", value: "Fe 500D" },
      { label: "Diameter", value: "16 mm" },
      { label: "Length", value: "12 m" },
      { label: "Yield Strength", value: "500 N/mm²" },
    ],
  },
  {
    id: "p6", slug: "sail-tmt-fe500-8mm", name: "SAIL TMT Bar Fe500 — 8mm",
    brand: "SAIL", category: "tmt-bars", price: 58, unit: "kg", minOrder: 100,
    image: tmtBars, rating: 4.5, inStock: true,
    description: "Premium quality 8mm TMT bars for stirrups and ties. Manufactured in state-of-the-art mills.",
    specs: [
      { label: "Grade", value: "Fe 500" },
      { label: "Diameter", value: "8 mm" },
      { label: "Length", value: "12 m" },
      { label: "Use", value: "Stirrups, Ties" },
    ],
  },
  {
    id: "p7", slug: "red-clay-bricks", name: "Red Clay Bricks (Class A)",
    brand: "Local", category: "bricks", price: 9, unit: "piece", minOrder: 500,
    image: bricks, rating: 4.4, inStock: true,
    description: "Premium Class A red clay bricks. Uniform size, sharp edges, and excellent compressive strength.",
    specs: [
      { label: "Size", value: "230x110x75 mm" },
      { label: "Class", value: "A Grade" },
      { label: "Compressive Strength", value: "10.5 N/mm²" },
      { label: "Water Absorption", value: "< 15%" },
    ],
  },
  {
    id: "p8", slug: "aac-blocks", name: "AAC Lightweight Blocks",
    brand: "Siporex", category: "bricks", price: 65, unit: "piece", minOrder: 100,
    image: bricks, rating: 4.6, inStock: true,
    description: "Autoclaved Aerated Concrete blocks. Lightweight, fire-resistant, and excellent thermal insulation.",
    specs: [
      { label: "Size", value: "600x200x100 mm" },
      { label: "Density", value: "550-650 kg/m³" },
      { label: "Fire Rating", value: "4 hours" },
      { label: "Thermal Conductivity", value: "0.16 W/mK" },
    ],
  },
  {
    id: "p9", slug: "river-sand", name: "River Sand (Construction Grade)",
    brand: "Local", category: "aggregates", price: 1850, unit: "ton", minOrder: 5,
    image: sand, rating: 4.5, inStock: true,
    description: "Naturally washed river sand. Ideal for concrete, plastering, and masonry work.",
    specs: [
      { label: "Grade", value: "Zone II" },
      { label: "Type", value: "Natural River Sand" },
      { label: "Silt Content", value: "< 3%" },
      { label: "Fineness Modulus", value: "2.6 - 2.9" },
    ],
  },
  {
    id: "p10", slug: "20mm-aggregate", name: "20mm Stone Aggregate",
    brand: "Local", category: "aggregates", price: 1450, unit: "ton", minOrder: 5,
    image: aggregate, rating: 4.5, inStock: true,
    description: "Crushed stone aggregate of 20mm size. Used in RCC, road construction, and concrete work.",
    specs: [
      { label: "Size", value: "20 mm" },
      { label: "Type", value: "Crushed Stone" },
      { label: "Shape", value: "Angular" },
      { label: "Use", value: "RCC, Concrete" },
    ],
  },
  {
    id: "p11", slug: "m-sand", name: "M-Sand (Manufactured Sand)",
    brand: "Local", category: "aggregates", price: 1650, unit: "ton", minOrder: 5,
    image: sand, rating: 4.4, inStock: true,
    description: "Eco-friendly manufactured sand. Cubical particles ensure better workability and strength.",
    specs: [
      { label: "Grade", value: "Zone II" },
      { label: "Type", value: "Manufactured" },
      { label: "Shape", value: "Cubical" },
      { label: "Use", value: "Concrete, Plastering" },
    ],
  },
  {
    id: "p12", slug: "fly-ash-bricks", name: "Fly Ash Bricks",
    brand: "EcoBuild", category: "bricks", price: 7, unit: "piece", minOrder: 500,
    image: bricks, rating: 4.3, inStock: true,
    description: "Eco-friendly fly ash bricks. Higher strength, lower water absorption than clay bricks.",
    specs: [
      { label: "Size", value: "230x110x75 mm" },
      { label: "Compressive Strength", value: "12 N/mm²" },
      { label: "Water Absorption", value: "< 12%" },
      { label: "Eco-Friendly", value: "Yes" },
    ],
  },
];

export const DELIVERY = {
  freeAbove: 10000,
  charge: 100,
  radiusKm: 20,
  city: "Mumbai",
};

export function calcDelivery(subtotal: number) {
  return subtotal >= DELIVERY.freeAbove ? 0 : DELIVERY.charge;
}

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getByCategory(category: string) {
  return PRODUCTS.filter((p) => p.category === category);
}