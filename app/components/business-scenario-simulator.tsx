
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  Target,
  PlayCircle,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const businessScenarios = {
  'linear-equations': {
    title: "Coffee Shop Break-Even Analysis",
    description: "Run your own coffee shop and discover the break-even point through interactive calculations.",
    variables: {
      fixedCosts: { label: "Fixed Costs (per day)", default: 200, min: 100, max: 500 },
      variableCost: { label: "Variable Cost (per cup)", default: 1.5, min: 1, max: 3, step: 0.1 },
      sellPrice: { label: "Selling Price (per cup)", default: 4.0, min: 2, max: 8, step: 0.1 }
    },
    insights: [
      "Higher selling prices reduce break-even quantity",
      "Fixed costs create a baseline that must be covered daily", 
      "Variable costs affect profit margin per unit"
    ]
  },
  'functions-graphs': {
    title: "Subscription Service Pricing Strategy",
    description: "Design a tiered subscription model and analyze customer value optimization.",
    variables: {
      basicPrice: { label: "Basic Plan Price", default: 8.99, min: 5, max: 15, step: 0.01 },
      standardPrice: { label: "Standard Plan Price", default: 13.99, min: 10, max: 20, step: 0.01 },
      premiumPrice: { label: "Premium Plan Price", default: 17.99, min: 15, max: 30, step: 0.01 }
    },
    insights: [
      "Optimal pricing balances customer value and revenue",
      "Tiered pricing captures different customer segments",
      "Price gaps between tiers affect upgrade incentives"
    ]
  },
  'quadratic-functions': {
    title: "Manufacturing Profit Optimization",
    description: "Optimize production levels for maximum profit using quadratic profit functions.",
    variables: {
      setupCost: { label: "Setup Cost", default: 2000000, min: 1000000, max: 5000000, step: 100000 },
      marginalRevenue: { label: "Marginal Revenue", default: 800, min: 500, max: 1200 },
      scalingFactor: { label: "Scaling Factor", default: 0.05, min: 0.01, max: 0.1, step: 0.01 }
    },
    insights: [
      "Production has an optimal level due to capacity constraints",
      "Economies of scale initially increase profitability",
      "Overproduction leads to diminishing returns"
    ]
  }
};

interface BusinessScenarioSimulatorProps {
  moduleSlug: string;
}

