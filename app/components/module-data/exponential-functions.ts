
export const exponentialFunctionsData = {
  'Introduction to Exponential Functions': [
    {
      id: 'concept-1',
      type: 'concept' as const,
      title: 'Exponential Growth in Business',
      content: 'Exponential functions have the form f(x) = a·b^x, where the base b determines growth (b > 1) or decay (0 < b < 1). In business, exponential functions model compound interest, population growth, viral marketing, technology adoption, and economic expansion.'
    },
    {
      id: 'example-1',
      type: 'example' as const,
      title: 'Startup Growth Analysis',
      content: 'A tech startup has 1,000 users and grows at 15% per month. Model their user growth.',
      example: {
        problem: 'Write the exponential function and predict users after 8 months.',
        solution: 'U(t) = 1000(1.15)^t, After 8 months: U(8) = 1000(1.15)^8 ≈ 3,059 users',
        steps: [
          'Initial users: a = 1000',
          'Growth rate: 15% = 0.15, so b = 1 + 0.15 = 1.15',
          'Exponential function: U(t) = 1000(1.15)^t',
          'Calculate U(8): U(8) = 1000(1.15)^8',
          'U(8) = 1000 × 3.059 ≈ 3,059 users',
          'The startup will have approximately 3,059 users after 8 months'
        ]
      }
    },
    {
      id: 'practice-1',
      type: 'practice' as const,
      title: 'Business Growth Problems',
      content: 'Practice modeling exponential growth in business scenarios.',
      questions: [
        {
          id: 'q1',
          question: 'A company\'s revenue grows 12% annually. If current revenue is $500,000, what will it be in 5 years? Round to nearest thousand.',
          type: 'calculation' as const,
          correctAnswer: '882000',
          explanation: 'R(t) = 500000(1.12)^t. R(5) = 500000(1.12)^5 = 500000(1.762) ≈ $881,000. The company\'s revenue will be approximately $882,000.'
        }
      ]
    }
  ],

  'Compound Interest and Financial Applications': [
    {
      id: 'concept-2',
      type: 'concept' as const,
      title: 'Compound Interest Formula',
      content: 'Compound interest formula: A = P(1 + r/n)^(nt), where P is principal, r is annual rate, n is compounding frequency, and t is time. This models investments, loans, business financing, and retirement planning.'
    },
    {
      id: 'example-2',
      type: 'example' as const,
      title: 'Business Investment Analysis',
      content: 'A business invests $50,000 at 6% annual interest, compounded quarterly, for equipment financing.',
      example: {
        problem: 'What will the investment be worth in 3 years?',
        solution: 'A = $50,000(1.015)^12 ≈ $59,780',
        steps: [
          'Given: P = $50,000, r = 0.06, n = 4 (quarterly), t = 3',
          'Formula: A = P(1 + r/n)^(nt)',
          'A = 50000(1 + 0.06/4)^(4×3)',
          'A = 50000(1 + 0.015)^12',
          'A = 50000(1.015)^12',
          'A = 50000(1.1956) ≈ $59,780',
          'The investment will be worth approximately $59,780 after 3 years'
        ]
      }
    }
  ],

  'Exponential Decay and Depreciation': [
    {
      id: 'concept-3',
      type: 'concept' as const,
      title: 'Exponential Decay in Business Assets',
      content: 'Exponential decay models asset depreciation, market share decline, customer churn, and product obsolescence. The decay function is f(x) = a·b^x where 0 < b < 1, representing the percentage remaining each period.'
    },
    {
      id: 'example-3',
      type: 'example' as const,
      title: 'Equipment Depreciation',
      content: 'A company purchases machinery for $80,000. It depreciates at 20% annually.',
      example: {
        problem: 'What will the machinery be worth after 4 years?',
        solution: 'V(t) = 80000(0.8)^t, V(4) = 80000(0.8)^4 ≈ $32,768',
        steps: [
          'Initial value: $80,000',
          'Depreciation rate: 20% loss means 80% remains',
          'Decay function: V(t) = 80000(0.8)^t',
          'After 4 years: V(4) = 80000(0.8)^4',
          'V(4) = 80000(0.4096) = $32,768',
          'The machinery will be worth $32,768 after 4 years'
        ]
      }
    },
    {
      id: 'practice-3',
      type: 'practice' as const,
      title: 'Depreciation Analysis',
      content: 'Calculate asset depreciation using exponential decay.',
      questions: [
        {
          id: 'q1',
          question: 'A vehicle worth $25,000 depreciates 15% each year. What is its value after 3 years? Round to nearest dollar.',
          type: 'calculation' as const,
          correctAnswer: '15328',
          explanation: 'V(t) = 25000(0.85)^t. V(3) = 25000(0.85)^3 = 25000(0.6131) ≈ $15,328. The vehicle will be worth $15,328 after 3 years.'
        }
      ]
    }
  ]
};
