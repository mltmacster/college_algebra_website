
export const functionsGraphingData = {
  'Introduction to Functions': [
    {
      id: 'concept-1',
      type: 'concept' as const,
      title: 'Understanding Functions in Business',
      content: 'A function is a relationship where each input has exactly one output. In business, functions model relationships like revenue = price × quantity, profit = revenue - costs, or demand based on price changes. Functions help predict outcomes and optimize business decisions.'
    },
    {
      id: 'example-1',
      type: 'example' as const,
      title: 'Revenue Function Example',
      content: 'A business selling widgets has a revenue function R(x) = 25x, where x is the number of widgets sold and R(x) is the total revenue.',
      example: {
        problem: 'If the widget company sells 150 widgets, what is their revenue?',
        solution: 'R(150) = 25(150) = $3,750',
        steps: [
          'Identify the revenue function: R(x) = 25x',
          'Substitute x = 150: R(150) = 25(150)',
          'Calculate: R(150) = $3,750',
          'Therefore, selling 150 widgets generates $3,750 in revenue'
        ]
      }
    },
    {
      id: 'practice-1',
      type: 'practice' as const,
      title: 'Function Practice Problems',
      content: 'Practice identifying and evaluating business functions.',
      questions: [
        {
          id: 'q1',
          question: 'A consulting firm charges $80 per hour. What is the function C(h) for total cost based on hours h?',
          type: 'input' as const,
          correctAnswer: 'C(h) = 80h',
          explanation: 'The cost function is C(h) = 80h, where h is the number of hours and 80 is the hourly rate.'
        },
        {
          id: 'q2',
          question: 'Using C(h) = 80h, what is the cost for 12 hours of consulting?',
          type: 'calculation' as const,
          correctAnswer: '960',
          explanation: 'C(12) = 80(12) = $960. The consulting firm would charge $960 for 12 hours of work.'
        }
      ]
    }
  ],

  'Linear Functions and Slope': [
    {
      id: 'concept-2',
      type: 'concept' as const,
      title: 'Linear Functions in Business Analytics',
      content: 'Linear functions have the form f(x) = mx + b, where m is the slope (rate of change) and b is the y-intercept (starting value). In business, the slope represents how one variable changes relative to another, like cost per unit or revenue growth rate.'
    },
    {
      id: 'example-2',
      type: 'example' as const,
      title: 'Break-Even Analysis',
      content: 'A startup has fixed costs of $5,000 and variable costs of $12 per unit. Their selling price is $20 per unit.',
      example: {
        problem: 'Create cost and revenue functions, then find the break-even point.',
        solution: 'Cost: C(x) = 5000 + 12x, Revenue: R(x) = 20x, Break-even: 5000 + 12x = 20x → x = 625 units',
        steps: [
          'Cost function: C(x) = 5000 + 12x (fixed costs + variable costs)',
          'Revenue function: R(x) = 20x (price per unit × units sold)',
          'Break-even when C(x) = R(x): 5000 + 12x = 20x',
          'Solve: 5000 = 8x → x = 625 units',
          'Break-even point: 625 units, generating $12,500 in revenue'
        ]
      }
    }
  ],

  'Function Composition': [
    {
      id: 'concept-3',
      type: 'concept' as const,
      title: 'Multi-Stage Business Processes',
      content: 'Function composition (f∘g)(x) = f(g(x)) represents multi-stage processes common in business: manufacturing → distribution → retail, or lead generation → conversion → revenue.'
    },
    {
      id: 'example-3',
      type: 'example' as const,
      title: 'Supply Chain Analysis',
      content: 'A manufacturer produces units at cost C(x) = 15x + 2000. A distributor marks up by 40%: D(y) = 1.4y. Find the total cost function.',
      example: {
        problem: 'What is the distributor\'s total cost for x units?',
        solution: '(D∘C)(x) = D(C(x)) = 1.4(15x + 2000) = 21x + 2800',
        steps: [
          'Manufacturing cost: C(x) = 15x + 2000',
          'Distributor markup: D(y) = 1.4y',
          'Composite function: D(C(x)) = 1.4(15x + 2000)',
          'Simplify: D(C(x)) = 21x + 2800',
          'For x units, distributor pays $21 per unit plus $2,800 fixed costs'
        ]
      }
    }
  ]
};
