# AI Recruitment Platform - Backend Documentation

**Complete System Architecture, API Design & AI Integration Guide**

---

## 📑 Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [Database Design](#3-database-design)
4. [API Design & Endpoints](#4-api-design--endpoints)
5. [AI Integration](#5-ai-integration)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Data Flow](#7-data-flow)
8. [Implementation Details](#8-implementation-details)
9. [Deployment Architecture](#9-deployment-architecture)

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 16)                     │
│  - React 19 with TypeScript                                  │
│  - Tailwind CSS 4.0                                          │
│  - Deployed on Vercel                                        │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTPS REST API
                   │ JWT Authentication
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (NestJS 11)                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │          API Gateway & Controllers                   │    │
│  │  - Auth Controller (JWT + Google OAuth)             │    │
│  │  - Jobs Controller (CRUD Operations)                │    │
│  │  - Applications Controller (with AI)                │    │
│  │  - AI Controller (Gemini Integration)               │    │
│  │  - Recruiter Requests Controller                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Service Layer                           │    │
│  │  - Business Logic                                    │    │
│  │  - Data Validation                                   │    │
│  │  - Error Handling                                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         External Services Integration                │    │
│  │                                                       │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │    │
│  │  │ Google       │  │  Supabase    │  │ Nodemailer│ │    │
│  │  │ Gemini AI    │  │  Storage     │  │ (SMTP)    │ │    │
│  │  │ 2.5 Flash    │  │  (Files)     │  │           │ │    │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │          Data Access Layer (Prisma ORM)              │    │
│  └─────────────────────────────────────────────────────┘    │
│                   Deployed on Railway                        │
└──────────────────┬──────────────────────────────────────────┘
                   │ PostgreSQL Connection
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database (Supabase)                  │
│  - User Management                                           │
│  - Job Listings                                              │
│  - Applications & AI Analysis Results                        │
│  - Recruiter Approval Workflow                               │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Architectural Patterns

**1. MVC Pattern (Model-View-Controller)**

- **Model**: Prisma schema definitions
- **View**: JSON responses
- **Controller**: NestJS controllers handling HTTP requests

**2. Service Layer Pattern**

- Business logic separated from controllers
- Reusable service methods
- Dependency injection for modularity

**3. Repository Pattern**

- Prisma acts as repository abstraction
- Database operations encapsulated
- Easy to mock for testing

**4. Microservices-Ready Architecture**

- Modular design with feature modules
- Each module can be extracted to separate service
- Clear separation of concerns

---

## 2. Technology Stack

### 2.1 Core Backend Technologies

| Technology     | Version | Purpose              |
| -------------- | ------- | -------------------- |
| **NestJS**     | 11.0    | Backend framework    |
| **TypeScript** | 5.3     | Programming language |
| **Node.js**    | 22.18.0 | Runtime environment  |
| **Prisma ORM** | 6.2     | Database ORM         |
| **PostgreSQL** | Latest  | Relational database  |

### 2.2 Authentication & Security

| Technology           | Purpose                       |
| -------------------- | ----------------------------- |
| **Passport.js**      | Authentication middleware     |
| **JWT**              | Token-based authentication    |
| **bcrypt**           | Password hashing              |
| **Google OAuth 2.0** | Social authentication         |
| **CORS**             | Cross-origin resource sharing |

### 2.3 AI & External Services

| Service                     | Purpose                            |
| --------------------------- | ---------------------------------- |
| **Google Gemini 2.5 Flash** | Resume analysis & email generation |
| **Supabase Storage**        | Resume file storage                |
| **Nodemailer**              | Email delivery (SMTP)              |
| **pdf-parse**               | PDF resume parsing                 |

### 2.4 Development Tools

| Tool         | Purpose         |
| ------------ | --------------- |
| **ESLint**   | Code linting    |
| **Prettier** | Code formatting |
| **Jest**     | Unit testing    |

---

## 3. Database Design

### 3.1 Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────┐
│                        USER                                  │
├─────────────────────────────────────────────────────────────┤
│ id: String (UUID) [PK]                                       │
│ email: String [UNIQUE]                                       │
│ name: String                                                 │
│ password: String? (nullable for OAuth)                       │
│ role: Enum (admin, recruiter, candidate)                     │
│ picture: String?                                             │
│ createdAt: DateTime                                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ 1:N (recruiter creates jobs)
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                        JOB                                   │
├─────────────────────────────────────────────────────────────┤
│ id: String (UUID) [PK]                                       │
│ title: String                                                │
│ description: String                                          │
│ requirements: String[]                                       │
│ location: String                                             │
│ salaryRange: String?                                         │
│ type: Enum (onsite, remote, hybrid)                          │
│ status: Enum (active, closed)                                │
│ postedBy: String [FK -> User.id]                             │
│ companyName: String                                          │
│ createdAt: DateTime                                          │
│ updatedAt: DateTime                                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ 1:N (job has applications)
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   APPLICATION                                │
├─────────────────────────────────────────────────────────────┤
│ id: String (UUID) [PK]                                       │
│ userId: String [FK -> User.id]                               │
│ jobId: String [FK -> Job.id]                                 │
│ candidateName: String                                        │
│ candidateEmail: String                                       │
│ resumeUrl: String                                            │
│ status: Enum (applied, shortlisted, interview_scheduled,    │
│              accepted, rejected)                             │
│ aiAnalysis: Json (skills, summary, matchScore, explanation) │
│ interviewDate: DateTime?                                     │
│ notes: String?                                               │
│ createdAt: DateTime                                          │
│ updatedAt: DateTime                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 RECRUITER_REQUEST                            │
├─────────────────────────────────────────────────────────────┤
│ id: String (UUID) [PK]                                       │
│ userId: String [FK -> User.id]                               │
│ companyName: String                                          │
│ companyEmail: String                                         │
│ companyWebsite: String?                                      │
│ position: String                                             │
│ reason: String                                               │
│ status: Enum (pending, approved, rejected)                   │
│ reviewedBy: String? [FK -> User.id]                          │
│ reviewedAt: DateTime?                                        │
│ reviewNotes: String?                                         │
│ submittedAt: DateTime                                        │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Database Schema (Prisma)

```prisma
// Key schema highlights

model User {
  id                String              @id @default(uuid())
  email             String              @unique
  name              String
  password          String?             // Nullable for OAuth users
  role              UserRole            @default(candidate)
  picture           String?
  createdAt         DateTime            @default(now())

  // Relations
  jobs              Job[]               @relation("RecruiterJobs")
  applications      Application[]
  recruiterRequests RecruiterRequest[]
}

enum UserRole {
  admin
  recruiter
  candidate
}

model Job {
  id           String        @id @default(uuid())
  title        String
  description  String
  requirements String[]      // Array of skills/requirements
  location     String
  salaryRange  String?
  type         JobType
  status       JobStatus     @default(active)
  postedBy     String
  companyName  String

  recruiter    User          @relation("RecruiterJobs", fields: [postedBy], references: [id])
  applications Application[]

  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

enum JobType {
  onsite
  remote
  hybrid
}

enum JobStatus {
  active
  closed
}

model Application {
  id              String            @id @default(uuid())
  userId          String
  jobId           String
  candidateName   String
  candidateEmail  String
  resumeUrl       String
  status          ApplicationStatus @default(applied)
  aiAnalysis      Json              // Stored AI analysis results
  interviewDate   DateTime?
  notes           String?

  user            User              @relation(fields: [userId], references: [id])
  job             Job               @relation(fields: [jobId], references: [id])

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  @@unique([userId, jobId])         // One application per user per job
}

enum ApplicationStatus {
  applied
  shortlisted
  interview_scheduled
  accepted
  rejected
}
```

### 3.3 Key Database Design Decisions

**1. UUID Primary Keys**

- Better for distributed systems
- No sequential guessing
- Globally unique

**2. Soft Delete Pattern**

- Status field instead of deletion
- Maintains data integrity
- Audit trail preservation

**3. JSON Field for AI Analysis**

- Flexible structure for AI results
- No need for separate tables
- Easy to query and update

**4. Composite Unique Constraint**

- Prevents duplicate applications
- Database-level enforcement
- Better data integrity

---

## 4. API Design & Endpoints

### 4.1 API Design Principles

**RESTful Design**

- Resource-based URLs
- HTTP methods represent actions
- Stateless communication
- JSON request/response

**Consistent Response Format**

```typescript
// Success Response
{
  "data": { /* resource data */ },
  "message": "Success message"
}

// Error Response
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

### 4.2 Complete API Endpoints

#### **Authentication Endpoints**

**POST /auth/register**

- **Description**: Register new user account
- **Auth Required**: No
- **Request Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

- **Response**: User object + JWT token
- **Implementation**: Password hashing with bcrypt, JWT generation

**POST /auth/login**

- **Description**: Login with email and password
- **Auth Required**: No
- **Request Body**:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

- **Response**: User object + JWT access token

**GET /auth/google**

- **Description**: Initiate Google OAuth flow
- **Auth Required**: No
- **Redirect**: Google OAuth consent screen
- **Implementation**: Passport Google Strategy

**GET /auth/google/callback**

- **Description**: Google OAuth callback handler
- **Auth Required**: No
- **Response**: Redirect to frontend with token and user data
- **Flow**:
  1. Receive Google user data
  2. Find or create user in database
  3. Generate JWT token
  4. Redirect to frontend with query params

**POST /auth/google/complete**

- **Description**: Complete Google OAuth (set role for new users)
- **Auth Required**: Yes (JWT)
- **Request Body**:

```json
{
  "role": "candidate" // or "recruiter"
}
```

---

#### **Job Management Endpoints**

**GET /jobs**

- **Description**: Get all active job listings
- **Auth Required**: No
- **Query Params**:
  - `status` (optional): filter by active/closed
- **Response**: Array of job objects with recruiter info

**GET /jobs/:id**

- **Description**: Get specific job details with all applications
- **Auth Required**: Yes (Recruiter who posted or Admin)
- **Response**: Job object with applications array including AI analysis

**POST /jobs**

- **Description**: Create new job posting
- **Auth Required**: Yes (Recruiter only)
- **Request Body**:

```json
{
  "title": "Senior Frontend Developer",
  "description": "We are looking for...",
  "requirements": ["React", "TypeScript", "5+ years"],
  "location": "Jakarta, Indonesia",
  "salaryRange": "$80k - $120k",
  "type": "hybrid",
  "companyName": "Tech Corp"
}
```

- **AI Integration**: Requirements array used for candidate matching

**PATCH /jobs/:id**

- **Description**: Update job details or close job
- **Auth Required**: Yes (Job owner or Admin)
- **Request Body**: Partial job fields
- **Use Case**: Close job when position is filled

**DELETE /jobs/:id**

- **Description**: Delete job posting
- **Auth Required**: Yes (Job owner or Admin)
- **Implementation**: Soft delete (set status to closed)

---

#### **Application Endpoints**

**POST /applications**

- **Description**: Submit job application with resume
- **Auth Required**: Yes
- **Request Type**: `multipart/form-data`
- **Request Body**:

```json
{
  "jobId": "uuid",
  "candidateName": "John Doe",
  "candidateEmail": "john@example.com",
  "resume": File // PDF file
}
```

- **AI Integration Flow**:
  1. Upload resume to Supabase Storage
  2. Parse PDF text content
  3. Send to Gemini AI for analysis
  4. Calculate match score with job requirements
  5. Store application with AI analysis
- **Response**: Application object with AI analysis

**GET /applications/user/:userId**

- **Description**: Get all applications for a user
- **Auth Required**: Yes (User or Admin)
- **Response**: Array of applications with job details and AI scores

**GET /applications/candidate/applied**

- **Description**: Get job IDs user has applied to
- **Auth Required**: Yes
- **Query Params**: `email`
- **Use Case**: Prevent duplicate applications, show applied status

**GET /applications/status/:jobId/:email**

- **Description**: Check application status for specific job
- **Auth Required**: Yes
- **Response**: Application status or null

**PATCH /applications/:id**

- **Description**: Update application status (recruiter action)
- **Auth Required**: Yes (Recruiter)
- **Request Body**:

```json
{
  "status": "shortlisted",
  "notes": "Great candidate, schedule interview"
}
```

- **Status Flow**: applied → shortlisted → interview_scheduled → accepted/rejected

**POST /applications/send-email**

- **Description**: Send AI-generated email to candidate
- **Auth Required**: Yes (Recruiter)
- **Request Body**:

```json
{
  "to": "candidate@example.com",
  "subject": "Interview Invitation",
  "type": "interview",
  "candidateName": "John Doe",
  "jobTitle": "Frontend Developer",
  "companyName": "Tech Corp",
  "interviewDate": "2026-02-15",
  "recruiterName": "Sarah Wilson"
}
```

- **AI Integration**: Gemini generates professional email content
- **Implementation**: Nodemailer SMTP delivery

---

#### **AI Service Endpoints**

**POST /ai/analyze-resume**

- **Description**: Analyze resume PDF with Google Gemini AI
- **Auth Required**: Yes
- **Request Type**: `multipart/form-data`
- **Request Body**:

```json
{
  "resume": File, // PDF file
  "jobRequirements": ["React", "Node.js", "AWS"]
}
```

- **AI Process**:
  1. Parse PDF to text
  2. Send to Gemini with structured prompt
  3. Extract: skills, summary, match score (0-100), explanation
- **Response**:

```json
{
  "skills": ["React", "TypeScript", "Node.js", "AWS"],
  "summary": "Senior developer with 5 years experience...",
  "matchScore": 88,
  "explanation": "Strong match due to..."
}
```

**POST /ai/compare-candidates**

- **Description**: Compare up to 3 candidates with AI insights
- **Auth Required**: Yes (Recruiter)
- **Request Body**:

```json
{
  "jobId": "uuid",
  "candidateIds": ["uuid1", "uuid2", "uuid3"]
}
```

- **AI Integration**:
  - Analyzes all 3 resumes
  - Compares against job requirements
  - Generates comparative insights
  - Recommends best fit
- **Response**: Detailed comparison with AI recommendation

**POST /ai/generate-email**

- **Description**: Generate professional email using Gemini
- **Auth Required**: Yes (Recruiter)
- **Request Body**:

```json
{
  "type": "interview" | "acceptance" | "rejection",
  "candidateName": "John Doe",
  "jobTitle": "Frontend Developer",
  "companyName": "Tech Corp",
  "additionalInfo": { /* context-specific data */ }
}
```

- **AI Prompt Engineering**: Different prompts for each email type
- **Response**: Professional, empathetic email content

---

#### **Recruiter Request Endpoints**

**POST /recruiter-requests**

- **Description**: Submit request to become recruiter
- **Auth Required**: Yes (Candidate)
- **Request Body**:

```json
{
  "companyName": "Tech Corp",
  "companyEmail": "hr@techcorp.com",
  "companyWebsite": "https://techcorp.com",
  "position": "HR Manager",
  "reason": "I want to hire developers..."
}
```

**GET /recruiter-requests/my-request**

- **Description**: Get user's recruiter request status
- **Auth Required**: Yes
- **Response**: Request object with status and review notes

**GET /recruiter-requests**

- **Description**: Get all recruiter requests (admin view)
- **Auth Required**: Yes (Admin only)
- **Query Params**:
  - `status` (optional): pending | approved | rejected
- **Response**: Array of requests with user info

**PATCH /recruiter-requests/:id/review**

- **Description**: Approve or reject recruiter request
- **Auth Required**: Yes (Admin only)
- **Request Body**:

```json
{
  "status": "approved",
  "reviewNotes": "Verified company information"
}
```

- **Implementation**: Updates user role if approved

---

### 4.3 API Security Features

**1. JWT Authentication**

```typescript
// Protected route example
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Req() req) {
  return req.user;
}
```

**2. Role-Based Access Control (RBAC)**

```typescript
// Admin-only endpoint
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Get('admin/users')
getAllUsers() { }
```

**3. Input Validation**

```typescript
// DTO validation with class-validator
export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ArrayMinSize(1)
  requirements: string[];
}
```

**4. CORS Configuration**

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

---

## 5. AI Integration

### 5.1 Google Gemini AI Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Submission                    │
│              (Candidate uploads resume PDF)                  │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│               Step 1: File Upload & Storage                  │
│  - Upload PDF to Supabase Storage                            │
│  - Generate secure URL                                       │
│  - Store URL in database                                     │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│               Step 2: PDF Text Extraction                    │
│  - Download PDF from Supabase                                │
│  - Use pdf-parse library                                     │
│  - Extract raw text content                                  │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│           Step 3: AI Analysis (Google Gemini)                │
│                                                               │
│  Prompt Engineering:                                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ "You are an expert HR analyst. Analyze this resume   │  │
│  │  and extract:                                         │  │
│  │  1. Technical skills (array)                          │  │
│  │  2. Professional summary (1-2 sentences)              │  │
│  │  3. Match score (0-100) vs job requirements: [...]   │  │
│  │  4. Detailed explanation of match                     │  │
│  │                                                        │  │
│  │  Resume Text: {resumeText}                            │  │
│  │  Job Requirements: {requirements}                     │  │
│  │                                                        │  │
│  │  Respond ONLY with valid JSON."                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  Model: gemini-2.5-flash-latest                              │
│  Temperature: 0.7 (balanced creativity)                      │
│  Max Tokens: 1000                                            │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│            Step 4: Parse AI Response                         │
│  - Validate JSON structure                                   │
│  - Extract: skills, summary, matchScore, explanation         │
│  - Handle parsing errors gracefully                          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│          Step 5: Store in Database                           │
│  - Save application with aiAnalysis JSON field               │
│  - Store all extracted data for future queries              │
│  - Index by match score for sorting                          │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 AI Service Implementation

**Key Code: ai.service.ts**

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as pdf from "pdf-parse";

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async analyzeResume(
    resumeBuffer: Buffer,
    jobRequirements: string[],
  ): Promise<AIAnalysisResult> {
    // 1. Extract text from PDF
    const pdfData = await pdf(resumeBuffer);
    const resumeText = pdfData.text;

    // 2. Prepare AI prompt
    const prompt = this.buildAnalysisPrompt(resumeText, jobRequirements);

    // 3. Call Gemini AI
    const model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash-latest",
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    // 4. Parse response
    const response = result.response.text();
    const analysis = JSON.parse(this.cleanJsonResponse(response));

    return {
      skills: analysis.skills || [],
      summary: analysis.summary || "",
      matchScore: analysis.matchScore || 0,
      explanation: analysis.explanation || "",
    };
  }

  private buildAnalysisPrompt(
    resumeText: string,
    requirements: string[],
  ): string {
    return `You are an expert HR analyst and technical recruiter.

Analyze the following resume and job requirements.

RESUME TEXT:
${resumeText}

JOB REQUIREMENTS:
${requirements.join(", ")}

Extract the following information and respond ONLY with valid JSON:

{
  "skills": ["skill1", "skill2", ...],
  "summary": "Brief 1-2 sentence professional summary",
  "matchScore": 85,
  "explanation": "Detailed explanation of why this score was given"
}

Guidelines:
- skills: Extract all technical and soft skills
- summary: Concise professional background
- matchScore: 0-100 based on requirement match
- explanation: Specific examples from resume
- Be objective and fair
- Focus on measurable criteria`;
  }

  // Email generation with AI
  async generateEmail(type: string, context: any): Promise<string> {
    const prompt = this.buildEmailPrompt(type, context);
    const model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash-latest",
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}
```

### 5.3 AI Prompt Engineering Strategies

**1. Resume Analysis Prompt**

- Clear instruction: "You are an expert HR analyst"
- Structured format: JSON output specification
- Context provision: Resume text + job requirements
- Scoring criteria: 0-100 scale with explanation
- Edge case handling: Missing information defaults

**2. Email Generation Prompt**

- Professional tone setting
- Context awareness (interview/acceptance/rejection)
- Personalization variables (names, dates, company)
- Empathy in rejection emails
- Clear call-to-action in acceptance emails

**3. Candidate Comparison Prompt**

- Multi-candidate analysis
- Side-by-side comparison format
- Recommendation with reasoning
- Strengths and weaknesses of each
- Tie-breaking logic

### 5.4 AI Response Handling

**Error Handling**

```typescript
try {
  const analysis = await this.aiService.analyzeResume(buffer, requirements);
} catch (error) {
  // Fallback to basic analysis
  return {
    skills: this.extractSkillsBasic(resumeText),
    summary: "Unable to generate AI summary",
    matchScore: 50,
    explanation: "AI analysis unavailable, manual review required",
  };
}
```

**Response Validation**

```typescript
private validateAIResponse(analysis: any): AIAnalysisResult {
  return {
    skills: Array.isArray(analysis.skills) ? analysis.skills : [],
    summary: typeof analysis.summary === 'string' ? analysis.summary : '',
    matchScore: this.clampScore(analysis.matchScore),
    explanation: analysis.explanation || 'No explanation provided',
  };
}

private clampScore(score: any): number {
  const num = parseInt(score);
  if (isNaN(num)) return 50;
  return Math.max(0, Math.min(100, num));
}
```

---

## 6. Authentication & Authorization

### 6.1 Authentication Flow

**JWT-Based Authentication**

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │         │   Backend    │         │   Database   │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │ 1. POST /auth/login    │                        │
       │ {email, password}      │                        │
       ├───────────────────────>│                        │
       │                        │ 2. Find user by email  │
       │                        ├───────────────────────>│
       │                        │                        │
       │                        │ 3. User data           │
       │                        │<───────────────────────┤
       │                        │                        │
       │                        │ 4. Verify password     │
       │                        │    (bcrypt.compare)    │
       │                        │                        │
       │                        │ 5. Generate JWT token  │
       │                        │    (sign with secret)  │
       │                        │                        │
       │ 6. Response with token │                        │
       │    + user data         │                        │
       │<───────────────────────┤                        │
       │                        │                        │
       │ 7. Store token         │                        │
       │    (Cookie/LocalStorage)│                       │
       │                        │                        │
       │ 8. API request with    │                        │
       │    Authorization header│                        │
       ├───────────────────────>│                        │
       │                        │ 9. Verify JWT          │
       │                        │    (validate signature)│
       │                        │                        │
       │                        │ 10. Extract user ID    │
       │                        │     from token payload │
       │                        │                        │
       │ 11. Protected resource │                        │
       │<───────────────────────┤                        │
```

**JWT Token Structure**

```typescript
{
  "sub": "user-uuid",        // Subject (user ID)
  "email": "user@example.com",
  "role": "candidate",
  "iat": 1704067200,         // Issued at
  "exp": 1704153600          // Expiration (24 hours)
}
```

### 6.2 Google OAuth Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Frontend   │    │   Backend    │    │    Google    │    │   Database   │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │                   │
       │ 1. Click "Sign in │                   │                   │
       │    with Google"   │                   │                   │
       │                   │                   │                   │
       │ 2. Redirect to    │                   │                   │
       │    /auth/google   │                   │                   │
       ├──────────────────>│                   │                   │
       │                   │ 3. Redirect to    │                   │
       │                   │    Google OAuth   │                   │
       │                   ├──────────────────>│                   │
       │                   │                   │                   │
       │                   │   4. Google login │                   │
       │                   │      consent      │                   │
       │<──────────────────┼───────────────────┤                   │
       │                   │                   │                   │
       │                   │ 5. OAuth callback │                   │
       │                   │    with code      │                   │
       │                   │<──────────────────┤                   │
       │                   │                   │                   │
       │                   │ 6. Exchange code  │                   │
       │                   │    for user info  │                   │
       │                   ├──────────────────>│                   │
       │                   │                   │                   │
       │                   │ 7. User profile   │                   │
       │                   │    data           │                   │
       │                   │<──────────────────┤                   │
       │                   │                   │                   │
       │                   │ 8. Find or create user                │
       │                   ├──────────────────────────────────────>│
       │                   │                   │                   │
       │                   │ 9. User data      │                   │
       │                   │<──────────────────────────────────────┤
       │                   │                   │                   │
       │                   │ 10. Generate JWT  │                   │
       │                   │                   │                   │
       │ 11. Redirect with │                   │                   │
       │     token & data  │                   │                   │
       │<──────────────────┤                   │                   │
```

### 6.3 Role-Based Access Control (RBAC)

**Role Hierarchy**

```
┌─────────────────────────────────────────────────────────────┐
│                          ADMIN                               │
│  - Full system access                                        │
│  - Manage users and roles                                    │
│  - Approve recruiter requests                                │
│  - View all jobs and applications                            │
│  - System configuration                                      │
└──────────────────┬──────────────────────────────────────────┘
                   │
    ┌──────────────┴──────────────┐
    ▼                             ▼
┌──────────────────┐    ┌──────────────────┐
│    RECRUITER     │    │    CANDIDATE     │
│  - Post jobs     │    │  - Apply to jobs │
│  - View apps     │    │  - View apps     │
│  - Update status │    │  - Upload resume │
│  - Send emails   │    │  - View matches  │
└──────────────────┘    └──────────────────┘
```

**Implementation Example**

```typescript
// Roles guard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}

// Usage in controller
@Roles('recruiter', 'admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Post('jobs')
createJob(@Body() dto: CreateJobDto, @Req() req) {
  return this.jobsService.create(dto, req.user.id);
}
```

---

## 7. Data Flow

### 7.1 Complete Application Submission Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Candidate Initiates Application                     │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend: User fills form + uploads PDF resume              │
│ - Job ID                                                     │
│ - Candidate name and email                                   │
│ - Resume file (PDF, max 5MB)                                 │
└──────────────────┬──────────────────────────────────────────┘
                   │ FormData with multipart/form-data
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend: POST /applications                                  │
│                                                               │
│ Controller receives:                                         │
│ - @Body() applicationDto                                     │
│ - @UploadedFile() resume                                     │
│ - @Req() user (from JWT)                                     │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Validation                                           │
│ - Check if user already applied to this job                  │
│ - Validate PDF file type and size                            │
│ - Verify job exists and is active                            │
└──────────────────┬──────────────────────────────────────────┘
                   │ If valid
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Upload Resume to Supabase Storage                   │
│                                                               │
│ const fileName = `${userId}-${jobId}-${Date.now()}.pdf`;    │
│ const { data } = await supabase.storage                      │
│   .from('resumes')                                           │
│   .upload(fileName, resumeBuffer);                           │
│                                                               │
│ const resumeUrl = data.publicUrl;                            │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Fetch Job Requirements                               │
│                                                               │
│ const job = await prisma.job.findUnique({                    │
│   where: { id: jobId },                                      │
│   select: { requirements: true }                             │
│ });                                                          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 5: AI Resume Analysis                                   │
│                                                               │
│ const analysis = await aiService.analyzeResume(              │
│   resumeBuffer,                                              │
│   job.requirements                                           │
│ );                                                           │
│                                                               │
│ Returns:                                                     │
│ {                                                            │
│   skills: ["React", "Node.js", "TypeScript"],               │
│   summary: "5 years full-stack developer...",               │
│   matchScore: 88,                                            │
│   explanation: "Strong match due to..."                      │
│ }                                                            │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 6: Create Application in Database                      │
│                                                               │
│ const application = await prisma.application.create({        │
│   data: {                                                    │
│     userId,                                                  │
│     jobId,                                                   │
│     candidateName,                                           │
│     candidateEmail,                                          │
│     resumeUrl,                                               │
│     status: 'applied',                                       │
│     aiAnalysis: analysis  // JSON field                      │
│   }                                                          │
│ });                                                          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 7: Return Response to Frontend                         │
│                                                               │
│ HTTP 201 Created                                             │
│ {                                                            │
│   message: "Application submitted successfully",            │
│   data: {                                                    │
│     application,                                             │
│     aiAnalysis                                               │
│   }                                                          │
│ }                                                            │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend: Show Success + Display Match Score                │
│ - "Application submitted! Match Score: 88%"                  │
│ - Show extracted skills                                      │
│ - Display AI-generated summary                               │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Recruiter Review Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Recruiter views job applications                             │
└──────────────────┬──────────────────────────────────────────┘
                   │ GET /jobs/:id
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend returns job with all applications                    │
│ - Sorted by match score (highest first)                      │
│ - Includes AI analysis for each candidate                    │
│ - Includes resume URLs                                       │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Recruiter reviews candidates                                 │
│ - View AI match scores                                       │
│ - Read AI explanations                                       │
│ - Download resumes                                           │
│ - Compare up to 3 candidates side-by-side                    │
└──────────────────┬──────────────────────────────────────────┘
                   │ Decision made
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Update application status                                    │
│ PATCH /applications/:id                                      │
│ { status: "shortlisted", notes: "..." }                      │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Send email to candidate (optional)                           │
│ POST /applications/send-email                                │
│                                                               │
│ AI generates personalized email:                             │
│ - Interview invitations with date/time                       │
│ - Acceptance letters                                         │
│ - Polite rejection notices                                   │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Email sent via Nodemailer (SMTP)                             │
│ - Professional HTML formatting                               │
│ - Company branding                                           │
│ - Reply-to address                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Candidate receives email notification                        │
│ - Updates visible in candidate dashboard                     │
│ - Real-time status tracking                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Implementation Details

### 8.1 Key Service Implementations

**Applications Service (applications.service.ts)**

```typescript
@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async create(
    createDto: CreateApplicationDto,
    resumeFile: Express.Multer.File,
    userId: string,
  ) {
    // 1. Check for duplicate application
    const existing = await this.prisma.application.findUnique({
      where: {
        userId_jobId: { userId, jobId: createDto.jobId },
      },
    });

    if (existing) {
      throw new BadRequestException("Already applied to this job");
    }

    // 2. Upload resume to Supabase
    const resumeUrl = await this.uploadResume(
      resumeFile.buffer,
      userId,
      createDto.jobId,
    );

    // 3. Get job requirements
    const job = await this.prisma.job.findUnique({
      where: { id: createDto.jobId },
      select: { requirements: true },
    });

    // 4. Analyze resume with AI
    const aiAnalysis = await this.aiService.analyzeResume(
      resumeFile.buffer,
      job.requirements,
    );

    // 5. Create application
    return this.prisma.application.create({
      data: {
        userId,
        jobId: createDto.jobId,
        candidateName: createDto.candidateName,
        candidateEmail: createDto.candidateEmail,
        resumeUrl,
        status: "applied",
        aiAnalysis: aiAnalysis as any,
      },
      include: {
        job: true,
        user: { select: { name: true, email: true } },
      },
    });
  }

  async sendEmail(emailDto: SendEmailDto, recruiterId: string) {
    // Generate AI email content
    const emailContent = await this.aiService.generateEmail(
      emailDto.type,
      emailDto,
    );

    // Send via Nodemailer
    await this.emailService.send({
      to: emailDto.to,
      subject: emailDto.subject,
      html: this.formatEmailHtml(emailContent, emailDto),
    });

    return { message: "Email sent successfully" };
  }
}
```

**AI Service Core Methods**

````typescript
@Injectable()
export class AiService {
  async analyzeResume(
    resumeBuffer: Buffer,
    requirements: string[],
  ): Promise<AIAnalysis> {
    try {
      // Extract text from PDF
      const pdfData = await pdf(resumeBuffer);
      const text = pdfData.text;

      // Build prompt
      const prompt = `Analyze this resume against job requirements:

Requirements: ${requirements.join(", ")}

Resume:
${text}

Return JSON with: skills[], summary, matchScore (0-100), explanation`;

      // Call Gemini
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.5-flash-latest",
      });

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      // Parse and validate
      const analysis = this.parseAIResponse(response);
      return analysis;
    } catch (error) {
      // Fallback analysis
      return this.basicAnalysis(resumeBuffer, requirements);
    }
  }

  private parseAIResponse(response: string): AIAnalysis {
    // Clean markdown code blocks if present
    const cleaned = response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const data = JSON.parse(cleaned);

    // Validate and sanitize
    return {
      skills: Array.isArray(data.skills) ? data.skills : [],
      summary: typeof data.summary === "string" ? data.summary : "",
      matchScore: this.validateScore(data.matchScore),
      explanation: data.explanation || "No explanation provided",
    };
  }
}
````

