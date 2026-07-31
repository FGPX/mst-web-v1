import { products } from "./data";

export type ComfortAnswers = {
  roomType: string;
  users: number;
  widthMm: number;
  comfort: "soft" | "balanced" | "firm";
  posture: "upright" | "relaxed";
  seatHeightMm: number;
  seatDepthMm: number;
  children: boolean;
  pets: boolean;
  electric: boolean;
  style: string;
  color: string;
};

export function scoreComfortMatch(answers: ComfortAnswers) {
  return products
    .map((product) => {
      let score = 0;
      if (product.widthMm <= answers.widthMm) score += 3;
      if (product.comfortOptions.includes(answers.comfort)) score += 2;
      if (Math.abs(product.seatHeightMm - answers.seatHeightMm) <= 30) score += 2;
      if (Math.abs(product.seatDepthMm - answers.seatDepthMm) <= 50) score += 1;
      if (answers.electric && product.electricFunctions.length) score += 2;
      if ((answers.children || answers.pets) && product.materials.some((id) => /easy|micro|sand|oat/.test(id))) score += 2;
      if (product.colors.includes(answers.color)) score += 1;
      if (product.styles.includes(answers.style)) score += 1;
      return { product, score, explanation: `Recommended because it supports ${answers.posture} seating, ${answers.comfort} comfort, ${product.seatHeightMm} mm seat height and validated dimensions for ${answers.users} user${answers.users === 1 ? "" : "s"}.` };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
