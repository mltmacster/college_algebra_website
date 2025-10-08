
// Interactive Problem System for College Algebra Learning Platform
// Focused on Linear Equations & Inequalities with Business Applications

export interface Problem {
  id: string;
  title: string;
  description: string;
  businessContext: string;
  problemStatement: string;
  type: 'multiple-choice' | 'step-by-step' | 'fill-blank';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  hints: string[];
  solution: Solution;
  choices?: string[];
  correctAnswer?: string;
  steps?: ProblemStep[];
}

export interface Solution {
  steps: string[];
  explanation: string;
  finalAnswer: string;
  verification?: string;
}

export interface ProblemStep {
  instruction: string;
  expectedAnswer: string;
  hint?: string;
  explanation?: string;
}

export interface UserProgress {
  problemId: string;
  attempts: number;
  currentStep: number;
  isCompleted: boolean;
  score: number;
  hintsUsed: number;
  timeSpent: number; // in seconds
  lastAttempt: Date;
}

// Module 1: Linear Equations & Inequalities - Interactive Problem Set
export const linearEquationsProblems: Problem[] = [
  // Problem 1: Basic Break-Even Analysis
  {
    id: 'linear-001',
    title: 'Coffee Shop Break-Even Analysis',
    description: 'Calculate the break-even point for a small business',
    businessContext: 'A local coffee shop wants to determine their daily break-even point to make informed pricing and sales decisions.',
    problemStatement: 'Maya\'s Coffee Shop has fixed costs of $200 per day (rent, utilities, labor) and variable costs of $1.50 per cup of coffee (beans, milk, supplies). They sell each cup for $4.00. How many cups must Maya sell daily to break even?',
    type: 'step-by-step',
    difficulty: 'easy',
    points: 10,
    hints: [
      'Break-even occurs when Total Revenue = Total Cost',
      'Revenue = Price × Quantity',
      'Total Cost = Fixed Cost + Variable Cost × Quantity',
      'Set up the equation: 4x = 200 + 1.5x'
    ],
    solution: {
      steps: [
        'Define variables: Let x = number of cups sold per day',
        'Revenue equation: R = 4x',
        'Cost equation: C = 200 + 1.5x',
        'Break-even condition: R = C, so 4x = 200 + 1.5x',
        'Solve: 4x - 1.5x = 200',
        'Simplify: 2.5x = 200',
        'Final calculation: x = 200 ÷ 2.5 = 80'
      ],
      explanation: 'At 80 cups per day, Maya\'s revenue ($320) equals her total cost ($320), achieving break-even.',
      finalAnswer: '80 cups per day',
      verification: 'Check: Revenue = 4 × 80 = $320; Cost = 200 + 1.5 × 80 = $320 ✓'
    },
    steps: [
      {
        instruction: 'Set up the revenue equation (Price × Quantity)',
        expectedAnswer: '4x',
        hint: 'Coffee price is $4.00 per cup, sold x cups',
        explanation: 'Revenue = Price per unit × Number of units sold'
      },
      {
        instruction: 'Set up the total cost equation (Fixed + Variable costs)',
        expectedAnswer: '200 + 1.5x',
        hint: 'Fixed costs are $200, variable costs are $1.50 per cup',
        explanation: 'Total Cost = Fixed Costs + (Variable Cost per unit × Number of units)'
      },
      {
        instruction: 'Create the break-even equation (Revenue = Cost)',
        expectedAnswer: '4x = 200 + 1.5x',
        hint: 'Set the revenue equation equal to the cost equation',
        explanation: 'At break-even point, all costs are covered by revenue'
      },
      {
        instruction: 'Solve for x by collecting like terms',
        expectedAnswer: '2.5x = 200',
        hint: 'Move all x terms to one side: 4x - 1.5x = 200',
        explanation: 'Subtract 1.5x from both sides to isolate x terms'
      },
      {
        instruction: 'Calculate the final answer',
        expectedAnswer: '80',
        hint: 'Divide both sides by 2.5',
        explanation: 'x = 200 ÷ 2.5 = 80 cups per day'
      }
    ]
  },

  // Problem 2: Profit Analysis
  {
    id: 'linear-002',
    title: 'Tech Startup Profit Target',
    description: 'Determine sales needed to achieve specific profit goals',
    businessContext: 'A tech startup wants to calculate how many software licenses they need to sell monthly to achieve their profit target.',
    problemStatement: 'Digital Solutions Inc. has monthly fixed costs of $15,000 and sells software licenses for $80 each. The variable cost per license is $20. How many licenses must they sell to achieve a monthly profit of $25,000?',
    type: 'step-by-step',
    difficulty: 'medium',
    points: 15,
    hints: [
      'Profit = Revenue - Total Cost',
      'Total Cost = Fixed Cost + Variable Cost × Quantity',
      'Set up: 25000 = 80x - (15000 + 20x)',
      'Simplify and solve for x'
    ],
    solution: {
      steps: [
        'Define variables: Let x = number of licenses sold',
        'Revenue equation: R = 80x',
        'Cost equation: C = 15000 + 20x',
        'Profit equation: P = R - C = 80x - (15000 + 20x)',
        'Simplify profit equation: P = 80x - 15000 - 20x = 60x - 15000',
        'Set profit target: 25000 = 60x - 15000',
        'Solve: 60x = 25000 + 15000 = 40000',
        'Final calculation: x = 40000 ÷ 60 = 667 licenses (rounded up)'
      ],
      explanation: 'To achieve $25,000 profit, Digital Solutions needs to sell 667 licenses monthly.',
      finalAnswer: '667 licenses',
      verification: 'Check: Revenue = 80 × 667 = $53,360; Cost = 15000 + 20 × 667 = $28,340; Profit = $53,360 - $28,340 = $25,020 ✓'
    },
    steps: [
      {
        instruction: 'Write the profit formula in terms of x',
        expectedAnswer: '60x - 15000',
        hint: 'Profit = Revenue - Cost = 80x - (15000 + 20x)',
        explanation: 'Combine like terms: 80x - 20x - 15000 = 60x - 15000'
      },
      {
        instruction: 'Set up equation for target profit of $25,000',
        expectedAnswer: '25000 = 60x - 15000',
        hint: 'Set the profit formula equal to the target profit',
        explanation: 'We want profit to equal $25,000'
      },
      {
        instruction: 'Solve for x',
        expectedAnswer: '667',
        hint: 'Add 15000 to both sides, then divide by 60',
        explanation: '60x = 40000, so x = 40000 ÷ 60 ≈ 667 licenses'
      }
    ]
  },

  // Problem 3: Supply and Demand Equilibrium
  {
    id: 'linear-003',
    title: 'Market Equilibrium Analysis',
    description: 'Find the equilibrium point where supply meets demand',
    businessContext: 'A market analyst needs to find the equilibrium price and quantity for a new product launch.',
    problemStatement: 'For a new smartphone, the supply equation is P = 200 + 0.5Q and the demand equation is P = 800 - 0.3Q, where P is price in dollars and Q is quantity in thousands. Find the equilibrium price and quantity.',
    type: 'step-by-step',
    difficulty: 'medium',
    points: 15,
    hints: [
      'At equilibrium, supply price = demand price',
      'Set the equations equal: 200 + 0.5Q = 800 - 0.3Q',
      'Solve for Q first, then substitute back to find P',
      'Check your answer by verifying both equations give the same P'
    ],
    solution: {
      steps: [
        'At equilibrium, supply price = demand price',
        'Set equations equal: 200 + 0.5Q = 800 - 0.3Q',
        'Collect Q terms: 0.5Q + 0.3Q = 800 - 200',
        'Simplify: 0.8Q = 600',
        'Solve for Q: Q = 600 ÷ 0.8 = 750 (thousand units)',
        'Substitute Q = 750 into supply equation: P = 200 + 0.5(750) = 575',
        'Verify with demand equation: P = 800 - 0.3(750) = 575 ✓'
      ],
      explanation: 'The market equilibrium occurs at 750,000 units and $575 per unit.',
      finalAnswer: 'Q = 750 thousand units, P = $575',
      verification: 'Both equations yield P = $575 when Q = 750, confirming equilibrium'
    },
    steps: [
      {
        instruction: 'Set supply equal to demand',
        expectedAnswer: '200 + 0.5Q = 800 - 0.3Q',
        hint: 'At equilibrium, the supply price equals the demand price',
        explanation: 'This is where the supply and demand curves intersect'
      },
      {
        instruction: 'Collect all Q terms on one side',
        expectedAnswer: '0.8Q = 600',
        hint: 'Move all Q terms to left side and constants to right side',
        explanation: '0.5Q + 0.3Q = 800 - 200'
      },
      {
        instruction: 'Solve for the equilibrium quantity Q',
        expectedAnswer: '750',
        hint: 'Divide both sides by 0.8',
        explanation: 'Q = 600 ÷ 0.8 = 750 thousand units'
      },
      {
        instruction: 'Find the equilibrium price P by substituting Q = 750',
        expectedAnswer: '575',
        hint: 'Use either the supply or demand equation',
        explanation: 'P = 200 + 0.5(750) = 200 + 375 = $575'
      }
    ]
  },

  // Problem 4: Multiple Choice - Cost Analysis
  {
    id: 'linear-004',
    title: 'Manufacturing Cost Comparison',
    description: 'Compare different manufacturing scenarios',
    businessContext: 'A manufacturing company is evaluating two production methods and needs to determine which is more cost-effective.',
    problemStatement: 'Method A has fixed costs of $10,000 and variable costs of $15 per unit. Method B has fixed costs of $25,000 and variable costs of $8 per unit. At what production level do both methods cost the same?',
    type: 'multiple-choice',
    difficulty: 'easy',
    points: 8,
    choices: [
      'A) 1,500 units',
      'B) 2,143 units', 
      'C) 2,500 units',
      'D) 3,000 units'
    ],
    correctAnswer: 'B',
    hints: [
      'Set up cost equations for both methods',
      'Method A: C₁ = 10000 + 15x',
      'Method B: C₂ = 25000 + 8x',
      'Find where C₁ = C₂'
    ],
    solution: {
      steps: [
        'Method A cost: C₁ = 10000 + 15x',
        'Method B cost: C₂ = 25000 + 8x',
        'Set equal: 10000 + 15x = 25000 + 8x',
        'Solve: 15x - 8x = 25000 - 10000',
        '7x = 15000',
        'x = 15000 ÷ 7 ≈ 2,143 units'
      ],
      explanation: 'Both methods cost the same when producing approximately 2,143 units.',
      finalAnswer: '2,143 units (Option B)',
      verification: 'Check: Method A = 10000 + 15(2143) = $42,145; Method B = 25000 + 8(2143) = $42,144 ≈ equal'
    }
  },

  // Problem 5: Inequality - Production Constraints
  {
    id: 'linear-005',
    title: 'Production Capacity Planning',
    description: 'Determine feasible production levels within budget constraints',
    businessContext: 'A company needs to plan production while staying within budget and meeting minimum order requirements.',
    problemStatement: 'XYZ Corp can spend at most $50,000 on production this month. Each unit costs $12 to produce and they have $8,000 in fixed costs. They must produce at least 2,000 units to fulfill existing orders. What is the range of units they can produce?',
    type: 'step-by-step',
    difficulty: 'medium',
    points: 12,
    hints: [
      'Set up the budget constraint: 8000 + 12x ≤ 50000',
      'Also consider the minimum requirement: x ≥ 2000',
      'Solve the inequality for the maximum',
      'Combine constraints to find the feasible range'
    ],
    solution: {
      steps: [
        'Budget constraint: 8000 + 12x ≤ 50000',
        'Solve for maximum: 12x ≤ 50000 - 8000 = 42000',
        'Maximum units: x ≤ 42000 ÷ 12 = 3500',
        'Minimum constraint: x ≥ 2000',
        'Feasible range: 2000 ≤ x ≤ 3500'
      ],
      explanation: 'XYZ Corp can produce between 2,000 and 3,500 units while meeting budget and order constraints.',
      finalAnswer: '2,000 to 3,500 units',
      verification: 'Check: Min cost = 8000 + 12(2000) = $32,000 ✓; Max cost = 8000 + 12(3500) = $50,000 ✓'
    },
    steps: [
      {
        instruction: 'Set up the budget constraint inequality',
        expectedAnswer: '8000 + 12x ≤ 50000',
        hint: 'Total cost must be at most $50,000',
        explanation: 'Fixed costs + Variable costs ≤ Budget'
      },
      {
        instruction: 'Solve for the maximum number of units',
        expectedAnswer: '3500',
        hint: 'Subtract 8000 from both sides, then divide by 12',
        explanation: '12x ≤ 42000, so x ≤ 3500'
      },
      {
        instruction: 'State the complete feasible range',
        expectedAnswer: '2000 ≤ x ≤ 3500',
        hint: 'Combine the minimum requirement with the maximum capacity',
        explanation: 'Must produce at least 2000 but no more than 3500 units'
      }
    ]
  }
];

