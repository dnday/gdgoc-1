import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.recruiterRequest.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Existing data cleared');

  // Create Users
  console.log('👤 Creating users...');

  // Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@airecruitment.com',
      name: 'Admin User',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      accountStatus: 'active',
    },
  });

  // Candidates
  const candidate1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: await bcrypt.hash('password123', 10),
      role: 'candidate',
      accountStatus: 'active',
    },
  });

  const candidate2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      password: await bcrypt.hash('password123', 10),
      role: 'candidate',
      accountStatus: 'active',
    },
  });

  const candidate3 = await prisma.user.create({
    data: {
      email: 'mike.johnson@example.com',
      name: 'Mike Johnson',
      password: await bcrypt.hash('password123', 10),
      role: 'candidate',
      accountStatus: 'active',
    },
  });

  // Recruiters
  const recruiter1 = await prisma.user.create({
    data: {
      email: 'sarah.wilson@techcorp.com',
      name: 'Sarah Wilson',
      password: await bcrypt.hash('password123', 10),
      role: 'recruiter',
      accountStatus: 'active',
    },
  });

  const recruiter2 = await prisma.user.create({
    data: {
      email: 'david.chen@innovate.com',
      name: 'David Chen',
      password: await bcrypt.hash('password123', 10),
      role: 'recruiter',
      accountStatus: 'active',
    },
  });

  const recruiter3 = await prisma.user.create({
    data: {
      email: 'emma.davis@startup.io',
      name: 'Emma Davis',
      password: await bcrypt.hash('password123', 10),
      role: 'recruiter',
      accountStatus: 'active',
    },
  });

  console.log('✅ Users created');

  // Create Jobs
  console.log('💼 Creating jobs...');

  const job1 = await prisma.job.create({
    data: {
      title: 'Senior Frontend Developer',
      description: `We are looking for an experienced Frontend Developer to join our growing team. You will be responsible for building scalable web applications using modern JavaScript frameworks.

Key Responsibilities:
• Develop and maintain responsive web applications
• Collaborate with designers and backend developers
• Optimize applications for maximum speed and scalability
• Write clean, maintainable code following best practices`,
      requirements: `• 5+ years of experience in frontend development
• Expert knowledge of React, TypeScript, and Next.js
• Strong understanding of HTML5, CSS3, and modern JavaScript
• Experience with state management (Redux, Zustand, or similar)
• Familiarity with RESTful APIs and GraphQL
• Experience with testing frameworks (Jest, React Testing Library)
• Strong problem-solving skills and attention to detail`,
      company: 'TechCorp Solutions',
      location: 'Jakarta, Indonesia',
      jobType: 'Hybrid',
      salaryMin: 15000000,
      salaryMax: 25000000,
      recruiterId: recruiter1.id,
      isActive: true,
      createdAt: new Date('2026-01-25T10:00:00Z'),
    },
  });

  const job2 = await prisma.job.create({
    data: {
      title: 'Full Stack Engineer',
      description: `Join our innovative team as a Full Stack Engineer. You'll work on cutting-edge projects that impact millions of users worldwide.

What You'll Do:
• Design and implement features across the full stack
• Build RESTful APIs and microservices
• Work with modern cloud infrastructure
• Participate in code reviews and technical discussions
• Mentor junior developers`,
      requirements: `• 3+ years of full-stack development experience
• Proficiency in Node.js, Express, and NestJS
• Strong frontend skills with React or Vue.js
• Experience with PostgreSQL or MySQL
• Knowledge of Docker and Kubernetes
• Understanding of CI/CD pipelines
• Excellent communication skills`,
      company: 'Innovate Labs',
      location: 'Singapore',
      jobType: 'Remote',
      salaryMin: 20000000,
      salaryMax: 35000000,
      recruiterId: recruiter2.id,
      isActive: true,
      createdAt: new Date('2026-01-26T14:30:00Z'),
    },
  });

  const job3 = await prisma.job.create({
    data: {
      title: 'Backend Developer (Python)',
      description: `We're seeking a talented Backend Developer to help us build robust and scalable backend systems using Python and modern frameworks.

Your Impact:
• Develop high-performance backend services
• Design database schemas and optimize queries
• Implement authentication and authorization systems
• Write comprehensive unit and integration tests
• Collaborate with frontend teams`,
      requirements: `• 4+ years of Python development experience
• Strong knowledge of Django or FastAPI
• Experience with PostgreSQL and Redis
• Understanding of REST API design principles
• Familiarity with AWS or GCP
• Experience with message queues (RabbitMQ, Kafka)
• Bachelor's degree in Computer Science or related field`,
      company: 'DataFlow Systems',
      location: 'Kuala Lumpur, Malaysia',
      jobType: 'Onsite',
      salaryMin: 12000000,
      salaryMax: 20000000,
      recruiterId: recruiter2.id,
      isActive: true,
      createdAt: new Date('2026-01-27T09:15:00Z'),
    },
  });

  const job4 = await prisma.job.create({
    data: {
      title: 'DevOps Engineer',
      description: `Looking for a DevOps Engineer to streamline our development and deployment processes. You'll be at the forefront of our infrastructure automation efforts.

Core Responsibilities:
• Manage and scale cloud infrastructure
• Implement CI/CD pipelines
• Monitor system performance and reliability
• Automate deployment processes
• Ensure security and compliance`,
      requirements: `• 3+ years of DevOps/SRE experience
• Strong knowledge of AWS or Azure
• Experience with Terraform or CloudFormation
• Proficiency in Docker and Kubernetes
• Scripting skills (Python, Bash, or Go)
• Understanding of monitoring tools (Prometheus, Grafana)
• Strong troubleshooting skills`,
      company: 'CloudScale Inc',
      location: 'Bangkok, Thailand',
      jobType: 'Hybrid',
      salaryMin: 18000000,
      salaryMax: 30000000,
      recruiterId: recruiter3.id,
      isActive: true,
      createdAt: new Date('2026-01-28T11:00:00Z'),
    },
  });

  const job5 = await prisma.job.create({
    data: {
      title: 'Mobile Developer (React Native)',
      description: `Join our mobile team to build beautiful and performant mobile applications. You'll work on apps used by thousands of users daily.

What We Offer:
• Work on exciting projects with the latest technologies
• Flexible working hours and remote options
• Competitive salary and benefits
• Professional development opportunities
• Collaborative and innovative team culture`,
      requirements: `• 3+ years of mobile development experience
• Expert knowledge of React Native
• Strong JavaScript/TypeScript skills
• Experience with iOS and Android platforms
• Knowledge of mobile UI/UX best practices
• Experience with app deployment and distribution
• Passion for creating great user experiences`,
      company: 'MobileFirst Studio',
      location: 'Asia Pacific',
      jobType: 'Remote',
      salaryMin: 14000000,
      salaryMax: 24000000,
      recruiterId: recruiter3.id,
      isActive: true,
      createdAt: new Date('2026-01-29T08:30:00Z'),
    },
  });

  const job6 = await prisma.job.create({
    data: {
      title: 'UI/UX Designer',
      description: `We're looking for a creative UI/UX Designer to help us create intuitive and beautiful user interfaces. You'll work closely with product managers and developers to bring ideas to life.`,
      requirements: `• 2+ years of UI/UX design experience
• Proficiency in Figma and Adobe Creative Suite
• Strong portfolio demonstrating design skills
• Understanding of user-centered design principles
• Experience with prototyping and user testing
• Knowledge of HTML/CSS is a plus`,
      company: 'DesignHub',
      location: 'Manila, Philippines',
      jobType: 'Onsite',
      salaryMin: 10000000,
      salaryMax: 18000000,
      recruiterId: recruiter1.id,
      isActive: false, // Closed position
      createdAt: new Date('2026-01-20T16:00:00Z'),
    },
  });

  console.log('✅ Jobs created');

  // Create Applications with various statuses
  console.log('📝 Creating applications...');

  // Applications for Job 1 (Senior Frontend Developer)
  await prisma.application.create({
    data: {
      jobId: job1.id,
      userId: candidate1.id,
      candidateName: candidate1.name!,
      email: candidate1.email,
      resumeUrl: '/uploads/john-doe-resume.pdf',
      resumeText:
        'Senior Frontend Developer with 6 years of experience in React, Next.js, and TypeScript. Led multiple projects from conception to deployment...',
      skillsExtracted: [
        'React',
        'Next.js',
        'TypeScript',
        'JavaScript',
        'HTML5',
        'CSS3',
        'Redux',
        'Jest',
        'Git',
        'Agile',
      ],
      summary:
        'Highly experienced frontend developer with strong React and Next.js skills. Excellent match for senior position.',
      matchScore: 92,
      matchExplanation:
        'Candidate has extensive experience with all required technologies and demonstrates leadership capabilities.',
      status: 'accepted',
      createdAt: new Date('2026-01-26T10:30:00Z'),
    },
  });

  await prisma.application.create({
    data: {
      jobId: job1.id,
      userId: candidate2.id,
      candidateName: candidate2.name!,
      email: candidate2.email,
      resumeUrl: '/uploads/jane-smith-resume.pdf',
      resumeText:
        'Frontend Developer with 4 years of experience specializing in React and modern web technologies...',
      skillsExtracted: [
        'React',
        'TypeScript',
        'JavaScript',
        'CSS3',
        'Webpack',
        'Git',
      ],
      summary:
        'Solid frontend developer with good React experience, though slightly less than the preferred 5 years.',
      matchScore: 78,
      matchExplanation:
        'Good technical skills but experience level is slightly below the 5+ years requirement.',
      status: 'interview_scheduled',
      createdAt: new Date('2026-01-26T14:15:00Z'),
    },
  });

  await prisma.application.create({
    data: {
      jobId: job1.id,
      userId: candidate3.id,
      candidateName: candidate3.name!,
      email: candidate3.email,
      resumeUrl: '/uploads/mike-johnson-resume.pdf',
      resumeText:
        'Passionate frontend developer with 3 years of experience building responsive web applications...',
      skillsExtracted: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap'],
      summary:
        'Junior to mid-level developer with potential but lacks senior-level experience.',
      matchScore: 65,
      matchExplanation:
        'Good foundational skills but experience level and technical depth do not match senior requirements.',
      status: 'rejected',
      createdAt: new Date('2026-01-27T09:00:00Z'),
    },
  });

  // Applications for Job 2 (Full Stack Engineer)
  await prisma.application.create({
    data: {
      jobId: job2.id,
      userId: candidate1.id,
      candidateName: candidate1.name!,
      email: candidate1.email,
      resumeUrl: '/uploads/john-doe-resume.pdf',
      resumeText:
        'Full stack developer with expertise in both frontend and backend technologies...',
      skillsExtracted: [
        'Node.js',
        'Express',
        'React',
        'PostgreSQL',
        'Docker',
        'AWS',
        'TypeScript',
      ],
      summary:
        'Well-rounded full stack developer with strong experience across the entire stack.',
      matchScore: 88,
      matchExplanation:
        'Excellent match with comprehensive full stack experience and cloud knowledge.',
      status: 'interview_scheduled',
      createdAt: new Date('2026-01-27T11:00:00Z'),
    },
  });

  await prisma.application.create({
    data: {
      jobId: job2.id,
      userId: candidate2.id,
      candidateName: candidate2.name!,
      email: candidate2.email,
      resumeUrl: '/uploads/jane-smith-resume.pdf',
      resumeText:
        'Software engineer with experience in building scalable web applications...',
      skillsExtracted: ['Node.js', 'React', 'MongoDB', 'Express', 'JavaScript'],
      summary:
        'Good full stack skills but limited cloud and containerization experience.',
      matchScore: 72,
      matchExplanation:
        'Solid core skills but lacks experience with some preferred technologies like Docker and Kubernetes.',
      status: 'shortlisted',
      createdAt: new Date('2026-01-28T10:30:00Z'),
    },
  });

  // Applications for Job 3 (Backend Python)
  await prisma.application.create({
    data: {
      jobId: job3.id,
      userId: candidate3.id,
      candidateName: candidate3.name!,
      email: candidate3.email,
      resumeUrl: '/uploads/mike-johnson-resume.pdf',
      resumeText:
        'Backend developer specializing in Python with experience in Django and FastAPI...',
      skillsExtracted: [
        'Python',
        'Django',
        'PostgreSQL',
        'Redis',
        'REST API',
        'Git',
        'Linux',
      ],
      summary:
        'Strong Python backend developer with good database and API design skills.',
      matchScore: 85,
      matchExplanation:
        'Excellent match for Python backend role with relevant framework and database experience.',
      status: 'applied',
      createdAt: new Date('2026-01-28T14:00:00Z'),
    },
  });

  // Applications for Job 4 (DevOps)
  await prisma.application.create({
    data: {
      jobId: job4.id,
      userId: candidate1.id,
      candidateName: candidate1.name!,
      email: candidate1.email,
      resumeUrl: '/uploads/john-doe-resume.pdf',
      resumeText:
        'DevOps engineer with experience in AWS, Kubernetes, and CI/CD automation...',
      skillsExtracted: [
        'AWS',
        'Docker',
        'Kubernetes',
        'Terraform',
        'Jenkins',
        'Python',
        'Bash',
      ],
      summary:
        'Experienced DevOps professional with comprehensive infrastructure and automation skills.',
      matchScore: 90,
      matchExplanation:
        'Perfect match with all required skills and strong automation experience.',
      status: 'shortlisted',
      createdAt: new Date('2026-01-29T09:15:00Z'),
    },
  });

  // Applications for Job 5 (React Native)
  await prisma.application.create({
    data: {
      jobId: job5.id,
      userId: candidate2.id,
      candidateName: candidate2.name!,
      email: candidate2.email,
      resumeUrl: '/uploads/jane-smith-resume.pdf',
      resumeText:
        'Mobile developer with extensive React Native experience building cross-platform apps...',
      skillsExtracted: [
        'React Native',
        'JavaScript',
        'TypeScript',
        'iOS',
        'Android',
        'Redux',
        'Firebase',
      ],
      summary:
        'Highly skilled React Native developer with proven track record of successful app launches.',
      matchScore: 94,
      matchExplanation:
        'Outstanding candidate with extensive React Native experience and strong mobile development skills.',
      status: 'applied',
      createdAt: new Date('2026-01-29T16:00:00Z'),
    },
  });

  await prisma.application.create({
    data: {
      jobId: job5.id,
      userId: candidate3.id,
      candidateName: candidate3.name!,
      email: candidate3.email,
      resumeUrl: '/uploads/mike-johnson-resume.pdf',
      resumeText:
        'Mobile developer learning React Native with some Flutter experience...',
      skillsExtracted: [
        'Flutter',
        'Dart',
        'JavaScript',
        'React Native',
        'Firebase',
      ],
      summary:
        'Junior mobile developer transitioning to React Native from Flutter.',
      matchScore: 58,
      matchExplanation:
        'Limited React Native experience, primarily Flutter background which may require onboarding time.',
      status: 'applied',
      createdAt: new Date('2026-01-30T08:00:00Z'),
    },
  });

  console.log('✅ Applications created');

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log('   👤 Users: 7 (1 admin, 3 candidates, 3 recruiters)');
  console.log('   💼 Jobs: 6 (5 active, 1 closed)');
  console.log('   📝 Applications: 10');
  console.log('');
  console.log('🔐 Login Credentials:');
  console.log('   Admin:');
  console.log('   - admin@airecruitment.com (password: admin123)');
  console.log('');
  console.log('   Candidates (password: password123):');
  console.log('   - john.doe@example.com');
  console.log('   - jane.smith@example.com');
  console.log('   - mike.johnson@example.com');
  console.log('');
  console.log('   Recruiters (password: password123):');
  console.log('   - sarah.wilson@techcorp.com');
  console.log('   - david.chen@innovate.com');
  console.log('   - emma.davis@startup.io');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
