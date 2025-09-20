
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Users, Plus, Mail, GraduationCap, CheckCircle, AlertCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
}

export function InstructorManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // New instructor form state
  const [newInstructor, setNewInstructor] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // This would need an API endpoint to fetch users
      // For now, we'll show the current setup
      setUsers([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@doe.com',
          firstName: 'John',
          lastName: 'Doe', 
          createdAt: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const createInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setMessage(null);

    try {
      const response = await fetch('/api/create-instructor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInstructor)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Instructor account created successfully!' });
        setNewInstructor({ email: '', firstName: '', lastName: '', password: '' });
        fetchUsers();
      } else {
        const error = await response.text();
        setMessage({ type: 'error', text: error || 'Failed to create instructor' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Instructor Management</h2>
        <Badge variant="outline" className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>{users.length} Total Users</span>
        </Badge>
      </div>

      {/* Current Setup Info */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Current Setup:</strong> All authenticated users can access the analytics dashboard. 
          The system is optimized for small-scale deployment with unified access.
        </AlertDescription>
      </Alert>

      {/* Create New Instructor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create New Instructor Account</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createInstructor} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <Input
                  type="text"
                  value={newInstructor.firstName}
                  onChange={(e) => setNewInstructor(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Dr. Sarah"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <Input
                  type="text"
                  value={newInstructor.lastName}
                  onChange={(e) => setNewInstructor(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Wilson"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <Input
                type="email"
                value={newInstructor.email}
                onChange={(e) => setNewInstructor(prev => ({ ...prev, email: e.target.value }))}
                placeholder="instructor@university.edu"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                value={newInstructor.password}
                onChange={(e) => setNewInstructor(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Min 8 characters"
                minLength={8}
                required
              />
            </div>

            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={creating} className="w-full">
              {creating ? 'Creating...' : 'Create Instructor Account'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Current Users */}
      <Card>
        <CardHeader>
          <CardTitle>Current Users with Analytics Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>{user.email}</span>
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Analytics Access</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Current Instructor Access</h4>
              <p className="text-sm text-gray-600">
                Login with: <code className="bg-gray-100 px-2 py-1 rounded">john@doe.com</code> / <code className="bg-gray-100 px-2 py-1 rounded">johndoe123</code>
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Analytics Dashboard</h4>
              <p className="text-sm text-gray-600">
                Access comprehensive analytics at: <code className="bg-gray-100 px-2 py-1 rounded">/analytics</code>
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Student Registration</h4>
              <p className="text-sm text-gray-600">
                Students self-register at: <code className="bg-gray-100 px-2 py-1 rounded">/auth/register</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
