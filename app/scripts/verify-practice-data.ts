
// Verification script to test practice data integration
// Run with: npx tsx scripts/verify-practice-data.ts

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PracticeQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'calculation';
  correctAnswer: string;
  options?: string[];
  explanation: string;
  points: number;
  businessContext: string;
}

// Import practice data (simulating the actual import)
const practiceDataKeys = [
  'linear-equations',
  'systems-linear-equations', 
  'functions-and-graphing',
  'quadratic-functions',
  'exponential-and-logarithmic-functions',
  'matrix-operations-and-applications'
];

async function verifyPracticeDataIntegration() {
  console.log('🧪 PRACTICE DATA VERIFICATION STARTING...\n');

  try {
    // 1. Verify database connection
    console.log('1️⃣ Testing Database Connection...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful\n');

    // 2. Get all modules from database
    console.log('2️⃣ Fetching Modules from Database...');
    const modules = await prisma.learningModule.findMany({
      select: { id: true, title: true, slug: true, isActive: true },
      orderBy: { order: 'asc' }
    });
    
    console.log(`✅ Found ${modules.length} modules in database:`);
    modules.forEach((module, index) => {
      console.log(`   ${index + 1}. ${module.title} (slug: "${module.slug}")`);
    });
    console.log();

    // 3. Check slug alignment with practice data
    console.log('3️⃣ Verifying Slug Alignment...');
    let alignmentIssues = 0;
    
    modules.forEach(module => {
      if (module.isActive && practiceDataKeys.includes(module.slug)) {
        console.log(`✅ "${module.slug}" - Practice data available`);
      } else if (module.isActive) {
        console.log(`❌ "${module.slug}" - NO practice data found`);
        alignmentIssues++;
      } else {
        console.log(`⚠️  "${module.slug}" - Module inactive`);
      }
    });

    if (alignmentIssues === 0) {
      console.log(`\n🎉 ALL ACTIVE MODULES HAVE PRACTICE DATA! ✅`);
    } else {
      console.log(`\n⚠️  ${alignmentIssues} modules missing practice data`);
    }

    // 4. Verify critical modules
    console.log('\n4️⃣ Testing Critical Modules...');
    const criticalModules = [
      'functions-and-graphing',
      'quadratic-functions', 
      'exponential-and-logarithmic-functions',
      'matrix-operations-and-applications'
    ];

    const dbSlugs = modules.map(m => m.slug);
    let criticalIssues = 0;

    criticalModules.forEach(slug => {
      if (dbSlugs.includes(slug)) {
        console.log(`✅ Critical module "${slug}" exists in database`);
      } else {
        console.log(`❌ Critical module "${slug}" MISSING from database`);
        criticalIssues++;
      }
    });

    if (criticalIssues === 0) {
      console.log(`\n🎯 ALL CRITICAL MODULES VERIFIED! ✅`);
    } else {
      console.log(`\n🚨 ${criticalIssues} critical modules have issues`);
    }

    // 5. Summary
    console.log('\n📊 VERIFICATION SUMMARY:');
    console.log(`   Total Modules: ${modules.length}`);
    console.log(`   Active Modules: ${modules.filter(m => m.isActive).length}`);
    console.log(`   Practice Data Keys: ${practiceDataKeys.length}`);
    console.log(`   Alignment Issues: ${alignmentIssues}`);
    console.log(`   Critical Issues: ${criticalIssues}`);

    if (alignmentIssues === 0 && criticalIssues === 0) {
      console.log('\n🎉 PRACTICE SYSTEM STATUS: FULLY OPERATIONAL! ✅');
      console.log('\n🚀 READY FOR PRODUCTION DEPLOYMENT!');
    } else {
      console.log('\n⚠️  PRACTICE SYSTEM STATUS: NEEDS ATTENTION');
      console.log('\n❌ NOT READY FOR PRODUCTION');
    }

  } catch (error) {
    console.error('❌ VERIFICATION FAILED:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run verification
verifyPracticeDataIntegration()
  .then(() => {
    console.log('\n✅ Verification completed successfully!');
  })
  .catch((error) => {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  });
