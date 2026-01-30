import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creating sample recruiter request...');

  // Get candidate user
  const candidate = await prisma.user.findUnique({
    where: { email: 'john.doe@email.com' },
  });

  if (!candidate) {
    console.log('❌ Candidate not found. Run npm run seed first!');
    return;
  }

  // Create recruiter request
  const request = await prisma.recruiterRequest.create({
    data: {
      userId: candidate.id,
      companyName: 'Tech Innovators Inc',
      companyEmail: 'john@techinnovators.com',
      companyWebsite: 'https://techinnovators.com',
      position: 'HR Manager',
      reason:
        'I am the HR Manager at Tech Innovators Inc. We are expanding our tech team and need to post multiple job openings. I would like to have recruiter access to manage job postings and review candidates efficiently through your AI-powered platform.',
      status: 'pending',
    },
  });

  console.log('✅ Recruiter request created!');
  console.log('📋 Request Details:');
  console.log(`   User: ${candidate.name} (${candidate.email})`);
  console.log(`   Company: ${request.companyName}`);
  console.log(`   Position: ${request.position}`);
  console.log(`   Status: ${request.status}`);
  console.log('\n🎯 Now you can login as admin and approve this request at:');
  console.log('   http://localhost:3001/dashboard/admin/recruiter-requests');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
