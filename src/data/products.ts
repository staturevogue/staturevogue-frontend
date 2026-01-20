export interface Product {
  id: string;
  name: string;
  category: string;
  collection?: string;
  gender: "Men" | "Women";
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  description: string;
  images: string[]; 
  colors: { name: string; hex: string }[];
  sizes: { size: string; inStock: boolean }[];
  features: string[];
  careInstructions: string[];
  fabric: string;
  fit: string;
  inStock: boolean;
}

const commonFeatures = ["100% Premium Cotton", "Pre-shrunk fabric", "Double-stitched hem", "Color-fast dye"];
const dryFitFeatures = ["Moisture Wicking", "4-Way Stretch", "Breathable Mesh", "Quick Dry"];
const commonCare = ["Machine wash cold", "Do not bleach", "Tumble dry low", "Iron on low heat"];

export const products: Product[] = [
  // --- MEN'S COLLECTION ---
  {
    id: "m-crew-1",
    name: "Classic Men's Crew Neck",
    category: "Crew Neck",
    gender: "Men",
    price: 999,
    originalPrice: 1499,
    rating: 4.8,
    reviewCount: 1240,
    badge: "BESTSELLER",
    description: "The essential everyday tee. Soft, breathable, and built to last.",
    images: ["/images/products/men-crew.jpg"],
    colors: [{ name: "Black", hex: "#000000" }, { name: "White", hex: "#FFFFFF" }, { name: "Navy", hex: "#1F2B5B" }],
    sizes: [{ size: "S", inStock: true }, { size: "M", inStock: true }, { size: "L", inStock: true }, { size: "XL", inStock: true }],
    features: commonFeatures,
    careInstructions: commonCare,
    fabric: "100% Combed Cotton",
    fit: "Regular Fit",
    inStock: true
  },
  {
    id: "m-oversize-1",
    name: "Street Oversize Tee",
    category: "Oversize T-shirts",
    gender: "Men",
    price: 1299,
    originalPrice: 1999,
    rating: 4.9,
    reviewCount: 850,
    badge: "TRENDING",
    description: "Relaxed dropped-shoulder fit for that modern street style aesthetic.",
    images: ["/images/products/men-oversize.jpg"],
    colors: [{ name: "Beige", hex: "#F5F5DC" }, { name: "Olive", hex: "#556B2F" }],
    sizes: [{ size: "M", inStock: true }, { size: "L", inStock: true }, { size: "XL", inStock: true }],
    features: commonFeatures,
    careInstructions: commonCare,
    fabric: "Heavyweight Cotton (240 GSM)",
    fit: "Oversized Fit",
    inStock: true
  },
  {
    id: "m-polo-1",
    name: "Premium Pique Polo",
    category: "Polos",
    gender: "Men",
    price: 1499,
    originalPrice: 2299,
    rating: 4.7,
    reviewCount: 520,
    description: "Smart casual perfection. Structured collar that stays crisp all day.",
    images: ["/images/products/men-polo.jpg"],
    colors: [{ name: "Navy", hex: "#1F2B5B" }, { name: "Maroon", hex: "#800000" }],
    sizes: [{ size: "M", inStock: true }, { size: "L", inStock: true }, { size: "XL", inStock: false }],
    features: ["Anti-roll collar", "2-button placket", "Split hem"],
    careInstructions: commonCare,
    fabric: "Cotton Pique",
    fit: "Slim Fit",
    inStock: true
  },
  {
    id: "m-dryfit-round-1",
    name: "Performance Dry-Fit Round",
    category: "Dry Fit",
    gender: "Men",
    price: 899,
    originalPrice: 1299,
    rating: 4.6,
    reviewCount: 310,
    description: "Engineered for intense workouts. Keeps you cool and dry.",
    images: ["/images/products/men-dryfit-round.jpg"],
    colors: [{ name: "Grey", hex: "#808080" }, { name: "Neon Blue", hex: "#4D4DFF" }],
    sizes: [{ size: "S", inStock: true }, { size: "M", inStock: true }, { size: "L", inStock: true }],
    features: dryFitFeatures,
    careInstructions: ["Machine wash cold", "No fabric softener", "Air dry"],
    fabric: "Polyester Spandex Blend",
    fit: "Athletic Fit",
    inStock: true
  },
  {
    id: "m-dryfit-collar-1",
    name: "Performance Dry-Fit Collar",
    category: "Dry Fit",
    gender: "Men",
    price: 1099,
    originalPrice: 1599,
    rating: 4.8,
    reviewCount: 190,
    description: "The look of a polo with the performance of gym wear.",
    images: ["/images/products/men-dryfit-collar.jpg"],
    colors: [{ name: "Black", hex: "#000000" }, { name: "White", hex: "#FFFFFF" }],
    sizes: [{ size: "M", inStock: true }, { size: "L", inStock: true }, { size: "XL", inStock: true }],
    features: dryFitFeatures,
    careInstructions: ["Machine wash cold", "No fabric softener", "Air dry"],
    fabric: "Micro-Mesh Polyester",
    fit: "Regular Fit",
    inStock: true
  },
  {
    id: "m-tracks-1",
    name: "Everyday Regular Tracks",
    category: "Regular tracks",
    gender: "Men",
    price: 1599,
    originalPrice: 2499,
    rating: 4.5,
    reviewCount: 440,
    description: "Comfortable track pants for lounging or light activities.",
    images: ["/images/products/men-tracks.jpg"],
    colors: [{ name: "Black", hex: "#000000" }, { name: "Grey Melange", hex: "#A9A9A9" }],
    sizes: [{ size: "S", inStock: true }, { size: "M", inStock: true }, { size: "L", inStock: true }, { size: "XL", inStock: true }],
    features: ["Elastic waistband", "Deep pockets", "Soft brushed interior"],
    careInstructions: commonCare,
    fabric: "Cotton Poly Blend",
    fit: "Regular Fit",
    inStock: true
  },
  {
    id: "m-pants-1",
    name: "Semi-Formal Straight Pants",
    category: "Semi Formal Pants",
    gender: "Men",
    price: 1999,
    originalPrice: 2999,
    rating: 4.8,
    reviewCount: 600,
    badge: "NEW",
    description: "Solid straight fit pants that bridge the gap between formal and casual.",
    images: ["/images/products/men-pants.jpg"],
    colors: [{ name: "Khaki", hex: "#F0E68C" }, { name: "Black", hex: "#000000" }, { name: "Navy", hex: "#1F2B5B" }],
    sizes: [{ size: "30", inStock: true }, { size: "32", inStock: true }, { size: "34", inStock: true }, { size: "36", inStock: true }],
    features: ["Wrinkle resistant", "Stretch waist", "Button closure"],
    careInstructions: commonCare,
    fabric: "Cotton Elastane",
    fit: "Straight Fit",
    inStock: true
  },
  {
    id: "m-shorts-1",
    name: "Essential Cotton Shorts",
    category: "Shorts",
    gender: "Men",
    price: 999,
    originalPrice: 1499,
    rating: 4.6,
    reviewCount: 220,
    description: "Breathable shorts perfect for summer days or home comfort.",
    images: ["/images/products/men-shorts.jpg"],
    colors: [{ name: "Olive", hex: "#556B2F" }, { name: "Black", hex: "#000000" }],
    sizes: [{ size: "S", inStock: true }, { size: "M", inStock: true }, { size: "L", inStock: true }],
    features: ["Drawstring waist", "2 side pockets", "Knee length"],
    careInstructions: commonCare,
    fabric: "100% French Terry Cotton",
    fit: "Relaxed Fit",
    inStock: true
  },

  // --- WOMEN'S COLLECTION ---
  {
    id: "w-crew-1",
    name: "Women's Classic Crew",
    category: "Crew Neck",
    gender: "Women",
    price: 899,
    originalPrice: 1299,
    rating: 4.9,
    reviewCount: 880,
    badge: "BESTSELLER",
    description: "A flattering cut on a classic design. Soft touch fabric.",
    images: ["/images/products/women-crew.jpg"],
    colors: [{ name: "Pink", hex: "#FFC0CB" }, { name: "White", hex: "#FFFFFF" }, { name: "Lavender", hex: "#E6E6FA" }],
    sizes: [{ size: "XS", inStock: true }, { size: "S", inStock: true }, { size: "M", inStock: true }, { size: "L", inStock: true }],
    features: commonFeatures,
    careInstructions: commonCare,
    fabric: "Cotton Modal Blend",
    fit: "Regular Fit",
    inStock: true
  },
  {
    id: "w-oversize-1",
    name: "Boyfriend Oversize Tee",
    category: "Oversize T-shirts",
    gender: "Women",
    price: 1199,
    originalPrice: 1799,
    rating: 4.8,
    reviewCount: 1100,
    badge: "TRENDING",
    description: "Maximum comfort with unmatched style. The perfect oversize fit.",
    images: ["/images/products/women-oversize.jpg"],
    colors: [{ name: "Black", hex: "#000000" }, { name: "Lilac", hex: "#C8A2C8" }],
    sizes: [{ size: "S", inStock: true }, { size: "M", inStock: true }, { size: "L", inStock: true }],
    features: commonFeatures,
    careInstructions: commonCare,
    fabric: "100% Heavy Cotton",
    fit: "Oversized Fit",
    inStock: true
  },
  {
    id: "w-dryfit-1",
    name: "Women's Active Dry-Fit",
    category: "Dry Fit",
    gender: "Women",
    price: 999,
    originalPrice: 1499,
    rating: 4.7,
    reviewCount: 450,
    description: "High performance wear for yoga, running, or gym.",
    images: ["/images/products/women-dryfit.jpg"],
    colors: [{ name: "Coral", hex: "#FF7F50" }, { name: "Black", hex: "#000000" }],
    sizes: [{ size: "XS", inStock: true }, { size: "S", inStock: true }, { size: "M", inStock: true }, { size: "L", inStock: true }],
    features: dryFitFeatures,
    careInstructions: ["Machine wash cold", "Air dry"],
    fabric: "Nylon Spandex",
    fit: "Slim Fit",
    inStock: true
  }
];