
// EU Guideline Daily Amounts (GDA) Standards
// Based on EU Regulation No 1169/2011

export interface GDAValues {
  energy: number // kJ
  energyKcal: number // kcal
  fat: number // g
  saturates: number // g
  sugars: number // g
  salt: number // g
}

// Reference intake for an average adult (8400 kJ/2000 kcal)
export const EU_GDA_REFERENCE: GDAValues = {
  energy: 8400, // kJ
  energyKcal: 2000, // kcal
  fat: 70, // g
  saturates: 20, // g
  sugars: 90, // g
  salt: 6, // g
}

export interface NutritionValues {
  energy?: number // kJ
  energyKcal?: number // kcal (calories)
  fat?: number // g
  saturates?: number // g
  carbohydrates?: number // g
  sugars?: number // g
  protein?: number // g
  salt?: number // g
  fiber?: number // g
}

export function calculateGDAPercentages(
  nutrition: NutritionValues
): Partial<Record<keyof GDAValues, number>> {
  const percentages: Partial<Record<keyof GDAValues, number>> = {}

  if (nutrition.energy) {
    percentages.energy = (nutrition.energy / EU_GDA_REFERENCE.energy) * 100
  }

  if (nutrition.energyKcal) {
    percentages.energyKcal = (nutrition.energyKcal / EU_GDA_REFERENCE.energyKcal) * 100
  }

  if (nutrition.fat) {
    percentages.fat = (nutrition.fat / EU_GDA_REFERENCE.fat) * 100
  }

  if (nutrition.saturates) {
    percentages.saturates = (nutrition.saturates / EU_GDA_REFERENCE.saturates) * 100
  }

  if (nutrition.sugars) {
    percentages.sugars = (nutrition.sugars / EU_GDA_REFERENCE.sugars) * 100
  }

  if (nutrition.salt) {
    percentages.salt = (nutrition.salt / EU_GDA_REFERENCE.salt) * 100
  }

  return percentages
}

export function formatGDAPercentage(percentage: number): string {
  return `${Math.round(percentage)}%`
}

// Traffic light color coding for nutritional values (per 100g)
// Based on UK FSA traffic light system (also used across EU)
export type TrafficLightColor = 'green' | 'amber' | 'red'

export interface TrafficLightThresholds {
  green: number
  amber: number
}

const TRAFFIC_LIGHT_THRESHOLDS = {
  fat: { green: 3, amber: 17.5 }, // per 100g
  saturates: { green: 1.5, amber: 5 }, // per 100g
  sugars: { green: 5, amber: 22.5 }, // per 100g
  salt: { green: 0.3, amber: 1.5 }, // per 100g
}

export function getTrafficLightColor(
  nutrient: 'fat' | 'saturates' | 'sugars' | 'salt',
  valuePer100g: number
): TrafficLightColor {
  const thresholds = TRAFFIC_LIGHT_THRESHOLDS[nutrient]
  
  if (valuePer100g <= thresholds.green) {
    return 'green'
  } else if (valuePer100g <= thresholds.amber) {
    return 'amber'
  } else {
    return 'red'
  }
}

export function getTrafficLightLabel(color: TrafficLightColor): string {
  switch (color) {
    case 'green':
      return 'Low'
    case 'amber':
      return 'Medium'
    case 'red':
      return 'High'
  }
}
