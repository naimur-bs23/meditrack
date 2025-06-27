# 💊 Prescription & Medicine Tracker – MVP Task List

## 📌 Tech Stack
- Backend: Node.js (Express)
- Database: PostgreSQL
- ORM: Sequelize
- Authentication: JWT
- Deployment: Docker

---

## ✅ Phase 1: Project Setup

- [x] Initialize Node.js project (`npm init`)
- [x] Setup Express server
- [x] Connect to PostgreSQL using ORM (Sequelize)
- [x] Create environment config (.env)
- [x] Setup basic folder structure (`controllers`, `routes`, `models`, `middleware`)

---

## 👥 Phase 2: User Authentication & Roles

- [x] Create user model (roles: patient, doctor, pharmacist)
- [x] Register endpoint (`POST /auth/register`)
- [x] Login endpoint (`POST /auth/login`)
- [x] JWT-based authentication middleware
- [x] Role-based access control middleware

---

## 🧾 Phase 3: Prescription Management

- [x] Prescription model (doctor_id, patient_id, medicine_list, dosage, start_date, end_date, notes)
- [x] `POST /prescriptions` – Create prescription (doctor only)
- [x] `GET /prescriptions/:id` – View prescription (doctor, patient, pharmacist)
- [x] `GET /prescriptions` – List prescriptions for logged-in user
- [x] `PUT /prescriptions/:id` – Update prescription (doctor only)
- [x] `DELETE /prescriptions/:id` – Delete prescription (optional)

---

## 💊 Phase 4: Medicine Inventory (Basic)

- [x] Medicine model (name, type, manufacturer, stock_count, expiry_date)
- [ ] `POST /medicines` – Add medicine (pharmacist only)
- [ ] `GET /medicines` – View all medicines
- [ ] `PUT /medicines/:id` – Update medicine stock/details
- [ ] `DELETE /medicines/:id` – Remove medicine (optional)

---

## ⏰ Phase 5: Medication Reminders (MVP placeholder)

- [ ] Schedule model (prescription_id, time_of_day, reminder_type)
- [ ] Simple reminder endpoint (`GET /reminders`) – returns schedule for logged-in user
- [ ] (Optional) Setup cron job or external scheduler for reminders

---

## 🛡️ Phase 6: Security & Validation

- [ ] Input validation with Joi / express-validator
- [ ] Hash passwords with bcrypt
- [ ] Secure sensitive routes with auth/role middleware
- [ ] Use helmet & rate-limiting middleware

---

## 📄 Phase 7: Documentation

- [x] API documentation (Swagger)
- [ ] Set up README with installation instructions

---
