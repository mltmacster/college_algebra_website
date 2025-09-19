
import { PrismaClient, BadgeType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
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
      title: "Functions and Graphs",
      description: "Explore function behavior, graphing techniques, and piecewise functions used in tiered pricing models.",
      order: 2,
      slug: "functions-graphs",
      content: JSON.stringify({
        overview: "Comprehensive study of functions and their graphical representations",
        businessApplications: ["Tiered Pricing", "Function Modeling", "Domain Analysis", "Transformations"],
        estimatedHours: 18,
        difficulty: "Beginner"
      }),
      objectives: [
        "Understand function notation and terminology",
        "Graph various types of functions accurately",
        "Analyze domain and range of business functions",
        "Model tiered pricing with piecewise functions",
        "Interpret function transformations in business contexts"
      ],
      topics: [
        "Function Notation",
        "Graphing Techniques",
        "Piecewise Functions", 
        "Domain & Range",
        "Transformations"
      ],
      isActive: true
    },
    {
      title: "Polynomial and Rational Functions",
      description: "Analyze complex relationships in revenue optimization and efficiency modeling through advanced functions.",
      order: 3,
      slug: "polynomial-rational",
      content: JSON.stringify({
        overview: "Advanced function analysis for complex business modeling",
        businessApplications: ["Revenue Optimization", "Efficiency Analysis", "Cost Modeling", "Asymptotic Behavior"],
        estimatedHours: 24,
        difficulty: "Intermediate"
      }),
      objectives: [
        "Analyze polynomial functions and their business applications",
        "Understand rational functions in efficiency modeling",
        "Apply functions to revenue optimization problems",
        "Interpret asymptotic behavior in business contexts",
        "Model complex relationships using advanced functions"
      ],
      topics: [
        "Polynomial Models",
        "Revenue Optimization",
        "Efficiency Analysis",
        "Asymptotes",
        "End Behavior"
      ],
      isActive: true
    },
    {
      title: "Exponential and Logarithmic Functions",
      description: "Study growth models, compound interest, and logarithmic scales essential for business finance.",
      order: 4,
      slug: "exponential-logarithmic",
      content: JSON.stringify({
        overview: "Financial mathematics using exponential and logarithmic functions",
        businessApplications: ["Compound Interest", "Growth Models", "Investment Analysis", "Scaling"],
        estimatedHours: 26,
        difficulty: "Intermediate"
      }),
      objectives: [
        "Model exponential growth in business scenarios",
        "Calculate compound interest and investment returns",
        "Apply logarithmic functions to solve business problems",
        "Analyze scaling patterns in business growth",
        "Make informed financial decisions using mathematical models"
      ],
      topics: [
        "Exponential Growth",
        "Compound Interest",
        "Business Scaling",
        "Logarithmic Models",
        "Investment Analysis"
      ],
      isActive: true
    },
    {
      title: "Systems of Equations and Matrices",
      description: "Learn resource allocation, optimization problems, and matrix operations for business decision making.",
      order: 5,
      slug: "systems-matrices",
      content: JSON.stringify({
        overview: "Advanced problem solving with systems and matrices",
        businessApplications: ["Resource Allocation", "Linear Programming", "Decision Making", "Optimization"],
        estimatedHours: 28,
        difficulty: "Advanced"
      }),
      objectives: [
        "Solve systems of linear equations efficiently",
        "Apply matrix operations to business problems",
        "Optimize resource allocation using linear programming",
        "Make data-driven business decisions",
        "Model complex business scenarios with multiple variables"
      ],
      topics: [
        "Resource Allocation",
        "Matrix Operations",
        "Optimization",
        "Linear Programming",
        "Decision Making"
      ],
      isActive: true
    },
    {
      title: "Sequences, Series, and Probability",
      description: "Apply sequences and probability concepts to financial planning, risk assessment, and forecasting.",
      order: 6,
      slug: "sequences-probability",
      content: JSON.stringify({
        overview: "Financial planning and risk analysis using mathematical sequences and probability",
        businessApplications: ["Financial Planning", "Risk Assessment", "Forecasting", "Annuities"],
        estimatedHours: 22,
        difficulty: "Advanced"
      }),
      objectives: [
        "Apply sequences to financial planning problems",
        "Use probability for risk assessment",
        "Create business forecasts using mathematical models",
        "Calculate annuity and investment sequences",
        "Make informed decisions under uncertainty"
      ],
      topics: [
        "Financial Planning",
        "Risk Assessment", 
        "Forecasting",
        "Annuities",
        "Monte Carlo Methods"
      ],
      isActive: true
    }
  ];

  // Create modules
  for (const moduleData of modules) {
    await prisma.learningModule.upsert({
      where: { slug: moduleData.slug },
      update: moduleData,
      create: moduleData
    });
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
      title: "Functions Expert", 
      description: "Master functions and graphs with excellent performance",
      imageUrl: "https://cdn.abacus.ai/images/51024b94-7fbb-4036-987b-b3fe393f6bf8.png",
      badgeType: BadgeType.MODULE_COMPLETION,
      requirements: JSON.stringify({ minScore: 80, moduleSlug: "functions-graphs" }),
      points: 100
    },
    {
      title: "Advanced Functions Specialist",
      description: "Excel in polynomial and rational functions applications",
      imageUrl: "https://cdn.abacus.ai/images/66b5d1c0-2932-4b89-8b7a-bf1602072d0a.png",
      badgeType: BadgeType.MODULE_COMPLETION,
      requirements: JSON.stringify({ minScore: 80, moduleSlug: "polynomial-rational" }),
      points: 120
    },
    {
      title: "Exponential Growth Guru",
      description: "Master exponential and logarithmic functions for financial analysis",
      imageUrl: "https://cdn.abacus.ai/images/34b6cfe8-5c21-4134-ac87-d925614c655e.png",
      badgeType: BadgeType.MODULE_COMPLETION,
      requirements: JSON.stringify({ minScore: 80, moduleSlug: "exponential-logarithmic" }),
      points: 120
    },
    {
      title: "Systems & Matrices Pro",
      description: "Advanced problem solving with systems and linear programming",
      imageUrl: "https://cdn.abacus.ai/images/ee07f028-b7bf-48ed-b7c3-fa607383db57.png",
      badgeType: BadgeType.MODULE_COMPLETION,
      requirements: JSON.stringify({ minScore: 80, moduleSlug: "systems-matrices" }),
      points: 150
    },
    {
      title: "Probability & Planning Expert",
      description: "Master financial planning and risk assessment techniques",
      imageUrl: "https://cdn.abacus.ai/images/932a5a8a-52f3-48ec-928d-7d55a4d52b9b.png",
      badgeType: BadgeType.MODULE_COMPLETION,
      requirements: JSON.stringify({ minScore: 80, moduleSlug: "sequences-probability" }),
      points: 130
    }
  ];

  for (const badgeData of badges) {
    const module = await prisma.learningModule.findUnique({
      where: { slug: JSON.parse(badgeData.requirements).moduleSlug }
    });
    
    if (module) {
      // Check if badge already exists for this module
      const existingBadge = await prisma.badge.findFirst({
        where: { 
          moduleId: module.id,
          badgeType: badgeData.badgeType
        }
      });

      if (existingBadge) {
        // Update existing badge
        await prisma.badge.update({
          where: { id: existingBadge.id },
          data: { ...badgeData, moduleId: module.id }
        });
      } else {
        // Create new badge
        await prisma.badge.create({
          data: { ...badgeData, moduleId: module.id }
        });
      }
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