// Evaluation functions
export function evaluateAnswer(problemId: string, userAnswer: string, stepIndex?: number): {
  isCorrect: boolean;
  feedback: string;
  hint?: string;
} {
  // Search for problem across all modules
  const allProblemSets = [
    linearEquationsProblems,
    functionsAndGraphingProblems,
    quadraticFunctionsProblems,
    exponentialLogarithmicProblems,
    matrixOperationsProblems,
    sequencesProbabilityProblems
  ];
  
  let problem: Problem | undefined;
  for (const problemSet of allProblemSets) {
    problem = problemSet.find(p => p.id === problemId);
    if (problem) break;
  }
  
  if (!problem) {
    return { isCorrect: false, feedback: 'Problem not found' };
  }

  // Handle multiple choice
  if (problem.type === 'multiple-choice') {
    const isCorrect = userAnswer.toUpperCase() === problem.correctAnswer?.toUpperCase();
    return {
      isCorrect,
      feedback: isCorrect 
        ? '🎉 Correct! Great job applying these concepts to business analysis.' 
        : `❌ Incorrect. ${problem.hints[1] || 'Try reviewing the problem setup.'}`
    };
  }

  // Handle step-by-step problems
  if (problem.type === 'step-by-step' && stepIndex !== undefined && problem.steps) {
    const step = problem.steps[stepIndex];
    const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(step.expectedAnswer);
    
    return {
      isCorrect,
      feedback: isCorrect 
        ? '✅ Correct! Moving to the next step.' 
        : '❌ Not quite right. Check your calculation.',
      hint: step.hint
    };
  }

  return { isCorrect: false, feedback: 'Unable to evaluate answer' };
}

function normalizeAnswer(answer: string): string {
  return answer.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\$|,/g, '')
    .trim();
}

export function getHint(problemId: string, hintIndex: number): string | null {
  // Search for problem across all modules
  const allProblemSets = [
    linearEquationsProblems,
    functionsAndGraphingProblems,
    quadraticFunctionsProblems,
    exponentialLogarithmicProblems,
    matrixOperationsProblems,
    sequencesProbabilityProblems
  ];
  
  let problem: Problem | undefined;
  for (const problemSet of allProblemSets) {
    problem = problemSet.find(p => p.id === problemId);
    if (problem) break;
  }
  
  if (!problem || hintIndex >= problem.hints.length) return null;
  return problem.hints[hintIndex];
}

