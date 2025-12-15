
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  ArrowRight, 
  ArrowLeft,
  Calculator,
  Target,
  Timer,
  Award,
  HelpCircle,
  Play,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Problem {
  id: string;
  title: string;
  description: string;
  businessContext: string;
  problemStatement: string;
  type: 'multiple-choice' | 'step-by-step' | 'fill-blank';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  hints?: string[];
  choices?: string[];
  steps?: {
    instruction: string;
    hint?: string;
    explanation?: string;
  }[];
}

interface InteractiveProblemProps {
  problem: Problem;
  moduleSlug: string; // Added for analytics tracking
  onComplete: (score: number, timeSpent: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  problemNumber?: number;
  totalProblems?: number;
}

export function InteractiveProblem({
  problem,
  moduleSlug,
  onComplete,
  onNext,
  onPrevious,
  isFirst = false,
  isLast = false,
  problemNumber = 1,
  totalProblems = 1
}: InteractiveProblemProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState<string>('');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = () => {
    if (problem.type === 'step-by-step') {
      return ((currentStep) / (problem.steps?.length || 1)) * 100;
    }
    return isCompleted ? 100 : 0;
  };

  const handleAnswer = async (answer: string) => {
    setIsLoading(true);
    setAttempts(prev => prev + 1);
    
    try {
      const response = await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          answer,
          stepIndex: problem.type === 'step-by-step' ? currentStep : undefined,
          action: 'evaluate'
        })
      });

      const result = await response.json();
      
      setIsCorrect(result.isCorrect);
      setFeedback(result.feedback);

      if (result.isCorrect) {
        const newAnswers = [...userAnswers];
        newAnswers[currentStep] = answer;
        setUserAnswers(newAnswers);

        if (problem.type === 'step-by-step') {
          if (currentStep < (problem.steps?.length || 1) - 1) {
            // Move to next step
            setTimeout(() => {
              setCurrentStep(prev => prev + 1);
              setIsCorrect(null);
              setFeedback('');
              setShowHint(false);
            }, 1500);
          } else {
            // Problem completed
            completeProblems(result.score || problem.points);
          }
        } else {
          // Single-step problem completed
          completeProblems(result.score || problem.points);
        }
      }
    } catch (error) {
      setFeedback('Error evaluating answer. Please try again.');
      setIsCorrect(false);
    } finally {
      setIsLoading(false);
    }
  };

  const completeProblems = (earnedScore: number) => {
    setIsCompleted(true);
    setScore(earnedScore);
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    
    // Track successful problem completion
    trackProblemAttempt(true, timeSpent, earnedScore.toString());
    
    onComplete(earnedScore, timeSpent);
  };

  // Analytics tracking function for problem attempts
  const trackProblemAttempt = async (isCorrect: boolean, timeSpent: number, answer: string = '') => {
    try {
      await fetch('/api/analytics/problem-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          moduleSlug,
          isCorrect,
          hintsUsedCount: hintsUsed,
          timeSpent,
          answer,
        }),
      });
    } catch (error) {
      // Silent fail - don't disrupt user experience
      console.error('Error tracking problem attempt:', error);
    }
  };

  const getHint = async () => {
    try {
      const response = await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          action: 'get_hint',
          hintIndex: hintsUsed
        })
      });

      const result = await response.json();
      if (result.hint) {
        setCurrentHint(result.hint);
        setShowHint(true);
        setHintsUsed(prev => prev + 1);
        
        // Track hint usage analytics
        trackHintUsage(hintsUsed);
      } else if (result.message) {
        setCurrentHint(result.message);
        setShowHint(true);
      }
    } catch (error) {
      console.error('Error fetching hint:', error);
      setCurrentHint('Unable to load hint. Please try again.');
      setShowHint(true);
    }
  };

  // Analytics tracking function for hint usage
  const trackHintUsage = async (hintIndex: number) => {
    try {
      await fetch('/api/analytics/hint-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          moduleSlug,
          hintIndex,
        }),
      });
    } catch (error) {
      // Silent fail - don't disrupt user experience
      console.error('Error tracking hint usage:', error);
    }
  };

  const resetProblem = () => {
    setCurrentStep(0);
    setUserAnswers([]);
    setFeedback('');
    setIsCorrect(null);
    setHintsUsed(0);
    setCurrentHint('');
    setShowHint(false);
    setAttempts(0);
    setIsCompleted(false);
    setScore(0);
  };

  const renderMultipleChoice = () => (
    <div className="space-y-4">
      <div className="grid gap-3">
        {problem.choices?.map((choice, index) => (
          <Button
            key={index}
            variant="outline"
            className="justify-start text-left h-auto p-4 hover:bg-blue-50"
            onClick={() => handleAnswer(String.fromCharCode(65 + index))}
            disabled={isLoading || isCompleted}
          >
            <span className="font-semibold mr-3">{String.fromCharCode(65 + index)})</span>
            {choice.replace(/^[A-D]\)\s*/, '')}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderStepByStep = () => {
    const currentStepData = problem.steps?.[currentStep];
    if (!currentStepData) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-blue-600">
            Step {currentStep + 1} of {problem.steps?.length}
          </Badge>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Timer className="h-4 w-4" />
            {Math.round((Date.now() - startTime) / 1000)}s
          </div>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h4 className="font-semibold text-blue-900 mb-3">
              {currentStepData.instruction}
            </h4>
            <div className="space-y-3">
              <Input
                placeholder="Enter your answer here..."
                className="bg-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    handleAnswer(e.currentTarget.value.trim());
                    e.currentTarget.value = '';
                  }
                }}
                disabled={isLoading}
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const input = document.querySelector('input') as HTMLInputElement;
                    if (input?.value.trim()) {
                      handleAnswer(input.value.trim());
                      input.value = '';
                    }
                  }}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  Submit Answer
                </Button>
                <Button
                  variant="outline"
                  onClick={getHint}
                  disabled={isLoading || hintsUsed >= (problem.hints?.length || 0)}
                  className={hintsUsed >= (problem.hints?.length || 0) ? 'opacity-50' : ''}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Get Hint ({(problem.hints?.length || 0) - hintsUsed} available)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hint Display */}
        {showHint && currentHint && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <Lightbulb className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Hint {hintsUsed}:</strong> {currentHint}
            </AlertDescription>
          </Alert>
        )}

        {/* Progress Steps */}
        <div className="flex items-center space-x-2">
          {problem.steps?.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                index < currentStep
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <Calculator className="h-6 w-6 text-blue-600 mr-3" />
                {problem.title}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Problem {problemNumber} of {totalProblems} • {problem.description}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
              <div className="flex items-center">
                <Award className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="font-semibold">{problem.points} pts</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold text-blue-600">{Math.round(calculateProgress())}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Business Context */}
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Target className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <strong>Business Context:</strong> {problem.businessContext}
            </AlertDescription>
          </Alert>

          {/* Problem Statement */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Problem:</h3>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
              {problem.problemStatement}
            </p>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <Alert className={isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                  {isCorrect ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={isCorrect ? 'text-green-900' : 'text-red-900'}>
                    {feedback}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Problem Interface */}
          {!isCompleted ? (
            <div>
              {problem.type === 'multiple-choice' && renderMultipleChoice()}
              {problem.type === 'step-by-step' && renderStepByStep()}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Problem Completed! 🎉</h3>
              <p className="text-gray-600 mb-4">You earned {score} points!</p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span>Attempts: {attempts}</span>
                <span>•</span>
                <span>Hints Used: {hintsUsed}</span>
                <span>•</span>
                <span>Time: {Math.round((Date.now() - startTime) / 1000)}s</span>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <div className="flex space-x-2">
              {!isFirst && onPrevious && (
                <Button variant="outline" onClick={onPrevious}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              <Button variant="outline" onClick={resetProblem}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
            
            <div>
              {isCompleted && !isLast && onNext && (
                <Button onClick={onNext} className="bg-green-600 hover:bg-green-700">
                  Next Problem
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
              {isCompleted && isLast && (
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Complete Module
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
