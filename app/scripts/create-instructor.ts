
// Script to create instructor accounts  
// Run with: npx tsx scripts/create-instructor.ts

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface InstructorData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

async function createInstructor(data: InstructorData) {
  console.log(`Creating instructor account for ${data.email}...`);
  
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });
    
    if (existingUser) {
      console.log(`❌ User ${data.email} already exists!`);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    // Create instructor
    const instructor = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        password: hashedPassword,
      }
    });
    
    console.log(`✅ Created instructor: ${instructor.name} (${instructor.email})`);
    console.log(`🔑 Login credentials: ${data.email} / ${data.password}`);
    
  } catch (error) {
    console.error(`❌ Error creating instructor:`, error);
  }
}

async function main() {
  console.log('🎓 Creating Instructor Accounts...\n');
  
  // Default instructors to create
  const instructors: InstructorData[] = [
    {
      email: 'instructor1@university.edu',
      firstName: 'Dr. Sarah',
      lastName: 'Wilson',
      password: 'instructor123'
    },
    {
      email: 'instructor2@college.edu', 
      firstName: 'Prof. Michael',
      lastName: 'Chen',
      password: 'instructor456'
    },
    {
      email: 'instructor3@school.edu',
      firstName: 'Dr. Emily',
      lastName: 'Rodriguez', 
      password: 'instructor789'
    }
  ];
  
  for (const instructor of instructors) {
    await createInstructor(instructor);
  }
  
  console.log('\n🎉 Instructor creation completed!');
  console.log('\n📊 All instructors can access analytics at: /analytics');
  console.log('👥 They will see data for ALL students in the system');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