export function calculateScore(attempts: number, hintsUsed: number, basePoints: number): number {
  let score = basePoints;
  
  // Reduce score based on attempts (max 3 attempts before major penalty)
  if (attempts > 1) {
    score *= Math.max(0.3, 1 - (attempts - 1) * 0.2);
  }
  
  // Reduce score based on hints used
  score *= Math.max(0.5, 1 - hintsUsed * 0.1);
  
  return Math.round(score);
}

// Module 2: Functions and Graphing - Interactive Problem Set
export const functionsAndGraphingProblems: Problem[] = [
  {
    id: 'func-001',
    title: 'E-Commerce Revenue Function',
    description: 'Create and analyze a revenue function for an online store',
    businessContext: 'An e-commerce business tracks daily sales and needs to model revenue as a function of product price.',
    problemStatement: 'An online store sells phone cases. Market research shows that if they charge $p per case, they sell (500 - 20p) cases per day. Write the revenue function R(p) and determine the price that maximizes revenue.',
    type: 'step-by-step',
    difficulty: 'medium',
    points: 15,
    hints: [
      'Revenue = Price × Quantity',
      'Quantity depends on price: Q(p) = 500 - 20p',
      'R(p) = p × (500 - 20p)',
      'Expand to get R(p) = 500p - 20p²'
    ],
    solution: {
      steps: [
        'Revenue function: R(p) = Price × Quantity',
        'Substitute Q(p) = 500 - 20p',
        'R(p) = p(500 - 20p) = 500p - 20p²',
        'This is a quadratic function opening downward',
        'Maximum at vertex: p = -b/(2a) = -500/(2×-20) = $12.50'
      ],
      explanation: 'At $12.50 per case, the store maximizes revenue at R(12.50) = $3,125 per day.',
      finalAnswer: '$12.50 per case',
      verification: 'Check: At p=$12.50, Q=500-20(12.50)=250 cases, R=12.50×250=$3,125 ✓'
    },
    steps: [
      {
        instruction: 'Write the revenue function R(p)',
        expectedAnswer: '500p - 20p²',
        hint: 'Revenue = Price × Quantity, where Q = 500 - 20p'
      },
      {
        instruction: 'Find the price that maximizes revenue',
        expectedAnswer: '12.5',
        hint: 'For quadratic ax²+bx+c, maximum at x = -b/(2a)'
      }
    ]
  },
  {
    id: 'func-002',
    title: 'Piecewise Pricing Model',
    description: 'Design a tiered pricing structure for bulk orders',
    businessContext: 'A wholesale supplier offers volume discounts using piecewise pricing.',
    problemStatement: 'A supplier prices orders as follows: $10 per unit for 0-50 units, $9 per unit for 51-100 units, $8 per unit for over 100 units. Write the piecewise function C(x) for the total cost of x units.',
    type: 'step-by-step',
    difficulty: 'medium',
    points: 12,
    hints: [
      'Break into three cases based on quantity ranges',
      'Case 1: x ≤ 50',
      'Case 2: 50 < x ≤ 100',
      'Case 3: x > 100'
    ],
    solution: {
      steps: [
        'Case 1 (0-50 units): C(x) = 10x',
        'Case 2 (51-100 units): C(x) = 9x',
        'Case 3 (over 100 units): C(x) = 8x',
        'Piecewise function: C(x) = {10x if 0≤x≤50, 9x if 50<x≤100, 8x if x>100}'
      ],
      explanation: 'The cost per unit decreases as order quantity increases, creating incentive for bulk purchases.',
      finalAnswer: 'C(x) = {10x if 0≤x≤50; 9x if 50<x≤100; 8x if x>100}',
      verification: 'Example: 30 units costs $300, 75 units costs $675, 150 units costs $1,200 ✓'
    },
    steps: [
      {
        instruction: 'Write the cost formula for 0-50 units',
        expectedAnswer: '10x',
        hint: 'Price is $10 per unit in this range'
      },
      {
        instruction: 'Write the cost formula for over 100 units',
        expectedAnswer: '8x',
        hint: 'Price is $8 per unit for bulk orders'
      }
    ]
  },
  {
    id: 'func-003',
    title: 'Domain Analysis for Production',
    description: 'Determine feasible production ranges',
    businessContext: 'A factory needs to identify valid production quantities based on capacity constraints.',
    problemStatement: 'A factory produces widgets. The profit function is P(x) = -2x² + 100x - 800, where x is units produced (in hundreds). The factory can produce between 10 and 40 hundred units per month. What is the domain of P(x) in this context?',
    type: 'multiple-choice',
    difficulty: 'easy',
    points: 8,
    hints: [
      'Domain represents valid input values',
      'Production capacity limits x to [10, 40]',
      'Domain is expressed in interval notation'
    ],
    solution: {
      steps: [
        'Identify constraints: 10 ≤ x ≤ 40',
        'Express as domain: [10, 40]',
        'This represents 1,000 to 4,000 units per month'
      ],
      explanation: 'The domain [10, 40] represents feasible production levels given factory capacity.',
      finalAnswer: '[10, 40]'
    },
    choices: ['[0, 40]', '[10, 40]', '(-∞, +∞)', '[0, +∞)'],
    correctAnswer: '[10, 40]'
  },
  {
    id: 'func-004',
    title: 'Function Transformation for Marketing',
    description: 'Model the impact of advertising spending on sales',
    businessContext: 'A marketing team analyzes how advertising budget affects product sales.',
    problemStatement: 'Base sales are modeled by f(x) = 100√x where x is advertising spend in thousands. If the company doubles its advertising budget and adds a $500 signing bonus campaign, write the transformed function g(x).',
    type: 'step-by-step',
    difficulty: 'medium',
    points: 14,
    hints: [
      'Doubling budget means horizontal scaling: f(2x)',
      'Adding bonus means vertical shift: +500',
      'Combined: g(x) = f(2x) + 500'
    ],
    solution: {
      steps: [
        'Original function: f(x) = 100√x',
        'Double budget: f(2x) = 100√(2x)',
        'Add bonus campaign: +500',
        'Final function: g(x) = 100√(2x) + 500'
      ],
      explanation: 'The transformation doubles advertising effectiveness and adds a baseline from the bonus campaign.',
      finalAnswer: 'g(x) = 100√(2x) + 500',
      verification: 'If x=$4k, g(4) = 100√8 + 500 ≈ 783 sales vs f(4) = 200 sales ✓'
    },
    steps: [
      {
        instruction: 'Write the function after doubling the budget',
        expectedAnswer: '100√(2x)',
        hint: 'Doubling budget means replacing x with 2x'
      },
      {
        instruction: 'Add the effect of the $500 bonus campaign',
        expectedAnswer: '100√(2x) + 500',
        hint: 'Vertical shift adds a constant to the entire function'
      }
    ]
  },
  {
    id: 'func-005',
    title: 'Composite Functions in Supply Chain',
    description: 'Chain multiple business processes using function composition',
    businessContext: 'A supply chain involves multiple cost layers that compound.',
    problemStatement: 'A product has base cost C(x) = 50 + 2x where x is production volume. Shipping adds S(c) = 1.2c + 100. Retail markup is R(s) = 1.4s. Find the final retail price function R(S(C(x))).',
    type: 'step-by-step',
    difficulty: 'hard',
    points: 18,
    hints: [
      'Work from inside out: first C(x), then S(C(x)), finally R(S(C(x)))',
      'Substitute C(x) into S: S(50+2x) = 1.2(50+2x) + 100',
      'Then substitute result into R'
    ],
    solution: {
      steps: [
        'Start with C(x) = 50 + 2x',
        'Apply shipping: S(C(x)) = 1.2(50+2x) + 100 = 60 + 2.4x + 100 = 160 + 2.4x',
        'Apply retail markup: R(S(C(x))) = 1.4(160+2.4x)',
        'Simplify: R(S(C(x))) = 224 + 3.36x'
      ],
      explanation: 'Each cost layer compounds, resulting in a final retail price that includes all markups.',
      finalAnswer: '224 + 3.36x',
      verification: 'For x=100 units: Base=$250, +Shipping=$400, ×Retail=$560, Formula: 224+3.36(100)=$560 ✓'
    },
    steps: [
      {
        instruction: 'Calculate S(C(x)) by substituting C(x) into S',
        expectedAnswer: '160 + 2.4x',
        hint: 'S(C(x)) = 1.2(50+2x) + 100'
      },
      {
        instruction: 'Calculate R(S(C(x))) by substituting the result into R',
        expectedAnswer: '224 + 3.36x',
        hint: 'R(160+2.4x) = 1.4(160+2.4x)'
      }
    ]
  }
];

