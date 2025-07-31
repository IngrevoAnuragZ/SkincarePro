export type IngredientCategory = 
  | 'humectant' 
  | 'emollient' 
  | 'occlusive' 
  | 'antioxidant' 
  | 'exfoliant' 
  | 'brightening' 
  | 'soothing'
  | 'preservative'
  | 'anti-aging'
  | 'healing'
  | 'barrier-repair'
  | 'hydrating';

export type SkinType = 
  | 'dry' 
  | 'oily' 
  | 'combination' 
  | 'normal' 
  | 'sensitive'
  | 'all';

export type SkinConcern = 
  | 'acne' 
  | 'aging' 
  | 'hyperpigmentation' 
  | 'sensitivity' 
  | 'dryness' 
  | 'oiliness' 
  | 'pores' 
  | 'texture'
  | 'sun-damage'
  | 'redness'
  | 'acne-prone'
  | 'sun sensitivity'
  | 'pregnancy';

export interface Ingredient {
  id: string;
  name: string;
  alternativeNames: string[];
  category: IngredientCategory[];
  description: string;
  benefits: string[];
  suitableFor: SkinType[];
  concerns: string[];
  maxConcentration?: number;
  minConcentration?: number;
  pHRange?: {
    min: number;
    max: number;
  };
  conflicts: string[];
  safetyLevel: 'safe' | 'caution' | 'unsafe';
  evidenceLevel: 'high' | 'medium' | 'low';
  timeOfUse: 'AM' | 'PM' | 'AM/PM';
  references: string[];
}

export interface IngredientAnalysis {
  ingredient: Ingredient;
  concentration?: number;
  safetyScore: number;
  compatibilityScore: number;
  warnings: string[];
  recommendations: string[];
}