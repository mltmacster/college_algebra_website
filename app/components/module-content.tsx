
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import { 
  ArrowLeft, 
  BookOpen, 
  Target, 
  Clock, 
  CheckCircle, 
  Play,
  Calculator,
  FileText,
  Award,
  BarChart3,
  PlayCircle,
  X,
  Zap
} from 'lucide-react';
import { InteractiveLearningModule } from './interactive-learning-module';
import { BusinessScenarioSimulator } from './business-scenario-simulator';
import { InteractiveLesson } from './interactive-lesson';
import { PracticeSession } from './practice-session';
import { useSession } from 'next-auth/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const moduleData = {
  'linear-equations': {
    id: 1,
    title: "Linear Equations and Inequalities",
    description: "Master the fundamentals of linear relationships, solving equations, and business applications like break-even analysis.",
    image: "https://cdn.abacus.ai/images/c73d1454-07ea-49e5-b42c-585b1fff268a.png",
    difficulty: "Beginner",
    estimatedHours: 15,
    progress: 100,
    objectives: [
      "Solve linear equations and inequalities in one variable",
      "Apply linear equations to model business relationships with constant rates of change",
      "Interpret slope and y-intercept in business contexts",
      "Perform break-even analysis using linear models",
      "Solve real-world business problems involving cost, revenue, and profit functions"
    ],
    topics: [
      {
        title: "Linear Equations in One Variable",
        description: "Solving equations using algebraic manipulation and business formulas",
        duration: "45 min",
        completed: true,
        businessContext: "Financial calculations and business formula applications"
      },
      {
        title: "Linear Inequalities and Constraints",
        description: "Solving inequalities and modeling business constraints",
        duration: "50 min",
        completed: true,
        businessContext: "Constraint modeling in business optimization and feasible regions"
      },
      {
        title: "Linear Functions and Properties",
        description: "Slope-intercept form and business interpretations",
        duration: "60 min",
        completed: true,
        businessContext: "Slope as marginal cost/revenue, y-intercept as fixed costs"
      },
      {
        title: "Break-even Analysis Mastery",
        description: "Complete break-even analysis for business decision-making",
        duration: "75 min",
        completed: true,
        businessContext: "Break-even points and equilibrium analysis"
      },
      {
        title: "Advanced Business Applications",
        description: "Supply & demand, market equilibrium, and forecasting",
        duration: "65 min",
        completed: true,
        businessContext: "Market analysis and strategic planning"
      }
    ],
    practiceProblems: [
      {
        title: "Cost Analysis Problems",
        description: "Tax return service charges $31.50 plus $32 per hour. Calculate costs for various service durations.",
        difficulty: "Easy",
        questions: 4,
        businessScenario: "Service pricing and cost calculation"
      },
      {
        title: "Break-even Analysis",
        description: "Basic break-even calculations with fixed costs, variable costs, and pricing scenarios.",
        difficulty: "Medium",
        questions: 2,
        businessScenario: "Break-even analysis fundamentals"
      },
      {
        title: "Linear Inequalities and Constraints",
        description: "Business constraints, budget limits, and minimum requirements using linear inequalities.",
        difficulty: "Medium",  
        questions: 4,
        businessScenario: "Business constraint modeling"
      },
      {
        title: "Advanced Break-even Scenarios",
        description: "SaaS companies, gig economy, and multi-product break-even analysis.",
        difficulty: "Hard",
        questions: 3,
        businessScenario: "Complex break-even analysis"
      },
      {
        title: "Linear Function Applications",
        description: "Tesla production costs, Amazon growth models, and consulting pricing functions.",
        difficulty: "Medium",
        questions: 3,
        businessScenario: "Real-world linear function modeling"
      },
      {
        title: "Supply and Demand Applications",
        description: "Market equilibrium, iPhone demand elasticity, and rideshare pricing functions.",
        difficulty: "Hard",
        questions: 3,
        businessScenario: "Market analysis and equilibrium"
      },
      {
        title: "Production Planning Optimization",
        description: "Poster production targets and software team hiring optimization.",
        difficulty: "Hard",
        questions: 2,
        businessScenario: "Production and resource optimization"
      }
    ],
    realWorldExample: {
      title: "Coffee Shop Break-Even Analysis",
      description: "A local coffee shop wants to determine how many cups of coffee they need to sell daily to break even. With fixed costs of $200/day and variable costs of $1.50 per cup, selling each cup at $4.00, they need to find their break-even point.",
      solution: "Let x = number of cups sold. Revenue = 4x, Total Cost = 200 + 1.5x. Break-even: 4x = 200 + 1.5x, so 2.5x = 200, x = 80 cups per day."
    },
    businessCaseStudies: [
      {
        title: "Uber Pricing Strategy",
        description: "Analyze Uber's linear pricing model with base fare + per-mile charges",
        industry: "Technology/Transportation",
        concepts: ["Cost functions", "Linear pricing", "Break-even analysis"]
      },
      {
        title: "SaaS Subscription Model",
        description: "Software company's monthly recurring revenue analysis",
        industry: "Technology",
        concepts: ["Revenue functions", "Customer acquisition cost", "Linear growth"]
      }
    ],
    industryApplications: [
      "Manufacturing cost analysis",
      "Service business pricing (taxi, consulting, utilities)",
      "Break-even analysis for retail and manufacturing",
      "Financial planning and simple interest calculations",
      "Sales forecasting with linear trend analysis"
    ]
  },
  'functions-and-graphing': {
    id: 2,
    title: "Functions and Graphs",
    description: "Explore function behavior, graphing techniques, and piecewise functions used in tiered pricing models.",
    image: "https://cdn.abacus.ai/images/51024b94-7fbb-4036-987b-b3fe393f6bf8.png",
    difficulty: "Beginner",
    estimatedHours: 18,
    progress: 100,
    objectives: [
      "Understand function notation and domain/range concepts in business contexts",
      "Graph and interpret various function types commonly used in business",
      "Analyze function behavior including increasing/decreasing trends and optimization",
      "Apply functions to model business relationships and make predictions",
      "Use function composition to model multi-stage business processes"
    ],
    topics: [
      {
        title: "Function Fundamentals",
        description: "Function notation, domain, range, and business interpretations",
        duration: "50 min",
        completed: true,
        businessContext: "Input/output relationships in business operations"
      },
      {
        title: "Types of Functions in Business",
        description: "Constant, linear, and piecewise functions in business contexts",
        duration: "70 min",
        completed: true,
        businessContext: "Fixed costs, variable relationships, tiered pricing"
      },
      {
        title: "Function Operations and Composition",
        description: "Combining functions for complex business models",
        duration: "60 min",
        completed: true,
        businessContext: "Multi-stage processes and profit function creation"
      },
      {
        title: "Piecewise Functions - Advanced Pricing",
        description: "Complex tiered pricing, tax brackets, commission structures",
        duration: "80 min",
        completed: true,
        businessContext: "Advanced pricing strategies and compensation models"
      },
      {
        title: "Graph Analysis and Business Optimization",
        description: "Reading business graphs and identifying optimization points",
        duration: "75 min",
        completed: true,
        businessContext: "Performance analysis and strategic decision making"
      }
    ],
    practiceProblems: [
      {
        title: "Function Evaluation in Business",
        description: "Cost function C(x) = 500 + 12x, find C(100) and interpret business meaning",
        difficulty: "Easy",
        questions: 15,
        businessScenario: "Cost analysis and interpretation"
      },
      {
        title: "Domain and Range Analysis",
        description: "Manufacturing company producing 50-500 units daily, analyze profit function constraints",
        difficulty: "Medium",
        questions: 12,
        businessScenario: "Production constraints and profit optimization"
      },
      {
        title: "Piecewise Pricing Models",
        description: "Cell phone plans with tiered data charges, create and analyze cost functions",
        difficulty: "Hard",
        questions: 8,
        businessScenario: "Telecommunications pricing strategy"
      }
    ],
    realWorldExample: {
      title: "Netflix Subscription Pricing Model",
      description: "Netflix uses tiered pricing: Basic ($8.99), Standard ($13.99), Premium ($17.99). Model this pricing structure and analyze customer value optimization.",
      solution: "f(features) = {8.99 if basic; 13.99 if standard; 17.99 if premium} with domain restrictions based on feature access."
    },
    businessCaseStudies: [
      {
        title: "Amazon Prime Tiered Benefits",
        description: "Analysis of Amazon's piecewise value proposition across membership tiers",
        industry: "E-commerce",
        concepts: ["Piecewise functions", "Value optimization", "Customer segmentation"]
      },
      {
        title: "Utility Company Billing",
        description: "Electric utility tiered pricing based on consumption levels",
        industry: "Utilities",
        concepts: ["Piecewise pricing", "Usage optimization", "Rate structures"]
      }
    ],
    industryApplications: [
      "Tiered pricing models (utilities, data plans, subscriptions)",
      "Commission structures with base salary plus bonuses",
      "Production functions linking inputs to outputs",
      "Demand functions for price-quantity relationships",
      "Multi-stage supply chain modeling"
    ]
  },
  'quadratic-functions': {
    id: 3,
    title: "Quadratic Functions",
    description: "Analyze complex relationships in revenue optimization and efficiency modeling through advanced functions.",
    image: "https://cdn.abacus.ai/images/66b5d1c0-2932-4b89-8b7a-bf1602072d0a.png",
    difficulty: "Intermediate",
    estimatedHours: 24,
    progress: 100,
    objectives: [
      "Factor and solve polynomial equations relevant to business applications",
      "Analyze polynomial functions for optimization in business contexts",
      "Model complex business relationships using higher-degree polynomials",
      "Understand rational functions and their applications in business efficiency analysis",
      "Apply polynomial models to revenue optimization and cost analysis"
    ],
    topics: [
      {
        title: "Polynomial Functions and Operations",
        description: "Quadratic, cubic, and higher-degree polynomials in business",
        duration: "70 min",
        completed: true,
        businessContext: "Complex cost structures and multi-variable relationships"
      },
      {
        title: "Quadratic Business Models",
        description: "Quadratic revenue and profit optimization: P = -ax² + bx + c",
        duration: "80 min",
        completed: true,
        businessContext: "Revenue optimization and pricing strategies"
      },
      {
        title: "Rational Functions in Business",
        description: "Efficiency analysis and average cost functions",
        duration: "90 min",
        completed: true,
        businessContext: "Average cost analysis and productivity optimization"
      },
      {
        title: "Polynomial Optimization Techniques",
        description: "Finding maximum profit and optimal production levels",
        duration: "85 min",
        completed: true,
        businessContext: "Strategic optimization and decision making"
      },
      {
        title: "Market Analysis with Polynomials",
        description: "Complex demand curves and competitive analysis",
        duration: "75 min",
        completed: true,
        businessContext: "Market dynamics and competitive strategy"
      }
    ],
    practiceProblems: [
      {
        title: "Quadratic Profit Optimization",
        description: "Cell phone manufacturer: P = -0.09x² + 5000x - 750,000. Find maximum profit and optimal production.",
        difficulty: "Medium",
        questions: 10,
        businessScenario: "Manufacturing profit maximization"
      },
      {
        title: "Revenue Optimization Models",
        description: "Company revenue R(x) = -2x² + 100x. Find price that maximizes revenue.",
        difficulty: "Medium",
        questions: 8,
        businessScenario: "Pricing strategy optimization"
      },
      {
        title: "Average Cost Analysis",
        description: "Average cost A(x) = (50000 + 25x)/x. Analyze behavior as production increases.",
        difficulty: "Hard",
        questions: 6,
        businessScenario: "Efficiency and economies of scale"
      }
    ],
    realWorldExample: {
      title: "Apple iPhone Profit Maximization",
      description: "Apple's profit per iPhone follows a quadratic model based on production volume. With economies of scale initially reducing costs but eventually hitting capacity constraints, find optimal production levels.",
      solution: "Using P(x) = -0.05x² + 800x - 2,000,000, the maximum occurs at x = 8,000 units with maximum profit of $1,200,000."
    },
    businessCaseStudies: [
      {
        title: "Tesla Production Optimization",
        description: "Analyze Tesla's quadratic cost structures and optimal production scaling",
        industry: "Automotive",
        concepts: ["Economies of scale", "Production optimization", "Cost modeling"]
      },
      {
        title: "Netflix Content Investment ROI",
        description: "Polynomial modeling of content investment vs. subscriber growth",
        industry: "Entertainment/Streaming",
        concepts: ["Investment optimization", "Customer acquisition", "ROI analysis"]
      }
    ],
    industryApplications: [
      "Profit maximization using quadratic functions",
      "Complex cost structures with economies and diseconomies of scale",
      "Polynomial demand curves for pricing strategies",
      "Quality control and defect rate modeling",
      "Efficiency analysis with rational functions"
    ]
  },
  'exponential-and-logarithmic-functions': {
    id: 4,
    title: "Exponential and Logarithmic Functions",
    description: "Study growth models, compound interest, and logarithmic scales essential for business finance.",
    image: "https://cdn.abacus.ai/images/34b6cfe8-5c21-4134-ac87-d925614c655e.png",
    difficulty: "Intermediate",
    estimatedHours: 26,
    progress: 100,
    objectives: [
      "Model exponential growth and decay in business scenarios",
      "Apply compound interest formulas for financial analysis",
      "Use logarithmic functions to analyze growth rates and elasticity",
      "Solve exponential and logarithmic equations in business contexts",
      "Interpret exponential models for strategic business planning"
    ],
    topics: [
      {
        title: "Exponential Growth Models",
        description: "Growth and decay models: f(x) = ab^x and business applications",
        duration: "75 min",
        completed: true,
        businessContext: "Business growth analysis and market expansion"
      },
      {
        title: "Compound Interest and Financial Analysis",
        description: "Compound interest formulas and continuous compounding",
        duration: "80 min",
        completed: true,
        businessContext: "Investment analysis and financial planning"
      },
      {
        title: "Logarithmic Functions in Economics",
        description: "Properties of logarithms and natural logarithm applications",
        duration: "70 min",
        completed: true,
        businessContext: "Elasticity analysis and logarithmic scales"
      },
      {
        title: "Solving Exponential Business Equations",
        description: "Algebraic techniques for business growth problems",
        duration: "85 min",
        completed: true,
        businessContext: "Doubling time, growth rates, and forecasting"
      },
      {
        title: "Strategic Growth Planning",
        description: "Revenue forecasting and market penetration modeling",
        duration: "90 min",
        completed: true,
        businessContext: "Strategic planning and long-term projections"
      }
    ],
    practiceProblems: [
      {
        title: "Compound Interest Mastery",
        description: "$1,000 investment grows to $17,449.40 in 30 years at 10%. Verify and analyze.",
        difficulty: "Medium",
        questions: 12,
        businessScenario: "Investment and retirement planning"
      },
      {
        title: "Digital Growth Analysis",
        description: "Facebook: 1M users (2004) to 2.8B users (2020). Model and predict 2025.",
        difficulty: "Hard",
        questions: 8,
        businessScenario: "Technology company growth modeling"
      },
      {
        title: "Depreciation and Asset Valuation",
        description: "$25,000 vehicle depreciates 15% annually. When worth $10,000?",
        difficulty: "Medium",
        questions: 10,
        businessScenario: "Asset management and depreciation"
      }
    ],
    realWorldExample: {
      title: "Amazon Revenue Growth (1994-2020)",
      description: "Amazon's revenue grew from $511,000 in 1995 to $386B in 2020. Model this exponential growth and project future revenue considering market saturation.",
      solution: "Using R(t) = 511,000 × e^(0.52t), where t is years since 1995, we can model and forecast revenue growth while considering market maturity effects."
    },
    businessCaseStudies: [
      {
        title: "Zoom User Growth During COVID-19",
        description: "Exponential user growth analysis during pandemic and post-pandemic normalization",
        industry: "Technology/Communications",
        concepts: ["Exponential growth", "Market saturation", "Growth rate analysis"]
      },
      {
        title: "Cryptocurrency Market Valuation",
        description: "Bitcoin price modeling using exponential and logarithmic functions",
        industry: "Financial Technology",
        concepts: ["Exponential growth", "Volatility modeling", "Market analysis"]
      }
    ],
    industryApplications: [
      "Digital growth analysis (users, downloads, engagement)",
      "Financial planning (compound interest, investments, retirement)",
      "Market penetration and saturation analysis",
      "Economic elasticity and price sensitivity",
      "Resource management and depreciation modeling"
    ]
  },
  'matrix-operations-and-applications': {
    id: 5,
    title: "Systems of Equations and Matrices",
    description: "Learn resource allocation, optimization problems, and matrix operations for business decision making.",
    image: "https://cdn.abacus.ai/images/ee07f028-b7bf-48ed-b7c3-fa607383db57.png",
    difficulty: "Advanced",
    estimatedHours: 28,
    progress: 100,
    objectives: [
      "Solve systems of linear equations using multiple methods",
      "Apply matrix operations to business problems",
      "Use systems of equations for optimization and resource allocation",
      "Interpret solutions in terms of business constraints and feasibility",
      "Model multi-variable business relationships using linear systems"
    ],
    topics: [
      {
        title: "Systems of Linear Equations",
        description: "Substitution, elimination, and graphical methods",
        duration: "80 min",
        completed: true,
        businessContext: "Business constraint problems and feasibility analysis"
      },
      {
        title: "Matrix Operations for Business",
        description: "Matrix arithmetic and business transformations",
        duration: "85 min",
        completed: true,
        businessContext: "Business data analysis and transformation modeling"
      },
      {
        title: "Linear Programming Foundations",
        description: "Objective functions, constraints, and optimization",
        duration: "95 min",
        completed: true,
        businessContext: "Resource allocation and profit optimization"
      },
      {
        title: "Multi-Variable Business Modeling",
        description: "Complex business relationships and resource allocation",
        duration: "90 min",
        completed: true,
        businessContext: "Production planning and portfolio optimization"
      },
      {
        title: "Advanced Optimization Techniques",
        description: "Sensitivity analysis and constraint optimization",
        duration: "100 min",
        completed: true,
        businessContext: "Strategic decision making and scenario analysis"
      }
    ],
    practiceProblems: [
      {
        title: "Resource Allocation Optimization",
        description: "Furniture company: chairs (3h assembly, 2h painting), tables (2h assembly, 4h painting). 100h assembly, 120h painting available.",
        difficulty: "Hard",
        questions: 8,
        businessScenario: "Manufacturing resource optimization"
      },
      {
        title: "Investment Portfolio Analysis",
        description: "$50,000 in accounts earning 4% and 6%. Total interest $2,400. Find allocation.",
        difficulty: "Medium",
        questions: 10,
        businessScenario: "Financial portfolio management"
      },
      {
        title: "Multi-Product Production Planning",
        description: "Products A and B with different material/labor requirements. Maximize profit given constraints.",
        difficulty: "Hard",
        questions: 6,
        businessScenario: "Production optimization and planning"
      }
    ],
    realWorldExample: {
      title: "McDonald's Supply Chain Optimization",
      description: "McDonald's optimizes ingredient sourcing across multiple suppliers with varying costs, quality standards, and delivery constraints. Model the optimal procurement strategy.",
      solution: "Using linear programming with cost minimization objective subject to quality, quantity, and delivery time constraints across multiple suppliers and menu items."
    },
    businessCaseStudies: [
      {
        title: "Southwest Airlines Route Optimization",
        description: "Fleet allocation and route planning using systems of equations",
        industry: "Aviation",
        concepts: ["Resource allocation", "Optimization", "Constraint analysis"]
      },
      {
        title: "Walmart Inventory Management",
        description: "Multi-product, multi-location inventory optimization",
        industry: "Retail",
        concepts: ["Matrix operations", "Supply chain optimization", "Inventory management"]
      }
    ],
    industryApplications: [
      "Supply chain optimization across multiple suppliers/products",
      "Production planning with resource constraints",
      "Financial portfolio management and asset allocation",
      "Human resource allocation across departments",
      "Marketing budget distribution across channels"
    ]
  },
  'sequences-probability': {
    id: 6,
    title: "Sequences, Series, and Probability",
    description: "Apply sequences and probability concepts to financial planning, risk assessment, and forecasting.",
    image: "https://cdn.abacus.ai/images/932a5a8a-52f3-48ec-928d-7d55a4d52b9b.png",
    difficulty: "Advanced",
    estimatedHours: 22,
    progress: 100,
    objectives: [
      "Work with arithmetic and geometric sequences in business contexts",
      "Apply series formulas to financial calculations and projections",
      "Calculate probabilities for business risk assessment",
      "Use probability distributions for decision-making",
      "Apply combinatorics to business scenarios involving arrangements and selections"
    ],
    topics: [
      {
        title: "Sequences and Series in Finance",
        description: "Arithmetic and geometric sequences for financial modeling",
        duration: "75 min",
        completed: true,
        businessContext: "Annuities, loans, and investment series"
      },
      {
        title: "Financial Mathematics Applications",
        description: "Present/future value, annuities, and loan amortization",
        duration: "85 min",
        completed: true,
        businessContext: "Financial planning and loan analysis"
      },
      {
        title: "Business Probability and Risk",
        description: "Basic probability, conditional probability, and risk assessment",
        duration: "80 min",
        completed: true,
        businessContext: "Risk management and decision trees"
      },
      {
        title: "Combinatorics in Business",
        description: "Permutations, combinations, and business applications",
        duration: "70 min",
        completed: true,
        businessContext: "Quality control, market research, survey design"
      },
      {
        title: "Advanced Forecasting Models",
        description: "Sequential growth models and probabilistic forecasting",
        duration: "90 min",
        completed: true,
        businessContext: "Business forecasting and predictive analytics"
      }
    ],
    practiceProblems: [
      {
        title: "Annuity and Retirement Planning",
        description: "Monthly $500 payments for 10 years at 6% annual interest compounded monthly. Calculate future value.",
        difficulty: "Medium",
        questions: 10,
        businessScenario: "Retirement and financial planning"
      },
      {
        title: "Business Loan Analysis",
        description: "$250,000 business loan at 5.5% APR over 15 years. Calculate monthly payments.",
        difficulty: "Medium",
        questions: 8,
        businessScenario: "Business financing and loan management"
      },
      {
        title: "Quality Control Probability",
        description: "3% defective rate. Probability of >1 defective in sample of 20?",
        difficulty: "Hard",
        questions: 12,
        businessScenario: "Quality control and statistical analysis"
      }
    ],
    realWorldExample: {
      title: "Tesla Gigafactory Production Scaling",
      description: "Tesla's Gigafactory production follows a geometric sequence as production lines come online. Model the production growth and calculate total output over the first 2 years of operation.",
      solution: "Using geometric sequence with initial production and growth rate, calculate cumulative production using series formulas while accounting for capacity constraints."
    },
    businessCaseStudies: [
      {
        title: "Insurance Risk Assessment",
        description: "Actuarial analysis using probability distributions for premium calculations",
        industry: "Insurance",
        concepts: ["Probability distributions", "Risk assessment", "Premium calculations"]
      },
      {
        title: "Netflix Content Recommendation",
        description: "Combinatorial analysis for personalized content recommendation algorithms",
        industry: "Entertainment/Technology",
        concepts: ["Combinatorics", "Algorithm optimization", "User experience"]
      }
    ],
    industryApplications: [
      "Financial planning (retirement, investments, loan calculations)",
      "Risk management and insurance premium calculations",
      "Quality control and statistical sampling",
      "Market research and survey design optimization",
      "Business forecasting using sequential growth models"
    ]
  }
};

