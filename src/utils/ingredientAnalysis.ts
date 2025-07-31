import { Ingredient, IngredientAnalysis } from '../types/ingredients';
import { ingredients } from '../data/ingredients';

export function parseIngredientList(input: string): string[] {
  return input
    .split(',')
    .map(ingredient => ingredient.trim())
    .filter(ingredient => ingredient.length > 0);
}

export function findIngredient(name: string): Ingredient | undefined {
  const normalizedName = name.toLowerCase();
  return ingredients.find(
    ingredient =>
      ingredient.name.toLowerCase() === normalizedName ||
      ingredient.alternativeNames.some(alt => alt.toLowerCase() === normalizedName)
  );
}

export function analyzeIngredients(ingredientList: string): IngredientAnalysis[] {
  const parsedIngredients = parseIngredientList(ingredientList);
  const analysis: IngredientAnalysis[] = [];

  for (const ingredientName of parsedIngredients) {
    const ingredient = findIngredient(ingredientName);
    if (ingredient) {
      const compatibilityScore = calculateCompatibilityScore(ingredient, parsedIngredients);
      const safetyScore = calculateSafetyScore(ingredient);
      const warnings = generateWarnings(ingredient, parsedIngredients);
      const recommendations = generateRecommendations(ingredient);

      analysis.push({
        ingredient,
        safetyScore,
        compatibilityScore,
        warnings,
        recommendations
      });
    }
  }

  return analysis;
}

function calculateCompatibilityScore(ingredient: Ingredient, allIngredients: string[]): number {
  let score = 100;
  
  // Check for conflicts with other ingredients in the list
  ingredient.conflicts.forEach(conflict => {
    if (allIngredients.some(ing => ing.toLowerCase().includes(conflict.toLowerCase()))) {
      score -= 25;
    }
  });

  return Math.max(0, score);
}

function calculateSafetyScore(ingredient: Ingredient): number {
  switch (ingredient.safetyLevel) {
    case 'safe':
      return 100;
    case 'caution':
      return 50;
    case 'unsafe':
      return 0;
    default:
      return 0;
  }
}

function generateWarnings(ingredient: Ingredient, allIngredients: string[]): string[] {
  const warnings: string[] = [];

  // Check for conflicts
  ingredient.conflicts.forEach(conflict => {
    if (allIngredients.some(ing => ing.toLowerCase().includes(conflict.toLowerCase()))) {
      warnings.push(`May interact with ${conflict}`);
    }
  });

  // Add concentration warnings
  if (ingredient.maxConcentration) {
    warnings.push(`Should not exceed ${ingredient.maxConcentration}% concentration`);
  }

  return warnings;
}

function generateRecommendations(ingredient: Ingredient): string[] {
  const recommendations: string[] = [];

  // Add usage recommendations
  if (ingredient.pHRange) {
    recommendations.push(
      `Best used in products with pH between ${ingredient.pHRange.min} and ${ingredient.pHRange.max}`
    );
  }

  // Add skin type recommendations
  if (ingredient.suitableFor.length > 0) {
    recommendations.push(
      `Particularly beneficial for ${ingredient.suitableFor.join(', ')} skin types`
    );
  }

  return recommendations;
}