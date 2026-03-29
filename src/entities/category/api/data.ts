import type { Category } from "../types";
import advancedBuildingSets from "../../../advanced_building_sets.png";
import engine from "../../../engine.png";
import figures from "../../../figures.png";
import tradingCards from "../../../trading_cards.png";

export const categoriesData: Category[] = [
  {
    id: "cat-engineering",
    name: "Engineering Models",
    slug: "engineering-models",
    description:
      "Precision mechanical models an``d metal engine kits for builders and collectors.",
    image: engine.src,
  },
  {
    id: "cat-model-kits",
    name: "Model Kits",
    slug: "model-kits",
    description: "Assembly kits for all skill levels — plastic, resin, and metal.",
    image: advancedBuildingSets.src,
  },
  {
    id: "cat-figures",
    name: "Figures",
    slug: "figures",
    description: "Collectible and toy figures from your favorite franchises.",
    image: figures.src,
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Stands, cases, and compatible accessories.",
    image: tradingCards.src,
  },
];
