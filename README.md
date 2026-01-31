# AI Recruitment Platform

An intelligent recruitment management system powered by AI to streamline the hiring process for recruiters and job seekers.

## 🌟 Project Overview

The AI Recruitment Platform is a full-stack web application that leverages artificial intelligence to match candidates with job opportunities. The system analyzes candidate resumes, extracts skills, calculates match scores, and assists recruiters in making data-driven hiring decisions.

### Key Features

- **AI-Powered Resume Analysis**: Automatic skill extraction and candidate evaluation using Google Gemini AI
- **Smart Matching Algorithm**: Calculate compatibility scores between candidates and job requirements
- **Multi-Role System**: Support for Candidates, Recruiters, and Administrators
- **Resume Management**: Upload and store resumes with Supabase integration
- **Email Automation**: AI-generated professional emails for candidate communication
- **Application Tracking**: Real-time status updates and comprehensive application management
- **Recruiter Approval Workflow**: Admin-controlled recruiter verification process
- **Google OAuth Integration**: Seamless authentication with Google accounts
- **Multi-Candidate Comparison**: Compare up to 3 candidates side-by-side with AI insights

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Custom components with Lucide React icons
- **State Management**: React Hooks
- **Authentication**: JWT + Cookie-based sessions

### Backend

- **Framework**: [NestJS 11](https://nestjs.com/)
- **Language**: TypeScript
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL
- **Authentication**:
  - Passport.js (JWT Strategy)
  - Google OAuth 2.0
- **File Storage**: Supabase Storage
- **AI Integration**:
  - Google Gemini 2.5 Flash (resume analysis)
  - PDF parsing with pdf-parse
- **Email Service**: Nodemailer (SMTP)

### Database Schema

- **Users**: Multi-role authentication system
- **Jobs**: Job postings with detailed requirements
- **Applications**: Candidate applications with AI analysis
- **RecruiterRequests**: Approval workflow for becoming a recruiter

---

## ✨ Features Implemented

### For Candidates

✅ User registration and authentication (manual + Google OAuth)  
✅ Browse available job listings  
✅ Upload resume and apply to jobs (PDF support)  
✅ AI-powered skill extraction from resumes  
✅ View AI-generated match scores for applications  
✅ Track application status in real-time  
✅ Request to become a recruiter  
✅ View application history

### For Recruiters

✅ Post and manage job listings  
✅ View all applications for posted jobs  
✅ Review AI-generated candidate analysis  
✅ Filter and sort applications by match score  
✅ Update application status (shortlist, interview, accept, reject)  
✅ Generate AI-powered email drafts  
✅ Send personalized emails to candidates  
✅ Dashboard with application analytics  
✅ Compare up to 3 candidates simultaneously

### For Administrators

✅ View all recruiter approval requests  
✅ Approve or reject recruiter applications  
✅ User role management  
✅ Platform oversight and monitoring

### AI Features

✅ **Resume Parsing**: Extract text from PDF resumes  
✅ **Skill Extraction**: Identify technical and soft skills using regex patterns  
✅ **Match Scoring**: Calculate 0-100% compatibility score  
✅ **Candidate Summarization**: Generate brief candidate profiles  
✅ **Email Generation**: Create professional acceptance/rejection emails  
✅ **Interview Invitations**: Personalized with specific dates

### Technical Features

✅ RESTful API architecture  
✅ JWT-based authentication  
✅ Role-based access control (RBAC)  
✅ File upload handling (multipart/form-data)  
✅ Database migrations with Prisma  
✅ Database seeding for testing  
✅ CORS configuration  
✅ TypeScript strict mode  
✅ Error handling middleware  
✅ Input validation with class-validator

---

## 👥 Team Members & Roles

| Name     | Role   | Responsibilities                    |
| -------- | ------ | ----------------------------------- |
| [Name 1] | [Role] | [Frontend/Backend/AI/Database/etc.] |
| [Name 2] | [Role] | [Responsibilities]                  |
| [Name 3] | [Role] | [Responsibilities]                  |
| [Name 4] | [Role] | [Responsibilities]                  |

_Note: Please fill in team member details above_

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14 or higher
- npm or yarn package manager

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/ai-recruitment.git
cd ai-recruitment
```

#### 2. Backend Setup

```bash
cd ai-recruitment-backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# (See DEPLOYMENT_GUIDE.md for all required variables)

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed database with test data
npx ts-node prisma/seed.ts

# Start development server
npm run start:dev
```

Backend will run on `http://localhost:3000`

#### 3. Frontend Setup

```bash
cd ai-recruitment-frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3001`

### Environment Variables

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete environment variable configuration.

**Required Services:**

- PostgreSQL database
- Google OAuth credentials
- Google Gemini API key
- Supabase account (for file storage)
- SMTP email service

---

## 🧪 Testing

### Test Accounts

See [TEST_ACCOUNTS.md](TEST_ACCOUNTS.md) for complete list of test accounts.

**Quick Reference:**

| Role      | Email                     | Password    |
| --------- | ------------------------- | ----------- |
| Admin     | admin@airecruitment.com   | admin123    |
| Recruiter | sarah.wilson@techcorp.com | password123 |
| Candidate | john.doe@example.com      | password123 |

### Testing Workflow

1. **Admin Login**: Test recruiter approval workflow
2. **Recruiter Login**: Create jobs, review applications
3. **Candidate Login**: Apply to jobs, upload resume
4. **AI Analysis**: Upload real PDF resume to test AI features
5. **Email Generation**: Test email drafts and sending
6. **Multi-Candidate Comparison**: Compare 2-3 candidates side-by-side

---

## 📁 Project Structure

```
ai-recruitment/
├── ai-recruitment-backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   ├── seed.ts                # Test data seeding
│   │   └── migrations/            # Database migrations
│   ├── src/
│   │   ├── ai/                    # AI service (Gemini)
│   │   ├── applications/          # Application management
│   │   ├── auth/                  # Authentication
│   │   ├── jobs/                  # Job management
│   │   ├── recruiter-requests/    # Recruiter approval
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example
│   └── package.json
│
├── ai-recruitment-frontend/
│   ├── app/
│   │   ├── dashboard/             # Main dashboard
│   │   │   ├── candidate/         # Candidate pages
│   │   │   ├── jobs/              # Job pages
│   │   │   └── page.tsx           # Recruiter dashboard
│   │   ├── login-success/
│   │   ├── select-role/
│   │   ├── layout.tsx
│   │   └── page.tsx               # Landing/login
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── dashboard/             # Dashboard components
│   ├── lib/                       # Utilities
│   └── package.json
│
├── DEPLOYMENT_GUIDE.md
├── API_DOCUMENTATION.md
├── TEST_ACCOUNTS.md
└── README.md (this file)
```

---

## 🔑 API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with credentials
- `GET /auth/google` - Google OAuth initiation
- `GET /auth/google/callback` - Google OAuth callback

### Jobs

- `GET /jobs` - Get all jobs (public)
- `GET /jobs/:id` - Get single job
- `POST /jobs` - Create job (recruiter)
- `PATCH /jobs/:id` - Update job
- `DELETE /jobs/:id` - Delete job

### Applications

- `POST /applications` - Submit application with resume
- `GET /applications/job/:jobId` - Get applications for job
- `GET /applications/user/:userId` - Get user's applications
- `POST /applications/generate-draft` - AI email generation
- `POST /applications/send-email` - Send email to candidate

### Recruiter Requests

- `POST /recruiter-requests` - Submit recruiter request
- `GET /recruiter-requests` - Get all requests (admin)
- `PATCH /recruiter-requests/:id/review` - Approve/reject (admin)

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API reference.

---

## 🤖 AI Integration Details

### Resume Analysis Pipeline

1. **PDF Upload**: Candidate uploads resume (PDF format)
2. **Text Extraction**: pdf-parse extracts text content
3. **AI Analysis**: Google Gemini 2.5 Flash analyzes:
   - Skills (technical + soft skills)
   - Experience summary
   - Match score (0-100%)
   - Detailed explanation
4. **Storage**: Results saved to database
5. **Display**: Shown to recruiter in dashboard

### Email Generation

AI generates context-aware emails:

- **Interview Invitations**: Includes specific date/time
- **Acceptance Letters**: Congratulatory tone with next steps
- **Rejection Letters**: Empathetic and encouraging

### Skill Extraction

Uses regex-based pattern matching for:

- **Programming Languages**: JavaScript, TypeScript, Python, Java, Go, Rust, C++, C#, PHP, Ruby, Swift, Kotlin, Scala
- **Frameworks**: React, Vue, Angular, Next.js, Node.js, Express, NestJS, Django, FastAPI, Flask, Spring, Laravel
- **Databases**: PostgreSQL, MySQL, MongoDB, Redis, Cassandra, DynamoDB, Elasticsearch
- **Cloud/DevOps**: AWS, Azure, GCP, Docker, Kubernetes, Terraform, Jenkins, GitLab, CircleCI
- **Tools**: Git, GraphQL, REST API, gRPC, Kafka, RabbitMQ, Nginx, Apache

---

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt (10 rounds)
- CORS protection
- Environment variable management
- SQL injection protection (Prisma ORM)
- File type validation (PDF only)
- Role-based access control
- OAuth 2.0 secure flow

---

## 📊 Database Schema

### Users Table

```prisma
id: UUID (PK)
email: String (unique)
name: String
password: String (hashed)
picture: String (optional)
role: candidate | recruiter | admin
accountStatus: active | pending | suspended
```

### Jobs Table

```prisma
id: UUID (PK)
title: String
description: Text
requirements: Text
company: String
location: String
jobType: Remote | Hybrid | Onsite
salaryMin/Max: Integer
recruiterId: UUID (FK)
isActive: Boolean
```

### Applications Table

```prisma
id: UUID (PK)
jobId: UUID (FK)
userId: UUID (optional FK)
candidateName: String
email: String
resumeUrl: String
resumeText: Text
skillsExtracted: String[]
summary: Text
matchScore: Integer (0-100)
matchExplanation: Text
status: applied | shortlisted | interview_scheduled | accepted | rejected
statusHistory: String[]
```

---

## 🎯 Future Enhancements

- [ ] Real-time notifications (WebSocket)
- [ ] Advanced search and filtering
- [ ] Video interview scheduling
- [ ] Calendar integration
- [ ] Analytics dashboard for recruiters
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Resume templates
- [ ] Skill assessment tests
- [ ] Referral system

---

## 📝 Documentation

- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**: Complete deployment instructions
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)**: Full API reference
- **[TEST_ACCOUNTS.md](TEST_ACCOUNTS.md)**: Test accounts and credentials

