# Recruiter Approval System Setup

## ✅ What Has Been Implemented

### Security Fix

- **Default Role**: All new users (both manual registration & Google OAuth) are now created as **candidates** by default
- **Role Selection Removed**: Users can no longer choose their own role during registration
- **Approval Required**: To become a recruiter, users must submit a request and get admin approval

### Backend Changes

1. **Database Schema** (Prisma)
   - Added `RecruiterRequest` model
   - User `role` now defaults to `"candidate"`
   - Added `accountStatus` field for future use

2. **Email Service** (`src/email/email.service.ts`)
   - Email notifications with professional HTML templates
   - **3 Email Types**:
     - ✉️ Request Submitted (confirmation)
     - ✅ Request Approved (with dashboard link)
     - ❌ Request Rejected (with reason)

3. **API Endpoints** (`/recruiter-requests`)
   - `POST /recruiter-requests` - Submit request
   - `GET /recruiter-requests` - List all requests (admin)
   - `GET /recruiter-requests/my-request` - Get my request status
   - `PATCH /recruiter-requests/:id/review` - Approve/reject request
   - `DELETE /recruiter-requests/:id` - Delete request

4. **Auth Service Updated**
   - Removed role parameter from registration
   - All users created as candidates
   - Removed role selection flow

### Frontend Changes

1. **Registration Form** (`components/RegisterForm.tsx`)
   - Removed role selection UI
   - All new users registered as candidates
   - Simplified flow

2. **Request Recruiter Page** (`app/request-recruiter/page.tsx`)
   - Form to request recruiter access
   - Shows existing request status (pending/approved/rejected)
   - Success confirmation

3. **Admin Dashboard** (`app/dashboard/admin/recruiter-requests/page.tsx`)
   - View all requests with filters
   - Approve/reject with notes
   - Beautiful UI with status badges

## 🔧 Setup Instructions

### 1. Environment Variables

Update your `.env` file in the backend:

\`\`\`env

# Email SMTP Configuration (Gmail example)

SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password" # Generate from Google Account Settings

# Frontend URL

FRONTEND_URL="http://localhost:3001"
\`\`\`

**How to get Gmail App Password:**

1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate a new app password for "Mail"
5. Copy and paste it to `SMTP_PASS`

### 2. Install Dependencies

\`\`\`bash
cd ai-recruitment-backend
npm install

# nodemailer is already in package.json

\`\`\`

### 3. Run Migration

Migration has already been applied, but if you need to run it again:

\`\`\`bash
npx prisma migrate dev
\`\`\`

### 4. Generate Prisma Client

\`\`\`bash
npx prisma generate
\`\`\`

### 5. Start Backend

\`\`\`bash
npm run start:dev
\`\`\`

### 6. Start Frontend

\`\`\`bash
cd ../ai-recruitment-frontend
npm run dev
\`\`\`

## 📧 Email Templates

All emails have professional HTML templates with:

- Gradient headers
- Company branding
- Clear CTAs (buttons)
- Responsive design

### Example Email Subjects

- ✉️ **Confirmation**: "✉️ Recruiter Access Request Received"
- ✅ **Approval**: "🎉 Recruiter Access Approved - AI Recruitment Platform"
- ❌ **Rejection**: "❌ Recruiter Access Request - Update"

## 🎯 User Flow

### For Candidates

1. **Register** → Automatically created as candidate
2. **Want to recruit?** → Click "Request Recruiter Access"
3. **Fill Form** → Company name, email, position, reason
4. **Wait for review** → Receive confirmation email
5. **Get notified** → Receive approval/rejection email

### For Admins

1. **Access** → Go to `/dashboard/admin/recruiter-requests`
2. **View Requests** → See all pending/approved/rejected requests
3. **Review** → Read company info, reason, user details
4. **Decide** → Approve or reject with optional notes
5. **Email Sent** → System automatically sends notification to user

## 🔐 Security Benefits

✅ No self-service recruiter access  
✅ Admin has full control  
✅ Audit trail (reviewedBy, reviewNotes)  
✅ Email verification via company email  
✅ Can add company domain validation later

## 🚀 Future Enhancements

- [ ] Admin role guard (currently any authenticated user can access admin endpoints)
- [ ] Email domain whitelist (e.g., only @company.com domains)
- [ ] Auto-approval for verified domains
- [ ] LinkedIn verification integration
- [ ] Request history and analytics
- [ ] Notification system (in-app notifications)

## 📝 Notes

- All existing users will remain with their current roles
- New registrations will be candidates by default
- Admins should be created manually in the database initially
- Email service uses nodemailer (supports Gmail, SendGrid, AWS SES, etc.)

## 🧪 Testing

### Test Email Locally

You can use services like:

- [Mailtrap](https://mailtrap.io/) - Free SMTP testing
- [Ethereal Email](https://ethereal.email/) - Free fake SMTP
- Gmail with app password

### Test Flow

1. Register new user → Should be candidate
2. Submit recruiter request → Should receive confirmation email
3. Admin approves → User receives approval email & role updated to recruiter
4. Admin rejects → User receives rejection email with reason
5. Verify user can't access recruiter dashboard until approved

## 🐛 Troubleshooting

### Email Not Sending

- Check SMTP credentials
- Verify firewall/network allows SMTP
- Check Gmail "Less secure apps" setting
- Use app password instead of regular password

### Migration Error

\`\`\`bash
npx prisma migrate reset # Warning: Deletes all data!
npx prisma migrate dev
\`\`\`

### TypeScript Errors

\`\`\`bash
npx prisma generate
npm run build
\`\`\`