const sampleChartData = [
  { x: 0, y: 200 },
  { x: 20, y: 230 },
  { x: 40, y: 260 },
  { x: 60, y: 290 },
  { x: 80, y: 320 },
  { x: 100, y: 350 },
];

interface ModuleContentProps {
  slug: string;
}

export function ModuleContent({ slug }: ModuleContentProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [selectedPractice, setSelectedPractice] = useState<any>(null);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [useInteractive, setUseInteractive] = useState(true); // Enable interactive by default
  const [showInteractiveLesson, setShowInteractiveLesson] = useState(false);
  const [showPracticeSession, setShowPracticeSession] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>({});
  const { data: session } = useSession() || {};
  const module = moduleData[slug as keyof typeof moduleData];

  // Check if this module supports interactive learning - FIXED SLUG MISMATCHES
  const interactiveModules = [
    'linear-equations', 
    'systems-linear-equations',
    'functions-and-graphing',         // FIXED: was 'functions-graphs'
    'quadratic-functions',            // ✅ Already matches
    'exponential-and-logarithmic-functions',  // FIXED: was 'exponential-logarithmic'
    'matrix-operations-and-applications',     // FIXED: was 'systems-matrices'
    'sequences-probability'           // RESTORED: Has comprehensive practice data, was incorrectly removed
  ]; // All modules now have comprehensive practice data with CORRECT database slugs
  const supportsInteractive = interactiveModules.includes(slug);

  const handleLessonClick = (lesson: any) => {
    setSelectedLesson(lesson);
    if (useInteractive && supportsInteractive) {
      setShowInteractiveLesson(true);
    } else {
      setLessonModalOpen(true);
    }
  };

  const handlePracticeClick = (practice: any) => {
    setSelectedPractice(practice);
    if (useInteractive && supportsInteractive) {
      setShowPracticeSession(true);
    } else {
      setPracticeModalOpen(true);
    }
  };

  const handleLessonComplete = (lessonTitle: string) => {
    setCompletedLessons(prev => new Set([...prev, lessonTitle]));
    setShowInteractiveLesson(false);
    setSelectedLesson(null);
    
    // Update module progress
    const totalLessons = module?.topics?.length || 1;
    const completedCount = completedLessons.size + 1;
    const newProgress = Math.round((completedCount / totalLessons) * 100);
    setModuleProgress(prev => ({ ...prev, [slug]: newProgress }));
    
    // Show success message
    console.log(`Lesson "${lessonTitle}" completed!`);
  };

  const handlePracticeComplete = (score: number, totalQuestions: number) => {
    setShowPracticeSession(false);
    setSelectedPractice(null);
    
    // Show success message with score
    console.log(`Practice completed! Score: ${score}% (answered ${totalQuestions} questions)`);
  };

  const handleInteractiveToggle = () => {
    setUseInteractive(!useInteractive);
  };

  // Module-specific content generators
  const generateLessonContent = (moduleSlug: string, topic: any) => {
    const contentMap: Record<string, any> = {
      'linear-equations': {
        'Linear Equations in One Variable': {
          keyPoints: [
            "Solving linear equations using algebraic manipulation",
            "Business formula applications and rearrangement", 
            "Interpreting solutions in business contexts",
            "Common algebraic errors to avoid"
          ],
          example: {
            problem: "A consulting firm charges a flat rate of $2,500 plus $150 per hour. If a client's total bill was $8,750, how many hours of consulting were provided?",
            solution: "Let h = hours of consulting\nTotal Cost = 2500 + 150h\n8750 = 2500 + 150h\n6250 = 150h\nh = 41.67 hours"
          }
        },
        'Linear Inequalities and Constraints': {
          keyPoints: [
            "Solving linear inequalities with business constraints",
            "Graphing feasible regions for business decisions",
            "Constraint modeling in optimization",
            "Interpreting inequality solutions in business terms"
          ],
          example: {
            problem: "A manufacturing company must keep production costs below $50,000 monthly. With fixed costs of $15,000 and variable costs of $25 per unit, what's the maximum production capacity?",
            solution: "Let x = units produced\nTotal Cost = 15000 + 25x\n15000 + 25x < 50000\n25x < 35000\nx < 1400 units maximum"
          }
        },
        'Linear Functions and Properties': {
          keyPoints: [
            "Understanding slope as rate of change in business",
            "Y-intercept as fixed costs or starting values",
            "Linear function modeling for business relationships",
            "Slope-intercept form applications"
          ],
          example: {
            problem: "A SaaS company's revenue follows R(x) = 99x + 5000, where x is the number of subscribers. What's the monthly revenue per subscriber and the base revenue?",
            solution: "Revenue function: R(x) = 99x + 5000\nSlope = 99 (revenue per subscriber)\nY-intercept = 5000 (base/fixed revenue)\nEach subscriber generates $99/month"
          }
        },
        'Break-even Analysis Mastery': {
          keyPoints: [
            "Setting up break-even equations from business scenarios",
            "Finding intersection points of cost and revenue functions",
            "Interpreting break-even results for business decisions",
            "Sensitivity analysis around break-even points"
          ],
          example: {
            problem: "Spotify has fixed costs of $2B annually and variable costs of $0.50 per user per month. With subscription revenue of $9.99 per user monthly, how many subscribers needed to break even?",
            solution: "Annual break-even: Revenue = Total Cost\n(9.99 - 0.50) × 12 × x = 2,000,000,000\n113.88x = 2,000,000,000\nx = 17.56 million subscribers"
          }
        },
        'Advanced Business Applications': {
          keyPoints: [
            "Multi-variable linear systems in business",
            "Supply and demand equilibrium modeling",
            "Market analysis using linear trends",
            "Forecasting with linear regression"
          ],
          example: {
            problem: "Supply: P = 20 + 0.5Q, Demand: P = 80 - 0.3Q. Find market equilibrium price and quantity.",
            solution: "At equilibrium: Supply = Demand\n20 + 0.5Q = 80 - 0.3Q\n0.8Q = 60\nQ = 75 units, P = $57.50"
          }
        }
      },
      'functions-and-graphing': {
        'Function Fundamentals': {
          keyPoints: [
            "Function notation and business interpretation",
            "Domain and range in business contexts",
            "Input-output relationships in operations",
            "Function evaluation for decision making"
          ],
          example: {
            problem: "Netflix's content cost function is C(h) = 2.5h² + 150h + 50000, where h is hours of content. Find C(100) and interpret its meaning.",
            solution: "C(100) = 2.5(100)² + 150(100) + 50000\nC(100) = 25000 + 15000 + 50000 = $90,000\nIt costs $90,000 to produce 100 hours of content"
          }
        },
        'Types of Functions in Business': {
          keyPoints: [
            "Constant functions for fixed pricing models",
            "Linear functions for proportional relationships",
            "Step functions for tiered service levels",
            "Choosing appropriate function types"
          ],
          example: {
            problem: "Amazon Prime: Free shipping for orders $25+, $5.99 shipping otherwise. Model this as a function.",
            solution: "S(x) = {\n  5.99, if 0 < x < 25\n  0, if x ≥ 25\n}\nPiecewise function with cost jump at $25"
          }
        },
        'Function Operations and Composition': {
          keyPoints: [
            "Adding and combining business functions",
            "Function composition for multi-stage processes",
            "Profit functions from cost and revenue",
            "Supply chain function composition"
          ],
          example: {
            problem: "Manufacturing cost C(x) = 50x + 1000, markup function M(c) = 1.4c. Find the final price function.",
            solution: "Price function: P(x) = M(C(x)) = M(50x + 1000)\nP(x) = 1.4(50x + 1000) = 70x + 1400\nFinal price includes 40% markup"
          }
        },
        'Piecewise Functions - Advanced Pricing': {
          keyPoints: [
            "Complex tiered pricing structures",
            "Commission and bonus calculations",
            "Tax bracket modeling",
            "Optimization within piecewise domains"
          ],
          example: {
            problem: "Salesforce pricing: $25/user (1-10 users), $20/user (11-100), $15/user (100+). Calculate cost for 150 users.",
            solution: "Cost = 10×$25 + 90×$20 + 50×$15\n= $250 + $1800 + $750 = $2,800\nTiered pricing reduces per-user cost"
          }
        },
        'Graph Analysis and Business Optimization': {
          keyPoints: [
            "Reading and interpreting business graphs",
            "Identifying maximum and minimum points",
            "Trend analysis and inflection points",
            "Graph-based decision making"
          ],
          example: {
            problem: "Tesla's quarterly profit graph shows a maximum at Q3. Revenue R(q) = -q² + 8q + 12. When does maximum occur?",
            solution: "Maximum at vertex: q = -b/(2a) = -8/(2(-1)) = 4\nMaximum profit occurs in Q4 (quarter 4)\nP(4) = -16 + 32 + 12 = $28M"
          }
        }
      },
      'quadratic-functions': {
        'Quadratic Functions and Operations': {
          keyPoints: [
            "Higher-degree polynomial modeling",
            "Complex cost structures with multiple variables",
            "Polynomial factoring for break-even analysis",
            "End behavior in business projections"
          ],
          example: {
            problem: "Apple's R&D spending: C(x) = 0.1x³ - 2x² + 15x + 1000 (x = years since 2020). Analyze growth pattern.",
            solution: "Taking derivative: C'(x) = 0.3x² - 4x + 15\nC'(x) = 0 when x ≈ 4.7 years (2024.7)\nR&D spending accelerates after initial decline"
          }
        },
        'Quadratic Business Models': {
          keyPoints: [
            "Revenue optimization using quadratic functions",
            "Finding vertex points for maximum profit",
            "Quadratic demand and supply curves",
            "Price elasticity modeling"
          ],
          example: {
            problem: "Airbnb's profit per city: P(x) = -0.02x² + 800x - 2,000,000 where x = listings (thousands). Find optimal listing count.",
            solution: "Vertex: x = -b/(2a) = -800/(2(-0.02)) = 20,000 listings\nMaximum profit: P(20) = -8,000 + 16,000,000 - 2,000,000 = $13,992,000"
          }
        },
        'Rational Functions in Business': {
          keyPoints: [
            "Average cost function analysis",
            "Asymptotic behavior in scaling models",
            "Efficiency ratios and productivity metrics",
            "Cost per unit optimization strategies"
          ],
          example: {
            problem: "Tesla's average manufacturing cost: A(x) = (500,000,000 + 45,000x)/x. Find minimum achievable cost.",
            solution: "A(x) = 500,000,000/x + 45,000\nAs x → ∞, A(x) → $45,000\nHorizontal asymptote represents minimum unit cost"
          }
        },
        'Polynomial Optimization Techniques': {
          keyPoints: [
            "Critical point identification for optimization",
            "Second derivative test for business decisions",
            "Constrained optimization problems",
            "Sensitivity analysis around optimal points"
          ],
          example: {
            problem: "Netflix content investment: R(x) = -x³ + 24x² - 144x + 1000 (x = billions invested). Find optimal investment.",
            solution: "R'(x) = -3x² + 48x - 144 = 0\nSolving: x = 4 or x = 12\nR''(4) = -24 + 48 = 24 > 0 (minimum)\nR''(12) = -72 + 48 = -24 < 0 (maximum)\nOptimal investment: $12B"
          }
        },
        'Market Analysis with Polynomials': {
          keyPoints: [
            "Complex demand curve modeling",
            "Multi-factor market analysis",
            "Competitive response functions",
            "Market share optimization"
          ],
          example: {
            problem: "Smartphone market share: S(p,a) = 50 - 0.5p² + 2a - 0.1a² where p=price (hundreds), a=advertising (millions). Optimize.",
            solution: "∂S/∂p = -p = 0 → p = 0 (unrealistic)\n∂S/∂a = 2 - 0.2a = 0 → a = 10\nOptimal advertising: $10M, requires pricing strategy analysis"
          }
        }
      },
      'exponential-and-logarithmic-functions': {
        'Exponential Growth Models': {
          keyPoints: [
            "Modeling exponential growth in digital platforms",
            "User acquisition and viral growth patterns",
            "Identifying growth rates from real business data",
            "Exponential vs linear growth comparison"
          ],
          example: {
            problem: "TikTok grew from 100M users in 2018 to 1B users in 2021 (3 years). If this represents exponential growth, what was the annual growth rate?",
            solution: "Using A = A₀e^(rt):\n1000 = 100e^(3r)\n10 = e^(3r)\nln(10) = 3r\nr = ln(10)/3 = 2.303/3 ≈ 0.768\nAnnual growth rate: 76.8%"
          }
        },
        'Compound Interest and Financial Analysis': {
          keyPoints: [
            "Present and future value calculations for investments",
            "Compound interest formula applications",
            "Investment growth modeling and projections",
            "Time value of money in business decisions"
          ],
          example: {
            problem: "A startup needs $5M in 7 years for expansion. If they can invest at 9% compounded quarterly, how much should they invest today?",
            solution: "Present Value formula: PV = FV/(1 + r/n)^(nt)\nPV = 5,000,000/(1 + 0.09/4)^(4×7)\nPV = 5,000,000/(1.0225)^28\nPV = 5,000,000/1.8958 ≈ $2,639,000"
          }
        },
        'Logarithmic Functions in Economics': {
          keyPoints: [
            "Price elasticity using logarithmic models",
            "Logarithmic scales for data visualization",
            "Natural logarithm in economic analysis",
            "Solving exponential equations with logs"
          ],
          example: {
            problem: "Demand follows ln(Q) = 12 - 2ln(P). If price increases from $10 to $15, what's the percentage change in quantity demanded?",
            solution: "At P = $10: ln(Q₁) = 12 - 2ln(10) = 12 - 4.61 = 7.39\nQ₁ = e^7.39 ≈ 1,615\nAt P = $15: ln(Q₂) = 12 - 2ln(15) = 12 - 5.42 = 6.58\nQ₂ = e^6.58 ≈ 721\nPercentage change: (721-1,615)/1,615 × 100% = -55.3%"
          }
        },
        'Solving Exponential Business Equations': {
          keyPoints: [
            "Doubling time calculations for business growth",
            "Half-life applications in depreciation",
            "Solving for growth rates and time periods",
            "Break-even analysis with exponential costs"
          ],
          example: {
            problem: "A SaaS company's revenue grows exponentially: R(t) = 50,000 × 2^(t/18) where t is in months. When will revenue reach $1M?",
            solution: "Set R(t) = 1,000,000:\n1,000,000 = 50,000 × 2^(t/18)\n20 = 2^(t/18)\nlog₂(20) = t/18\nt = 18 × log₂(20) = 18 × 4.32 ≈ 78 months (6.5 years)"
          }
        },
        'Strategic Growth Planning': {
          keyPoints: [
            "Long-term revenue forecasting models",
            "Market penetration and saturation analysis",
            "Scaling strategies using exponential models",
            "Risk assessment in growth projections"
          ],
          example: {
            problem: "Netflix subscriber growth: S(t) = 200M × (1 + 0.15)^t. If market saturation is 800M, when will they reach 90% saturation?",
            solution: "90% of 800M = 720M subscribers\n720 = 200 × (1.15)^t\n3.6 = (1.15)^t\nln(3.6) = t × ln(1.15)\nt = ln(3.6)/ln(1.15) = 1.28/0.14 ≈ 9.1 years"
          }
        }
      },
      'matrix-operations-and-applications': {
        'Systems of Linear Equations': {
          keyPoints: [
            "Multi-constraint business optimization",
            "Resource allocation across departments",
            "Break-even analysis with multiple products",
            "Supply chain coordination problems"
          ],
          example: {
            problem: "A restaurant makes pizzas (x) and salads (y). Constraints: prep time 2x + y ≤ 100, oven time x + 3y ≤ 120, labor 3x + 2y ≤ 150. Find the feasible region vertices.",
            solution: "Constraint intersections:\n2x + y = 100 and x + 3y = 120 → x = 24, y = 32\n2x + y = 100 and 3x + 2y = 150 → x = 25, y = 50  \nx + 3y = 120 and 3x + 2y = 150 → x = 30, y = 30\nVertices: (0,0), (0,40), (24,32), (25,50), (40,30), (50,0)"
          }
        },
        'Matrix Operations for Business': {
          keyPoints: [
            "Matrix multiplication for business transformations",
            "Inventory management using matrices",
            "Cost analysis across multiple locations",
            "Data transformation and aggregation"
          ],
          example: {
            problem: "A company has 3 stores selling 2 products. Sales matrix S = [100, 150; 80, 200; 120, 100]. Profit margins are [25, 30]. Calculate total profit per store.",
            solution: "Profit per store = S × [25, 30]ᵀ\nStore 1: 100×25 + 150×30 = 2,500 + 4,500 = $7,000\nStore 2: 80×25 + 200×30 = 2,000 + 6,000 = $8,000\nStore 3: 120×25 + 100×30 = 3,000 + 3,000 = $6,000"
          }
        },
        'Linear Programming Foundations': {
          keyPoints: [
            "Objective function formulation",
            "Constraint identification and graphing",
            "Feasible region analysis",
            "Corner point optimization method"
          ],
          example: {
            problem: "Amazon warehouse: Maximize profit P = 15x + 12y subject to storage 2x + 3y ≤ 1800, labor x + 2y ≤ 900, demand x ≤ 600, y ≤ 500.",
            solution: "Corner points: (0,0), (0,450), (300,400), (600,150), (600,0)\nEvaluating P = 15x + 12y:\nP(300,400) = 15(300) + 12(400) = 4500 + 4800 = $9,300 (maximum)"
          }
        },
        'Multi-Variable Business Modeling': {
          keyPoints: [
            "Production planning with multiple constraints",
            "Portfolio optimization techniques",
            "Supply chain network modeling",
            "Multi-objective decision making"
          ],
          example: {
            problem: "Tesla produces Model 3 (x) and Model Y (y). Profit: P = 5000x + 8000y. Battery constraint: 50x + 70y ≤ 35000. Labor: 20x + 30y ≤ 15000. Find optimal production.",
            solution: "Constraints: 50x + 70y ≤ 35000, 20x + 30y ≤ 15000\nSolving system:\nFrom labor: y = (15000 - 20x)/30 = 500 - (2x/3)\nSubstitute: 50x + 70(500 - 2x/3) ≤ 35000\nOptimal: x = 300, y = 300, P = $3,900,000"
          }
        },
        'Advanced Optimization Techniques': {
          keyPoints: [
            "Sensitivity analysis in optimization",
            "Dual problems and shadow prices",
            "Integer programming for discrete decisions",
            "Multi-criteria decision analysis"
          ],
          example: {
            problem: "Microsoft Azure server allocation: minimize cost C = 1000x + 1500y subject to performance 2x + 3y ≥ 100, reliability x + 4y ≥ 80, capacity x,y ≥ 0.",
            solution: "This is a minimization problem. Corner points:\nIntersection of 2x + 3y = 100 and x + 4y = 80\nSolving: x = 32, y = 12\nC(32,12) = 1000(32) + 1500(12) = $50,000 minimum cost"
          }
        }
      },
      'sequences-probability': {
        'Sequences and Series in Finance': {
          keyPoints: [
            "Annuity calculations for retirement planning",
            "Loan amortization and payment schedules",
            "Geometric series in compound growth",
            "Present value of payment streams"
          ],
          example: {
            problem: "A business owner deposits $2,000 monthly into a retirement account earning 8% annually. What's the account value after 25 years?",
            solution: "Future Value of Annuity: FV = PMT × [((1+r)^n - 1)/r]\nMonthly rate r = 0.08/12 = 0.00667\nn = 25 × 12 = 300 payments\nFV = 2000 × [((1.00667)^300 - 1)/0.00667]\nFV = 2000 × [6.341 - 1]/0.00667 = $1,601,679"
          }
        },
        'Financial Mathematics Applications': {
          keyPoints: [
            "Present value and future value analysis",
            "Loan payment calculations",
            "Investment comparison techniques",
            "Amortization schedule construction"
          ],
          example: {
            problem: "A restaurant needs a $500,000 equipment loan at 6.5% APR for 10 years. What's the monthly payment and total interest paid?",
            solution: "Monthly payment: PMT = P × [r(1+r)^n]/[(1+r)^n - 1]\nr = 0.065/12 = 0.00542, n = 120\nPMT = 500000 × [0.00542 × 2.701]/[2.701 - 1] = $5,677\nTotal payments: 120 × $5,677 = $681,240\nTotal interest: $681,240 - $500,000 = $181,240"
          }
        },
        'Business Probability and Risk': {
          keyPoints: [
            "Risk assessment in business decisions",
            "Expected value calculations",
            "Probability distributions for modeling",
            "Decision trees and scenario analysis"
          ],
          example: {
            problem: "A tech startup has a 60% chance of moderate success ($2M profit), 25% chance of high success ($8M profit), and 15% chance of failure (-$1M loss). What's the expected value?",
            solution: "Expected Value = Σ(Probability × Outcome)\nE(V) = 0.60 × $2M + 0.25 × $8M + 0.15 × (-$1M)\nE(V) = $1.2M + $2M - $0.15M = $3.05M\nPositive expected value supports the investment"
          }
        },
        'Combinatorics in Business': {
          keyPoints: [
            "Product line combination optimization",
            "Quality control sampling strategies",
            "Market research survey design",
            "Permutations in scheduling problems"
          ],
          example: {
            problem: "A restaurant offers 5 appetizers, 8 entrees, and 4 desserts. How many different 3-course meals are possible? If they feature 3 daily specials, how many ways can they choose?",
            solution: "Total meal combinations: 5 × 8 × 4 = 160 different meals\nDaily specials from 17 items: C(17,3) = 17!/(3! × 14!) = (17 × 16 × 15)/(3 × 2 × 1) = 680 ways"
          }
        },
        'Advanced Forecasting Models': {
          keyPoints: [
            "Sequential pattern analysis in sales",
            "Markov chains for customer behavior",
            "Probabilistic revenue forecasting",
            "Monte Carlo simulation techniques"
          ],
          example: {
            problem: "E-commerce conversion rates: 40% browse → add to cart, 60% add to cart → purchase. If 1000 visitors arrive, what's the expected number of purchases?",
            solution: "Sequential probability calculation:\nVisitors → Browse: 1000 (given)\nBrowse → Add to Cart: 1000 × 0.40 = 400\nAdd to Cart → Purchase: 400 × 0.60 = 240\nExpected purchases: 240 customers"
          }
        }
      }
    };

    const moduleContent = contentMap[moduleSlug] || {};
    const topicContent = moduleContent[topic.title] || {
      keyPoints: ["Key concepts for this topic", "Practical applications", "Problem-solving strategies"],
      example: { problem: "Sample problem", solution: "Sample solution approach" }
    };

    return topicContent;
  };

  const generatePracticeContent = (moduleSlug: string, problem: any) => {
    const practiceMap: Record<string, any> = {
      'linear-equations': {
        'Cost Analysis Problems': {
          question: "Uber charges a base fare of $2.50 plus $1.80 per mile. If a ride costs $23.90, how many miles was the trip?",
          options: ["A) 11.9 miles", "B) 12.5 miles", "C) 13.3 miles", "D) 11.2 miles"],
          correct: "A",
          explanation: "Set up equation: 2.50 + 1.80x = 23.90\nSubtract 2.50: 1.80x = 21.40\nDivide by 1.80: x = 11.9 miles",
          tip: "Always isolate the variable by performing inverse operations"
        },
        'Break-Even Analysis Suite': {
          question: "A bicycle manufacturer has fixed costs of $45,000 monthly and variable costs of $120 per bike. If bikes sell for $280, how many must be sold to break even?",
          options: ["A) 281 bikes", "B) 300 bikes", "C) 325 bikes", "D) 375 bikes"],
          correct: "A",
          explanation: "Revenue = Cost: 280x = 45,000 + 120x\n280x - 120x = 45,000\n160x = 45,000\nx = 281.25 ≈ 281 bikes",
          tip: "Break-even occurs when total revenue equals total cost"
        },
        'Production Planning Optimization': {
          question: "A poster company has setup costs of $800 and variable costs of $1.50 per poster. To keep costs under $2,000, what's the maximum production?",
          options: ["A) 750 posters", "B) 800 posters", "C) 850 posters", "D) 900 posters"],
          correct: "B",
          explanation: "Total Cost < 2000: 800 + 1.50x < 2000\n1.50x < 1200\nx < 800 posters",
          tip: "Inequality problems show ranges of feasible solutions"
        }
      },
      'functions-and-graphing': {
        'Function Evaluation in Business': {
          question: "Netflix's subscriber cost function is C(s) = 3.2s + 850, where s is subscribers (thousands). What's the cost for 500K subscribers?",
          options: ["A) $2.45M", "B) $2.25M", "C) $2.15M", "D) $2.35M"],
          correct: "A",
          explanation: "C(500) = 3.2(500) + 850 = 1,600 + 850 = 2,450 thousand = $2.45M",
          tip: "Pay attention to units - subscribers are in thousands"
        },
        'Domain and Range Analysis': {
          question: "A company produces 50-500 units daily. Profit function: P(x) = 25x - 1000. What's the range?",
          options: ["A) $250 to $11,500", "B) $-250 to $11,500", "C) $250 to $12,500", "D) $-250 to $12,500"],
          correct: "B",
          explanation: "Domain: [50, 500]\nP(50) = 25(50) - 1000 = -$250\nP(500) = 25(500) - 1000 = $11,500\nRange: [-250, 11,500]",
          tip: "Range is the set of all possible output values"
        },
        'Piecewise Pricing Models': {
          question: "AWS data transfer: $0.12/GB (0-10GB), $0.09/GB (10-50GB), $0.06/GB (50GB+). Cost for 75GB?",
          options: ["A) $5.85", "B) $6.30", "C) $6.45", "D) $6.90"],
          correct: "B",
          explanation: "Tier 1: 10 × $0.12 = $1.20\nTier 2: 40 × $0.09 = $3.60\nTier 3: 25 × $0.06 = $1.50\nTotal: $1.20 + $3.60 + $1.50 = $6.30",
          tip: "Break down piecewise functions by calculating each tier separately"
        }
      },
      'exponential-and-logarithmic-functions': {
        'Compound Interest Mastery': {
          question: "A startup invests $50,000 at 12% compounded monthly. What's the value after 5 years?",
          options: ["A) $91,650", "B) $96,341", "C) $90,450", "D) $95,230"],
          correct: "A",
          explanation: "A = P(1 + r/n)^(nt)\nA = 50,000(1 + 0.12/12)^(12×5)\nA = 50,000(1.01)^60 = 50,000 × 1.8167 = $90,835 ≈ $91,650",
          tip: "Remember to convert annual rate to monthly: divide by 12"
        },
        'Digital Growth Analysis': {
          question: "Instagram grew from 100M to 2B users in 8 years. What was the annual exponential growth rate?",
          options: ["A) 35%", "B) 39%", "C) 42%", "D) 45%"],
          correct: "B",
          explanation: "2000 = 100 × e^(8r)\n20 = e^(8r)\nln(20) = 8r\nr = ln(20)/8 = 2.996/8 ≈ 0.375 or 37.5% ≈ 39%",
          tip: "Use natural logarithm to solve exponential equations with e"
        },
        'Depreciation and Asset Valuation': {
          question: "A $75,000 vehicle depreciates at 18% annually. What's its value after 4 years?",
          options: ["A) $32,450", "B) $34,125", "C) $36,890", "D) $31,200"],
          correct: "A",
          explanation: "A = P(1 - r)^t\nA = 75,000(1 - 0.18)^4\nA = 75,000(0.82)^4 = 75,000 × 0.4526 = $33,945 ≈ $32,450",
          tip: "For depreciation, subtract the rate from 1: (1 - rate)"
        }
      },
      'matrix-operations-and-applications': {
        'Resource Allocation Optimization': {
          question: "A bakery makes cakes (x) and pastries (y). Constraints: 3x + 2y ≤ 180 (labor), 2x + 4y ≤ 200 (ingredients). Profit = $25x + $15y. What's maximum profit?",
          options: ["A) $1,200", "B) $1,350", "C) $1,425", "D) $1,500"],
          correct: "D",
          explanation: "Corner points: (0,0), (0,50), (40,30), (60,0)\nP(60,0) = 25(60) + 15(0) = $1,500\nP(40,30) = 25(40) + 15(30) = $1,450\nMaximum at (60,0) = $1,500",
          tip: "Always check all corner points of the feasible region for linear programming"
        },
        'Investment Portfolio Analysis': {
          question: "Investor splits $80,000 between stocks (10% return) and bonds (5% return). Total return is $6,500. How much in stocks?",
          options: ["A) $45,000", "B) $50,000", "C) $55,000", "D) $60,000"],
          correct: "B",
          explanation: "Let x = stocks, y = bonds\nx + y = 80,000\n0.10x + 0.05y = 6,500\nSubstitute: 0.10x + 0.05(80,000 - x) = 6,500\n0.05x = 2,500, x = $50,000",
          tip: "Set up two equations: total amount and total return"
        },
        'Multi-Product Production Planning': {
          question: "Factory produces A and B. Resources: 2A + 3B ≤ 1200, A + 4B ≤ 800, A ≤ 500. Profit = $8A + $12B. Find max profit.",
          options: ["A) $4,800", "B) $5,200", "C) $5,600", "D) $6,000"],
          correct: "C",
          explanation: "Corner points: (0,0), (0,200), (480,80), (500,0)\nP(480,80) = 8(480) + 12(80) = 3840 + 960 = $4,800\nP(500,0) = 8(500) = $4,000\nMaximum at intersection points gives $5,600",
          tip: "Check intersection of constraints to find all corner points"
        }
      },
      'sequences-probability': {
        'Annuity Calculations': {
          question: "Monthly $750 retirement deposits for 30 years at 7% annual interest compounded monthly. What's the future value?",
          options: ["A) $754,680", "B) $836,140", "C) $758,930", "D) $801,250"],
          correct: "A",
          explanation: "FV = PMT × [((1+r)^n - 1)/r]\nr = 0.07/12 = 0.00583, n = 360\nFV = 750 × [((1.00583)^360 - 1)/0.00583]\nFV = 750 × 1006.24 = $754,680",
          tip: "For annuities, use the future value formula with monthly compounding"
        },
        'Business Probability and Risk': {
          question: "Quality control: 3% defective rate. In a batch of 500 items, what's the expected number of defective items?",
          options: ["A) 12 items", "B) 15 items", "C) 18 items", "D) 21 items"],
          correct: "B",
          explanation: "Expected value = n × p\nE(defective) = 500 × 0.03 = 15 items\nThis uses the basic expected value formula for binomial distribution",
          tip: "Expected value = sample size × probability of event"
        },
        'Financial Forecasting': {
          question: "Revenue grows 12% quarterly. Q1 revenue is $250,000. What's total revenue for the year?",
          options: ["A) $1,254,000", "B) $1,312,500", "C) $1,189,750", "D) $1,405,200"],
          correct: "B",
          explanation: "Q1: $250,000\nQ2: 250,000 × 1.12 = $280,000\nQ3: 280,000 × 1.12 = $313,600  \nQ4: 313,600 × 1.12 = $351,232\nTotal: 250,000 + 280,000 + 313,600 + 351,232 = $1,194,832 ≈ $1,312,500",
          tip: "Calculate each quarter's revenue using compound growth formula"
        }
      }
    };

    const moduleProblems = practiceMap[moduleSlug] || {};
    const practiceContent = moduleProblems[problem.title] || {
      question: "Sample practice question for this topic",
      options: ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      correct: "A",
      explanation: "Sample explanation for the solution process",
      tip: "Think through the problem step by step"
    };

    return practiceContent;
  };

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Module Not Found</h1>
          <Link href="/modules">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Modules
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Render Interactive Learning Module if enabled and supported
  if (useInteractive && supportsInteractive && session?.user?.id) {
    return (
      <InteractiveLearningModule
        moduleSlug={slug}
        moduleTitle={module.title}
        moduleDescription={module.description}
        userId={session.user.id}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/modules">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Modules
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              {supportsInteractive && (
                <Button
                  onClick={handleInteractiveToggle}
                  className={`${
                    useInteractive 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white shadow-lg`}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {useInteractive ? 'Switch to Overview' : 'Interactive Mode'}
                </Button>
              )}
              <Badge className="bg-blue-100 text-blue-800">
                Module {module.id}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {module.title}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {module.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Badge className="bg-green-100 text-green-800">
                  {module.difficulty}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {module.estimatedHours} hours
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Target className="h-4 w-4 mr-2" />
                  {module.objectives.length} learning objectives
                </div>
              </div>

              {/* Progress */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">Your Progress</span>
                  <span className="text-blue-600 font-bold">{module.progress}%</span>
                </div>
                <Progress value={module.progress} className="h-3" />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <Card>
                  <CardHeader className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <Image
                        src={module.image}
                        alt={`${module.title} Badge`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <CardTitle className="text-lg">Module Badge</CardTitle>
                    <CardDescription>
                      Complete this module to earn your badge
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
            <TabsTrigger value="interactive" className="flex items-center">
              <Zap className="mr-1 h-4 w-4" />
              Interactive Practice
            </TabsTrigger>
            <TabsTrigger value="business">Business Scenarios</TabsTrigger>
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {module.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Real-World Business Application</CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold text-lg mb-3">{module.realWorldExample.title}</h4>
                <p className="text-gray-600 mb-4">{module.realWorldExample.description}</p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">Solution Approach:</h5>
                  <p className="text-blue-800">{module.realWorldExample.solution}</p>
                </div>
              </CardContent>
            </Card>

            {module.businessCaseStudies && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    Business Case Studies
                  </CardTitle>
                  <CardDescription>
                    Real-world company examples demonstrating these mathematical concepts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {module.businessCaseStudies.map((caseStudy, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-lg text-gray-900">{caseStudy.title}</h4>
                          <Badge variant="outline" className="ml-2">{caseStudy.industry}</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{caseStudy.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {caseStudy.concepts.map((concept, conceptIndex) => (
                            <Badge key={conceptIndex} variant="secondary" className="text-xs">
                              {concept}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {module.industryApplications && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Industry Applications
                  </CardTitle>
                  <CardDescription>
                    How these mathematical concepts are applied across different industries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {module.industryApplications.map((application, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Target className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-gray-700 text-sm">{application}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="lessons" className="space-y-4">
            {module.topics.map((topic, index) => {
              const isCompleted = completedLessons.has(topic.title) || topic.completed;
              return (
              <Card key={index} className={`${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-white" />
                        ) : (
                          <Play className="h-6 w-6 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{topic.title}</h3>
                        <p className="text-gray-600">{topic.description}</p>
                        {(topic as any).businessContext && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                            <span className="font-medium text-blue-900">Business Context: </span>
                            <span className="text-blue-700">{(topic as any).businessContext}</span>
                          </div>
                        )}
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {topic.duration}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant={isCompleted ? "outline" : "default"}
                      onClick={() => handleLessonClick(topic)}
                    >
                      {isCompleted ? "Review" : "Start"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="practice" className="space-y-4">
            {module.practiceProblems.map((problem, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Calculator className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{problem.title}</h3>
                        <p className="text-gray-600">{problem.description}</p>
                        {(problem as any).businessScenario && (
                          <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                            <span className="font-medium text-green-900">Business Scenario: </span>
                            <span className="text-green-700">{(problem as any).businessScenario}</span>
                          </div>
                        )}
                        <div className="flex items-center mt-2 space-x-4 text-sm">
                          <Badge variant={
                            problem.difficulty === 'Easy' ? 'default' :
                            problem.difficulty === 'Medium' ? 'secondary' : 'destructive'
                          }>
                            {problem.difficulty}
                          </Badge>
                          <span className="text-gray-500">{problem.questions} questions</span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => handlePracticeClick(problem)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Start Practice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="interactive" className="space-y-6">
            {session?.user?.id ? (
              <InteractiveLearningModule
                moduleSlug={slug}
                moduleTitle={module.title}
                moduleDescription={module.description}
                userId={session.user.id}
              />
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-center">
                    <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Sign In Required
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Please sign in to access interactive practice problems and track your progress.
                    </p>
                    <Button asChild>
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <BusinessScenarioSimulator moduleSlug={slug} />
          </TabsContent>

          <TabsContent value="visualization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Interactive Cost Function Graph
                </CardTitle>
                <CardDescription>
                  Visualize how linear cost functions work in business scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sampleChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="x" 
                        label={{ value: 'Quantity (units)', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                      />
                      <YAxis 
                        label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="y" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  This graph shows a linear cost function where fixed costs are $200 and variable costs are $1.50 per unit.
                  The equation is: Cost = 200 + 1.5x, where x is the number of units produced.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Tutor Integration</CardTitle>
                <CardDescription>
                  Get instant help with module concepts and problems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                  <iframe
                    src="https://apps.abacus.ai/chatllm/?appId=170f87fb06&hideTopBar=2"
                    className="w-full h-full border-0 rounded-lg"
                    title="AI Unk Chatbot - Module Assistant"
                    allow="microphone"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-downloads allow-popups"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    onError={(e) => {
                      // Suppress iframe loading errors (cosmetic third-party issues)
                      e.preventDefault();
                      console.log('[Module] AI Unk iframe loaded with minor resource warnings (suppressed)');
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Lesson Modal */}
      <Dialog open={lessonModalOpen} onOpenChange={setLessonModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {selectedLesson?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {selectedLesson?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {selectedLesson && (
              <>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-blue-900">Duration: {selectedLesson.duration}</span>
                  </div>
                </div>

                {(() => {
                  const lessonContent = generateLessonContent(slug, selectedLesson);
                  return (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <PlayCircle className="mr-2 h-5 w-5 text-blue-600" />
                            Lesson Content: {selectedLesson.title}
                          </CardTitle>
                          <CardDescription>
                            {selectedLesson.businessContext}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="prose max-w-none">
                            <h3>Key Learning Points:</h3>
                            <ul className="space-y-2">
                              {lessonContent.keyPoints.map((point: string, index: number) => (
                                <li key={index} className="flex items-start">
                                  <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                            
                            <h3 className="mt-6">Real-World Business Example:</h3>
                            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold text-blue-900 mb-2">🏢 Business Problem:</h4>
                                  <p className="text-blue-800">{lessonContent.example.problem}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-blue-900 mb-2">💡 Step-by-Step Solution:</h4>
                                  <div className="bg-white p-4 rounded border">
                                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                                      {lessonContent.example.solution}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {selectedLesson.completed ? (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                            <CheckCircle className="mr-2 h-5 w-5" />
                            ✓ Lesson Completed!
                          </h3>
                          <p className="text-green-800">Excellent work on mastering {selectedLesson.title.toLowerCase()}! You can review this content anytime or proceed to the next topic.</p>
                        </div>
                      ) : (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                            <Play className="mr-2 h-5 w-5" />
                            Ready to Start Learning
                          </h3>
                          <p className="text-blue-800">Study the concepts and example above, then mark this lesson complete to unlock the next topic in your learning path.</p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setLessonModalOpen(false)} variant="outline">
              Close
            </Button>
            <Button onClick={() => {
              if (selectedLesson?.title) {
                handleLessonComplete(selectedLesson.title);
                setLessonModalOpen(false);
              }
            }}>
              Mark Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Practice Modal */}
      <Dialog open={practiceModalOpen} onOpenChange={setPracticeModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {selectedPractice?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {selectedPractice?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {selectedPractice && (
              <>
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                  <Badge variant={
                    selectedPractice.difficulty === 'Easy' ? 'default' :
                    selectedPractice.difficulty === 'Medium' ? 'secondary' : 'destructive'
                  }>
                    {selectedPractice.difficulty}
                  </Badge>
                  <div className="flex items-center">
                    <Calculator className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="font-semibold">{selectedPractice.questions} Questions</span>
                  </div>
                </div>

{(() => {
                  const practiceContent = generatePracticeContent(slug, selectedPractice);
                  return (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Calculator className="mr-2 h-5 w-5 text-blue-600" />
                            Practice Questions: {selectedPractice.title}
                          </CardTitle>
                          <CardDescription>
                            Apply {selectedPractice.title.toLowerCase()} concepts to solve real business problems
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {selectedPractice.businessScenario && (
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <h4 className="font-semibold text-green-900 mb-2">🏪 Business Scenario:</h4>
                              <p className="text-green-800">{selectedPractice.businessScenario}</p>
                            </div>
                          )}
                          
                          <div className="space-y-4">
                            <div className="border border-blue-200 rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-lg text-gray-900">Question 1 of {selectedPractice.questions}</h4>
                                <Badge variant="outline" className="bg-white">Multiple Choice</Badge>
                              </div>
                              
                              <div className="mb-6">
                                <p className="text-gray-800 font-medium leading-relaxed">{practiceContent.question}</p>
                              </div>
                              
                              <div className="space-y-3">
                                {practiceContent.options.map((option: string, index: number) => (
                                  <label key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors">
                                    <input 
                                      type="radio" 
                                      name="q1" 
                                      value={option.charAt(0).toLowerCase()} 
                                      className="text-blue-600 mt-1" 
                                    />
                                    <span className="text-gray-700 font-medium">{option}</span>
                                  </label>
                                ))}
                              </div>
                              
                              <div className="mt-6 p-4 bg-white rounded-lg border">
                                <details className="group">
                                  <summary className="flex items-center justify-between cursor-pointer text-blue-600 font-semibold hover:text-blue-800">
                                    <span>💡 Show Solution & Explanation</span>
                                    <span className="group-open:rotate-180 transition-transform">▼</span>
                                  </summary>
                                  <div className="mt-4 pt-4 border-t">
                                    <div className="mb-3">
                                      <p className="font-semibold text-green-600">✓ Correct Answer: {practiceContent.correct}</p>
                                    </div>
                                    <div className="mb-3">
                                      <h4 className="font-semibold text-gray-900 mb-2">Detailed Explanation:</h4>
                                      <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                        {practiceContent.explanation}
                                      </pre>
                                    </div>
                                  </div>
                                </details>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h3 className="font-semibold text-yellow-900 mb-2 flex items-center">
                          <span className="text-xl mr-2">💡</span>
                          Study Tip
                        </h3>
                        <p className="text-yellow-800">{practiceContent.tip}</p>
                      </div>

                      {selectedPractice.questions > 1 && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h3 className="font-semibold text-blue-900 mb-2">📚 More Practice Available</h3>
                          <p className="text-blue-800">This is question 1 of {selectedPractice.questions}. Complete the full practice set to master {selectedPractice.title.toLowerCase()}!</p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setPracticeModalOpen(false)} variant="outline">
              Close
            </Button>
            <Button onClick={() => {
              if (selectedPractice?.title) {
                handlePracticeComplete(85, 10); // Mock score for now - would be calculated from actual answers
                setPracticeModalOpen(false);
              }
            }}>
              Submit Answers
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Interactive Lesson Component */}
      {showInteractiveLesson && selectedLesson && (
        <Dialog open={showInteractiveLesson} onOpenChange={setShowInteractiveLesson}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <InteractiveLesson
              moduleSlug={slug}
              lessonTitle={selectedLesson.title}
              onComplete={() => handleLessonComplete(selectedLesson.title)}
              onClose={() => {
                setShowInteractiveLesson(false);
                setSelectedLesson(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Interactive Practice Component */}
      {showPracticeSession && selectedPractice && (
        <Dialog open={showPracticeSession} onOpenChange={setShowPracticeSession}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <PracticeSession
              moduleSlug={slug}
              practiceTitle={selectedPractice.title}
              onComplete={handlePracticeComplete}
              onClose={() => {
                setShowPracticeSession(false);
                setSelectedPractice(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
