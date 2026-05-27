import { PetType, PetSize } from '@/store/usePetStore';

export interface PetProfile {
  name: string;
  type: PetType;
  breed: string;
  size: PetSize;
  age: number | null;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  tagline: string;
  description: string;
  features: string[];
  specs: ProductSpecification[];
  isNew?: boolean;
  isBest?: boolean;
  infoImages?: string[];
  modelUrl?: string;
  recommendedFor?: {
    type?: PetType;
    size?: PetSize;
  };
}

export const products: Product[] = [
  {
    id: "window-hammock",
    name: "Duit Window Hammock",
    price: 2450,
    image: "https://duit.kr/web/product/big/window_hammock.jpg",
    images: [],
    category: "furniture",
    tagline: "A wider world, wider enjoyment",
    description: "A versatile window hammock for cats with three different styles to choose from, catering to your cat's preferences. It provides a wider view and a comfortable resting spot.",
    features: ["3 different hammock styles", "Strong suction cups", "Space-saving design", "Durable fabric"],
    specs: [
      { label: "Type", value: "Window Hammock" },
      { label: "Styles", value: "3 types" }
    ],
    isBest: true,
    recommendedFor: { type: "cat" }
  },
  {
    id: "catthenon",
    name: "Duit Catthenon",
    price: 1990,
    image: "https://duit.kr/web/product/big/catthenon.jpg",
    images: [],
    category: "furniture",
    tagline: "Catthenon, the kingdom of cats",
    description: "Create a kingdom for your cats with the Duit Catthenon, a modular and stylish cat furniture piece that serves as a secret base and scratcher.",
    features: ["Modular design", "Sturdy construction", "Aesthetic appeal", "Secret base for cats"],
    specs: [
      { label: "Material", value: "Premium Wood/Cardboard" }
    ],
    isBest: true,
    recommendedFor: { type: "cat" }
  },
  {
    id: "pure-da",
    name: "Duit Pure Da (Odor Free)",
    price: 1250,
    image: "https://duit.kr/web/product/big/pure_da.jpg",
    images: [],
    category: "hygiene",
    tagline: "Small but powerful motion sensor deodorizer",
    description: "A compact and powerful deodorizer that uses motion sensing technology to eliminate odors near the litter box or pet area.",
    features: ["Motion sensor activation", "Powerful deodorization", "Compact and portable", "Long battery life"],
    specs: [
      { label: "Technology", value: "Motion Sensor" },
      { label: "Function", value: "Deodorization" }
    ],
    isBest: true,
    recommendedFor: { type: "cat" }
  },
  {
    id: "summer-cushion",
    name: "Duit Summer Cushion",
    price: 2150,
    image: "https://duit.kr/web/product/big/summer_cushion.jpg",
    images: [],
    category: "play-rest",
    tagline: "Instant -5°C cooling for a refreshing daily life",
    description: "A cooling cushion with a 3D layered structure that provides an immediate cooling effect of -5°C, perfect for hot summer days.",
    features: ["3D layered structure", "-5°C cooling effect", "Breathable material", "Washable cover"],
    specs: [
      { label: "Sizes", value: "2 sizes available" },
      { label: "Cooling", value: "Instant -5°C" }
    ],
    isBest: true,
    recommendedFor: { type: "dog", size: "small" }
  },
  {
    id: "all-day-board",
    name: "Duit All Day Board",
    price: 950,
    image: "https://duit.kr/web/product/big/all_day_board.jpg",
    images: [],
    category: "play-rest",
    tagline: "Durable cat scratcher with premium & natural texture",
    description: "An essential scratcher for every cat, featuring a premium and natural texture that cats love. Available in multiple colors to match your home.",
    features: ["Premium texture", "Durable construction", "4 colors available", "Eco-friendly material"],
    specs: [
      { label: "Colors", value: "4 colors" },
      { label: "Material", value: "Natural Cardboard" }
    ],
    isBest: true,
    recommendedFor: { type: "cat" }
  },
  {
    id: "tiramisu-board",
    name: "Duit Tiramisu Board",
    price: 1750,
    image: "https://duit.kr/web/product/big/tiramisu_board.jpg",
    images: [],
    category: "play-rest",
    tagline: "One, two, three- the higher you go, the more you enjoy!",
    description: "A multi-tier scratcher board that offers vertical fun and scratching surfaces for cats, designed like a delicious tiramisu.",
    features: ["3-tier design", "Vertical scratching", "Stable base", "Stylish design"],
    specs: [
      { label: "Tiers", value: "3-tier" }
    ],
    recommendedFor: { type: "cat" }
  },
  {
    id: "mouse-bot",
    name: "Duit Mouse Bot",
    price: 1290,
    image: "https://duit.kr/web/product/big/mouse_bot.jpg",
    images: [],
    category: "play-rest",
    tagline: "A fun hunting adventure for cats",
    description: "An interactive toy that mimics the movement of a mouse, providing cats with a fun and engaging hunting experience to keep them active.",
    features: ["Interactive movement", "Hunting simulation", "Automatic play mode", "Durable shell"],
    specs: [
      { label: "Type", value: "Electronic Toy" }
    ],
    recommendedFor: { type: "cat" }
  },
  {
    id: "the-table-plus",
    name: "Duit The Table Plus",
    price: 4900,
    image: "https://duit.kr/web/product/big/the_table_plus.jpg",
    images: [],
    category: "eat-drink",
    tagline: "Customized automatic dry food dispenser in your hand",
    description: "An advanced automatic feeder that allows you to customize feeding schedules and portions via an app, ensuring your pet is always fed.",
    features: ["App control", "Customizable schedule", "Precise portions", "Sleek design"],
    specs: [
      { label: "Type", value: "Automatic Feeder" },
      { label: "Connectivity", value: "Wi-Fi / App" }
    ],
    isBest: true,
    recommendedFor: { type: "dog", size: "small" }
  },
  {
    id: "standing-board",
    name: "Duit Standing Board",
    price: 1990,
    image: "https://duit.kr/web/product/big/standing_board.jpg",
    images: [],
    category: "play-rest",
    tagline: "The successor to the All Day Board, an essential for all cats",
    description: "A vertical standing scratcher that provides a different scratching angle for cats who prefer upright surfaces, saving your furniture.",
    features: ["Vertical design", "Sturdy and stable", "Premium scratching surface", "Space-efficient"],
    specs: [
      { label: "Type", value: "Standing Scratcher" }
    ],
    recommendedFor: { type: "cat" }
  },
  {
    id: "peanut-board",
    name: "Duit Peanut Board",
    price: 1850,
    image: "https://duit.kr/web/product/big/peanut_board.jpg",
    images: [],
    category: "play-rest",
    tagline: "All the fun for cats in one place",
    description: "A peanut-shaped scratcher and lounge that offers multiple ways for cats to play, scratch, and rest in one compact unit.",
    features: ["Unique peanut shape", "Scratcher and lounge", "Durable material", "Ergonomic for cats"],
    specs: [
      { label: "Shape", value: "Peanut" }
    ],
    recommendedFor: { type: "cat" }
  },
  {
    id: "hidden-track-board",
    name: "Duit Hidden Track Board",
    price: 1790,
    image: "https://duit.kr/web/product/big/hidden_track_board.jpg",
    images: [],
    category: "play-rest",
    tagline: "Multi-scratcher for scratching and playing at once",
    description: "A multi-functional scratcher that includes a hidden track for balls, combining scratching with interactive play to keep cats entertained.",
    features: ["Hidden track with ball", "Interactive play", "Scratching surface", "Sturdy design"],
    specs: [
      { label: "Type", value: "Multi-scratcher" }
    ],
    recommendedFor: { type: "cat" }
  },
  {
    id: "all-day-basket",
    name: "Duit All Day Basket",
    price: 1690,
    image: "https://duit.kr/web/product/big/all_day_basket.jpg",
    images: [],
    category: "play-rest",
    tagline: "A comfortable hobby space for all cats",
    description: "A cozy basket-style bed and scratcher that provides a secure and comfortable space for cats to rest and observe their surroundings.",
    features: ["Basket shape", "Cozy interior", "Scratching exterior", "Durable"],
    specs: [
      { label: "Type", value: "Basket Bed" }
    ],
    recommendedFor: { type: "cat" }
  },
  {
    id: "dtx",
    name: "Duit Train Express (DTX)",
    price: 1450,
    image: "https://duit.kr/web/product/big/dtx.jpg",
    images: [],
    category: "play-rest",
    tagline: "Endlessly expandable new concept cat tunnel",
    description: "A modular cat tunnel system that can be expanded and reconfigured to create a fun train-like path for cats to explore.",
    features: ["Modular expansion", "Tunnel design", "Interactive play", "Easy to assemble"],
    specs: [
      { label: "System", value: "Modular" }
    ],
    recommendedFor: { type: "cat" }
  },
  {
    id: "poo-poo-box-2-way",
    name: "Duit Poo Poo Box 2 Way",
    price: 1350,
    image: "https://duit.kr/web/product/big/poo_poo_box_2_way.jpg",
    images: [],
    category: "hygiene",
    tagline: "Zero stress! Customized cat litter box",
    description: "A 2-way entry litter box designed to reduce stress for cats and minimize litter tracking for owners with its smart design.",
    features: ["2-way entry/exit", "Spacious interior", "Easy to clean", "Litter tracking prevention"],
    specs: [
      { label: "Type", value: "Litter Box" }
    ],
    recommendedFor: { type: "cat" }
  },
  {
    id: "poo-poo-mat",
    name: "Duit Poo Poo Mat",
    price: 750,
    image: "https://duit.kr/web/product/big/poo_poo_mat.jpg",
    images: [],
    category: "hygiene",
    tagline: "A wise way to reduce desertification (litter tracking)",
    description: "A high-quality mat designed to catch litter from cats' paws as they exit the litter box, keeping your floors clean.",
    features: ["Litter trapping design", "Easy to clean", "2 colors/2 sizes", "Non-slip"],
    specs: [
      { label: "Sizes", value: "2 sizes" },
      { label: "Colors", value: "2 colors" }
    ],
    recommendedFor: { type: "cat" }
  },
  {
    id: "kitty-tree",
    name: "Duit Kitty Tree",
    price: 12500,
    image: "https://duit.kr/web/product/big/kitty_tree.jpg",
    images: [],
    category: "furniture",
    tagline: "Rest, play, scratch - for up to five cats!",
    description: "A multi-cat scratcher tree that allows up to five cats to rest, play, and scratch simultaneously, perfect for multi-cat households.",
    features: ["Multi-cat use", "Tree structure", "Durable scratching posts", "Stable base"],
    specs: [
      { label: "Capacity", value: "Up to 5 cats" }
    ],
    recommendedFor: { type: "cat" }
  },
  {
    id: "kitty-picker",
    name: "Duit Kitty Picker",
    price: 850,
    image: "https://duit.kr/web/product/big/kitty_picker.jpg",
    images: [],
    category: "play-rest",
    tagline: "The toy your cat picks at first sight!",
    description: "A premium fishing rod toy for cats, designed to be irresistible and highly engaging with its lifelike movements.",
    features: ["High engagement", "Premium materials", "Interchangeable ends", "Ergonomic handle"],
    specs: [
      { label: "Type", value: "Fishing Rod Toy" }
    ],
    recommendedFor: { type: "cat" }
  },
  {
    id: "tent-station",
    name: "Duit Tent Station",
    price: 2450,
    image: "https://duit.kr/web/product/big/tent_station.jpg",
    images: [],
    category: "furniture",
    tagline: "Warm base camp, a pause at the end of the adventure",
    description: "A cozy tent-style hideout for pets, providing a warm and secure base camp for rest and play after their daily adventures.",
    features: ["Tent design", "Cozy interior", "Stylish aesthetic", "Easy to set up"],
    specs: [
      { label: "Type", value: "Pet Tent" }
    ],
    recommendedFor: { type: "cat" }
  },
  {
    id: "buggie-bot",
    name: "Duit Buggie Bot",
    price: 1050,
    image: "https://duit.kr/web/product/big/buggie_bot.jpg",
    images: [],
    category: "play-rest",
    tagline: "Hunting skill level up!",
    description: "An interactive bug-like toy that helps cats upgrade their hunting skills through unpredictable and fast movements.",
    features: ["Unpredictable movement", "Hunting skill training", "Compact size", "Automatic obstacle avoidance"],
    specs: [
      { label: "Type", value: "Electronic Toy" }
    ],
    recommendedFor: { type: "cat" }
  },
  {
    id: "kitty-cinema",
    name: "Duit Kitty Cinema",
    price: 1550,
    image: "https://duit.kr/web/product/big/kitty_cinema.jpg",
    images: [],
    category: "play-rest",
    tagline: "Mini theater that will captivate you",
    description: "A projection and mood lamp designed for cats and their owners to enjoy together, creating a mini theater experience at home.",
    features: ["Projection function", "Mood lamp mode", "Interactive visuals", "Compact design"],
    specs: [
      { label: "Type", value: "Mood Lamp / Projector" }
    ],
    recommendedFor: { type: "cat" }
  },
  {
    id: "yummy-ball",
    name: "Duit Yummy Ball",
    price: 1450,
    image: "https://duit.kr/web/product/big/yummy_ball.jpg",
    images: [],
    category: "play-rest",
    tagline: "Your playful toy buddy, nose work master",
    description: "An interactive nose work toy that encourages pets to play and find treats, fulfilling their daily activity and mental stimulation needs.",
    features: ["Nose work training", "Treat dispensing", "Interactive play", "Durable material"],
    specs: [
      { label: "Type", value: "Nose Work Toy" }
    ],
    recommendedFor: { type: "dog" }
  },
  {
    id: "custom-potty",
    name: "Duit Custom Potty",
    price: 1650,
    image: "https://duit.kr/web/product/big/custom_potty.jpg",
    images: [],
    category: "hygiene",
    tagline: "Customized potty space for pets",
    description: "A customizable potty tray designed to fit your pet's needs and your home's aesthetic, making potty training easier.",
    features: ["Customizable design", "Easy to clean", "Durable construction", "Non-slip base"],
    specs: [
      { label: "Type", value: "Potty Tray" }
    ],
    recommendedFor: { type: "dog" }
  },
  {
    id: "anti-bug-light",
    name: "Duit Anti Bug Light",
    price: 590,
    image: "https://duit.kr/web/product/big/anti_bug_light.jpg",
    images: [],
    category: "daily",
    tagline: "Blinking LED for safe night walks",
    description: "A bright LED light that attaches to your pet's collar, ensuring safety during night walks and helping to repel bugs.",
    features: ["Bright LED light", "Anti-bug function", "Easy attachment", "Water-resistant"],
    specs: [
      { label: "Type", value: "Safety Light" }
    ],
    recommendedFor: { type: "dog" }
  },
  {
    id: "banana-brush",
    name: "Duit Banana Brush",
    price: 750,
    image: "https://duit.kr/web/product/big/banana_brush.jpg",
    images: [],
    category: "hygiene",
    tagline: "Glossy care without irritation",
    description: "A gentle brush designed for grooming and maintaining a glossy coat without irritating the pet's skin, shaped like a banana.",
    features: ["Gentle silicone bristles", "Ergonomic banana shape", "Glossy coat care", "Easy to clean"],
    specs: [
      { label: "Type", value: "Grooming Brush" },
      { label: "Material", value: "Silicone" }
    ],
    recommendedFor: { type: "dog" }
  },
  {
    id: "floating-bathtub",
    name: "Duit Floating Bathtub",
    price: 1350,
    image: "https://duit.kr/web/product/big/floating_bathtub.jpg",
    images: [],
    category: "hygiene",
    tagline: "Multi-functional collapsible bathtub",
    description: "A collapsible bathtub that is easy to store and use, perfect for bathing pets of various sizes and even for outdoor use.",
    features: ["Collapsible design", "Space-saving", "Durable and safe", "Multi-functional"],
    specs: [
      { label: "Type", value: "Bathtub" }
    ],
    recommendedFor: { type: "dog", size: "small" }
  },
  {
    id: "eraser-bin",
    name: "Duit Eraser Bin",
    price: 1250,
    image: "https://duit.kr/web/product/big/eraser_bin.jpg",
    images: [],
    category: "hygiene",
    tagline: "Touchless motion sensor trash can",
    description: "A hygienic, touchless trash can with a motion sensor, ideal for disposing of pet waste and keeping odors contained.",
    features: ["Motion sensor activation", "Touchless operation", "Odor control", "Sleek design"],
    specs: [
      { label: "Type", value: "Trash Can" },
      { label: "Sensor", value: "Motion" }
    ]
  }
];

export const getRecommendedProducts = (profile: PetProfile | null, productsList: Product[]) => {
  if (!profile) return productsList.filter(p => p.isBest);
  
  return productsList.map(product => {
    let score = 0;
    if (!product.recommendedFor) return { product, score: 1 };
    
    if (product.recommendedFor.type) {
      if (product.recommendedFor.type === profile.type) score += 10;
      else score -= 100;
    } else {
      score += 5;
    }

    if (product.recommendedFor.size) {
      if (product.recommendedFor.size === profile.size) score += 8;
      else score += 2;
    } else {
      score += 4;
    }

    if (product.isBest) score += 2;
    if (product.isNew) score += 2;

    return { product, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .map(item => item.product);
};
