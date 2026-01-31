# AI Recruitment Platform - API Documentation

Complete API documentation for the AI Recruitment Platform backend.

## Base URL

```
Development: http://localhost:3000
Production: https://your-api-domain.com
```

## Table of Contents

1. [Authentication](#authentication)
2. [Auth Endpoints](#auth-endpoints)
3. [Jobs Endpoints](#jobs-endpoints)
4. [Applications Endpoints](#applications-endpoints)
5. [Recruiter Requests Endpoints](#recruiter-requests-endpoints)
6. [Error Handling](#error-handling)

---

## Authentication

### Authentication Methods

The API supports two authentication methods:

#### 1. JWT Bearer Token

For protected endpoints, include JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### 2. Google OAuth 2.0

For Google sign-in, use the OAuth flow endpoints.

### JWT Token Structure

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "candidate|recruiter|admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

---

## Auth Endpoints

### POST /auth/register

Register a new user with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201 Created):**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "candidate",
    "accountStatus": "active",
    "createdAt": "2026-01-31T10:00:00.000Z"
  },
  "message": "User registered successfully"
}
```

**Errors:**

- `400`: Email already exists
- `400`: Invalid email format

---

### POST /auth/login

Login with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "candidate",
    "picture": null
  }
}
```

**Errors:**

- `401`: Invalid credentials

---

### GET /auth/google

Initiate Google OAuth flow.

**Response:**
Redirects to Google OAuth consent screen.

---

### GET /auth/google/callback

Google OAuth callback endpoint.

**Query Parameters:**

- `code`: OAuth authorization code (provided by Google)

**Response:**
Redirects to frontend with query parameters:

```
http://localhost:3001/login-success?token=JWT_TOKEN&role=candidate&name=John&email=user@example.com&picture=url
```

---

## Jobs Endpoints

### GET /jobs

Get all jobs (public, no authentication required).

**Query Parameters:**

- None (returns all active jobs)

**Response (200 OK):**

```json
[
  {
    "id": "uuid",
    "title": "Senior Frontend Developer",
    "description": "We are looking for...",
    "requirements": "5+ years of experience...",
    "company": "TechCorp Solutions",
    "location": "Jakarta, Indonesia",
    "jobType": "Hybrid",
    "salaryMin": 15000000,
    "salaryMax": 25000000,
    "recruiterId": "uuid",
    "recruiter": {
      "id": "uuid",
      "name": "Sarah Wilson",
      "email": "sarah.wilson@techcorp.com"
    },
    "isActive": true,
    "createdAt": "2026-01-25T10:00:00.000Z",
    "_count": {
      "applications": 5
    }
  }
]
```

---

### GET /jobs/:id

Get single job by ID.

**Path Parameters:**

- `id`: Job UUID

**Response (200 OK):**

```json
{
  "id": "uuid",
  "title": "Senior Frontend Developer",
  "description": "We are looking for...",
  "requirements": "5+ years of experience...",
  "company": "TechCorp Solutions",
  "location": "Jakarta, Indonesia",
  "jobType": "Hybrid",
  "salaryMin": 15000000,
  "salaryMax": 25000000,
  "recruiterId": "uuid",
  "recruiter": {
    "id": "uuid",
    "name": "Sarah Wilson",
    "email": "sarah.wilson@techcorp.com"
  },
  "isActive": true,
  "createdAt": "2026-01-25T10:00:00.000Z",
  "applications": [...]
}
```

**Errors:**

- `404`: Job not found

---

### POST /jobs

Create a new job posting (recruiter only).

**Authentication:** Required (JWT)

**Request Body:**

```json
{
  "title": "Senior Backend Developer",
  "description": "Job description here...",
  "requirements": "Requirements list...",
  "company": "Tech Company",
  "location": "Jakarta",
  "jobType": "Hybrid",
  "salaryMin": 15000000,
  "salaryMax": 25000000
}
```

**Response (201 Created):**

```json
{
  "id": "uuid",
  "title": "Senior Backend Developer",
  "description": "Job description here...",
  "requirements": "Requirements list...",
  "company": "Tech Company",
  "location": "Jakarta",
  "jobType": "Hybrid",
  "salaryMin": 15000000,
  "salaryMax": 25000000,
  "recruiterId": "uuid",
  "isActive": true,
  "createdAt": "2026-01-31T10:00:00.000Z"
}
```

**Errors:**

- `401`: Unauthorized (not logged in)
- `403`: Forbidden (not a recruiter)

---

### PATCH /jobs/:id

Update a job posting.

**Authentication:** Required (JWT, must be job owner)

**Request Body:** (all fields optional)

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "isActive": false
}
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "title": "Updated Title",
  "description": "Updated description"
}
```

---

### DELETE /jobs/:id

Delete a job posting.

**Authentication:** Required (JWT, must be job owner)

**Response (200 OK):**

```json
{
  "message": "Job deleted successfully"
}
```

---

## Applications Endpoints

### POST /applications

Submit a job application with resume upload.

**Authentication:** Not required (public endpoint)

**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**

```
jobId: uuid
candidateName: "John Doe"
email: "john@example.com"
resume: [PDF FILE]
```

**Response (201 Created):**

```json
{
  "id": "uuid",
  "jobId": "uuid",
  "candidateName": "John Doe",
  "email": "john@example.com",
  "resumeUrl": "https://supabase.co/storage/v1/object/public/resumes/...",
  "resumeText": "Extracted resume text...",
  "skillsExtracted": ["React", "TypeScript", "Node.js"],
  "summary": "Experienced full-stack developer...",
  "matchScore": 85,
  "matchExplanation": "Candidate has strong technical skills...",
  "status": "applied",
  "createdAt": "2026-01-31T10:00:00.000Z"
}
```

**Errors:**

- `400`: Already applied to this job
- `400`: Invalid file format (PDF only)
- `404`: Job not found

---

### GET /applications/job/:jobId

Get all applications for a specific job.

**Authentication:** Required (JWT, must be job owner or admin)

**Response (200 OK):**

```json
[
  {
    "id": "uuid",
    "jobId": "uuid",
    "candidateName": "John Doe",
    "email": "john@example.com",
    "resumeUrl": "https://...",
    "skillsExtracted": ["React", "TypeScript"],
    "summary": "Experienced developer...",
    "matchScore": 85,
    "matchExplanation": "Strong match...",
    "status": "applied",
    "createdAt": "2026-01-31T10:00:00.000Z"
  }
]
```

---

### GET /applications/check/:jobId/:email

Check if user has already applied to a job.

**Response (200 OK):**

```json
{
  "hasApplied": true,
  "applicationId": "uuid"
}
```

---

### GET /applications/candidate/applied

Get all job IDs that a candidate has applied to.

**Query Parameters:**

- `email`: Candidate email (required)

**Response (200 OK):**

```json
{
  "appliedJobIds": ["uuid1", "uuid2", "uuid3"]
}
```

---

### GET /applications/user/:userId

Get all applications submitted by a specific user.

**Authentication:** Required (JWT)

**Response (200 OK):**

```json
[
  {
    "id": "uuid",
    "jobId": "uuid",
    "job": {
      "id": "uuid",
      "title": "Senior Frontend Developer",
      "company": "TechCorp"
    },
    "candidateName": "John Doe",
    "email": "john@example.com",
    "status": "interview_scheduled",
    "matchScore": 85,
    "createdAt": "2026-01-31T10:00:00.000Z"
  }
]
```

---

### GET /applications/status/:jobId/:email

Get application status for a specific job and email.

**Response (200 OK):**

```json
{
  "id": "uuid",
  "status": "interview_scheduled",
  "matchScore": 85,
  "summary": "Experienced developer...",
  "createdAt": "2026-01-31T10:00:00.000Z"
}
```

**Response (404 Not Found):**

```json
{
  "message": "Application not found"
}
```

---

### POST /applications/generate-draft

Generate AI-powered email draft for application response.

**Authentication:** Required (JWT, recruiter)

**Request Body:**

```json
{
  "appId": "uuid",
  "action": "accepted",
  "interviewDate": "February 15, 2026 at 10:00 AM"
}
```

OR

```json
{
  "appId": "uuid",
  "action": "rejected"
}
```

**Response (200 OK):**

```json
{
  "subject": "Interview Invitation - Senior Frontend Developer Position",
  "message": "Dear John Doe,\n\nWe are pleased to inform you..."
}
```

---

### POST /applications/send-email

Send email to candidate and update application status.

**Authentication:** Required (JWT, recruiter)

**Request Body:**

```json
{
  "appId": "uuid",
  "to": "john@example.com",
  "subject": "Interview Invitation",
  "message": "Email body here...",
  "status": "accepted"
}
```

**Response (200 OK):**

```json
{
  "message": "Email sent and status updated",
  "application": {
    "id": "uuid",
    "status": "accepted",
    "statusHistory": ["applied", "accepted"]
  }
}
```

**Errors:**

- `404`: Application not found
- `500`: Failed to send email

---

## Recruiter Requests Endpoints

### POST /recruiter-requests

Submit a request to become a recruiter.

**Authentication:** Required (JWT)

**Request Body:**

```json
{
  "companyName": "Tech Innovations Inc",
  "companyWebsite": "https://techinnovations.com",
  "companyEmail": "hr@techinnovations.com",
  "position": "Senior HR Manager",
  "reason": "I am representing Tech Innovations Inc..."
}
```

**Response (201 Created):**

```json
{
  "id": "uuid",
  "userId": "uuid",
  "companyName": "Tech Innovations Inc",
  "companyWebsite": "https://techinnovations.com",
  "companyEmail": "hr@techinnovations.com",
  "position": "Senior HR Manager",
  "reason": "I am representing...",
  "status": "pending",
  "submittedAt": "2026-01-31T10:00:00.000Z"
}
```

**Errors:**

- `400`: User already has a pending/approved request

---

### GET /recruiter-requests

Get all recruiter requests (admin only).

**Authentication:** Required (JWT, admin)

**Query Parameters:**

- `status`: Filter by status (optional): `pending`, `approved`, `rejected`

**Response (200 OK):**

```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "companyName": "Tech Innovations Inc",
    "companyWebsite": "https://techinnovations.com",
    "companyEmail": "hr@techinnovations.com",
    "position": "Senior HR Manager",
    "reason": "I am representing...",
    "status": "pending",
    "submittedAt": "2026-01-31T10:00:00.000Z"
  }
]
```

---

### GET /recruiter-requests/my-request

Get current user's recruiter request.

**Authentication:** Required (JWT)

**Response (200 OK):**

```json
{
  "id": "uuid",
  "companyName": "Tech Innovations Inc",
  "status": "pending",
  "submittedAt": "2026-01-31T10:00:00.000Z",
  "reviewedAt": null,
  "reviewNotes": null
}
```

**Response (404 Not Found):**

```json
{
  "message": "No request found"
}
```

---

### PATCH /recruiter-requests/:id/review

Approve or reject a recruiter request (admin only).

**Authentication:** Required (JWT, admin)

**Request Body:**

```json
{
  "status": "approved",
  "reviewNotes": "Application looks good"
}
```

OR

```json
{
  "status": "rejected",
  "reviewNotes": "Insufficient information provided"
}
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "status": "approved",
  "reviewedAt": "2026-01-31T10:30:00.000Z",
  "reviewedBy": "admin-uuid",
  "reviewNotes": "Application looks good",
  "user": {
    "role": "recruiter"
  }
}
```

**Side Effects:**

- If approved, user's role is changed from `candidate` to `recruiter`
- User receives email notification of decision

---

## Error Handling

### Error Response Format

All errors follow this structure:

```json
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "Bad Request"
}
```

### Common Error Messages

| Status Code | Message               | Description                             |
| ----------- | --------------------- | --------------------------------------- |
| 400         | Bad Request           | Invalid request body or parameters      |
| 401         | Unauthorized          | Missing or invalid authentication token |
| 403         | Forbidden             | Insufficient permissions                |
| 404         | Not Found             | Resource not found                      |
| 409         | Conflict              | Resource already exists                 |
| 500         | Internal Server Error | Server error                            |

---

## Status Codes

### Application Status Values

- `applied`: Initial status when application is submitted
- `shortlisted`: Recruiter marked as potential candidate
- `interview_scheduled`: Interview date has been set
- `accepted`: Candidate accepted for position
- `rejected`: Application declined

### User Roles

- `candidate`: Regular user, can apply to jobs
- `recruiter`: Can post jobs and review applications
- `admin`: Full administrative access

### Job Types

- `Remote`: Work from anywhere
- `Onsite`: Work from office
- `Hybrid`: Mix of remote and onsite

---

**Last Updated:** January 31, 2026

**API Version:** 1.0.0