---

## 🐛 Known Issues

- Frontend API URLs hardcoded to `localhost:3000` (needs environment variable configuration)
- No rate limiting implemented
- No pagination for large datasets

---

## 📄 License

MIT License

Copyright (c) 2026 AI Recruitment Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 🙏 Acknowledgments

- **Google Gemini AI**: For powerful resume analysis
- **Supabase**: For reliable file storage
- **NestJS & Next.js**: For excellent framework foundations
- **Prisma**: For type-safe database access

---

## 📞 Contact & Support

For questions or issues:

- **GitHub Repository**: [Your repository URL]
- **GitHub Issues**: [repository URL]/issues

---

## 🏆 Project Highlights

✨ **AI-Powered**: Intelligent matching and analysis  
⚡ **Fast**: Optimized performance with Next.js and NestJS  
🔐 **Secure**: Multiple authentication methods and authorization  
📱 **Responsive**: Mobile-friendly design  
🎨 **Modern UI**: Clean and intuitive interface  
🔄 **Real-time**: Instant updates on application status  
📧 **Automated**: AI-generated email communications  
🗄️ **Scalable**: Designed for growth with proper architecture

---

**Developed with ❤️ using Next.js, NestJS, and Google Gemini AI**

**Last Updated:** January 31, 2026

**Version:** 1.0.0
