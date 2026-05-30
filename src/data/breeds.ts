export interface Breed {
  en: string;
  th: string;
  trait?: string;
  archetype?: string;
  description_th?: string;
  description_en?: string;
}

export const dogBreeds: Breed[] = [
  { 
    en: "Golden Retriever", 
    th: "โกลเด้น รีทรีฟเวอร์",
    trait: "Gentle & Active",
    archetype: "The Socialite",
    description_th: "เป็นมิตร ฉลาด และชอบกิจกรรมกลางแจ้ง ต้องการการดูแลเรื่องข้อต่อและสุขภาพขน",
    description_en: "Friendly, intelligent, and loves outdoor activities. Needs joint care and coat maintenance."
  },
  { 
    en: "Labrador Retriever", 
    th: "ลาบราดอร์ รีทรีฟเวอร์",
    trait: "Playful & Energetic",
    archetype: "The Explorer",
    description_th: "มีพลังงานสูง ชอบเล่นน้ำและคาบของ ต้องการของเล่นที่ทนทานและการควบคุมอาหาร",
    description_en: "High energy, loves swimming and fetching. Needs durable toys and weight management."
  },
  { 
    en: "French Bulldog", 
    th: "เฟรนช์ บูลด็อก",
    trait: "Charming & Easygoing",
    archetype: "The Comedian",
    description_th: "ปรับตัวง่าย ชอบนอนและต้องการความเย็นเป็นพิเศษเพื่อป้องกัน Heatstroke",
    description_en: "Adaptable, loves resting, and needs cooling solutions to prevent heatstroke."
  },
  { 
    en: "Poodle", 
    th: "พุดเดิ้ล",
    trait: "Smart & Elegant",
    archetype: "The Intellectual",
    description_th: "ฉลาดเป็นกรด ฝึกง่าย และต้องการการกระตุ้นทางสติปัญญาอย่างสม่ำเสมอ",
    description_en: "Highly intelligent, easy to train, and needs regular mental stimulation."
  },
  { 
    en: "Chihuahua", 
    th: "ชิวาวา",
    trait: "Lively & Devoted",
    archetype: "The Tiny Guardian",
    description_th: "ร่าเริง ซื่อสัตย์ และชอบความอบอุ่น ต้องการพื้นที่ส่วนตัวที่ปลอดภัย",
    description_en: "Lively, loyal, and loves warmth. Needs a safe and cozy private space."
  },
  { 
    en: "Corgi", 
    th: "คอร์กี้",
    trait: "Spirited & Bold",
    archetype: "The Royal Herder",
    description_th: "กล้าหาญและร่าเริง มีโครงสร้างหลังยาวที่ต้องระวังเรื่องการกระโดดและการขึ้นลงบันได",
    description_en: "Bold and cheerful. Has a long back that needs protection from jumping and stairs."
  },
  { 
    en: "Pomeranian", 
    th: "ปอมเมอเรเนียน",
    trait: "Vivacious & Extroverted",
    archetype: "The Little Star",
    description_th: "คล่องแคล่ว รักอิสระ และชอบเป็นจุดสนใจ ต้องการการดูแลขนอย่างพิถีพิถัน",
    description_en: "Active, independent, and loves being the center of attention. Needs meticulous grooming."
  },
  { 
    en: "Siberian Husky", 
    th: "ไซบีเรียน ฮัสกี้",
    trait: "Adventurous & Mischievous",
    archetype: "The Escape Artist",
    description_th: "มีอิสระสูง ชอบการผจญภัย และต้องการการออกกำลังกายที่เข้มข้นในสภาพอากาศที่เย็น",
    description_en: "Highly independent, loves adventure, and needs vigorous exercise in cool conditions."
  },
  { 
    en: "Shiba Inu", 
    th: "ชิบะ อินุ",
    trait: "Alert & Faithful",
    archetype: "The Zen Master",
    description_th: "มีความมั่นใจในตัวเองสูง รักความสะอาด และต้องการพื้นที่ที่เป็นส่วนตัว",
    description_en: "Self-confident, clean, and requires their own personal space."
  },
  { 
    en: "Thai Ridgeback", 
    th: "ไทยหลังอาน",
    trait: "Tough & Loyal",
    archetype: "The Ancient Guardian",
    description_th: "แข็งแรง ซื่อสัตย์ และมีสัญชาตญาณการเฝ้าบ้านที่ดีเยี่ยม ต้องการการฝึกอย่างสม่ำเสมอ",
    description_en: "Strong, loyal, and has excellent guarding instincts. Needs consistent training."
  }
].sort((a, b) => a.th.localeCompare(b.th, 'th'));

export const catBreeds: Breed[] = [
  { en: "Persian", th: "เปอร์เซีย", trait: "Quiet & Sweet", archetype: "The Royal Relaxer" },
  { en: "Maine Coon", th: "เมนคูน", trait: "Gentle Giant", archetype: "The Forest King" },
  { en: "Siamese", th: "วิเชียรมาศ (Siamese)", trait: "Vocal & Social", archetype: "The Talkative Friend" },
  { en: "British Shorthair", th: "บริติช ช็อตแฮร์", trait: "Calm & Patient", archetype: "The British Aristocrat" },
  { en: "Ragdoll", th: "แร็กดอลล์", trait: "Docile & Floppy", archetype: "The Living Teddy Bear" },
  { en: "Scottish Fold", th: "สก๊อตทิช โฟลด์", trait: "Sweet & Quirky", archetype: "The Owl-Like Companion" },
  { en: "Bengal", th: "เบงกอล", trait: "Active & Wild", archetype: "The Home Leopard" },
  { en: "Munchkin", th: "มัคคิน", trait: "Playful & Curious", archetype: "The Short-Legged Explorer" }
].sort((a, b) => a.th.localeCompare(b.th, 'th'));

