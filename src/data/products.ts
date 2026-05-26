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
  modelUrl?: string;
  recommendedFor?: {
    type?: PetType;
    size?: PetSize;
  };
}

export const products: Product[] = [
  // --- FEEDING ---
  {
    id: 'the-table-plus',
    name: 'The Table Plus',
    price: 8900,
    image: 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/13ff08bf73ad5.jpg?w=1000',
    category: 'eat-drink',
    tagline: 'Customizable Dry Food Dispenser for Dogs & Cats',
    description: 'เครื่องให้อาหารอัตโนมัติระดับเรือธงที่มุ่งเน้นเรื่องสรีระของสัตว์เลี้ยงเป็นสำคัญ สามารถปรับระดับความสูงและองศาการกินได้ละเอียด เพื่อลดแรงกดทับของกระดูกสันหลังส่วนคอ มาพร้อมระบบจ่ายอาหารที่แม่นยำและวัสดุเกรดพรีเมียม',
    features: [
      'ปรับความสูงได้ 4 ระดับ (6cm, 8cm, 10cm, 12cm)',
      'ปรับองศาชามได้ 3 ระดับ (0°, 10°, 20°)',
      'ชามสแตนเลส 304 ทนทาน ไม่สะสมแบคทีเรีย',
      'ระบบจ่ายอาหารอัจฉริยะ ป้องกันอาหารติดขัด',
      'ดีไซน์มินิมอล ทำความสะอาดง่ายทุกชิ้นส่วน'
    ],
    specs: [
      { label: 'วัสดุ', value: 'ABS / Stainless Steel 304' },
      { label: 'ขนาด', value: '180 x 180 x 250 mm' },
      { label: 'น้ำหนัก', value: '2.8 KG' },
      { label: 'ความจุ', value: '4 Liters' }
    ],
    isBest: true,
    isNew: true,
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    recommendedFor: { type: 'dog', size: 'medium' }
  },
  {
    id: 'the-water-pure-da',
    name: 'The Water Pure Da',
    price: 4500,
    image: 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/02c3dd1725fb7.jpg?w=1000',
    category: 'eat-drink',
    tagline: 'Ultra-Silent Premium Water Fountain',
    description: 'น้ำพุแมวและสุนัขที่ออกแบบมาเพื่อความเงียบสงบและการกรองน้ำที่สะอาดที่สุด ระบบหมุนเวียนน้ำเลียนแบบธรรมชาติ ช่วยกระตุ้นให้สัตว์เลี้ยงดื่มน้ำมากขึ้น ป้องกันโรคไตและทางเดินปัสสาวะ',
    features: [
      'ปั๊มน้ำแม่เหล็ก Ultra-Silent เสียงต่ำกว่า 20dB',
      'ระบบกรอง 3 ชั้น ขจัดคลอรีน โลหะหนัก และขน',
      'วัสดุเซรามิกและสแตนเลสเกรดการแพทย์',
      'ดีไซน์เปิดโล่ง 360 องศา ดื่มน้ำได้ทุกทิศทาง',
      'ระบบตัดไฟอัตโนมัติเมื่อน้ำแห้ง'
    ],
    specs: [
      { label: 'วัสดุ', value: 'Ceramic / PCTG / Stainless Steel' },
      { label: 'ความจุ', value: '2.0 Liters' },
      { label: 'แรงดันไฟ', value: 'DC 5V / 1A' },
      { label: 'การรับประกัน', value: '1 Year Official' }
    ],
    isBest: true,
    recommendedFor: {} // All pets
  },

  // --- LIVING ---
  {
    id: 'tent-station',
    name: 'Tent Station',
    price: 5900,
    image: 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/189a556efbbf8.jpg?w=1000',
    category: 'furniture',
    tagline: 'Cozy Base Camp for Pet Adventures',
    description: 'บ้านพักผ่อนทรงเต็นท์ที่มอบความรู้สึกปลอดภัยและอบอุ่น ออกแบบมาให้เป็นเฟอร์นิเจอร์ชิ้นหรูในบ้าน ผลิตจากเนื้อผ้าคุณภาพสูงที่ระบายอากาศได้ดีเยี่ยม พร้อมเบาะรองนอนหนานุ่มพิเศษ',
    features: [
      'โครงสร้างอลูมิเนียมเกรดอากาศยาน แข็งแรงน้ำหนักเบา',
      'ผ้า Micro-Fiber ถักทอละเอียด กันไรฝุ่นและขนไม่ติด',
      'เบาะรองนอน Double-Side (หนาว/ร้อน) ใช้ได้ทุกฤดู',
      'ดีไซน์ปิดทึบบางส่วนเพื่อลดความเครียดของสัตว์เลี้ยง',
      'ประกอบง่ายภายใน 5 นาที ไม่ต้องใช้เครื่องมือ'
    ],
    specs: [
      { label: 'วัสดุโครง', value: 'Aircraft Grade Aluminum' },
      { label: 'เนื้อผ้า', value: 'Premium Canvas / Mesh' },
      { label: 'น้ำหนัก', value: '1.5 KG' },
      { label: 'การซัก', value: 'Machine Washable (Gentle Cycle)' }
    ],
    isNew: true,
    recommendedFor: { size: 'medium' }
  },
  {
    id: 'all-day-board',
    name: 'All Day Board',
    price: 3200,
    image: 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/1ea24a0d5546d.jpg?w=1000',
    category: 'play-rest',
    tagline: 'Premium Natural Texture Cat Scratcher',
    description: 'ที่ลับเล็บแมวระดับพรีเมียมที่ใช้วัสดุธรรมชาติ 100% ออกแบบตามหลักสรีรศาสตร์เพื่อให้แมวสามารถลับเล็บ ยืดเส้น และนอนพักผ่อนได้ในชิ้นเดียว ทนทานกว่าที่ลับเล็บทั่วไปหลายเท่า',
    features: [
      'กระดาษลูกฟูก High-Density อัดแน่นพิเศษ',
      'ลดการเกิดฝุ่นผงขณะลับเล็บ',
      'โครงสร้างไม้ Birch Wood สวยงาม แข็งแรง',
      'เปลี่ยนแผ่นรีฟิลได้เมื่อสึกหรอ',
      'ผิวสัมผัสแบบรังผึ้งที่แมวชื่นชอบที่สุด'
    ],
    specs: [
      { label: 'วัสดุ', value: 'Natural Birch / Kraft Paper' },
      { label: 'น้ำหนัก', value: '2.1 KG' },
      { label: 'ขนาด', value: '450 x 320 x 140 mm' },
      { label: 'แหล่งผลิต', value: 'South Korea' }
    ],
    recommendedFor: { type: 'cat' }
  },
  {
    id: 'kitty-tree',
    name: 'Kitty Tree (Modular)',
    price: 15900,
    image: 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/1eff7a9ff2bb1.jpg?w=1000',
    category: 'furniture',
    tagline: 'Modern Architecture for Urban Cats',
    description: 'คอนโดแมวระบบ Modular ที่สามารถปรับเปลี่ยนรูปแบบการติดตั้งได้ตามขนาดพื้นที่ในบ้าน ใช้วัสดุไม้จริงโทนสีสว่าง ดีไซน์โปร่งโล่งไม่ทำให้ห้องดูอึดอัด พร้อมสถาปัตยกรรมที่รองรับการกระโดดและปีนป่าย',
    features: [
      'โครงสร้างไม้สน New Zealand Pine แท้ 100%',
      'เสาลับเล็บพันเชือกป่าน Cotton สีขาวพรีเมียม',
      'ฐานถ่วงน้ำหนักพิเศษ ป้องกันการล้ม',
      'ทางเดินและหลุมนอนอะคริลิกใส (Clear Bowl)',
      'เบาะนอนนุ่มถอดซักได้ทุกชั้น'
    ],
    specs: [
      { label: 'ความสูงสูงสุด', value: '175 cm' },
      { label: 'วัสดุหลัก', value: 'Solid Pine Wood' },
      { label: 'รองรับน้ำหนัก', value: 'สูงสุด 12 KG ต่อชั้น' },
      { label: 'การติดตั้ง', value: 'Self-Assembly Required' }
    ],
    recommendedFor: { type: 'cat' }
  },

  // --- CLEAN & HYGIENE ---
  {
    id: 'eraser-bin-v2',
    name: 'Eraser Bin (Sensor)',
    price: 3900,
    image: 'https://cdn.imweb.me/upload/S201801295a6ea8288a1a1/aab92744b8a85.jpg?w=1000',
    category: 'hygiene',
    tagline: 'Touchless Odor-Sealing Pet Waste Bin',
    description: 'ถังขยะอัจฉริยะที่เกิดมาเพื่อแก้ปัญหากลิ่นแผ่นรองซับและผ้าอ้อนสัตว์เลี้ยงโดยเฉพาะ ด้วยเทคโนโลยีซีลสุญญากาศ 2 ชั้น และเซนเซอร์เปิดฝาอัตโนมัติ ช่วยให้บ้านของคุณสะอาดและไร้กลิ่นรบกวน',
    features: [
      'Infrared Motion Sensor เปิดฝาใน 0.3 วินาที',
      'ระบบ Double Odor Shield ป้องกันกลิ่นเล็ดลอด',
      'ถุงขยะ Continuous Refill ใช้งานได้นาน 1-2 เดือน',
      'วัสดุเคลือบสารยับยั้งแบคทีเรีย',
      'ชาร์จไฟผ่าน USB-C ใช้งานได้ยาวนาน'
    ],
    specs: [
      { label: 'วัสดุ', value: 'Anti-Microbial ABS' },
      { label: 'ขนาดบรรจุ', value: '20 Liters' },
      { label: 'แบตเตอรี่', value: '2000mAh Li-ion' },
      { label: 'สี', value: 'Pure White' }
    ],
    isNew: true,
    recommendedFor: {} // All pets
  },
  {
    id: 'banana-brush',
    name: 'Banana Brush (Grooming)',
    price: 1350,
    image: 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/59cdd1240cbe3.jpg?w=1000',
    category: 'hygiene',
    tagline: 'Gentle Glossy Care for Healthy Fur',
    description: 'แปรงขนซิลิโคนดีไซน์รูปกล้วยที่เป็นเอกลักษณ์ของ Duit ช่วยกำจัดขนเสียและนวดกระตุ้นการไหลเวียนโลหิตในเวลาเดียวกัน อ่อนโยนต่อผิวหนังบอบบาง ไม่ทำให้เกิดแผลหรือความเครียดขณะแปรง',
    features: [
      'ซิลิโคน Food-Grade นุ่มพิเศษ ไม่ดึงผิว',
      'ปุ่มแปรง 2 ระดับ เข้าถึงขนชั้นใน (Undercoat)',
      'ด้ามจับถนัดมือ ลดความเมื่อยล้า',
      'ล้างน้ำทำความสะอาดได้ 100%',
      'พกพาสะดวก ดีไซน์น่ารักและพรีเมียม'
    ],
    specs: [
      { label: 'วัสดุ', value: 'Medical Grade Silicone' },
      { label: 'ขนาด', value: '115 x 50 mm' },
      { label: 'สี', value: 'Mellow Yellow' },
      { label: 'ประเภทขน', value: 'เหมาะสำหรับขนสั้นและยาว' }
    ],
    recommendedFor: {} // All pets
  },

  // --- OUTING ---
  {
    id: 'dtx-express-carrier',
    name: 'DTX (Duit Train Express)',
    price: 7900,
    image: 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/a3087dd65d164.jpg?w=1000',
    category: 'daily',
    tagline: 'The Ultimate Travel Experience for Pets',
    description: 'กระเป๋าเดินทางสัตว์เลี้ยงระดับไฮเอนด์ที่รวมความสวยงามและความปลอดภัยเข้าด้วยกัน ได้แรงบันดาลใจจากความคล่องตัวของรถไฟด่วน มาพร้อมระบบระบายอากาศที่เหนือชั้นและน้ำหนักที่เบาเป็นพิเศษ',
    features: [
      'ระบบ Suspension ลดแรงสั่นสะเทือนขณะเดิน',
      'หน้าต่างตาข่ายความเหนียวสูง ทนแรงข่วน',
      'พื้นกระเป๋าเสริมโครงแข็ง ไม่ยุบตัวเมื่อสัตว์เลี้ยงนั่ง',
      'ช่องเก็บของอเนกประสงค์ 4 จุด',
      'น้ำหนักเบาเพียง 1.1 KG แต่รับน้ำหนักได้ 10 KG'
    ],
    specs: [
      { label: 'วัสดุ', value: 'Polycarbonate / High-D Nylon' },
      { label: 'ขนาด', value: '420 x 260 x 300 mm' },
      { label: 'รับน้ำหนัก', value: 'Up to 10 KG' },
      { label: 'การรับรอง', value: 'Airline Cabin Approved' }
    ],
    isNew: true,
    recommendedFor: { size: 'small' }
  },
  {
    id: 'windows-hammock',
    name: 'Windows Hammock',
    price: 3500,
    image: 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/a42c07212f457.jpg?w=1000',
    category: 'furniture',
    tagline: 'Sun-Bathing Spot for Curious Cats',
    description: 'เปลติดกระจกที่มอบมุมมองที่ดีที่สุดในบ้านให้กับแมวของคุณ ช่วยให้พวกเขาได้อาบแดดและเฝ้ามองโลกภายนอกได้อย่างอิสระโดยไม่ต้องเสียพื้นที่ใช้สอยบนพื้นบ้าน',
    features: [
      'จุกดูดสุญญากาศ Industrial Grade รับน้ำหนักได้ 15 KG',
      'โครงเหล็กพ่นสี Power Coat กันสนิม',
      'แผ่นรองนอนผ้า Mesh ระบายอากาศได้ดี',
      'ติดตั้งง่าย ไม่ต้องเจาะผนัง',
      'พับเก็บได้เมื่อไม่ใช้งาน'
    ],
    specs: [
      { label: 'วัสดุ', value: 'Steel / Mesh / PVC' },
      { label: 'รับน้ำหนัก', value: 'Max 15 KG' },
      { label: 'ขนาดพื้นที่นอน', value: '550 x 350 mm' },
      { label: 'สี', value: 'Space Gray / Cream' }
    ],
    recommendedFor: { type: 'cat' }
  }
];

export const getRecommendedProducts = (profile: PetProfile | null, productsList: Product[]) => {
  if (!profile) return productsList.filter(p => p.isBest);
  
  // Scoring system for recommendations
  return productsList.map(product => {
    let score = 0;
    if (!product.recommendedFor) return { product, score: 1 };
    
    // Type match
    if (product.recommendedFor.type) {
      if (product.recommendedFor.type === profile.type) score += 10;
      else score -= 100; // Hard filter for wrong type
    } else {
      score += 5; // Universal products
    }

    // Size match
    if (product.recommendedFor.size) {
      if (product.recommendedFor.size === profile.size) score += 8;
      else score += 2; // Still okay, but not ideal
    } else {
      score += 4;
    }

    // New/Best boost
    if (product.isBest) score += 2;
    if (product.isNew) score += 2;

    return { product, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .map(item => item.product);
};
