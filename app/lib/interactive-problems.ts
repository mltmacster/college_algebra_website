
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
  const problem = linearEquationsProblems.find(p => p.id === problemId);
  if (!problem) {
    return { isCorrect: false, feedback: 'Problem not found' };
  }

  // Handle multiple choice
  if (problem.type === 'multiple-choice') {
    const isCorrect = userAnswer.toUpperCase() === problem.correctAnswer?.toUpperCase();
    return {
      isCorrect,
      feedback: isCorrect 
        ? '🎉 Correct! Great job applying linear equations to business analysis.' 
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
  const problem = linearEquationsProblems.find(p => p.id === problemId);
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