export function BusinessScenarioSimulator({ moduleSlug }: BusinessScenarioSimulatorProps) {
  const scenario = businessScenarios[moduleSlug as keyof typeof businessScenarios];
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [results, setResults] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeInsight, setActiveInsight] = useState(0);

  useEffect(() => {
    if (scenario) {
      const defaultInputs: Record<string, number> = {};
      Object.entries(scenario.variables).forEach(([key, variable]) => {
        defaultInputs[key] = variable.default;
      });
      setInputs(defaultInputs);
    }
  }, [scenario]);

  useEffect(() => {
    if (Object.keys(inputs).length > 0) {
      calculateResults();
    }
  }, [inputs]);

  const calculateResults = () => {
    if (!scenario) return;

    let newResults: any = {};
    let newChartData: any[] = [];

    switch (moduleSlug) {
      case 'linear-equations':
        const { fixedCosts, variableCost, sellPrice } = inputs;
        const breakEvenPoint = fixedCosts / (sellPrice - variableCost);
        newResults = {
          breakEvenPoint: Math.round(breakEvenPoint),
          dailyRevenue: Math.round(breakEvenPoint * sellPrice),
          profitMargin: ((sellPrice - variableCost) / sellPrice * 100).toFixed(1)
        };

        // Generate chart data
        for (let cups = 0; cups <= breakEvenPoint * 2; cups += 10) {
          const revenue = cups * sellPrice;
          const totalCost = fixedCosts + (cups * variableCost);
          const profit = revenue - totalCost;
          newChartData.push({
            cups,
            revenue: Math.round(revenue),
            cost: Math.round(totalCost),
            profit: Math.round(profit)
          });
        }
        break;

      case 'functions-graphs':
        const { basicPrice, standardPrice, premiumPrice } = inputs;
        newResults = {
          priceGaps: {
            basicToStandard: ((standardPrice - basicPrice) / basicPrice * 100).toFixed(1),
            standardToPremium: ((premiumPrice - standardPrice) / standardPrice * 100).toFixed(1)
          },
          totalValue: (basicPrice + standardPrice + premiumPrice).toFixed(2),
          averagePrice: ((basicPrice + standardPrice + premiumPrice) / 3).toFixed(2)
        };

        // Generate pricing visualization data
        newChartData = [
          { tier: 'Basic', price: basicPrice, features: 2 },
          { tier: 'Standard', price: standardPrice, features: 4 },
          { tier: 'Premium', price: premiumPrice, features: 8 }
        ];
        break;

      case 'quadratic-functions':
        const { setupCost, marginalRevenue, scalingFactor } = inputs;
        const optimalProduction = marginalRevenue / (2 * scalingFactor);
        const maxProfit = -scalingFactor * Math.pow(optimalProduction, 2) + marginalRevenue * optimalProduction - setupCost;
        
        newResults = {
          optimalProduction: Math.round(optimalProduction),
          maxProfit: Math.round(maxProfit),
          profitability: maxProfit > 0 ? 'Profitable' : 'Loss'
        };

        // Generate profit curve data
        for (let x = 0; x <= optimalProduction * 2; x += optimalProduction / 20) {
          const profit = -scalingFactor * Math.pow(x, 2) + marginalRevenue * x - setupCost;
          newChartData.push({
            production: Math.round(x),
            profit: Math.round(profit)
          });
        }
        break;
    }

    setResults(newResults);
    setChartData(newChartData);
  };

  const handleInputChange = (key: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [key]: numValue }));
  };

  const resetToDefaults = () => {
    if (scenario) {
      const defaultInputs: Record<string, number> = {};
      Object.entries(scenario.variables).forEach(([key, variable]) => {
        defaultInputs[key] = variable.default;
      });
      setInputs(defaultInputs);
    }
  };

  if (!scenario) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Business scenario simulator not available for this module.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <Calculator className="mr-2 h-6 w-6" />
            {scenario.title}
          </CardTitle>
          <CardDescription className="text-blue-700">
            {scenario.description}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Business Variables
            </CardTitle>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={resetToDefaults}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(scenario.variables).map(([key, variable]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{variable.label}</Label>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <Input
                    id={key}
                    type="number"
                    value={inputs[key] || variable.default}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    min={variable.min}
                    max={variable.max}
                    step={'step' in variable ? variable.step : 1}
                    className="flex-1"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Business Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results && (
              <div className="space-y-4">
                {moduleSlug === 'linear-equations' && (
                  <>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-green-600 mb-1">Break-Even Point</div>
                      <div className="text-2xl font-bold text-green-900">{results.breakEvenPoint} cups/day</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-sm text-blue-600">Daily Revenue</div>
                        <div className="font-semibold">${results.dailyRevenue}</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <div className="text-sm text-purple-600">Profit Margin</div>
                        <div className="font-semibold">{results.profitMargin}%</div>
                      </div>
                    </div>
                  </>
                )}

                {moduleSlug === 'functions-graphs' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-sm text-blue-600">Basic → Standard</div>
                        <div className="font-semibold">+{results.priceGaps.basicToStandard}%</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <div className="text-sm text-purple-600">Standard → Premium</div>
                        <div className="font-semibold">+{results.priceGaps.standardToPremium}%</div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-green-600 mb-1">Average Price</div>
                      <div className="text-2xl font-bold text-green-900">${results.averagePrice}</div>
                    </div>
                  </>
                )}

                {moduleSlug === 'quadratic-functions' && (
                  <>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-green-600 mb-1">Optimal Production</div>
                      <div className="text-2xl font-bold text-green-900">{results.optimalProduction} units</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-sm text-blue-600">Max Profit</div>
                        <div className="font-semibold">${results.maxProfit?.toLocaleString()}</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <div className="text-sm text-purple-600">Status</div>
                        <Badge variant={results.profitability === 'Profitable' ? 'default' : 'destructive'}>
                          {results.profitability}
                        </Badge>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Interactive Visualization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {moduleSlug === 'linear-equations' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="cups" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" strokeWidth={2} />
                    <Line type="monotone" dataKey="cost" stroke="#82ca9d" name="Total Cost" strokeWidth={2} />
                    <Line type="monotone" dataKey="profit" stroke="#ffc658" name="Profit" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : moduleSlug === 'quadratic-functions' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="production" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="profit" stroke="#8884d8" name="Profit" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Visualization not available for this module
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Business Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scenario.insights.map((insight, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  activeInsight === index 
                    ? 'bg-blue-100 border-l-4 border-blue-500' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setActiveInsight(index)}
              >
                <div className="flex items-center">
                  <PlayCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                  <span className="text-sm">{insight}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