// Module 3: Quadratic (Polynomial) Functions - Interactive Problem Set
export const quadraticFunctionsProblems: Problem[] = [
  {
    id: 'quad-001',
    title: 'Profit Maximization for Product Launch',
    description: 'Optimize pricing for maximum profit using quadratic modeling',
    businessContext: 'A tech company is launching a new app with subscription pricing.',
    problemStatement: 'Market analysis shows monthly profit P(x) = -5x² + 300x - 2000 where x is the subscription price in dollars. Find the optimal price and maximum profit.',
    type: 'step-by-step',
    difficulty: 'medium',
    points: 15,
    hints: [
      'This is a quadratic function: P(x) = ax² + bx + c',
      'Maximum occurs at vertex: x = -b/(2a)',
      'Substitute x back to find maximum profit'
    ],
    solution: {
      steps: [
        'Identify coefficients: a = -5, b = 300, c = -2000',
        'Find vertex: x = -300/(2×-5) = -300/(-10) = 30',
        'Calculate maximum profit: P(30) = -5(30)² + 300(30) - 2000',
        'P(30) = -4500 + 9000 - 2000 = $2,500'
      ],
      explanation: 'At $30/month subscription, the company maximizes profit at $2,500 per month.',
      finalAnswer: 'Price: $30, Max Profit: $2,500',
      verification: 'Test nearby values: P(29)=$2,495, P(30)=$2,500, P(31)=$2,495 ✓'
    },
    steps: [
      {
        instruction: 'Find the optimal subscription price using the vertex formula',
        expectedAnswer: '30',
        hint: 'x = -b/(2a) where a=-5, b=300'
      },
      {
        instruction: 'Calculate the maximum monthly profit at this price',
        expectedAnswer: '2500',
        hint: 'Substitute x=30 into P(x) = -5x² + 300x - 2000'
      }
    ]
  },
  {
    id: 'quad-002',
    title: 'Revenue Optimization for Event Planning',
    description: 'Determine optimal ticket pricing for maximum revenue',
    businessContext: 'A concert venue needs to balance ticket price with attendance to maximize revenue.',
    problemStatement: 'A venue has 2,000 seats. At $40/ticket, all seats sell out. For every $5 increase, 100 fewer tickets sell. Find the ticket price that maximizes revenue.',
    type: 'step-by-step',
    difficulty: 'hard',
    points: 20,
    hints: [
      'Let x = number of $5 increases',
      'Price: P(x) = 40 + 5x',
      'Quantity: Q(x) = 2000 - 100x',
      'Revenue: R(x) = P(x) × Q(x)'
    ],
    solution: {
      steps: [
        'Let x = number of $5 increases',
        'Price: P = 40 + 5x, Quantity: Q = 2000 - 100x',
        'Revenue: R(x) = (40+5x)(2000-100x)',
        'Expand: R(x) = 80000 - 4000x + 10000x - 500x² = -500x² + 6000x + 80000',
        'Maximum at x = -6000/(2×-500) = 6',
        'Optimal price: $40 + $5(6) = $70 per ticket',
        'Maximum revenue: R(6) = $98,000'
      ],
      explanation: 'At $70/ticket, the venue sells 1,400 tickets for $98,000 total revenue.',
      finalAnswer: '$70 per ticket',
      verification: 'R(6) = (40+30)(2000-600) = 70×1400 = $98,000 ✓'
    },
    steps: [
      {
        instruction: 'Write the revenue function R(x) in standard form',
        expectedAnswer: '-500x² + 6000x + 80000',
        hint: 'Expand (40+5x)(2000-100x)'
      },
      {
        instruction: 'Find the optimal number of $5 increases',
        expectedAnswer: '6',
        hint: 'Use vertex formula x = -b/(2a)'
      },
      {
        instruction: 'Calculate the optimal ticket price',
        expectedAnswer: '70',
        hint: 'Price = 40 + 5x where x=6'
      }
    ]
  },
  {
    id: 'quad-003',
    title: 'Cost-Volume Analysis',
    description: 'Model production costs using polynomial functions',
    businessContext: 'A manufacturing plant analyzes how production volume affects total costs.',
    problemStatement: 'Total monthly cost is C(x) = 0.5x² + 20x + 5000 where x is units produced. If the company must keep costs under $15,000, what is the maximum production capacity?',
    type: 'step-by-step',
    difficulty: 'medium',
    points: 14,
    hints: [
      'Set up inequality: 0.5x² + 20x + 5000 ≤ 15000',
      'Simplify: 0.5x² + 20x - 10000 ≤ 0',
      'Solve using quadratic formula'
    ],
    solution: {
      steps: [
        'Set up constraint: 0.5x² + 20x + 5000 ≤ 15000',
        'Simplify: 0.5x² + 20x - 10000 ≤ 0',
        'Multiply by 2: x² + 40x - 20000 ≤ 0',
        'Use quadratic formula: x = (-40 ± √(1600+80000))/2',
        'x = (-40 ± √81600)/2 = (-40 ± 285.66)/2',
        'Positive root: x ≈ 122.83',
        'Maximum capacity: 122 units'
      ],
      explanation: 'The plant can produce up to 122 units per month while staying under the $15,000 budget.',
      finalAnswer: '122 units',
      verification: 'C(122) = 0.5(122)² + 20(122) + 5000 = 7442 + 2440 + 5000 = $14,882 < $15,000 ✓'
    },
    steps: [
      {
        instruction: 'Set up the inequality for the cost constraint',
        expectedAnswer: '0.5x² + 20x - 10000 ≤ 0',
        hint: 'Subtract 15000 from both sides of C(x) ≤ 15000'
      },
      {
        instruction: 'Find the maximum production capacity (round down)',
        expectedAnswer: '122',
        hint: 'Solve the quadratic equation and take the positive root'
      }
    ]
  },
  {
    id: 'quad-004',
    title: 'Efficiency Modeling',
    description: 'Analyze operational efficiency using rational functions',
    businessContext: 'A logistics company models delivery efficiency based on fleet size.',
    problemStatement: 'Efficiency is modeled by E(x) = (100x)/(x+5) where x is number of trucks. As fleet size increases, what is the maximum possible efficiency (horizontal asymptote)?',
    type: 'multiple-choice',
    difficulty: 'medium',
    points: 10,
    hints: [
      'For rational functions, horizontal asymptote is ratio of leading coefficients',
      'E(x) = 100x/(x+5) as x → ∞',
      'Divide numerator and denominator by x'
    ],
    solution: {
      steps: [
        'Divide num and denom by x: E(x) = 100/(1 + 5/x)',
        'As x → ∞, 5/x → 0',
        'Limit: E(x) → 100/1 = 100',
        'Maximum efficiency approaches 100%'
      ],
      explanation: 'As fleet size grows infinitely large, efficiency approaches 100% but never quite reaches it.',
      finalAnswer: '100%'
    },
    choices: ['80%', '95%', '100%', '∞'],
    correctAnswer: '100%'
  },
  {
    id: 'quad-005',
    title: 'Break-Even Points for Multiple Products',
    description: 'Find profitability thresholds using quadratic analysis',
    businessContext: 'A company sells two product lines and needs to determine break-even points.',
    problemStatement: 'Profit from selling x units is P(x) = -2x² + 160x - 2000. Find both break-even points (where P(x) = 0) and the profitable range.',
    type: 'step-by-step',
    difficulty: 'hard',
    points: 18,
    hints: [
      'Set P(x) = 0: -2x² + 160x - 2000 = 0',
      'Simplify: -x² + 80x - 1000 = 0',
      'Use quadratic formula: x = (-b ± √(b²-4ac))/(2a)'
    ],
    solution: {
      steps: [
        'Set -2x² + 160x - 2000 = 0',
        'Divide by -2: x² - 80x + 1000 = 0',
        'Apply quadratic formula: x = (80 ± √(6400-4000))/2',
        'x = (80 ± √2400)/2 = (80 ± 48.99)/2',
        'Break-even points: x ≈ 15.5 and x ≈ 64.5',
        'Profitable range: 16 ≤ x ≤ 64 units'
      ],
      explanation: 'The company is profitable when selling between 16 and 64 units. Below 16 or above 64, they lose money.',
      finalAnswer: 'Break-even at 16 and 64 units; Profitable: 16-64 units',
      verification: 'P(15)=-$30, P(40)=$1,800, P(65)=-$30 ✓'
    },
    steps: [
      {
        instruction: 'Simplify the equation by dividing by -2',
        expectedAnswer: 'x² - 80x + 1000 = 0',
        hint: 'Divide each term by -2'
      },
      {
        instruction: 'Find the two break-even points (round to nearest integer)',
        expectedAnswer: '16, 64',
        hint: 'Use quadratic formula: x = (80 ± √2400)/2'
      }
    ]
  }
];

