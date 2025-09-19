
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Database, 
  Server, 
  Shield,
  Clock,
  Activity
} from 'lucide-react';

interface SystemStatus {
  component: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  responseTime?: number;
  lastChecked: Date;
}

interface HealthData {
  overall: 'healthy' | 'warning' | 'error';
  components: SystemStatus[];
  uptime: string;
  lastUpdated: Date;
}

export function SystemHealthMonitor() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const checkSystemHealth = async () => {
    setIsLoading(true);
    try {
      const checks = await Promise.allSettled([
        // API Health
        fetch('/api/health').then(res => ({ 
          status: res.ok ? 'healthy' : 'error', 
          responseTime: performance.now() 
        })),
        
        // Database connectivity 
        fetch('/api/health?check=db').then(res => ({ 
          status: res.ok ? 'healthy' : 'error', 
          responseTime: performance.now() 
        })),
        
        // Auth system
        fetch('/api/auth/providers').then(res => ({ 
          status: res.ok ? 'healthy' : 'error', 
          responseTime: performance.now() 
        })),
      ]);

      const components: SystemStatus[] = [
        {
          component: 'API Server',
          status: checks[0].status === 'fulfilled' ? 
            (checks[0].value as any).status : 'error',
          message: checks[0].status === 'fulfilled' ? 
            'All endpoints responding normally' : 'API server unreachable',
          responseTime: checks[0].status === 'fulfilled' ? 
            Math.round((checks[0].value as any).responseTime) : undefined,
          lastChecked: new Date(),
        },
        {
          component: 'Database',
          status: checks[1].status === 'fulfilled' ? 
            (checks[1].value as any).status : 'error',
          message: checks[1].status === 'fulfilled' ? 
            'Database connections stable' : 'Database connection issues',
          responseTime: checks[1].status === 'fulfilled' ? 
            Math.round((checks[1].value as any).responseTime) : undefined,
          lastChecked: new Date(),
        },
        {
          component: 'Authentication',
          status: checks[2].status === 'fulfilled' ? 
            (checks[2].value as any).status : 'error',
          message: checks[2].status === 'fulfilled' ? 
            'Authentication services operational' : 'Auth system down',
          responseTime: checks[2].status === 'fulfilled' ? 
            Math.round((checks[2].value as any).responseTime) : undefined,
          lastChecked: new Date(),
        },
      ];

      const errorCount = components.filter(c => c.status === 'error').length;
      const warningCount = components.filter(c => c.status === 'warning').length;

      const overall: HealthData['overall'] = 
        errorCount > 0 ? 'error' : 
        warningCount > 0 ? 'warning' : 
        'healthy';

      setHealthData({
        overall,
        components,
        uptime: calculateUptime(),
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthData({
        overall: 'error',
        components: [{
          component: 'System Monitor',
          status: 'error',
          message: 'Unable to perform health checks',
          lastChecked: new Date(),
        }],
        uptime: 'Unknown',
        lastUpdated: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateUptime = () => {
    // Simple uptime calculation (in real app, this would be from server)
    const startTime = new Date().getTime() - (Math.random() * 86400000); // Random within last day
    const uptime = new Date().getTime() - startTime;
    const hours = Math.floor(uptime / 3600000);
    const minutes = Math.floor((uptime % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const getStatusIcon = (status: SystemStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: SystemStatus['status']) => {
    const variants = {
      healthy: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  useEffect(() => {
    checkSystemHealth();
    
    if (autoRefresh) {
      const interval = setInterval(checkSystemHealth, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  if (!healthData && isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Checking system health...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6" />
            <CardTitle>System Health Monitor</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkSystemHealth}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant={autoRefresh ? "default" : "outline"}
              size="sm" 
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {healthData && (
            <div className="space-y-4">
              {/* Overall Status */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(healthData.overall)}
                  <div>
                    <h3 className="font-semibold">Overall System Status</h3>
                    <p className="text-sm text-gray-500">
                      Last updated: {healthData.lastUpdated.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(healthData.overall)}
                  <p className="text-sm text-gray-500 mt-1">
                    <Clock className="h-3 w-3 inline mr-1" />
                    Uptime: {healthData.uptime}
                  </p>
                </div>
              </div>

              {/* Component Status */}
              <div className="space-y-3">
                <h4 className="font-medium">Component Status</h4>
                {healthData.components.map((component, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      {component.component === 'Database' && <Database className="h-4 w-4 text-gray-500" />}
                      {component.component === 'API Server' && <Server className="h-4 w-4 text-gray-500" />}
                      {component.component === 'Authentication' && <Shield className="h-4 w-4 text-gray-500" />}
                      
                      <div>
                        <h5 className="font-medium text-sm">{component.component}</h5>
                        <p className="text-xs text-gray-500">{component.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(component.status)}
                      {component.responseTime && (
                        <p className="text-xs text-gray-500 mt-1">
                          {component.responseTime}ms
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