### 8.2 File Upload & Storage

**Supabase Storage Integration**

```typescript
import { createClient } from "@supabase/supabase-js";

export class FileStorageService {
  private supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
  );

  async uploadResume(
    buffer: Buffer,
    userId: string,
    jobId: string,
  ): Promise<string> {
    const fileName = `${userId}/${jobId}/${Date.now()}.pdf`;

    const { data, error } = await this.supabase.storage
      .from("resumes")
      .upload(fileName, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException("File upload failed");
    }

    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from("resumes")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }

  async deleteResume(url: string): Promise<void> {
    const path = this.extractPathFromUrl(url);
    await this.supabase.storage.from("resumes").remove([path]);
  }
}
```

### 8.3 Email Service

**Nodemailer Implementation**

```typescript
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    const mailOptions = {
      from: `"AI Recruitment" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  formatInterviewEmail(data: InterviewEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: #667eea; color: white; padding: 20px; }
            .content { padding: 30px; }
            .button { 
              background: #667eea; 
              color: white; 
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Interview Invitation</h1>
            </div>
            <div class="content">
              <p>Dear ${data.candidateName},</p>
              <p>Congratulations! We're excited to invite you for an interview for the <strong>${data.jobTitle}</strong> position at ${data.companyName}.</p>
              
              <h3>Interview Details:</h3>
              <ul>
                <li><strong>Date:</strong> ${data.interviewDate}</li>
                <li><strong>Duration:</strong> 60 minutes</li>
                <li><strong>Format:</strong> Video call</li>
              </ul>
              
              <p>Please confirm your availability by replying to this email.</p>
              
              <p>Best regards,<br>${data.recruiterName}<br>${data.companyName}</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
```

---

## 9. Deployment Architecture

### 9.1 Production Infrastructure

```
┌─────────────────────────────────────────────────────────────┐
│                    Internet / Users                          │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌────────────────┐    ┌────────────────┐
│   Vercel CDN   │    │  Railway Edge  │
│   (Frontend)   │    │   (Backend)    │
└────────┬───────┘    └────────┬───────┘
         │                     │
         │ HTTPS API           │ HTTPS
         │ Calls               │ Database
         └──────────┬──────────┘ Connection
                    │            │
                    ▼            ▼
           ┌─────────────────────────────┐
           │   Railway Backend Instance  │
           │   - NestJS Application      │
           │   - Node.js 22.18.0        │
           │   - Auto-scaling           │
           │   - Health monitoring      │
           └──────────┬──────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│ PostgreSQL │ │  Supabase  │ │   Google   │
│  Database  │ │  Storage   │ │  Gemini AI │
│ (Supabase) │ │  (Resumes) │ │    API     │
└────────────┘ └────────────┘ └────────────┘
```

### 9.2 Environment Configuration

**Backend (Railway)**

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Authentication
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://backend-url/auth/google/callback

# AI
GEMINI_API_KEY=your-gemini-api-key

# Storage
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend
FRONTEND_URL=https://your-frontend.vercel.app

# Server
PORT=3000
NODE_ENV=production
```

**Frontend (Vercel)**

```bash
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
```

### 9.3 CI/CD Pipeline

**Automatic Deployment Flow**

```
Developer          GitHub              Railway/Vercel
    │                 │                      │
    │ git push        │                      │
    ├────────────────>│                      │
    │                 │ Webhook trigger      │
    │                 ├─────────────────────>│
    │                 │                      │
    │                 │                      │ 1. Clone repo
    │                 │                      │ 2. Install deps
    │                 │                      │ 3. Run build
    │                 │                      │ 4. Run tests
    │                 │                      │ 5. Deploy
    │                 │                      │
    │                 │  Deployment status   │
    │                 │<─────────────────────┤
    │ Notification    │                      │
    │<────────────────┤                      │
    │                 │                      │
    │                 │                      │ Service live
    │                 │                      │ Health check
    │                 │                      │ Auto-scaling
```

### 9.4 Monitoring & Health Checks

**Health Check Endpoint**

```typescript
@Get('health')
healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: await this.checkDatabase(),
    ai: await this.checkAIService(),
    storage: await this.checkStorage(),
  };
}
```

---

## 🔗 Project Links

- **GitHub Repository**: https://github.com/dnday/gdgoc-1
- **Backend API**: https://gdgoc-1-production.up.railway.app/
- **API Health Check**: https://gdgoc-1-production.up.railway.app/health

---

**Document Version**: 1.0  
**Last Updated**: January 31, 2026  
**Author**: Backend Development Team