// Module 4: Exponential and Logarithmic Functions - Interactive Problem Set
export const exponentialLogarithmicProblems: Problem[] = [
  {
    id: 'exp-001',
    title: 'Compound Interest Investment',
    description: 'Calculate investment growth using exponential functions',
    businessContext: 'A financial advisor helps a client plan retirement savings.',
    problemStatement: 'An investor deposits $5,000 in an account earning 6% annual interest compounded monthly. How much will the investment be worth after 10 years? Use A = P(1 + r/n)^(nt).',
    type: 'step-by-step',
    difficulty: 'medium',
    points: 15,
    hints: [
      'P = $5,000 (principal)',
      'r = 0.06 (6% annual rate)',
      'n = 12 (monthly compounding)',
      't = 10 years'
    ],
    solution: {
      steps: [
        'Identify values: P=5000, r=0.06, n=12, t=10',
        'Formula: A = P(1 + r/n)^(nt)',
        'Substitute: A = 5000(1 + 0.06/12)^(12×10)',
        'Simplify: A = 5000(1.005)^120',
        'Calculate: A = 5000 × 1.8194 ≈ $9,097'
      ],
      explanation: 'After 10 years with monthly compounding, the investment grows to $9,097, earning $4,097 in interest.',
      finalAnswer: '$9,097',
      verification: 'Simple interest would yield $8,000; compound interest adds $1,097 more ✓'
    },
    steps: [
      {
        instruction: 'Set up the compound interest formula with correct values',
        expectedAnswer: '5000(1.005)^120',
        hint: 'A = P(1 + r/n)^(nt) where r/n = 0.06/12 = 0.005'
      },
      {
        instruction: 'Calculate the final amount (round to nearest dollar)',
        expectedAnswer: '9097',
        hint: 'Use calculator: 5000 × (1.005)^120'
      }
    ]
  },
  {
    id: 'exp-002',
    title: 'Business Growth Modeling',
    description: 'Model company revenue growth using exponential functions',
    businessContext: 'A startup projects revenue growth over the next 5 years.',
    problemStatement: 'A tech startup has $50,000 monthly revenue growing at 15% per month. Write the exponential function R(t) for revenue after t months and predict revenue after 12 months.',
    type: 'step-by-step',
    difficulty: 'medium',
    points: 14,
    hints: [
      'Exponential growth: R(t) = R₀(1 + r)^t',
      'Initial revenue R₀ = 50000',
      'Growth rate r = 0.15'
    ],
    solution: {
      steps: [
        'Exponential growth formula: R(t) = R₀(1 + r)^t',
        'Substitute values: R(t) = 50000(1.15)^t',
        'After 12 months: R(12) = 50000(1.15)^12',
        'Calculate: R(12) = 50000 × 5.35 ≈ $267,500'
      ],
      explanation: 'With 15% monthly growth, the startup\'s revenue grows from $50k to $267.5k in one year.',
      finalAnswer: 'R(t) = 50000(1.15)^t; R(12) ≈ $267,500',
      verification: 'Month 1: $57.5k, Month 6: $113k, Month 12: $267.5k - exponential growth confirmed ✓'
    },
    steps: [
      {
        instruction: 'Write the exponential revenue function R(t)',
        expectedAnswer: '50000(1.15)^t',
        hint: 'R(t) = Initial × (1 + growth_rate)^t'
      },
      {
        instruction: 'Calculate revenue after 12 months (round to nearest thousand)',
        expectedAnswer: '268000',
        hint: 'R(12) = 50000 × (1.15)^12'
      }
    ]
  },
  {
    id: 'exp-003',
    title: 'Depreciation Analysis',
    description: 'Calculate asset depreciation using exponential decay',
    businessContext: 'An accounting department tracks equipment value for tax purposes.',
    problemStatement: 'A company purchases equipment for $80,000. It depreciates at 20% per year. Write the value function V(t) and find the value after 5 years.',
    type: 'step-by-step',
    difficulty: 'medium',
    points: 13,
    hints: [
      'Exponential decay: V(t) = V₀(1 - r)^t',
      'Initial value V₀ = 80000',
      'Decay rate r = 0.20'
    ],
    solution: {
      steps: [
        'Exponential decay formula: V(t) = V₀(1 - r)^t',
        'Substitute values: V(t) = 80000(0.80)^t',
        'After 5 years: V(5) = 80000(0.80)^5',
        'Calculate: V(5) = 80000 × 0.32768 ≈ $26,214'
      ],
      explanation: 'After 5 years, the equipment is worth $26,214, having lost $53,786 in value.',
      finalAnswer: 'V(t) = 80000(0.80)^t; V(5) ≈ $26,214',
      verification: 'Year 1: $64k, Year 3: $40.96k, Year 5: $26.21k ✓'
    },
    steps: [
      {
        instruction: 'Write the depreciation function V(t)',
        expectedAnswer: '80000(0.80)^t',
        hint: 'V(t) = Initial × (1 - decay_rate)^t'
      },
      {
        instruction: 'Calculate value after 5 years (round to nearest dollar)',
        expectedAnswer: '26214',
        hint: 'V(5) = 80000 × (0.80)^5'
      }
    ]
  },
  {
    id: 'exp-004',
    title: 'Logarithmic Scale for Market Size',
    description: 'Use logarithms to solve for time in exponential growth',
    businessContext: 'A business consultant projects when a market will reach a target size.',
    problemStatement: 'A market currently valued at $100 million is growing at 12% annually. How many years until it reaches $500 million? Use logarithms to solve A = P(1+r)^t for t.',
    type: 'step-by-step',
    difficulty: 'hard',
    points: 18,
    hints: [
      'Start with 500 = 100(1.12)^t',
      'Divide both sides by 100: 5 = (1.12)^t',
      'Take log of both sides: log(5) = t × log(1.12)',
      'Solve for t: t = log(5)/log(1.12)'
    ],
    solution: {
      steps: [
        'Set up equation: 500 = 100(1.12)^t',
        'Divide by 100: 5 = (1.12)^t',
        'Take natural log of both sides: ln(5) = t × ln(1.12)',
        'Solve for t: t = ln(5)/ln(1.12)',
        'Calculate: t = 1.6094/0.1133 ≈ 14.2 years'
      ],
      explanation: 'The market will reach $500 million in approximately 14.2 years (about 14 years and 2 months).',
      finalAnswer: '14.2 years',
      verification: 'Check: 100(1.12)^14.2 ≈ $500 million ✓'
    },
    steps: [
      {
        instruction: 'Simplify the equation to isolate the exponential term',
        expectedAnswer: '5 = (1.12)^t',
        hint: 'Divide both sides by 100'
      },
      {
        instruction: 'Use logarithms to solve for t (round to 1 decimal)',
        expectedAnswer: '14.2',
        hint: 't = ln(5)/ln(1.12) or t = log(5)/log(1.12)'
      }
    ]
  },
  {
    id: 'exp-005',
    title: 'Continuous Compounding',
    description: 'Compare continuous vs periodic compounding',
    businessContext: 'A bank offers continuous compounding as a premium feature.',
    problemStatement: 'Compare two investment options for $10,000 over 8 years: Option A: 5% annual interest compounded quarterly. Option B: 5% annual interest compounded continuously (A = Pe^(rt)). What is the difference in final values?',
    type: 'step-by-step',
    difficulty: 'hard',
    points: 20,
    hints: [
      'Option A: A = P(1 + r/n)^(nt) where n=4',
      'Option B: A = Pe^(rt)',
      'Calculate each and find the difference'
    ],
    solution: {
      steps: [
        'Option A (quarterly): A = 10000(1 + 0.05/4)^(4×8)',
        'A = 10000(1.0125)^32 ≈ $14,859.47',
        'Option B (continuous): A = 10000e^(0.05×8)',
        'A = 10000e^0.4 ≈ $14,918.25',
        'Difference: $14,918.25 - $14,859.47 = $58.78'
      ],
      explanation: 'Continuous compounding yields $58.78 more than quarterly compounding over 8 years—a small but measurable advantage.',
      finalAnswer: 'Option A: $14,859.47; Option B: $14,918.25; Difference: $58.78',
      verification: 'Continuous compounding always yields slightly more than any periodic compounding ✓'
    },
    steps: [
      {
        instruction: 'Calculate final value for Option A (quarterly compounding)',
        expectedAnswer: '14859.47',
        hint: 'A = 10000(1.0125)^32'
      },
      {
        instruction: 'Calculate final value for Option B (continuous compounding)',
        expectedAnswer: '14918.25',
        hint: 'A = 10000 × e^0.4'
      },
      {
        instruction: 'Find the difference (Option B - Option A)',
        expectedAnswer: '58.78',
        hint: 'Subtract the two values'
      }
    ]
  }
];

