import { Ingredient } from '../types/ingredients';

export const ingredients: Ingredient[] = [
  {
    id: 'retinol',
    name: 'Retinol',
    alternativeNames: ['Vitamin A', 'Retinyl Palmitate'],
    category: ['anti-aging', 'exfoliant'],
    description: 'A powerful anti-aging ingredient that stimulates cell turnover and collagen production.',
    benefits: [
      'Reduces fine lines and wrinkles',
      'Improves skin texture',
      'Helps with acne',
      'Fades hyperpigmentation'
    ],
    suitableFor: ['normal', 'combination', 'oily'],
    concerns: ['sun sensitivity', 'pregnancy', 'sensitive skin'],
    maxConcentration: 1,
    minConcentration: 0.01,
    pHRange: {
      min: 5.5,
      max: 6.5
    },
    conflicts: ['vitamin C', 'benzoyl peroxide'],
    safetyLevel: 'caution',
    evidenceLevel: 'high',
    timeOfUse: 'PM',
    references: ['https://pubmed.ncbi.nlm.nih.gov/advanced-retinol-studies']
  },
  {
    id: 'adenosine',
    name: 'Adenosine',
    alternativeNames: ['Adenosine Triphosphate'],
    category: ['anti-aging'],
    description: 'A yeast-derived ingredient that helps reduce wrinkles and smooth skin texture.',
    benefits: [
      'Wrinkle reduction',
      'Skin smoothing',
      'Collagen production',
      'Cell energy boost'
    ],
    suitableFor: ['all'],
    concerns: [],
    maxConcentration: 0.1,
    minConcentration: 0.01,
    pHRange: {
      min: 6.0,
      max: 7.0
    },
    conflicts: [],
    safetyLevel: 'safe',
    evidenceLevel: 'medium',
    timeOfUse: 'AM/PM',
    references: ['https://pubmed.ncbi.nlm.nih.gov/adenosine-studies']
  },
  {
    id: 'copper-peptides',
    name: 'Copper Peptides',
    alternativeNames: ['GHK-Cu', 'Copper Tripeptide-1'],
    category: ['anti-aging', 'healing'],
    description: 'Peptides that promote collagen synthesis and skin healing.',
    benefits: [
      'Collagen synthesis',
      'Wound healing',
      'Anti-inflammatory',
      'Antioxidant'
    ],
    suitableFor: ['all'],
    concerns: [],
    maxConcentration: 2,
    minConcentration: 0.1,
    pHRange: {
      min: 5.5,
      max: 7.0
    },
    conflicts: ['vitamin C', 'AHAs'],
    safetyLevel: 'safe',
    evidenceLevel: 'medium',
    timeOfUse: 'AM/PM',
    references: ['https://pubmed.ncbi.nlm.nih.gov/copper-peptides-studies']
  },
  {
    id: 'matrixyl',
    name: 'Matrixyl',
    alternativeNames: ['Palmitoyl Pentapeptide-4'],
    category: ['anti-aging'],
    description: 'A powerful peptide that stimulates collagen production and reduces wrinkles.',
    benefits: [
      'Reduces wrinkles',
      'Improves skin firmness',
      'Boosts collagen production'
    ],
    suitableFor: ['all'],
    concerns: [],
    maxConcentration: 2,
    minConcentration: 0.1,
    pHRange: {
      min: 5.5,
      max: 7.0
    },
    conflicts: [],
    safetyLevel: 'safe',
    evidenceLevel: 'medium',
    timeOfUse: 'AM/PM',
    references: []
  },
  {
    id: 'argireline',
    name: 'Argireline',
    alternativeNames: ['Acetyl Hexapeptide-8'],
    category: ['anti-aging'],
    description: 'A peptide that helps reduce the appearance of expression lines.',
    benefits: [
      'Reduces expression lines',
      'Smooths skin texture',
      'Alternative to botox'
    ],
    suitableFor: ['all'],
    concerns: [],
    maxConcentration: 10,
    minConcentration: 5,
    pHRange: {
      min: 5.5,
      max: 7.0
    },
    conflicts: [],
    safetyLevel: 'safe',
    evidenceLevel: 'medium',
    timeOfUse: 'AM/PM',
    references: []
  },
  {
    id: 'coenzyme-q10',
    name: 'Coenzyme Q10',
    alternativeNames: ['Ubiquinone'],
    category: ['anti-aging', 'antioxidant'],
    description: 'A powerful antioxidant that boosts skin cell energy and fights free radicals.',
    benefits: [
      'Antioxidant protection',
      'Energy production',
      'Anti-aging effects'
    ],
    suitableFor: ['all'],
    concerns: [],
    maxConcentration: 1,
    minConcentration: 0.1,
    pHRange: {
      min: 5.5,
      max: 7.0
    },
    conflicts: [],
    safetyLevel: 'safe',
    evidenceLevel: 'medium',
    timeOfUse: 'AM/PM',
    references: []
  },
  {
    id: 'alpha-lipoic-acid',
    name: 'Alpha Lipoic Acid',
    alternativeNames: ['ALA', 'Thioctic Acid'],
    category: ['antioxidant', 'anti-inflammatory'],
    description: 'A powerful antioxidant with anti-inflammatory properties.',
    benefits: [
      'Antioxidant protection',
      'Reduces inflammation',
      'Improves skin texture'
    ],
    suitableFor: ['all'],
    concerns: ['sensitive skin'],
    maxConcentration: 5,
    minConcentration: 0.5,
    pHRange: {
      min: 5.5,
      max: 7.0
    },
    conflicts: [],
    safetyLevel: 'caution',
    evidenceLevel: 'medium',
    timeOfUse: 'PM',
    references: []
  },
  {
    id: 'mandelic-acid',
    name: 'Mandelic Acid',
    alternativeNames: ['AHA'],
    category: ['exfoliant'],
    description: 'A gentle alpha hydroxy acid derived from bitter almonds.',
    benefits: [
      'Gentle exfoliation',
      'Brightening effects',
      'Acne treatment'
    ],
    suitableFor: ['sensitive', 'acne-prone'],
    concerns: ['sun sensitivity'],
    maxConcentration: 10,
    minConcentration: 2,
    pHRange: {
      min: 3.0,
      max: 4.0
    },
    conflicts: ['retinoids'],
    safetyLevel: 'caution',
    evidenceLevel: 'medium',
    timeOfUse: 'PM',
    references: []
  },
  {
    id: 'tartaric-acid',
    name: 'Tartaric Acid',
    alternativeNames: ['AHA'],
    category: ['exfoliant'],
    description: 'A gentle AHA that helps refine pores and improve skin texture.',
    benefits: [
      'Pore refining',
      'Gentle exfoliation',
      'Skin brightening'
    ],
    suitableFor: ['all'],
    concerns: ['sun sensitivity'],
    maxConcentration: 7,
    minConcentration: 2,
    pHRange: {
      min: 3.0,
      max: 4.0
    },
    conflicts: ['retinoids'],
    safetyLevel: 'caution',
    evidenceLevel: 'medium',
    timeOfUse: 'PM',
    references: []
  },
  {
    id: 'citric-acid',
    name: 'Citric Acid',
    alternativeNames: ['AHA'],
    category: ['exfoliant'],
    description: 'A mild alpha hydroxy acid that acts as a pH adjuster and gentle exfoliant.',
    benefits: [
      'pH adjustment',
      'Mild exfoliation',
      'Antioxidant properties'
    ],
    suitableFor: ['all'],
    concerns: ['sun sensitivity'],
    maxConcentration: 10,
    minConcentration: 0.5,
    pHRange: {
      min: 3.0,
      max: 4.0
    },
    conflicts: ['retinoids'],
    safetyLevel: 'caution',
    evidenceLevel: 'medium',
    timeOfUse: 'PM',
    references: []
  },
  {
    id: 'malic-acid',
    name: 'Malic Acid',
    alternativeNames: ['AHA'],
    category: ['exfoliant'],
    description: 'A gentle alpha hydroxy acid with hydrating properties.',
    benefits: [
      'Gentle exfoliation',
      'Hydration',
      'Skin brightening'
    ],
    suitableFor: ['all'],
    concerns: ['sun sensitivity'],
    maxConcentration: 10,
    minConcentration: 1,
    pHRange: {
      min: 3.0,
      max: 4.0
    },
    conflicts: ['retinoids'],
    safetyLevel: 'caution',
    evidenceLevel: 'medium',
    timeOfUse: 'PM',
    references: []
  },
  {
    id: 'rosehip-oil',
    name: 'Rosehip Oil',
    alternativeNames: ['Rosa Canina Fruit Oil'],
    category: ['antioxidant', 'moisturizer'],
    description: 'A natural oil rich in vitamin C and essential fatty acids.',
    benefits: [
      'Skin regeneration',
      'Vitamin C content',
      'Moisturizing'
    ],
    suitableFor: ['all'],
    concerns: [],
    maxConcentration: 100,
    minConcentration: 1,
    pHRange: {
      min: 5.0,
      max: 7.0
    },
    conflicts: [],
    safetyLevel: 'safe',
    evidenceLevel: 'medium',
    timeOfUse: 'AM/PM',
    references: []
  },
  {
    id: 'argan-oil',
    name: 'Argan Oil',
    alternativeNames: ['Argania Spinosa Kernel Oil'],
    category: ['moisturizer', 'antioxidant'],
    description: 'A rich, non-comedogenic oil with moisturizing and antioxidant properties.',
    benefits: [
      'Moisturizing',
      'Antioxidant protection',
      'Non-comedogenic'
    ],
    suitableFor: ['all'],
    concerns: [],
    maxConcentration: 100,
    minConcentration: 1,
    pHRange: {
      min: 5.0,
      max: 7.0
    },
    conflicts: [],
    safetyLevel: 'safe',
    evidenceLevel: 'medium',
    timeOfUse: 'AM/PM',
    references: []
  },
  {
    id: 'jojoba-oil',
    name: 'Jojoba Oil',
    alternativeNames: ['Simmondsia Chinensis Seed Oil'],
    category: ['moisturizer'],
    description: 'A balancing oil that closely mimics skin\'s natural sebum.',
    benefits: [
      'Balancing',
      'Non-comedogenic',
      'Moisturizing'
    ],
    suitableFor: ['all'],
    concerns: [],
    maxConcentration: 100,
    minConcentration: 1,
    pHRange: {
      min: 5.0,
      max: 7.0
    },
    conflicts: [],
    safetyLevel: 'safe',
    evidenceLevel: 'high',
    timeOfUse: 'AM/PM',
    references: []
  },
  {
    id: 'tea-tree-oil',
    name: 'Tea Tree Oil',
    alternativeNames: ['Melaleuca Alternifolia Leaf Oil'],
    category: ['antibacterial'],
    description: 'A natural antibacterial and anti-inflammatory oil.',
    benefits: [
      'Antibacterial',
      'Acne treatment',
      'Anti-inflammatory'
    ],
    suitableFor: ['oily', 'acne-prone'],
    concerns: ['sensitive skin'],
    maxConcentration: 5,
    minConcentration: 0.5,
    pHRange: {
      min: 5.0,
      max: 7.0
    },
    conflicts: [],
    safetyLevel: 'caution',
    evidenceLevel: 'high',
    timeOfUse: 'AM/PM',
    references: []
  },
  {
    id: 'licorice-root',
    name: 'Licorice Root Extract',
    alternativeNames: ['Glycyrrhiza Glabra Root Extract'],
    category: ['brightening', 'anti-inflammatory'],
    description: 'A natural brightening and anti-inflammatory ingredient.',
    benefits: [
      'Brightening',
      'Anti-inflammatory',
      'Soothing'
    ],
    suitableFor: ['all'],
    concerns: [],
    maxConcentration: 2,
    minConcentration: 0.1,
    pHRange: {
      min: 5.0,
      max: 7.0
    },
    conflicts: [],
    safetyLevel: 'safe',
    evidenceLevel: 'medium',
    timeOfUse: 'AM/PM',
    references: []
  }
];