
'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { CheckCircle, ArrowRight, ArrowLeft, Calculator, Lightbulb, Target, Trophy } from 'lucide-react';

interface LessonStep {
  id: string;
  type: 'concept' | 'example' | 'practice' | 'summary';
  title: string;
  content: string;
  example?: {
    problem: string;
    solution: string;
    steps: string[];
  };
  questions?: Array<{
    id: string;
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
    type: 'multiple-choice' | 'input' | 'calculation';
  }>;
}

interface InteractiveLessonProps {
  moduleSlug: string;
  lessonTitle: string;
  onComplete: () => void;
  onClose: () => void;
}

const lessonData: Record<string, Record<string, LessonStep[]>> = {
  'linear-equations': {
    'Linear Equations in One Variable': [
      {
        id: 'concept-1',
        type: 'concept',
        title: 'Understanding Linear Equations',
        content: 'A linear equation in one variable has the form ax + b = c, where a ≠ 0. In business, these equations model relationships with constant rates of change, like cost structures, pricing models, and break-even analysis.'
      },
      {
        id: 'example-1',
        type: 'example',
        title: 'Business Application Example',
        content: 'Let\'s solve a real business problem using linear equations.',
        example: {
          problem: 'A consulting firm charges $2,500 flat rate plus $150 per hour. If a client\'s bill is $8,750, how many hours were provided?',
          solution: 'h = 41.67 hours',
          steps: [
            'Set up the equation: 2500 + 150h = 8750',
            'Subtract 2500 from both sides: 150h = 6250',
            'Divide by 150: h = 6250 ÷ 150',
            'Calculate: h = 41.67 hours'
          ]
        }
      },
      {
        id: 'practice-1',
        type: 'practice',
        title: 'Practice Problem',
        content: 'Now try solving this problem yourself.',
        questions: [
          {
            id: 'q1',
            question: 'A car rental company charges $45 per day plus $0.25 per mile. If your total bill is $127.50, how many miles did you drive?',
            type: 'calculation',
            correctAnswer: '330',
            explanation: 'Set up: 45 + 0.25m = 127.50. Solving: 0.25m = 82.50, so m = 330 miles.'
          }
        ]
      },
      {
        id: 'summary-1',
        type: 'summary',
        title: 'Key Takeaways',
        content: 'You\'ve learned to solve linear equations and apply them to business scenarios. Key skills: setting up equations from word problems, isolating variables, and interpreting solutions in business context.'
      }
    ],
    'Break-even Analysis Mastery': [
      {
        id: 'concept-2',
        type: 'concept',
        title: 'Break-Even Analysis Fundamentals',
        content: 'Break-even analysis finds the point where total revenue equals total costs. Formula: Revenue = Fixed Costs + Variable Costs, or R = FC + VC.'
      },
      {
        id: 'example-2',
        type: 'example',
        title: 'Break-Even Calculation',
        content: 'Let\'s calculate the break-even point for a business.',
        example: {
          problem: 'A bakery has fixed costs of $3,000/month, variable costs of $2 per cake, and sells cakes for $8 each. Find break-even quantity.',
          solution: 'Break-even: 500 cakes',
          steps: [
            'Revenue per cake: $8',
            'Variable cost per cake: $2',
            'Contribution margin: $8 - $2 = $6',
            'Break-even quantity: $3,000 ÷ $6 = 500 cakes'
          ]
        }
      },
      {
        id: 'practice-2',
        type: 'practice',
        title: 'Break-Even Practice',
        content: 'Calculate the break-even point for this scenario.',
        questions: [
          {
            id: 'q2',
            question: 'A software company has monthly fixed costs of $50,000, variable costs of $20 per user, and charges $80 per user. What is the break-even number of users?',
            type: 'calculation',
            correctAnswer: '833',
            explanation: 'Contribution margin: $80 - $20 = $60. Break-even: $50,000 ÷ $60 = 833.33, so 834 users (rounded up).'
          }
        ]
      }
    ]
  },
  'systems-linear-equations': {
    'Introduction to Systems of Linear Equations': [
      {
        id: 'concept-s1',
        type: 'concept',
        title: 'Understanding Systems of Linear Equations',
        content: 'A system of linear equations consists of two or more linear equations that share the same variables. In business, systems help solve problems with multiple constraints and relationships, such as production planning, resource allocation, and supply-demand analysis.'
      },
      {
        id: 'example-s1',
        type: 'example',
        title: 'Business Problem: Production Planning',
        content: 'Let\'s solve a real business system using elimination method.',
        example: {
          problem: 'A furniture company makes chairs and tables. Each chair requires 2 hours of labor and 1 unit of wood. Each table requires 3 hours of labor and 2 units of wood. If they have 200 hours of labor and 120 units of wood available, how many chairs (x) and tables (y) can they make to use all resources?',
          solution: 'Chairs: 40, Tables: 40',
          steps: [
            'Set up the system: 2x + 3y = 200 (labor), x + 2y = 120 (wood)',
            'Solve the second equation for x: x = 120 - 2y',
            'Substitute into first equation: 2(120 - 2y) + 3y = 200',
            'Simplify: 240 - 4y + 3y = 200',
            'Solve for y: -y = -40, so y = 40',
            'Find x: x = 120 - 2(40) = 40'
          ]
        }
      },
      {
        id: 'practice-s1',
        type: 'practice',
        title: 'System Practice Problem',
        content: 'Now solve this production system yourself.',
        questions: [
          {
            id: 'qs1',
            question: 'A bakery makes muffins and cookies. Muffins need 2 cups of flour and 1 egg each. Cookies need 1 cup of flour and 2 eggs each. With 50 cups of flour and 40 eggs available, how many muffins can they make if they use all ingredients? (Let x = muffins, y = cookies)',
            type: 'calculation',
            correctAnswer: '20',
            explanation: 'System: 2x + y = 50, x + 2y = 40. Solving: x = 20 muffins, y = 10 cookies.'
          }
        ]
      },
      {
        id: 'summary-s1',
        type: 'summary',
        title: 'Systems Method Mastery',
        content: 'You\'ve learned to solve systems using substitution and elimination. Key business applications: resource allocation, production optimization, and constraint analysis.'
      }
    ],
    'Solving Systems by Graphing': [
      {
        id: 'concept-s2',
        type: 'concept',
        title: 'Graphical Solutions in Business',
        content: 'Graphing systems shows the intersection point where both constraints are satisfied. This visual method is excellent for understanding feasible regions in business optimization problems.'
      },
      {
        id: 'example-s2',
        type: 'example',
        title: 'Supply and Demand Intersection',
        content: 'Find market equilibrium using graphical method.',
        example: {
          problem: 'Supply: P = 10 + 2Q, Demand: P = 50 - 3Q. Find equilibrium price and quantity where supply meets demand.',
          solution: 'Q = 8, P = 26',
          steps: [
            'Set equations equal: 10 + 2Q = 50 - 3Q',
            'Combine like terms: 5Q = 40',
            'Solve: Q = 8 units',
            'Find price: P = 10 + 2(8) = 26',
            'Verify: P = 50 - 3(8) = 26 ✓'
          ]
        }
      },
      {
        id: 'practice-s2',
        type: 'practice',
        title: 'Market Analysis Practice',
        content: 'Find the market equilibrium point.',
        questions: [
          {
            id: 'qs2',
            question: 'Given supply equation S = 5 + Q and demand equation D = 20 - 2Q, find the equilibrium quantity.',
            type: 'calculation',
            correctAnswer: '5',
            explanation: 'Set equal: 5 + Q = 20 - 2Q. Solving: 3Q = 15, so Q = 5 units.'
          }
        ]
      }
    ],
    'Business Applications of Systems': [
      {
        id: 'concept-s3',
        type: 'concept',
        title: 'Advanced Business System Modeling',
        content: 'Complex business problems often involve multiple variables and constraints. Systems help model investment portfolios, staffing optimization, pricing strategies, and break-even analysis with multiple products.'
      },
      {
        id: 'example-s3',
        type: 'example',
        title: 'Multi-Product Break-Even Analysis',
        content: 'Solve break-even for a company with two products.',
        example: {
          problem: 'Company ABC makes Product A (profit $5 each) and Product B (profit $8 each). Fixed costs are $2,000. They want to produce twice as many A\'s as B\'s. How many of each to break even?',
          solution: 'A: 222 units, B: 111 units',
          steps: [
            'Let x = Product A, y = Product B',
            'Profit equation: 5x + 8y = 2000 (break-even)',
            'Constraint: x = 2y (twice as many A\'s)',
            'Substitute: 5(2y) + 8y = 2000',
            'Simplify: 10y + 8y = 2000, so 18y = 2000',
            'Solve: y = 111.11 ≈ 111, x = 222'
          ]
        }
      },
      {
        id: 'practice-s3',
        type: 'practice',
        title: 'Multi-Product Analysis',
        content: 'Solve this business optimization problem.',
        questions: [
          {
            id: 'qs3',
            question: 'A company makes widgets ($3 profit) and gadgets ($7 profit). They need $240 total profit. If they make 3 times as many widgets as gadgets, how many gadgets should they make?',
            type: 'calculation',
            correctAnswer: '15',
            explanation: 'Let g = gadgets, w = widgets. System: 3w + 7g = 240, w = 3g. Substituting: 3(3g) + 7g = 240, so 9g + 7g = 240, therefore 16g = 240, g = 15 gadgets.'
          }
        ]
      }
    ]
  }
};

