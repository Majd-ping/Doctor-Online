# Quick Start Guide - Doctor Online Platform

## 🚀 Setup & Run in 3 Steps

### Step 1: Seed Database (One-time setup)

```bash
mysql -u root doctor_online < backend/seed.sql
```

**Note**: If prompted for password, just press Enter (XAMPP default)

### Step 2: Start Backend

```bash
cd backend
npm start
```

**Expected Output**: `MySQL connected` and server listening on port 5000

### Step 3: Start Frontend (in new terminal)

```bash
cd dr-online
npm start
```

**App loads on**: http://localhost:3000

---

## 🔐 Test Login Credentials

```
Email: john@patient.com
Password: password
```

Other users available:

- sarah@patient.com / password (Patient)
- mike@patient.com / password (Patient)
- ahmed@doctor.com / password (Doctor)
- fatima@doctor.com / password (Doctor)
- hassan@doctor.com / password (Doctor)

---

## 🎯 Test the Comments Feature

1. Login with above credentials
2. Click any post on Dashboard
3. Scroll down to **Comments** section
4. See 4 sample comments (already in database)
5. Add your own comment in the textarea
6. Click "Post Comment"
7. Your comment appears instantly! ✨

---

## 📋 What's Implemented

✅ **Authentication**

- Register new users (choose Patient or Doctor)
- Login with email/password
- JWT tokens (stored in localStorage)
- Logout functionality

✅ **Discussions Forum**

- View all discussions
- Create new discussion topics
- See author names and dates

✅ **Posts & Comments**

- Browse health articles
- View full post content
- **NEW**: Read and post comments on articles
- Real-time comment updates

✅ **Services**

- View available medical services
- Clean card layout

✅ **Doctors**

- View doctor directory (backend ready)
- Specialization and experience info

✅ **Contact Form**

- Submit inquiries
- Automatic email validation

---

## 🏗️ Architecture

**Backend**: Express.js + MySQL

- 8+ RESTful API endpoints
- JWT authentication
- Password hashing with bcryptjs
- Database relationships with foreign keys

**Frontend**: React 18 + React Router

- Component-based architecture
- Context API for state management
- Bootstrap 5 styling
- Real-time API integration

**Database**: MySQL with 8 tables

- users (6 seed users)
- posts (3 articles)
- comments (4 sample comments)
- discussions (4 topics)
- doctors (3 doctors)
- services (5 services)
- appointments (6 appointments)
- contact_messages (empty, ready for submissions)

---

## 🔗 API Endpoints

| Method   | Endpoint                  | Purpose                  |
| -------- | ------------------------- | ------------------------ |
| POST     | /api/register             | Create new user          |
| POST     | /api/login                | Authenticate user        |
| GET      | /api/posts                | Get all posts            |
| GET      | /api/posts/:id            | Get post details         |
| **GET**  | **/api/comments/:postId** | **Get post comments** ⭐ |
| **POST** | **/api/comments/:postId** | **Add comment** ⭐       |
| GET      | /api/discussions          | Get all discussions      |
| POST     | /api/discussions          | Create discussion        |
| GET      | /api/services             | Get all services         |
| GET      | /api/doctors              | Get all doctors          |
| POST     | /api/contact              | Submit contact form      |
| POST     | /api/appointments         | Book appointment         |

⭐ = Newly implemented

---

## 🐛 Troubleshooting

**"MySQL not connecting"**

- Check XAMPP MySQL is running
- Verify database name: `doctor_online`
- Default MySQL user: `root` with no password

**"Port 3000 or 5000 already in use"**

```bash
# Windows: Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**"Comments not appearing"**

- Clear browser cache (Ctrl+Shift+Delete)
- Make sure you're logged in to post
- Check console for API errors (F12 → Console)

**"Login fails"**

- Verify email is correct: `john@patient.com`
- Check password: `password`
- Database is seeded: `mysql doctor_online -u root < seed.sql`

---

## 📞 Support

All files are ready to use. If something doesn't work:

1. Check MySQL is running (XAMPP Control Panel)
2. Verify seed.sql was executed (check database in phpMyAdmin)
3. Check backend console for error messages
4. Check browser console (F12) for frontend errors
5. Review files in `backend/server.js` for endpoint logic

---

**Everything is configured and ready to go!** 🎉