// Module 5: Matrix Operations and Applications - Interactive Problem Set
export const matrixOperationsProblems: Problem[] = [
  {
    id: 'matrix-001',
    title: 'Resource Allocation Matrix',
    description: 'Use matrices to optimize resource distribution',
    businessContext: 'A manufacturing company allocates resources across multiple product lines.',
    problemStatement: 'A factory produces three products (A, B, C) requiring labor (hours) and materials (kg). Product A: 2 hrs, 5 kg. Product B: 3 hrs, 4 kg. Product C: 1 hr, 6 kg. Write the resource matrix R and calculate total resources needed for producing [10, 15, 20] units of each product.',
    type: 'step-by-step',
    difficulty: 'medium',
    points: 16,
    hints: [
      'Resource matrix R = [[2,3,1], [5,4,6]]',
      'Production vector P = [10, 15, 20]',
      'Total resources = R × P'
    ],
    solution: {
      steps: [
        'Resource matrix R = [[2,3,1], [5,4,6]] (rows: labor, materials; cols: A,B,C)',
        'Production P = [10, 15, 20]ᵀ',
        'Multiply: Total = R × P',
        'Labor: 2(10) + 3(15) + 1(20) = 20 + 45 + 20 = 85 hours',
        'Materials: 5(10) + 4(15) + 6(20) = 50 + 60 + 120 = 230 kg'
      ],
      explanation: 'Producing 10 units of A, 15 of B, and 20 of C requires 85 labor hours and 230 kg of materials.',
      finalAnswer: '85 hours, 230 kg',
      verification: 'Check calculations: 2×10=20, 3×15=45, 1×20=20 → 85 ✓'
    },
    steps: [
      {
        instruction: 'Calculate total labor hours needed',
        expectedAnswer: '85',
        hint: 'Labor = 2(10) + 3(15) + 1(20)'
      },
      {
        instruction: 'Calculate total materials (kg) needed',
        expectedAnswer: '230',
        hint: 'Materials = 5(10) + 4(15) + 6(20)'
      }
    ]
  },
  {
    id: 'matrix-002',
    title: 'Cost Matrix Multiplication',
    description: 'Calculate total costs using matrix operations',
    businessContext: 'A retail chain analyzes costs across multiple stores and product categories.',
    problemStatement: 'A chain has 3 stores. Store 1 sells [50, 30, 20] units of products X, Y, Z. Store 2: [40, 50, 25]. Store 3: [60, 20, 30]. Product costs: X=$10, Y=$15, Z=$8. Use matrix multiplication to find total revenue per store.',
    type: 'step-by-step',
    difficulty: 'medium',
    points: 15,
    hints: [
      'Sales matrix S = [[50,30,20], [40,50,25], [60,20,30]]',
      'Price vector P = [10, 15, 8]ᵀ',
      'Revenue = S × P'
    ],
    solution: {
      steps: [
        'Sales matrix S (stores × products) = [[50,30,20], [40,50,25], [60,20,30]]',
        'Price vector P = [10, 15, 8]ᵀ',
        'Store 1: 50(10) + 30(15) + 20(8) = 500 + 450 + 160 = $1,110',
        'Store 2: 40(10) + 50(15) + 25(8) = 400 + 750 + 200 = $1,350',
        'Store 3: 60(10) + 20(15) + 30(8) = 600 + 300 + 240 = $1,140'
      ],
      explanation: 'Matrix multiplication efficiently calculates revenue for all stores simultaneously.',
      finalAnswer: 'Store 1: $1,110; Store 2: $1,350; Store 3: $1,140',
      verification: 'Total company revenue: $1,110 + $1,350 + $1,140 = $3,600 ✓'
    },
    steps: [
      {
        instruction: 'Calculate revenue for Store 1',
        expectedAnswer: '1110',
        hint: '50×10 + 30×15 + 20×8'
      },
      {
        instruction: 'Calculate revenue for Store 2',
        expectedAnswer: '1350',
        hint: '40×10 + 50×15 + 25×8'
      }
    ]
  },
  {
    id: 'matrix-003',
    title: 'System of Equations for Production Planning',
    description: 'Solve linear systems using matrices',
    businessContext: 'A company balances production across multiple plants with different capabilities.',
    problemStatement: 'A company has two plants. Plant A produces 3 units of Product 1 and 2 of Product 2 per hour. Plant B produces 1 unit of Product 1 and 4 of Product 2 per hour. To meet an order of 500 units of Product 1 and 600 of Product 2, how many hours should each plant run? Solve: 3x + y = 500, 2x + 4y = 600.',
    type: 'step-by-step',
    difficulty: 'hard',
    points: 20,
    hints: [
      'System: 3x + y = 500 and 2x + 4y = 600',
      'Use elimination or substitution',
      'Check your solution'
    ],
    solution: {
      steps: [
        'System: 3x + y = 500 ... (1), 2x + 4y = 600 ... (2)',
        'Multiply (1) by 4: 12x + 4y = 2000',
        'Subtract (2): 12x + 4y - 2x - 4y = 2000 - 600',
        '10x = 1400, so x = 140',
        'Substitute into (1): 3(140) + y = 500',
        '420 + y = 500, so y = 80'
      ],
      explanation: 'Plant A should run for 140 hours and Plant B for 80 hours to meet the production targets.',
      finalAnswer: 'Plant A: 140 hours; Plant B: 80 hours',
      verification: 'Check: 3(140)+80=500 ✓, 2(140)+4(80)=280+320=600 ✓'
    },
    steps: [
      {
        instruction: 'Solve for x (hours for Plant A)',
        expectedAnswer: '140',
        hint: 'Eliminate y by multiplying equation 1 by 4 and subtracting equation 2'
      },
      {
        instruction: 'Solve for y (hours for Plant B)',
        expectedAnswer: '80',
        hint: 'Substitute x=140 into 3x + y = 500'
      }
    ]
  },
  {
    id: 'matrix-004',
    title: 'Inventory Management Matrix',
    description: 'Track multi-location inventory using matrices',
    businessContext: 'A warehouse chain tracks inventory across locations.',
    problemStatement: 'Three warehouses have inventory matrices for Week 1 and Week 2. W1 = [[100,200], [150,100], [200,150]] and W2 = [[120,180], [140,120], [210,140]]. Calculate the total inventory change matrix ΔW = W2 - W1.',
    type: 'step-by-step',
    difficulty: 'easy',
    points: 12,
    hints: [
      'Subtract corresponding elements',
      'ΔW[i][j] = W2[i][j] - W1[i][j]'
    ],
    solution: {
      steps: [
        'Warehouse 1: [120-100, 180-200] = [20, -20]',
        'Warehouse 2: [140-150, 120-100] = [-10, 20]',
        'Warehouse 3: [210-200, 140-150] = [10, -10]',
        'Change matrix ΔW = [[20,-20], [-10,20], [10,-10]]'
      ],
      explanation: 'The change matrix shows inventory increases (positive) and decreases (negative) for each product at each location.',
      finalAnswer: 'ΔW = [[20,-20], [-10,20], [10,-10]]',
      verification: 'Row 1: Product A +20, Product B -20 at Warehouse 1 ✓'
    },
    steps: [
      {
        instruction: 'Calculate the change for Warehouse 1',
        expectedAnswer: '[20, -20]',
        hint: 'W2[1] - W1[1] = [120-100, 180-200]'
      },
      {
        instruction: 'Calculate the change for Warehouse 3',
        expectedAnswer: '[10, -10]',
        hint: 'W2[3] - W1[3] = [210-200, 140-150]'
      }
    ]
  },
  {
    id: 'matrix-005',
    title: 'Optimization with Linear Programming',
    description: 'Set up optimization problem using matrix inequalities',
    businessContext: 'A logistics company optimizes delivery routes to minimize costs.',
    problemStatement: 'A company delivers two products. Each unit of Product A requires 2 truck hours and earns $30 profit. Product B requires 3 truck hours and earns $40 profit. With 100 truck hours available, set up the optimization problem to maximize profit.',
    type: 'multiple-choice',
    difficulty: 'medium',
    points: 14,
    hints: [
      'Let x = units of Product A, y = units of Product B',
      'Constraint: 2x + 3y ≤ 100',
      'Objective: Maximize P = 30x + 40y'
    ],
    solution: {
      steps: [
        'Variables: x = Product A units, y = Product B units',
        'Resource constraint: 2x + 3y ≤ 100',
        'Non-negativity: x ≥ 0, y ≥ 0',
        'Objective function: Maximize P = 30x + 40y'
      ],
      explanation: 'This is a linear programming problem. The optimal solution occurs at a corner point of the feasible region.',
      finalAnswer: 'Maximize P = 30x + 40y subject to 2x + 3y ≤ 100, x≥0, y≥0'
    },
    choices: [
      'Maximize P = 30x + 40y',
      'Maximize P = 2x + 3y',
      'Minimize P = 30x + 40y',
      'Maximize P = 100x + 100y'
    ],
    correctAnswer: 'Maximize P = 30x + 40y'
  }
];

