# Database Seed Data Guide

## Setup Instructions

### 1. Create the Database

```sql
CREATE DATABASE doctor_online;
USE doctor_online;
```

### 2. Run Backend (Tables are Auto-Created)

The backend server will automatically create all tables when started:

- `users`
- `doctors`
- `appointments`
- `posts`
- `services`
- `discussions`

```bash
cd backend
npm install
npm start
```

### 3. Populate Sample Data (Optional)

Once the tables are created, import the seed data:

```bash
mysql -u root -p doctor_online < seed.sql
```

**Note:** The seed data includes:

- 6 sample users (3 patients, 3 doctors)
- 3 doctor profiles with specializations and fees
- 6 sample appointments
- 3 blog posts
- 5 services
- 4 discussion topics

### Sample Login Credentials

**Patients:**

- Email: `john@patient.com` | Password: `password`
- Email: `sarah@patient.com` | Password: `password`
- Email: `mike@patient.com` | Password: `password`

**Doctors:**

- Email: `ahmed@doctor.com` | Password: `password`
- Email: `fatima@doctor.com` | Password: `password`
- Email: `hassan@doctor.com` | Password: `password`

**Note:** All sample passwords are hashed with bcrypt. The plain password is `password` (hashed to: `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/1Fm`)

## Backend Endpoints

### Authentication

- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Doctors

- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get single doctor

### Appointments

- `POST /api/appointments` - Book new appointment
- `GET /api/appointments/patient/:patient_id` - Get patient's appointments
- `GET /api/appointments/doctor/:doctor_id` - Get doctor's appointments
- `PUT /api/appointments/:id` - Update appointment status

### Posts

- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post

### Services

- `GET /api/services` - Get all services

### Discussions

- `GET /api/discussions` - Get all discussions
- `POST /api/discussions` - Create new discussion

## Database Schema

### users

```
id, name, email, password, role (Patient/Doctor), created_at
```

### doctors

```
id, user_id, specialization, experience (years), fees, availability, created_at
```

### appointments

```
id, doctor_id, patient_id, appointment_date, appointment_time, status (pending/confirmed/cancelled), created_at
```

### posts

```
id, title, author, category, summary, content, created_at
```

### services

```
id, title, description, created_at
```

### discussions

```
id, user_id, topic, created_at
```
