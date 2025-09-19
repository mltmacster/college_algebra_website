
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { 
  asyncHandler, 
  createValidationError,
  createDatabaseError,
  ErrorCodes
} from '../../../lib/error-handler';
import { 
  contactSchema, 
  validateAndSanitize,
  checkRateLimit 
} from '../../../lib/input-validation';

export const POST = asyncHandler(async (request: NextRequest) => {
  // Rate limiting
  const clientIP = request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown';
  
  const rateLimit = checkRateLimit(`contact_${clientIP}`, 5, 60000); // 5 requests per minute
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCodes.RATE_LIMIT_EXCEEDED,
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        }
      },
      { status: 429 }
    );
  }

  // Parse and validate request body
  const body = await request.json();
  
  // Validate and sanitize input
  const validatedData = validateAndSanitize(contactSchema, body);

  // Extract individual fields for clarity
  const { firstName, lastName, email, subject, message } = validatedData;
  const fullName = `${firstName} ${lastName}`.trim();

  // Save to database with proper error handling
  try {
    const submission = await prisma.contactSubmission.create({
      data: {
        name: fullName,
        email,
        subject,
        message,
        status: 'pending',
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          message: 'Message sent successfully! We\'ll get back to you within 24 hours.',
          submissionId: submission.id,
        }
      },
      { 
        status: 201,
        headers: {
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
        }
      }
    );
  } catch (error: any) {
    throw createDatabaseError('Failed to save contact form submission', error);
  }
});
