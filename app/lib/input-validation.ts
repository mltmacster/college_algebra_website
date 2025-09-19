
import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string()
  .email('Invalid email format')
  .min(1, 'Email is required')
  .max(255, 'Email is too long');

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  );

export const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(100, 'Name is too long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters');

export const slugSchema = z.string()
  .min(1, 'Slug is required')
  .max(100, 'Slug is too long')
  .regex(/^[a-z0-9-]+$/, 'Invalid slug format');

export const messageSchema = z.string()
  .min(1, 'Message is required')
  .max(1000, 'Message is too long');

// Registration schema
export const registrationSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  }),
});

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Contact form schema
export const contactSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  subject: z.string()
    .min(1, 'Subject is required')
    .max(200, 'Subject is too long'),
  message: messageSchema,
});

// Progress update schema
export const progressSchema = z.object({
  moduleSlug: slugSchema,
  lessonId: z.string().min(1, 'Lesson ID is required'),
  completed: z.boolean(),
  score: z.number().min(0).max(100).optional(),
});

// Badge award schema
export const badgeSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  badgeType: z.enum(['module_completion', 'perfect_score', 'streak', 'first_lesson']),
  moduleSlug: slugSchema.optional(),
});

// API parameter validation
export const moduleParamsSchema = z.object({
  slug: slugSchema,
});

export const problemParamsSchema = z.object({
  problemId: z.string().min(1, 'Problem ID is required'),
});

// Input sanitization functions
export function sanitizeHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
}

export function sanitizeFileName(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

export function validateAndSanitize<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  sanitize: boolean = true
): T {
  // First validate the structure
  const validated = schema.parse(data);

  if (!sanitize) {
    return validated;
  }

  // Then sanitize string fields
  const sanitized = { ...validated } as any;
  
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeHtml(sanitized[key]);
    }
  });

  return sanitized;
}

// Rate limiting helpers
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  const current = requestCounts.get(identifier);
  
  if (!current || current.resetTime <= now) {
    // New window
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    });
    
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs
    };
  }
  
  if (current.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime
    };
  }
  
  // Increment count
  current.count++;
  requestCounts.set(identifier, current);
  
  return {
    allowed: true,
    remaining: maxRequests - current.count,
    resetTime: current.resetTime
  };
}

// Clean up old rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCounts.entries()) {
    if (value.resetTime <= now) {
      requestCounts.delete(key);
    }
  }
}, 300000); // Clean up every 5 minutes
