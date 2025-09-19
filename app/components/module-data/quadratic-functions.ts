
export const quadraticFunctionsData = {
  'Quadratic Functions Basics': [
    {
      id: 'concept-1',
      type: 'concept' as const,
      title: 'Quadratic Functions in Business Optimization',
      content: 'Quadratic functions f(x) = ax² + bx + c model relationships with curved patterns common in business: profit optimization, cost minimization, demand curves, and resource allocation. The vertex represents maximum or minimum values crucial for business decisions.'
    },
    {
      id: 'example-1',
      type: 'example' as const,
      title: 'Profit Maximization',
      content: 'A company\'s profit function is P(x) = -2x² + 80x - 300, where x is the number of units sold (in hundreds).',
      example: {
        problem: 'Find the number of units that maximizes profit and the maximum profit amount.',
        solution: 'Maximum at x = 20 (2000 units), Maximum profit = $500',
        steps: [
          'Given: P(x) = -2x² + 80x - 300',
          'For maximum, use x = -b/(2a) = -80/(2(-2)) = 20',
          'This represents 20 hundred = 2000 units',
          'Maximum profit: P(20) = -2(400) + 80(20) - 300 = -800 + 1600 - 300 = $500',
          'The company maximizes profit by selling 2000 units, earning $500'
        ]
      }
    },
    {
      id: 'practice-1',
      type: 'practice' as const,
      title: 'Revenue Optimization',
      content: 'Practice finding optimal business solutions using quadratic functions.',
      questions: [
        {
          id: 'q1',
          question: 'A product has revenue function R(p) = -50p² + 1000p, where p is price. What price maximizes revenue?',
          type: 'calculation' as const,
          correctAnswer: '10',
          explanation: 'Using x = -b/(2a) = -1000/(2(-50)) = 10. The price that maximizes revenue is $10.'
        }
      ]
    }
  ],

  'Parabolas and Vertex Form': [
    {
      id: 'concept-2',
      type: 'concept' as const,
      title: 'Vertex Form for Business Analysis',
      content: 'Vertex form f(x) = a(x - h)² + k directly shows the optimal point (h,k). In business, this immediately reveals the best price, optimal production level, or minimum cost without additional calculations.'
    },
    {
      id: 'example-2',
      type: 'example' as const,
      title: 'Cost Minimization Analysis',
      content: 'A manufacturing company\'s cost function is C(q) = 3(q - 50)² + 1200, where q is production quantity.',
      example: {
        problem: 'What production level minimizes costs and what is the minimum cost?',
        solution: 'Minimum cost at q = 50 units, Minimum cost = $1,200',
        steps: [
          'Vertex form: C(q) = 3(q - 50)² + 1200',
          'Vertex is at (h,k) = (50, 1200)',
          'Since a = 3 > 0, parabola opens upward (minimum)',
          'Minimum production level: q = 50 units',
          'Minimum cost: C(50) = $1,200',
          'Any deviation from 50 units increases costs'
        ]
      }
    }
  ],

  'Applications of Quadratics': [
    {
      id: 'concept-3',
      type: 'concept' as const,
      title: 'Real-World Business Applications',
      content: 'Quadratic functions model many business scenarios: pricing strategies that balance volume and margin, advertising spend optimization, inventory management, and project timeline analysis.'
    },
    {
      id: 'example-3',
      type: 'example' as const,
      title: 'Marketing Budget Optimization',
      content: 'A company finds their monthly sales S follow the function S(x) = -0.5x² + 20x + 100, where x is advertising spend in thousands of dollars.',
      example: {
        problem: 'What advertising budget maximizes sales? What are the maximum sales?',
        solution: 'Optimal budget: $20,000, Maximum sales: 300 units',
        steps: [
          'Given: S(x) = -0.5x² + 20x + 100',
          'Find vertex: x = -b/(2a) = -20/(2(-0.5)) = 20',
          'Optimal advertising spend: $20,000',
          'Maximum sales: S(20) = -0.5(400) + 20(20) + 100 = -200 + 400 + 100 = 300',
          'The company should spend $20,000 monthly on advertising for maximum sales of 300 units'
        ]
      }
    }
  ]
};
