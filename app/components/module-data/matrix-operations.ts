
export const matrixOperationsData = {
  'Introduction to Matrices in Business': [
    {
      id: 'concept-1',
      type: 'concept' as const,
      title: 'Matrices for Business Data Organization',
      content: 'Matrices organize business data in rows and columns: sales by region and quarter, costs by department and month, inventory by product and location. Matrix operations enable complex business calculations like profit analysis, resource allocation, and multi-variable optimization.'
    },
    {
      id: 'example-1',
      type: 'example' as const,
      title: 'Sales Data Matrix',
      content: 'A company tracks quarterly sales (in thousands) for three products across two regions.',
      example: {
        problem: 'Organize this data: Region A: Product 1=$120k, Product 2=$85k, Product 3=$95k. Region B: Product 1=$110k, Product 2=$90k, Product 3=$105k',
        solution: 'Sales Matrix S = [[120, 85, 95], [110, 90, 105]]',
        steps: [
          'Create a 2×3 matrix (2 regions, 3 products)',
          'Row 1 (Region A): [120, 85, 95]',
          'Row 2 (Region B): [110, 90, 105]',
          'Complete matrix: S = [[120, 85, 95], [110, 90, 105]]',
          'Element S₁₂ = 85 represents Region A, Product 2 sales',
          'This organization enables easy analysis and calculations'
        ]
      }
    },
    {
      id: 'practice-1',
      type: 'practice' as const,
      title: 'Matrix Data Organization',
      content: 'Practice organizing business data into matrix format.',
      questions: [
        {
          id: 'q1',
          question: 'A store has inventory: Shirts: Small=50, Medium=75, Large=60. Pants: Small=30, Medium=45, Large=40. What is the element in position (2,1)?',
          type: 'calculation' as const,
          correctAnswer: '30',
          explanation: 'Matrix: [[50,75,60], [30,45,40]]. Element (2,1) is row 2, column 1 = 30 (Pants, Small size).'
        }
      ]
    }
  ],

  'Matrix Addition and Subtraction': [
    {
      id: 'concept-2',
      type: 'concept' as const,
      title: 'Combining Business Data with Matrix Operations',
      content: 'Matrix addition combines data from same categories (Q1 + Q2 sales, actual + projected costs). Matrix subtraction finds differences (actual - budget, this year - last year). Both operations require matrices of identical dimensions.'
    },
    {
      id: 'example-2',
      type: 'example' as const,
      title: 'Quarterly Sales Comparison',
      content: 'Compare Q1 and Q2 sales data to find total and growth.',
      example: {
        problem: 'Q1 Sales: [[100, 120], [80, 90]], Q2 Sales: [[110, 130], [85, 95]]. Find total sales and growth.',
        solution: 'Total: [[210, 250], [165, 185]], Growth: [[10, 10], [5, 5]]',
        steps: [
          'Total Sales = Q1 + Q2 (add corresponding elements)',
          'Total₁₁ = 100 + 110 = 210, Total₁₂ = 120 + 130 = 250',
          'Total₂₁ = 80 + 85 = 165, Total₂₂ = 90 + 95 = 185',
          'Total Sales Matrix: [[210, 250], [165, 185]]',
          'Growth = Q2 - Q1 (subtract corresponding elements)',
          'Growth Matrix: [[10, 10], [5, 5]]',
          'All segments showed positive growth'
        ]
      }
    }
  ],

  'Matrix Multiplication for Business Analysis': [
    {
      id: 'concept-3',
      type: 'concept' as const,
      title: 'Matrix Multiplication in Business Calculations',
      content: 'Matrix multiplication combines different business metrics: [Quantities] × [Unit Prices] = [Total Revenue], [Costs per Unit] × [Production Volumes] = [Total Costs]. The number of columns in the first matrix must equal rows in the second.'
    },
    {
      id: 'example-3',
      type: 'example' as const,
      title: 'Revenue Calculation Using Matrix Multiplication',
      content: 'Calculate total revenue from sales quantities and unit prices.',
      example: {
        problem: 'Sales quantities: [[50, 30], [40, 60]] (products × regions). Unit prices: [[15], [25]] (per product). Find total revenue.',
        solution: 'Revenue = [[50×15 + 30×25], [40×15 + 60×25]] = [[1500], [2100]]',
        steps: [
          'Matrix multiplication: Sales × Prices',
          'Sales is 2×2, Prices is 2×1, result will be 2×1',
          'Row 1: 50×15 + 30×25 = 750 + 750 = 1500',
          'Row 2: 40×15 + 60×25 = 600 + 1500 = 2100',
          'Revenue Matrix: [[1500], [2100]]',
          'Region 1: $1,500, Region 2: $2,100 total revenue'
        ]
      }
    },
    {
      id: 'practice-3',
      type: 'practice' as const,
      title: 'Business Matrix Multiplication',
      content: 'Apply matrix multiplication to business scenarios.',
      questions: [
        {
          id: 'q1',
          question: 'Production costs: [[2, 3]] (labor, materials per unit). Quantities: [[100], [200]] (labor hours, material units). What is the total cost?',
          type: 'calculation' as const,
          correctAnswer: '800',
          explanation: 'Total cost = [2, 3] × [[100], [200]] = [2×100 + 3×200] = [200 + 600] = [800]. Total cost is $800.'
        }
      ]
    }
  ]
};