export function InteractiveLesson({ moduleSlug, lessonTitle, onComplete, onClose }: InteractiveLessonProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});
  const [lessonComplete, setLessonComplete] = useState(false);

  const steps = lessonData[moduleSlug]?.[lessonTitle] || [];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleAnswerSubmit = (questionId: string, answer: string) => {
    setUserAnswers({ ...userAnswers, [questionId]: answer });
    setShowFeedback({ ...showFeedback, [questionId]: true });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setLessonComplete(true);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  const currentStepData = steps[currentStep];

  if (!currentStepData) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Lesson Not Available</h3>
        <p className="text-gray-600 mb-4">This lesson content is being prepared.</p>
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }

  if (lessonComplete) {
    return (
      <div className="p-6 text-center space-y-6">
        <div className="flex justify-center">
          <Trophy className="h-16 w-16 text-yellow-500" />
        </div>
        <h3 className="text-2xl font-bold text-green-700">Lesson Complete! 🎉</h3>
        <p className="text-lg text-gray-700">
          Excellent work! You've successfully completed "{lessonTitle}".
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={onClose} variant="outline">Review Lesson</Button>
          <Button onClick={handleComplete}>Mark Complete & Continue</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">{lessonTitle}</h2>
          <Badge variant="outline">Step {currentStep + 1} of {steps.length}</Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {currentStepData.type === 'concept' && <Lightbulb className="h-5 w-5 text-blue-500" />}
            {currentStepData.type === 'example' && <Calculator className="h-5 w-5 text-green-500" />}
            {currentStepData.type === 'practice' && <Target className="h-5 w-5 text-orange-500" />}
            {currentStepData.type === 'summary' && <CheckCircle className="h-5 w-5 text-purple-500" />}
            <span>{currentStepData.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 leading-relaxed">{currentStepData.content}</p>

          {/* Example Section */}
          {currentStepData.example && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Example Problem:</h4>
              <p className="text-blue-800 mb-3">{currentStepData.example.problem}</p>
              
              <h5 className="font-semibold text-blue-900 mb-2">Solution Steps:</h5>
              <ol className="list-decimal list-inside space-y-1 text-blue-800">
                {currentStepData.example.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
              
              <div className="mt-3 p-3 bg-green-100 rounded border border-green-200">
                <p className="font-semibold text-green-800">Answer: {currentStepData.example.solution}</p>
              </div>
            </div>
          )}

          {/* Practice Questions */}
          {currentStepData.questions && (
            <div className="space-y-4">
              {currentStepData.questions.map((question) => (
                <PracticeQuestion
                  key={question.id}
                  question={question}
                  userAnswer={userAnswers[question.id]}
                  showFeedback={showFeedback[question.id]}
                  onSubmit={(answer) => handleAnswerSubmit(question.id, answer)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        <Button onClick={handleNext}>
          {currentStep === steps.length - 1 ? 'Finish Lesson' : 'Next'}
          {currentStep < steps.length - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

interface PracticeQuestionProps {
  question: {
    id: string;
    question: string;
    type: 'multiple-choice' | 'input' | 'calculation';
    correctAnswer: string;
    explanation: string;
  };
  userAnswer?: string;
  showFeedback?: boolean;
  onSubmit: (answer: string) => void;
}

function PracticeQuestion({ question, userAnswer, showFeedback, onSubmit }: PracticeQuestionProps) {
  const [answer, setAnswer] = useState(userAnswer || '');
  const [submitted, setSubmitted] = useState(!!userAnswer);

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer);
      setSubmitted(true);
    }
  };

  const isCorrect = answer.trim().toLowerCase() === question.correctAnswer.toLowerCase();

  return (
    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
      <h4 className="font-semibold text-orange-900 mb-3">Practice Problem:</h4>
      <p className="text-orange-800 mb-4">{question.question}</p>
      
      <div className="flex space-x-2 mb-3">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer..."
          className="flex-1 px-3 py-2 border rounded-md"
          disabled={submitted}
        />
        <Button
          onClick={handleSubmit}
          disabled={!answer.trim() || submitted}
        >
          Submit
        </Button>
      </div>

      {showFeedback && submitted && (
        <div className={`p-3 rounded-md ${isCorrect ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className={`h-5 w-5 ${isCorrect ? 'text-green-600' : 'text-red-600'}`} />
            <span className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
              {isCorrect ? 'Correct!' : 'Not quite right'}
            </span>
          </div>
          <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
            {question.explanation}
          </p>
          {!isCorrect && (
            <p className="text-red-700 mt-2">
              <strong>Correct answer:</strong> {question.correctAnswer}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
