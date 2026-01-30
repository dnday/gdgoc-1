# 🚀 Quick Start Guide

## ✅ Setup Sudah Selesai!

### 📧 Email Configuration (Gmail)

**SMTP Settings yang digunakan:**

- **SMTP_HOST**: `smtp.gmail.com` (Gmail SMTP server)
- **SMTP_PORT**: `587` (TLS/STARTTLS port)
- **EMAIL_USER**: `marcelinusdino99@gmail.com` (your Gmail)
- **EMAIL_PASS**: `pfothwlrfshgvxkp` (your App Password)

> **Catatan**: Port 587 adalah standard port untuk SMTP dengan STARTTLS (aman). Alternatif: Port 465 untuk SSL (perlu ubah `secure: true`)

---

## 👥 Login Credentials (Dummy Data)

### 👤 **Admin / Recruiter (Untuk Approve Request)**

```
Email: admin@airecruitment.com
Password: admin123
```

### 👨‍💼 **Recruiter (Tech Corp)**

```
Email: recruiter@techcorp.com
Password: recruiter123
```

### 👨‍🎓 **Candidate (Test User)**

```
Email: john.doe@email.com
Password: candidate123
```

---

## 📊 Dummy Data yang Sudah Dibuat

✅ **3 Users**:

- 1 Admin (sebagai recruiter juga)
- 2 Recruiters
- 1 Candidate

✅ **8 Job Postings**:

1. Senior Full Stack Developer
2. Frontend Developer (React)
3. DevOps Engineer
4. UI/UX Designer
5. Backend Developer (Node.js)
6. Mobile Developer (React Native)
7. Data Scientist
8. Product Manager

---

## 🔄 Testing Flow

### **1. Test Sebagai Candidate (Request Recruiter Access)**

1. **Login sebagai candidate**:

   ```
   Email: john.doe@email.com
   Password: candidate123
   ```

2. **Browse jobs** di dashboard candidate

3. **Request Recruiter Access**:
   - Klik button "Request Recruiter Access" atau buka `/request-recruiter`
   - Isi form:
     - Company Name: Tech Corp Indonesia
     - Company Email: john@techcorp.com
     - Position: HR Manager
     - Reason: Need to hire developers for our startup
   - Submit
   - ✉️ **Email confirmation** akan dikirim ke john.doe@email.com

### **2. Test Sebagai Admin (Approve Request)**

1. **Login sebagai admin**:

   ```
   Email: admin@airecruitment.com
   Password: admin123
   ```

2. **Buka Admin Dashboard**:
   - Akses: `http://localhost:3001/dashboard/admin/recruiter-requests`

3. **Review Request**:
   - Lihat request dari John Doe
   - Klik "Approve" atau "Reject"
   - Tambahkan notes (optional)
   - Confirm

4. **Email otomatis terkirim**:
   - ✅ Jika approve → Email "🎉 Recruiter Access Approved"
   - ❌ Jika reject → Email "❌ Recruiter Access Request - Update" dengan reason

### **3. Test Email yang Terkirim**

Cek email `john.doe@email.com` atau email mana pun yang digunakan saat request. Akan ada 2 email:

1. **Confirmation** - Saat submit request
2. **Decision** - Approval atau Rejection

---

## 🎯 URL Routes

### Frontend

- **Homepage**: http://localhost:3001/
- **Candidate Dashboard**: http://localhost:3001/dashboard/candidate
- **Recruiter Dashboard**: http://localhost:3001/dashboard
- **Request Recruiter**: http://localhost:3001/request-recruiter
- **Admin Requests**: http://localhost:3001/dashboard/admin/recruiter-requests

### Backend API

- **Get Jobs**: GET http://localhost:3000/jobs
- **Submit Request**: POST http://localhost:3000/recruiter-requests
- **Get My Request**: GET http://localhost:3000/recruiter-requests/my-request
- **List All Requests**: GET http://localhost:3000/recruiter-requests
- **Approve/Reject**: PATCH http://localhost:3000/recruiter-requests/:id/review

---

## 🐛 Troubleshooting

### Email tidak terkirim?

1. Cek console backend untuk error message
2. Pastikan App Password benar (bukan password biasa)
3. Cek koneksi internet
4. Pastikan Gmail tidak block "less secure apps"

### Cara cek email error:

```bash
# Di backend console, lihat log:
❌ Error sending approval email: [error details]
```

### Reset Data:

```bash
cd ai-recruitment-backend
npx prisma migrate reset  # Warning: Delete all data!
npm run seed  # Re-create dummy data
```

---

## 📝 Notes

### SMTP Host & Port Options:

**Gmail:**

- Host: `smtp.gmail.com`
- Port: `587` (TLS) atau `465` (SSL)

**Outlook/Hotmail:**

- Host: `smtp-mail.outlook.com`
- Port: `587`

**Yahoo:**

- Host: `smtp.mail.yahoo.com`
- Port: `587`

**Custom SMTP (e.g., SendGrid, AWS SES):**

- Lihat dokumentasi provider masing-masing

### Port Explanation:

- **587**: STARTTLS (recommended, secure)
- **465**: SSL (older, still secure)
- **25**: Plain text (tidak secure, biasanya di-block ISP)

---

## 🎉 Ready to Test!

Backend running: http://localhost:3000
Frontend running: http://localhost:3001

**Start testing approval flow sekarang!** 🚀