// Module 6: Sequences, Probability, and Financial Applications - Interactive Problem Set
export const sequencesProbabilityProblems: Problem[] = [
  {
    id: 'seq-001',
    title: 'Annuity and Retirement Planning',
    description: 'Calculate future value of regular savings using sequences',
    businessContext: 'A financial planner helps a client calculate retirement savings.',
    problemStatement: 'An investor deposits $500 at the end of each month into an account earning 0.5% monthly interest. How much will be in the account after 10 years (120 months)? Use the future value formula: FV = P × [(1+r)ⁿ - 1]/r.',
    type: 'step-by-step',
    difficulty: 'hard',
    points: 20,
    hints: [
      'P = $500 (monthly payment)',
      'r = 0.005 (0.5% monthly rate)',
      'n = 120 months',
      'FV = 500 × [(1.005)¹²⁰ - 1]/0.005'
    ],
    solution: {
      steps: [
        'Identify values: P=500, r=0.005, n=120',
        'Formula: FV = P × [(1+r)ⁿ - 1]/r',
        'Substitute: FV = 500 × [(1.005)¹²⁰ - 1]/0.005',
        'Calculate: (1.005)¹²⁰ ≈ 1.8194',
        'FV = 500 × [0.8194/0.005] = 500 × 163.88 ≈ $81,940'
      ],
      explanation: 'After 10 years of $500 monthly deposits, the account grows to $81,940 (total deposits: $60,000; interest earned: $21,940).',
      finalAnswer: '$81,940',
      verification: 'Total deposited: 500×120=$60,000; Interest=$21,940 ✓'
    },
    steps: [
      {
        instruction: 'Calculate (1+r)ⁿ where r=0.005 and n=120',
        expectedAnswer: '1.8194',
        hint: '(1.005)^120'
      },
      {
        instruction: 'Calculate the future value (round to nearest dollar)',
        expectedAnswer: '81940',
        hint: 'FV = 500 × [(1.8194-1)/0.005]'
      }
    ]
  },
  {
    id: 'seq-002',
    title: 'Arithmetic Sequence in Salary Progression',
    description: 'Model salary increases using arithmetic sequences',
    businessContext: 'An HR department plans salary increments over a career span.',
    problemStatement: 'An employee starts at $40,000/year with $2,500 annual raises. What will their salary be in year 15? Find the sum of total earnings over 15 years. Use: aₙ = a₁ + (n-1)d and Sₙ = n(a₁+aₙ)/2.',
    type: 'step-by-step',
    difficulty: 'medium',
    points: 16,
    hints: [
      'Arithmetic sequence: aₙ = a₁ + (n-1)d',
      'a₁ = 40000, d = 2500, n = 15',
      'Sum formula: Sₙ = n(a₁+aₙ)/2'
    ],
    solution: {
      steps: [
        'Year 15 salary: a₁₅ = 40000 + (15-1)×2500',
        'a₁₅ = 40000 + 14×2500 = 40000 + 35000 = $75,000',
        'Total earnings: S₁₅ = 15(40000+75000)/2',
        'S₁₅ = 15×115000/2 = 15×57500 = $862,500'
      ],
      explanation: 'After 15 years, the employee earns $75,000/year and has earned $862,500 total.',
      finalAnswer: 'Year 15 salary: $75,000; Total earnings: $862,500',
      verification: 'Average salary = 862500/15 = $57,500 = (40000+75000)/2 ✓'
    },
    steps: [
      {
        instruction: 'Calculate the salary in year 15',
        expectedAnswer: '75000',
        hint: 'a₁₅ = 40000 + 14×2500'
      },
      {
        instruction: 'Calculate total earnings over 15 years',
        expectedAnswer: '862500',
        hint: 'S₁₅ = 15×(40000+75000)/2'
      }
    ]
  },
  {
    id: 'seq-003',
    title: 'Geometric Sequence in Sales Growth',
    description: 'Model exponential sales growth using geometric sequences',
    businessContext: 'A sales team projects revenue growth for a viral product.',
    problemStatement: 'A product generates $10,000 in month 1. Sales grow by 20% each month (geometric sequence with r=1.2). What will sales be in month 12? Find cumulative sales over 12 months. Use: aₙ = a₁rⁿ⁻¹ and Sₙ = a₁(rⁿ-1)/(r-1).',
    type: 'step-by-step',
    difficulty: 'hard',
    points: 18,
    hints: [
      'Geometric sequence: aₙ = a₁rⁿ⁻¹',
      'a₁ = 10000, r = 1.2, n = 12',
      'Sum: Sₙ = a₁(rⁿ-1)/(r-1)'
    ],
    solution: {
      steps: [
        'Month 12 sales: a₁₂ = 10000 × (1.2)¹¹',
        'Calculate: (1.2)¹¹ ≈ 7.43',
        'a₁₂ = 10000 × 7.43 ≈ $74,300',
        'Cumulative sales: S₁₂ = 10000 × [(1.2)¹² - 1]/(1.2 - 1)',
        'S₁₂ = 10000 × [8.916 - 1]/0.2 = 10000 × 39.58 ≈ $395,800'
      ],
      explanation: 'By month 12, monthly sales reach $74,300 and cumulative sales total $395,800.',
      finalAnswer: 'Month 12: $74,300; Cumulative: $395,800',
      verification: 'Growth factor (1.2)¹¹ ≈ 7.43 means sales increase 7.43× over 11 months ✓'
    },
    steps: [
      {
        instruction: 'Calculate sales in month 12 (round to nearest hundred)',
        expectedAnswer: '74300',
        hint: 'a₁₂ = 10000 × (1.2)^11'
      },
      {
        instruction: 'Calculate cumulative sales over 12 months (round to nearest hundred)',
        expectedAnswer: '395800',
        hint: 'S₁₂ = 10000 × [(1.2)^12 - 1]/0.2'
      }
    ]
  },
  {
    id: 'seq-004',
    title: 'Probability in Quality Control',
    description: 'Apply probability to manufacturing defect analysis',
    businessContext: 'A quality control team analyzes product defect rates.',
    problemStatement: 'A factory produces widgets with a 2% defect rate. If a customer orders 50 widgets, what is the probability that at most 1 is defective? Use binomial probability: P(X=k) = C(n,k) × pᵏ × (1-p)ⁿ⁻ᵏ.',
    type: 'step-by-step',
    difficulty: 'hard',
    points: 19,
    hints: [
      'n = 50, p = 0.02, find P(X≤1) = P(X=0) + P(X=1)',
      'P(X=0) = (0.98)⁵⁰',
      'P(X=1) = 50 × (0.02) × (0.98)⁴⁹'
    ],
    solution: {
      steps: [
        'P(X=0) = C(50,0) × (0.02)⁰ × (0.98)⁵⁰ = 1 × 1 × 0.3642 ≈ 0.3642',
        'P(X=1) = C(50,1) × (0.02)¹ × (0.98)⁴⁹ = 50 × 0.02 × 0.3716 ≈ 0.3716',
        'P(X≤1) = P(X=0) + P(X=1) = 0.3642 + 0.3716 = 0.7358',
        'Probability ≈ 73.58%'
      ],
      explanation: 'There\'s a 73.58% chance that at most 1 widget in an order of 50 will be defective.',
      finalAnswer: '73.58% or 0.7358',
      verification: 'Expected defects = 50×0.02 = 1, so P(≤1) should be reasonably high ✓'
    },
    steps: [
      {
        instruction: 'Calculate P(X=0), the probability of zero defects',
        expectedAnswer: '0.3642',
        hint: 'P(X=0) = (0.98)^50'
      },
      {
        instruction: 'Calculate P(X=1), the probability of exactly 1 defect',
        expectedAnswer: '0.3716',
        hint: 'P(X=1) = 50 × 0.02 × (0.98)^49'
      },
      {
        instruction: 'Calculate P(X≤1) as a percentage (round to 2 decimals)',
        expectedAnswer: '73.58',
        hint: 'P(X≤1) = P(X=0) + P(X=1)'
      }
    ]
  },
  {
    id: 'seq-005',
    title: 'Risk Assessment using Expected Value',
    description: 'Calculate expected value for investment decisions',
    businessContext: 'A venture capital firm evaluates investment risk.',
    problemStatement: 'An investor considers a startup investment: 40% chance of $500k return, 30% chance of $100k return, 30% chance of -$200k loss. Calculate the expected value. Should they invest if the cost is $150k?',
    type: 'step-by-step',
    difficulty: 'medium',
    points: 14,
    hints: [
      'Expected value E(X) = Σ(probability × outcome)',
      'E(X) = 0.40(500k) + 0.30(100k) + 0.30(-200k)',
      'Compare E(X) to investment cost'
    ],
    solution: {
      steps: [
        'Calculate expected value: E(X) = Σ(Pᵢ × Xᵢ)',
        'E(X) = 0.40×500k + 0.30×100k + 0.30×(-200k)',
        'E(X) = 200k + 30k - 60k = $170k',
        'Net expected value: $170k - $150k (cost) = $20k',
        'Decision: YES, invest (positive expected value)'
      ],
      explanation: 'The investment has an expected return of $170k against a $150k cost, yielding $20k expected profit.',
      finalAnswer: 'Expected value: $170k; Net profit: $20k; Decision: INVEST',
      verification: 'Weighted average: 40%×$500k + 30%×$100k + 30%×(-$200k) = $170k ✓'
    },
    steps: [
      {
        instruction: 'Calculate the expected value of returns (in thousands)',
        expectedAnswer: '170',
        hint: 'E(X) = 0.40×500 + 0.30×100 + 0.30×(-200)'
      },
      {
        instruction: 'Calculate net expected profit after $150k investment cost (in thousands)',
        expectedAnswer: '20',
        hint: 'Net profit = Expected value - Investment cost'
      }
    ]
  }
];

// Helper function to get problems for a specific module
export function getProblemsForModule(moduleSlug: string): Problem[] {
  switch (moduleSlug) {
    case 'linear-equations':
      return linearEquationsProblems;
    case 'functions-and-graphing':
      return functionsAndGraphingProblems;
    case 'quadratic-functions':
      return quadraticFunctionsProblems;
    case 'exponential-and-logarithmic-functions':
      return exponentialLogarithmicProblems;
    case 'matrix-operations-and-applications':
      return matrixOperationsProblems;
    case 'sequences-probability':
      return sequencesProbabilityProblems;
    default:
      return [];
  }
}
