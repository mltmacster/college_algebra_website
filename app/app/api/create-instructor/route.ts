
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, firstName, lastName, password } = await req.json();

    if (!email || !firstName || !lastName || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create instructor
    const instructor = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        password: hashedPassword,
      }
    });

    console.log(`✅ Created instructor: ${instructor.name} (${instructor.email})`);

    return NextResponse.json({
      message: 'Instructor created successfully',
      instructor: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        firstName: instructor.firstName,
        lastName: instructor.lastName
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating instructor:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
