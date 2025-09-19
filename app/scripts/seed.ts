
import { PrismaClient, BadgeType } from '@prisma/client'
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...');

  // Create test user - admin account with the specified credentials
  const hashedPassword = await bcrypt.hash('johndoe123', 12);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      password: hashedPassword,
    },
  });

  console.log('Created test user:', testUser.email);

  // Clean up existing modules and badges to avoid conflicts
  await prisma.badge.deleteMany({});
  await prisma.moduleProgress.deleteMany({});
  await prisma.learningModule.deleteMany({});
  console.log('Cleaned up existing modules and badges');

  // Create Learning Modules
  const modules = [
    {
      title: "Linear Equations and Inequalities",
      description: "Master the fundamentals of linear relationships, solving equations, and business applications like break-even analysis.",
      order: 1,
      slug: "linear-equations",
      content: JSON.stringify({
        overview: "Interactive module focused on linear equations and their business applications",
        businessApplications: ["Break-even Analysis", "Cost Functions", "Supply & Demand", "Market Equilibrium"],
        estimatedHours: 15,
        difficulty: "Beginner"
      }),
      objectives: [
        "Solve linear equations and inequalities in one variable",
        "Understand the concept of break-even analysis in business",
        "Apply linear functions to model cost, revenue, and profit",
        "Graph linear equations and interpret their business meanings",
        "Use linear models to make business decisions"
      ],
      topics: [
        "Linear Functions",
        "Break-even Analysis", 
        "Cost Functions",
        "Supply & Demand",
        "Market Equilibrium"
      ],
      isActive: true
    },
    {
      title: "Systems of Linear Equations",
      description: "Solve complex business problems involving multiple variables and constraints using systems of equations.",
      order: 2,
      slug: "systems-linear-equations",
      content: JSON.stringify({
        overview: "Advanced problem solving with systems of linear equations for business applications",
        businessApplications: ["Resource Allocation", "Multi-Product Analysis", "Market Analysis", "Optimization"],
        estimatedHours: 18,
        difficulty: "Intermediate"
      }),
      objectives: [
        "Solve systems of linear equations using multiple methods",
        "Apply systems to resource allocation problems",
        "Model multi-product business scenarios",
        "Analyze market equilibrium with multiple factors",
        "Optimize business decisions with multiple constraints"
      ],
      topics: [
        "Substitution Method",
        "Elimination Method", 
        "Resource Allocation",
        "Market Analysis",
        "Business Optimization"
      ],
      isActive: true
    },
    {
      title: "Functions and Graphing",
      description: "Explore function behavior, graphing techniques, and function composition for complex business modeling.",
      order: 3,
      slug: "functions-and-graphing",
      content: JSON.stringify({
        overview: "Comprehensive study of functions and their graphical representations in business",
        businessApplications: ["Function Modeling", "Business Processes", "Supply Chain Analysis", "Composite Functions"],
        estimatedHours: 20,
        difficulty: "Intermediate"
      }),
      objectives: [
        "Understand function notation and terminology",
        "Graph various types of functions accurately",
        "Model business processes with functions",
        "Apply function composition to multi-stage processes",
        "Analyze domain and range in business contexts"
      ],
      topics: [
        "Function Notation",
        "Graphing Techniques",
        "Function Composition",
        "Business Applications",
        "Multi-Stage Processes"
      ],
      isActive: true
    },
    {
      title: "Quadratic Functions",
      description: "Master quadratic functions for profit optimization, cost minimization, and revenue maximization in business.",
      order: 4,
      slug: "quadratic-functions",
      content: JSON.stringify({
        overview: "Business optimization using quadratic functions and vertex analysis",
        businessApplications: ["Profit Maximization", "Cost Minimization", "Revenue Optimization", "Business Analytics"],
        estimatedHours: 22,
        difficulty: "Intermediate"
      }),
      objectives: [
        "Understand quadratic functions in business optimization",
        "Find maximum and minimum values for business decisions",
        "Apply vertex form for immediate optimization insights",
        "Model curved business relationships",
        "Make data-driven optimization decisions"
      ],
      topics: [
        "Quadratic Functions",
        "Profit Maximization",
        "Vertex Form",
        "Business Optimization",
        "Cost Analysis"
      ],
      isActive: true
    },
    {
      title: "Exponential and Logarithmic Functions",
      description: "Study growth models, compound interest, and exponential decay essential for business finance and analysis.",
      order: 5,
      slug: "exponential-and-logarithmic-functions",
      content: JSON.stringify({
        overview: "Financial mathematics using exponential and logarithmic functions for business growth and decay",
        businessApplications: ["Compound Interest", "Business Growth", "Asset Depreciation", "Investment Analysis"],
        estimatedHours: 24,
        difficulty: "Advanced"
      }),
      objectives: [
        "Model exponential growth in business scenarios",
        "Calculate compound interest and investment returns",
        "Analyze asset depreciation using exponential decay",
        "Apply exponential functions to business growth models",
        "Make informed financial decisions using mathematical models"
      ],
      topics: [
        "Exponential Growth",
        "Compound Interest",
        "Asset Depreciation",
        "Business Growth Models",
        "Investment Analysis"
      ],
      isActive: true
    },
    {
      title: "Matrix Operations and Applications",
      description: "Learn matrix operations, data organization, and business calculations for complex multi-variable analysis.",
      order: 6,
      slug: "matrix-operations-and-applications",
      content: JSON.stringify({
        overview: "Advanced business data analysis using matrices and linear algebra operations",
        businessApplications: ["Data Organization", "Business Calculations", "Multi-Variable Analysis", "Linear Operations"],
        estimatedHours: 26,
        difficulty: "Advanced"
      }),
      objectives: [
        "Organize business data using matrices",
        "Perform matrix operations for business calculations",
        "Apply matrix addition and subtraction to data analysis",
        "Use matrix multiplication for complex business metrics",
        "Model multi-dimensional business relationships"
      ],
      topics: [
        "Matrix Organization",
        "Matrix Operations",
        "Business Data Analysis",
        "Multi-Variable Calculations",
        "Linear Business Models"
      ],
      isActive: true
    }
  ];

  // Create modules
  for (const moduleData of modules) {
    await prisma.learningModule.create({
      data: moduleData
    });
    console.log('Created module:', moduleData.title);
  }

  // Create Badges for each module
  const badges = [
    {
      title: "Linear Equations Master",
      description: "Complete the Linear Equations and Inequalities module with 80% or higher score",
      imageUrl: "https://cdn.abacus.ai/images/c73d1454-07ea-49e5-b42c-585b1fff268a.png",
      badgeType: BadgeType.MODULE_COMPLETION,
      requirements: JSON.stringify({ minScore: 80, moduleSlug: "linear-equations" }),
      points: 100
    },
    {
      title: "Systems Solver Expert", 
      description: "Master systems of linear equations with excellent performance",
      imageUrl: "https://cdn.abacus.ai/images/51024b94-7fbb-4036-987b-b3fe393f6bf8.png",
      badgeType: BadgeType.MODULE_COMPLETION,
      requirements: JSON.stringify({ minScore: 80, moduleSlug: "systems-linear-equations" }),
      points: 110
    },
    {
      title: "Functions & Graphing Specialist",
      description: "Excel in functions and graphing applications for business modeling",
      imageUrl: "https://cdn.abacus.ai/images/66b5d1c0-2932-4b89-8b7a-bf1602072d0a.png",
      badgeType: BadgeType.MODULE_COMPLETION,
      requirements: JSON.stringify({ minScore: 80, moduleSlug: "functions-and-graphing" }),
      points: 120
    },
    {
      title: "Quadratic Optimization Guru",
      description: "Master quadratic functions for business optimization and analysis",
      imageUrl: "https://cdn.abacus.ai/images/34b6cfe8-5c21-4134-ac87-d925614c655e.png",
      badgeType: BadgeType.MODULE_COMPLETION,
      requirements: JSON.stringify({ minScore: 80, moduleSlug: "quadratic-functions" }),
      points: 125
    },
    {
      title: "Exponential Growth Pro",
      description: "Advanced mastery of exponential and logarithmic functions for financial analysis",
      imageUrl: "https://cdn.abacus.ai/images/ee07f028-b7bf-48ed-b7c3-fa607383db57.png",
      badgeType: BadgeType.MODULE_COMPLETION,
      requirements: JSON.stringify({ minScore: 80, moduleSlug: "exponential-and-logarithmic-functions" }),
      points: 140
    },
    {
      title: "Matrix Operations Expert",
      description: "Master matrix operations and applications for complex business analysis",
      imageUrl: "https://cdn.abacus.ai/images/932a5a8a-52f3-48ec-928d-7d55a4d52b9b.png",
      badgeType: BadgeType.MODULE_COMPLETION,
      requirements: JSON.stringify({ minScore: 80, moduleSlug: "matrix-operations-and-applications" }),
      points: 150
    }
  ];

  for (const badgeData of badges) {
    const module = await prisma.learningModule.findUnique({
      where: { slug: JSON.parse(badgeData.requirements).moduleSlug }
    });
    
    if (module) {
      await prisma.badge.create({
        data: { ...badgeData, moduleId: module.id }
      });
      console.log('Created badge:', badgeData.title);
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${modules.length} learning modules`);
  console.log(`Created ${badges.length} badges`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
