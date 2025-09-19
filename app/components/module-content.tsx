
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
    progress: 85,
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
        completed: false,
        businessContext: "Break-even points and equilibrium analysis"
      },
      {
        title: "Advanced Business Applications",
        description: "Supply & demand, market equilibrium, and forecasting",
        duration: "65 min",
        completed: false,
        businessContext: "Market analysis and strategic planning"
      }
    ],
    practiceProblems: [
      {
        title: "Cost Analysis Problems",
        description: "Tax return service charges $31.50 plus $32 per hour. Calculate costs for various service durations.",
        difficulty: "Easy",
        questions: 12,
        businessScenario: "Service pricing and cost calculation"
      },
      {
        title: "Break-Even Analysis Suite",
        description: "Bike manufacturer with costs C(x) = 0.85x + 35,000 and revenue R(x) = 1.55x. Find break-even points.",
        difficulty: "Medium",
        questions: 8,
        businessScenario: "Manufacturing break-even analysis"
      },
      {
        title: "Production Planning Optimization",
        description: "Poster company with setup costs $80 and variable costs $0.11 per poster. Optimize production under constraints.",
        difficulty: "Medium",
        questions: 10,
        businessScenario: "Production planning and cost management"
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
  'functions-graphs': {
    id: 2,
    title: "Functions and Graphs",
    description: "Explore function behavior, graphing techniques, and piecewise functions used in tiered pricing models.",
    image: "https://cdn.abacus.ai/images/51024b94-7fbb-4036-987b-b3fe393f6bf8.png",
    difficulty: "Beginner",
    estimatedHours: 18,
    progress: 60,
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
        completed: false,
        businessContext: "Multi-stage processes and profit function creation"
      },
      {
        title: "Piecewise Functions - Advanced Pricing",
        description: "Complex tiered pricing, tax brackets, commission structures",
        duration: "80 min",
        completed: false,
        businessContext: "Advanced pricing strategies and compensation models"
      },
      {
        title: "Graph Analysis and Business Optimization",
        description: "Reading business graphs and identifying optimization points",
        duration: "75 min",
        completed: false,
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
  'polynomial-rational': {
    id: 3,
    title: "Polynomial and Rational Functions",
    description: "Analyze complex relationships in revenue optimization and efficiency modeling through advanced functions.",
    image: "https://cdn.abacus.ai/images/66b5d1c0-2932-4b89-8b7a-bf1602072d0a.png",
    difficulty: "Intermediate",
    estimatedHours: 24,
    progress: 30,
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
        completed: false,
        businessContext: "Revenue optimization and pricing strategies"
      },
      {
        title: "Rational Functions in Business",
        description: "Efficiency analysis and average cost functions",
        duration: "90 min",
        completed: false,
        businessContext: "Average cost analysis and productivity optimization"
      },
      {
        title: "Polynomial Optimization Techniques",
        description: "Finding maximum profit and optimal production levels",
        duration: "85 min",
        completed: false,
        businessContext: "Strategic optimization and decision making"
      },
      {
        title: "Market Analysis with Polynomials",
        description: "Complex demand curves and competitive analysis",
        duration: "75 min",
        completed: false,
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
  'exponential-logarithmic': {
    id: 4,
    title: "Exponential and Logarithmic Functions",
    description: "Study growth models, compound interest, and logarithmic scales essential for business finance.",
    image: "https://cdn.abacus.ai/images/34b6cfe8-5c21-4134-ac87-d925614c655e.png",
    difficulty: "Intermediate",
    estimatedHours: 26,
    progress: 0,
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
        completed: false,
        businessContext: "Business growth analysis and market expansion"
      },
      {
        title: "Compound Interest and Financial Analysis",
        description: "Compound interest formulas and continuous compounding",
        duration: "80 min",
        completed: false,
        businessContext: "Investment analysis and financial planning"
      },
      {
        title: "Logarithmic Functions in Economics",
        description: "Properties of logarithms and natural logarithm applications",
        duration: "70 min",
        completed: false,
        businessContext: "Elasticity analysis and logarithmic scales"
      },
      {
        title: "Solving Exponential Business Equations",
        description: "Algebraic techniques for business growth problems",
        duration: "85 min",
        completed: false,
        businessContext: "Doubling time, growth rates, and forecasting"
      },
      {
        title: "Strategic Growth Planning",
        description: "Revenue forecasting and market penetration modeling",
        duration: "90 min",
        completed: false,
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
  'systems-matrices': {
    id: 5,
    title: "Systems of Equations and Matrices",
    description: "Learn resource allocation, optimization problems, and matrix operations for business decision making.",
    image: "https://cdn.abacus.ai/images/ee07f028-b7bf-48ed-b7c3-fa607383db57.png",
    difficulty: "Advanced",
    estimatedHours: 28,
    progress: 0,
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
        completed: false,
        businessContext: "Business constraint problems and feasibility analysis"
      },
      {
        title: "Matrix Operations for Business",
        description: "Matrix arithmetic and business transformations",
        duration: "85 min",
        completed: false,
        businessContext: "Business data analysis and transformation modeling"
      },
      {
        title: "Linear Programming Foundations",
        description: "Objective functions, constraints, and optimization",
        duration: "95 min",
        completed: false,
        businessContext: "Resource allocation and profit optimization"
      },
      {
        title: "Multi-Variable Business Modeling",
        description: "Complex business relationships and resource allocation",
        duration: "90 min",
        completed: false,
        businessContext: "Production planning and portfolio optimization"
      },
      {
        title: "Advanced Optimization Techniques",
        description: "Sensitivity analysis and constraint optimization",
        duration: "100 min",
        completed: false,
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
    progress: 0,
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
        completed: false,
        businessContext: "Annuities, loans, and investment series"
      },
      {
        title: "Financial Mathematics Applications",
        description: "Present/future value, annuities, and loan amortization",
        duration: "85 min",
        completed: false,
        businessContext: "Financial planning and loan analysis"
      },
      {
        title: "Business Probability and Risk",
        description: "Basic probability, conditional probability, and risk assessment",
        duration: "80 min",
        completed: false,
        businessContext: "Risk management and decision trees"
      },
      {
        title: "Combinatorics in Business",
        description: "Permutations, combinations, and business applications",
        duration: "70 min",
        completed: false,
        businessContext: "Quality control, market research, survey design"
      },
      {
        title: "Advanced Forecasting Models",
        description: "Sequential growth models and probabilistic forecasting",
        duration: "90 min",
        completed: false,
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
  const [useInteractive, setUseInteractive] = useState(false);
  const { data: session } = useSession() || {};
  const module = moduleData[slug as keyof typeof moduleData];

  // Check if this module supports interactive learning
  const interactiveModules = ['linear-equations']; // Add more as we build them
  const supportsInteractive = interactiveModules.includes(slug);

  const handleLessonClick = (lesson: any) => {
    setSelectedLesson(lesson);
    setLessonModalOpen(true);
  };

  const handlePracticeClick = (practice: any) => {
    setSelectedPractice(practice);
    setPracticeModalOpen(true);
  };

  const handleInteractiveToggle = () => {
    setUseInteractive(!useInteractive);
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
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
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
            {module.topics.map((topic, index) => (
              <Card key={index} className={`${topic.completed ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        topic.completed ? 'bg-green-500' : 'bg-gray-200'
                      }`}>
                        {topic.completed ? (
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
                      variant={topic.completed ? "outline" : "default"}
                      onClick={() => handleLessonClick(topic)}
                    >
                      {topic.completed ? "Review" : "Start"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PlayCircle className="mr-2 h-5 w-5 text-blue-600" />
                      Lesson Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose max-w-none">
                      <h3>Key Concepts:</h3>
                      <ul>
                        <li>Understanding linear relationships in business contexts</li>
                        <li>Solving equations step-by-step</li>
                        <li>Real-world application examples</li>
                        <li>Common mistakes to avoid</li>
                      </ul>
                      
                      <h3>Interactive Example:</h3>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <p><strong>Problem:</strong> A company has fixed costs of $5,000 and variable costs of $15 per unit. If they sell each unit for $25, how many units do they need to sell to break even?</p>
                        <p className="mt-2"><strong>Solution:</strong></p>
                        <p>Let x = number of units to sell</p>
                        <p>Revenue = 25x</p>
                        <p>Total Cost = 5000 + 15x</p>
                        <p>Break-even: 25x = 5000 + 15x</p>
                        <p>10x = 5000</p>
                        <p>x = 500 units</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">✓ You've completed this lesson!</h3>
                  <p className="text-green-800">Great work! You can review this content anytime.</p>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setLessonModalOpen(false)} variant="outline">
              Close
            </Button>
            <Button onClick={() => {
              // Mark lesson as completed logic would go here
              setLessonModalOpen(false);
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

                <Card>
                  <CardHeader>
                    <CardTitle>Practice Questions</CardTitle>
                    <CardDescription>
                      Work through these problems to reinforce your understanding
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">Question 1 of {selectedPractice.questions}</h4>
                          <Badge variant="outline">Multiple Choice</Badge>
                        </div>
                        <p className="mb-4">A startup company has monthly fixed costs of $8,000. Their product costs $12 to make and sells for $20. How many units must they sell monthly to break even?</p>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="q1" value="a" className="text-blue-600" />
                            <span>A) 800 units</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="q1" value="b" className="text-blue-600" />
                            <span>B) 1,000 units</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="q1" value="c" className="text-blue-600" />
                            <span>C) 1,200 units</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="q1" value="d" className="text-blue-600" />
                            <span>D) 1,500 units</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">💡 Tip</h3>
                  <p className="text-yellow-800">Remember: Break-even occurs when Revenue = Total Cost</p>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setPracticeModalOpen(false)} variant="outline">
              Close
            </Button>
            <Button onClick={() => {
              // Submit practice logic would go here
              setPracticeModalOpen(false);
            }}>
              Submit Answers
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
