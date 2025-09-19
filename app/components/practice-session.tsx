
'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { CheckCircle, X, Calculator, Trophy, Target, Clock } from 'lucide-react';

interface PracticeQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'input' | 'calculation';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  businessContext: string;
}

interface PracticeSessionProps {
  moduleSlug: string;
  practiceTitle: string;
  onComplete: (score: number, totalQuestions: number) => void;
  onClose: () => void;
}

const practiceData: Record<string, Record<string, PracticeQuestion[]>> = {
  'linear-equations': {
    'Cost Analysis Problems': [
      {
        id: 'q1',
        question: 'A tax service charges $31.50 base fee plus $32 per hour. What is the total cost for 3.5 hours of service?',
        type: 'calculation',
        correctAnswer: '143.50',
        explanation: 'Total cost = $31.50 + ($32 × 3.5) = $31.50 + $112 = $143.50',
        points: 10,
        businessContext: 'Service pricing calculation'
      },
      {
        id: 'q2',
        question: 'A company\'s monthly cost is $8,000 fixed plus $15 per unit produced. If the total monthly cost is $23,000, how many units were produced?',
        type: 'calculation',
        correctAnswer: '1000',
        explanation: '$23,000 = $8,000 + $15x. Solving: $15x = $15,000, so x = 1,000 units',
        points: 15,
        businessContext: 'Production cost analysis'
      },
      {
        id: 'q3',
        question: 'Which equation represents a company with $5,000 fixed costs and $25 variable cost per unit?',
        type: 'multiple-choice',
        options: [
          'C = 5000 + 25x',
          'C = 25 + 5000x',
          'C = 5000x + 25',
          'C = 25x - 5000'
        ],
        correctAnswer: 'C = 5000 + 25x',
        explanation: 'Total cost = Fixed costs + (Variable cost per unit × number of units)',
        points: 10,
        businessContext: 'Cost function modeling'
      },
      {
        id: 'q4',
        question: 'A rental car company charges $45/day plus $0.25/mile. If your bill is $127.50 for one day, how many miles did you drive?',
        type: 'calculation',
        correctAnswer: '330',
        explanation: '$127.50 = $45 + $0.25m. Solving: $0.25m = $82.50, so m = 330 miles',
        points: 15,
        businessContext: 'Transportation cost calculation'
      }
    ],
    'Break-even Analysis': [
      {
        id: 'q5',
        question: 'A bakery has fixed costs of $2,000/month, sells cakes for $20 each, and has variable costs of $8 per cake. What is the break-even quantity?',
        type: 'calculation',
        correctAnswer: '167',
        explanation: 'Break-even = Fixed Costs ÷ (Price - Variable Cost) = $2,000 ÷ ($20 - $8) = $2,000 ÷ $12 = 166.67, so 167 cakes (rounded up)',
        points: 20,
        businessContext: 'Break-even analysis'
      },
      {
        id: 'q6',
        question: 'If a company\'s contribution margin per unit is $15 and fixed costs are $45,000, what is the break-even point in units?',
        type: 'calculation',
        correctAnswer: '3000',
        explanation: 'Break-even point = Fixed Costs ÷ Contribution Margin = $45,000 ÷ $15 = 3,000 units',
        points: 15,
        businessContext: 'Contribution margin analysis'
      }
    ]
  }
};

export function PracticeSession({ moduleSlug, practiceTitle, onComplete, onClose }: PracticeSessionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);

  const questions = practiceData[moduleSlug]?.[practiceTitle] || [];
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const handleAnswerSelect = (answer: string) => {
    setUserAnswers({ ...userAnswers, [questions[currentQuestion].id]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleComplete = () => {
    const score = calculateScore();
    onComplete(score, questions.length);
    setSessionComplete(true);
  };

  const calculateScore = () => {
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach((question) => {
      totalPoints += question.points;
      const userAnswer = userAnswers[question.id];
      if (userAnswer && isAnswerCorrect(question, userAnswer)) {
        earnedPoints += question.points;
      }
    });

    return Math.round((earnedPoints / totalPoints) * 100);
  };

  const isAnswerCorrect = (question: PracticeQuestion, answer: string) => {
    return answer.trim().toLowerCase() === question.correctAnswer.toLowerCase();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!questions.length) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Practice Not Available</h3>
        <p className="text-gray-600 mb-4">This practice session is being prepared.</p>
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }

  if (sessionComplete) {
    const score = calculateScore();
    return (
      <div className="p-6 text-center space-y-6">
        <div className="flex justify-center">
          <Trophy className="h-16 w-16 text-yellow-500" />
        </div>
        <h3 className="text-2xl font-bold text-green-700">Practice Complete! 🎉</h3>
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-700">{score}%</p>
              <p className="text-green-600">Final Score</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">{formatTime(timeSpent)}</p>
              <p className="text-green-600">Time Spent</p>
            </div>
          </div>
        </div>
        <Button onClick={onClose}>Continue Learning</Button>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const correctAnswers = questions.filter(q => isAnswerCorrect(q, userAnswers[q.id])).length;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Practice Results</h2>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{score}%</p>
              <p className="text-blue-600 text-sm">Score</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{correctAnswers}/{questions.length}</p>
              <p className="text-green-600 text-sm">Correct</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{formatTime(timeSpent)}</p>
              <p className="text-purple-600 text-sm">Time</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {questions.map((question, index) => {
            const userAnswer = userAnswers[question.id];
            const isCorrect = isAnswerCorrect(question, userAnswer);
            
            return (
              <Card key={question.id} className="border-l-4" style={{borderLeftColor: isCorrect ? '#10b981' : '#ef4444'}}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Question {index + 1}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                      <Badge variant={isCorrect ? "default" : "destructive"}>
                        {isCorrect ? `+${question.points}` : '0'} pts
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{question.question}</p>
                  <div className="text-sm space-y-1">
                    <p><strong>Your answer:</strong> {userAnswer || 'No answer'}</p>
                    <p><strong>Correct answer:</strong> {question.correctAnswer}</p>
                    <p className="text-gray-600"><strong>Explanation:</strong> {question.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button onClick={handleComplete} size="lg">
            Complete Practice Session
          </Button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const userAnswer = userAnswers[question.id];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">{practiceTitle}</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{formatTime(timeSpent)}</span>
            </div>
            <Badge variant="outline">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-orange-500" />
            <span>Question {currentQuestion + 1}</span>
            <Badge variant="secondary">{question.points} points</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">{question.question}</p>
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Business Context:</strong> {question.businessContext}
            </p>
          </div>

          {question.type === 'multiple-choice' && question.options ? (
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                    userAnswer === option ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter your answer:</label>
              <input
                type="text"
                value={userAnswer || ''}
                onChange={(e) => handleAnswerSelect(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          variant="outline"
        >
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!userAnswer}
        >
          {currentQuestion === questions.length - 1 ? 'Finish Practice' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
}
