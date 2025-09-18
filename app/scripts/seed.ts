
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

  // Create learning modules
  const modules = [
    {
      title: "Linear Equations and Inequalities",
      description: "Master the fundamentals of linear relationships, solving equations, and business applications like break-even analysis.",
      order: 1,
      slug: "linear-equations",
      content: "Comprehensive module covering linear equations, inequalities, and their business applications including break-even analysis, cost functions, supply and demand models, and market equilibrium.",
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
      ]
    },
    {
      title: "Functions and Graphs",
      description: "Explore function behavior, graphing techniques, and piecewise functions used in tiered pricing models.",
      order: 2,
      slug: "functions-graphs",
      content: "In-depth study of functions including notation, graphing, domain and range, piecewise functions for tiered pricing, and function transformations in business contexts.",
      objectives: [
        "Understand function notation and terminology",
        "Graph various types of functions accurately",
        "Analyze domain and range of business functions",
        "Model tiered pricing with piecewise functions",
        "Interpret function transformations in business contexts"
      ],
      topics: [
        "Function Notation",
        "Graphing",
        "Piecewise Functions",
        "Domain & Range",
        "Transformations"
      ]
    },
    {
      title: "Polynomial and Rational Functions",
      description: "Analyze complex relationships in revenue optimization and efficiency modeling through advanced functions.",
      order: 3,
      slug: "polynomial-rational",
      content: "Advanced study of polynomial and rational functions with applications to revenue optimization, efficiency analysis, asymptotic behavior, and end behavior analysis.",
      objectives: [
        "Analyze polynomial functions and their graphs",
        "Understand rational functions and asymptotes",
        "Apply polynomial models to revenue optimization",
        "Use rational functions in efficiency modeling",
        "Interpret end behavior in business contexts"
      ],
      topics: [
        "Polynomial Models",
        "Revenue Optimization",
        "Efficiency Analysis",
        "Asymptotes",
        "End Behavior"
      ]
    },
    {
      title: "Exponential and Logarithmic Functions",
      description: "Study growth models, compound interest, and logarithmic scales essential for business finance.",
      order: 4,
      slug: "exponential-logarithmic",
      content: "Comprehensive coverage of exponential and logarithmic functions including growth models, compound interest calculations, business scaling, and investment analysis.",
      objectives: [
        "Master exponential growth and decay models",
        "Calculate compound interest and annuities",
        "Apply logarithmic functions to business problems",
        "Model business scaling and growth",
        "Analyze investment and depreciation scenarios"
      ],
      topics: [
        "Exponential Growth",
        "Compound Interest",
        "Business Scaling",
        "Logarithmic Models",
        "Investment Analysis"
      ]
    },
    {
      title: "Systems of Equations and Matrices",
      description: "Learn resource allocation, optimization problems, and matrix operations for business decision making.",
      order: 5,
      slug: "systems-matrices",
      content: "Advanced topics including systems of linear equations, matrix operations, resource allocation problems, linear programming, and business decision making models.",
      objectives: [
        "Solve systems of linear equations",
        "Perform matrix operations",
        "Apply linear programming to resource allocation",
        "Use matrices for business decision making",
        "Optimize business processes and constraints"
      ],
      topics: [
        "Resource Allocation",
        "Matrix Operations",
        "Optimization",
        "Linear Programming",
        "Decision Making"
      ]
    },
    {
      title: "Sequences, Series, and Probability",
      description: "Apply sequences and probability concepts to financial planning, risk assessment, and forecasting.",
      order: 6,
      slug: "sequences-probability",
      content: "Final module covering sequences, series, probability theory, financial planning applications, risk assessment, and Monte Carlo methods for business forecasting.",
      objectives: [
        "Understand arithmetic and geometric sequences",
        "Apply series to financial calculations",
        "Master basic probability concepts",
        "Use probability in risk assessment",
        "Apply Monte Carlo methods to forecasting"
      ],
      topics: [
        "Financial Planning",
        "Risk Assessment", 
        "Forecasting",
        "Annuities",
        "Monte Carlo Methods"
      ]
    }
  ];

  // Create modules
  const createdModules = [];
  for (const moduleData of modules) {
    const module = await prisma.learningModule.upsert({
      where: { slug: moduleData.slug },
      update: {},
      create: moduleData,
    });
    createdModules.push(module);
    console.log(`Created module: ${module.title}`);
  }

  // Create badges
  const badges = [
    {
      title: "Linear Equations Master",
      description: "Completed Linear Equations and Inequalities module",
      imageUrl: "https://cdn.abacus.ai/images/c73d1454-07ea-49e5-b42c-585b1fff268a.png",
      moduleId: createdModules[0].id,
      badgeType: "MODULE_COMPLETION" as const,
      points: 20
    },
    {
      title: "Function Explorer", 
      description: "Completed Functions and Graphs module",
      imageUrl: "https://cdn.abacus.ai/images/51024b94-7fbb-4036-987b-b3fe393f6bf8.png",
      moduleId: createdModules[1].id,
      badgeType: "MODULE_COMPLETION" as const,
      points: 20
    },
    {
      title: "Polynomial Pro",
      description: "Completed Polynomial and Rational Functions module", 
      imageUrl: "https://cdn.abacus.ai/images/66b5d1c0-2932-4b89-8b7a-bf1602072d0a.png",
      moduleId: createdModules[2].id,
      badgeType: "MODULE_COMPLETION" as const,
      points: 25
    },
    {
      title: "Exponential Expert",
      description: "Completed Exponential and Logarithmic Functions module",
      imageUrl: "https://cdn.abacus.ai/images/34b6cfe8-5c21-4134-ac87-d925614c655e.png",
      moduleId: createdModules[3].id,
      badgeType: "MODULE_COMPLETION" as const,
      points: 25
    },
    {
      title: "Systems Solver",
      description: "Completed Systems of Equations and Matrices module",
      imageUrl: "https://cdn.abacus.ai/images/ee07f028-b7bf-48ed-b7c3-fa607383db57.png",
      moduleId: createdModules[4].id,
      badgeType: "MODULE_COMPLETION" as const,
      points: 30
    },
    {
      title: "Probability Pioneer",
      description: "Completed Sequences, Series, and Probability module",
      imageUrl: "https://cdn.abacus.ai/images/932a5a8a-52f3-48ec-928d-7d55a4d52b9b.png",
      moduleId: createdModules[5].id,
      badgeType: "MODULE_COMPLETION" as const,
      points: 25
    },
    {
      title: "First Steps",
      description: "Completed your first practice problem",
      imageUrl: "https://cdn.abacus.ai/images/32c88839-176e-4f10-b666-42a6ca0057d8.png",
      moduleId: null,
      badgeType: "QUIZ_PASS" as const,
      points: 5
    },
    {
      title: "Quiz Master",
      description: "Scored 90% or higher on 5 quizzes",
      imageUrl: "https://cdn.abacus.ai/images/8195ff2a-dfeb-4615-8511-56b1766ba0e8.png",
      moduleId: null,
      badgeType: "QUIZ_PASS" as const,
      points: 15
    },
    {
      title: "Course Completion",
      description: "Complete all 6 learning modules",
      imageUrl: "https://cdn.abacus.ai/images/a9502816-14fb-4bbf-9fd2-29dbbede7841.png",
      moduleId: null,
      badgeType: "COURSE_COMPLETION" as const,
      points: 100
    }
  ];

  // Create badges (delete existing ones first to avoid duplicates)
  await prisma.badge.deleteMany({});
  
  const createdBadges = [];
  for (const badgeData of badges) {
    const badge = await prisma.badge.create({
      data: badgeData,
    });
    createdBadges.push(badge);
    console.log(`Created badge: ${badge.title}`);
  }

  // Create some sample progress for the test user
  await prisma.moduleProgress.upsert({
    where: {
      userId_moduleId: {
        userId: testUser.id,
        moduleId: createdModules[0].id
      }
    },
    update: {},
    create: {
      userId: testUser.id,
      moduleId: createdModules[0].id,
      status: 'COMPLETED',
      completedAt: new Date('2024-02-15'),
      score: 95.0,
      timeSpent: 12 * 60, // 12 hours in minutes
    }
  });

  await prisma.moduleProgress.upsert({
    where: {
      userId_moduleId: {
        userId: testUser.id,
        moduleId: createdModules[1].id
      }
    },
    update: {},
    create: {
      userId: testUser.id,
      moduleId: createdModules[1].id,
      status: 'IN_PROGRESS',
      score: 85.0,
      timeSpent: 8 * 60, // 8 hours in minutes
    }
  });

  // Award some badges to the test user
  await prisma.userBadge.upsert({
    where: {
      userId_badgeId: {
        userId: testUser.id,
        badgeId: createdBadges[0].id // Linear Equations Master
      }
    },
    update: {},
    create: {
      userId: testUser.id,
      badgeId: createdBadges[0].id,
      earnedAt: new Date('2024-02-15')
    }
  });

  await prisma.userBadge.upsert({
    where: {
      userId_badgeId: {
        userId: testUser.id,
        badgeId: createdBadges[6].id // First Steps
      }
    },
    update: {},
    create: {
      userId: testUser.id,
      badgeId: createdBadges[6].id,
      earnedAt: new Date('2024-02-10')
    }
  });

  await prisma.userBadge.upsert({
    where: {
      userId_badgeId: {
        userId: testUser.id,
        badgeId: createdBadges[7].id // Quiz Master
      }
    },
    update: {},
    create: {
      userId: testUser.id,
      badgeId: createdBadges[7].id,
      earnedAt: new Date('2024-02-28')
    }
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('---');
  console.log('Test account credentials:');
  console.log('Email: john@doe.com');
  console.log('Password: johndoe123');
  console.log('---');
  console.log(`Created ${createdModules.length} modules`);
  console.log(`Created ${createdBadges.length} badges`);
  console.log('Sample progress and badges assigned to test user');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
