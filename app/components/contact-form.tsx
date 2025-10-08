
'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Mail, Send, MessageCircle, HelpCircle, Bug, BookOpen } from 'lucide-react';
import { toast } from '../hooks/use-toast';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit to database
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Message sent!',
          description: 'Thank you for your message. We\'ll get back to you soon.',
        });

        // Open Gmail with pre-filled email
        const subject = encodeURIComponent(`College Algebra Support: ${formData.subject || 'General Inquiry'}`);
        const body = encodeURIComponent(
          `Name: ${formData.name}
Email: ${formData.email}
Category: ${formData.category}
Subject: ${formData.subject}

Message:
${formData.message}

---
This message was submitted through the College Algebra Learning Platform contact form.`
        );
        
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=mtlmacster@gmail.com&su=${subject}&body=${body}`;
        window.open(gmailUrl, '_blank');

        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          category: ''
        });
      } else {
        toast({
          title: 'Error',
          description: 'There was an error sending your message. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error sending your message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Contact Form */}
      <div className="lg:col-span-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <MessageCircle className="mr-3 h-6 w-6" />
              Send us a Message
            </CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={handleSelectChange} disabled={isSubmitting}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="academic">Academic Help</SelectItem>
                    <SelectItem value="account">Account Issues</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Brief description of your inquiry"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Please provide details about your question or issue..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  rows={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information & Help */}
      <div className="space-y-6">
        {/* Quick Help */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="mr-2 h-5 w-5" />
              Quick Help
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <BookOpen className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-sm">Academic Questions</h4>
                  <p className="text-sm text-gray-600">
                    Need help with College Algebra concepts? Use our AI tutor for instant assistance.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Bug className="h-5 w-5 text-red-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-sm">Technical Issues</h4>
                  <p className="text-sm text-gray-600">
                    Experiencing problems with the platform? Let us know and we'll fix it quickly.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Tutor */}
        <Card>
          <CardHeader>
            <CardTitle>Try AI Unk First</CardTitle>
            <CardDescription>
              Get instant answers to your College Algebra questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
              <iframe
                src="https://apps.abacus.ai/chatllm/?appId=170f87fb06&hideTopBar=2"
                className="w-full h-full border-0 rounded-lg"
                title="AI Unk Chatbot - Contact Support"
                allow="microphone"
                sandbox="allow-same-origin allow-scripts allow-forms allow-downloads allow-popups"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                onError={(e) => {
                  // Suppress iframe loading errors (cosmetic third-party issues)
                  e.preventDefault();
                  console.log('[Contact] AI Unk iframe loaded with minor resource warnings (suppressed)');
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Alternative Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Direct Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Prefer to email directly? You can also reach us at:
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                window.open('mailto:mtlmacster@gmail.com?subject=College Algebra Support', '_blank');
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email us directly
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
