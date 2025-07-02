# MediTrack

MediTrack is a comprehensive medical prescription management system that allows doctors to create and manage prescriptions for patients, and pharmacists to manage the medicine inventory.

## Features

### User Management
- **Registration and Authentication**: Users can register and log in with email and password
- **Role-based Access Control**: Different functionalities based on user roles (Patient, Doctor, Pharmacist, Admin)
- **JWT Authentication**: Secure token-based authentication

### Prescription Management
- **Create Prescriptions**: Doctors can create prescriptions for patients
- **View Prescriptions**: 
  - Doctors can view prescriptions they created
  - Patients can view prescriptions assigned to them
- **Update Prescriptions**: Doctors can update their prescriptions (date, patient, medicines)
- **Delete Prescriptions**: Doctors can delete their prescriptions
- **Medicine Association**: Prescriptions can include multiple medicines with specific dosage and instructions

### Medicine Management
- **Create Medicines**: Pharmacists can add new medicines to the inventory
- **View Medicines**: All authenticated users can view the medicine inventory
- **Update Medicines**: Pharmacists can update medicine details
- **Delete Medicines**: Pharmacists can remove medicines from the inventory

## Entities

### User
- **Fields**:
  - `id`: Unique identifier
  - `name`: User's full name
  - `email`: User's email address (unique)
  - `password`: Hashed password
  - `role`: User role (Patient, Doctor, Pharmacist, Admin)
  - `createdAt`: Account creation timestamp
  - `updatedAt`: Account update timestamp

### Medicine
- **Fields**:
  - `id`: Unique identifier
  - `name`: Medicine name
  - `type`: Medicine type/category
  - `description`: Detailed description of the medicine

### Prescription
- **Fields**:
  - `id`: Unique identifier
  - `doctorId`: ID of the doctor who created the prescription
  - `patientId`: ID of the patient the prescription is for
  - `date`: Date of the prescription
  - `createdAt`: Prescription creation timestamp
  - `updatedAt`: Prescription update timestamp
- **Relationships**:
  - Belongs to a Doctor (User with Doctor role)
  - Belongs to a Patient (User with Patient role)
  - Has many PrescriptionMedicines
  - Has many Medicines through PrescriptionMedicines

### PrescriptionMedicine (Junction Entity)
- **Fields**:
  - `id`: Unique identifier
  - `prescriptionId`: ID of the associated prescription
  - `medicineId`: ID of the associated medicine
  - `dosage`: Prescribed dosage for the medicine
  - `instructions`: Special instructions for taking the medicine
- **Relationships**:
  - Belongs to a Prescription
  - Belongs to a Medicine

## User Roles and Permissions

### Patient
- View their own prescriptions
- View medicine details

### Doctor
- Create, view, update, and delete prescriptions for patients
- View medicine details

### Pharmacist
- Create, view, update, and delete medicines
- View all prescriptions

### Admin
- Full access to all features
- User management capabilities

## API Endpoints

### Authentication
- `POST /auth/register`: Register a new user
- `POST /auth/login`: Log in and receive JWT token

### Prescriptions
- `POST /prescriptions`: Create a new prescription (Doctor only)
- `GET /prescriptions`: Get all prescriptions (filtered by user role)
- `GET /prescriptions/:id`: Get a specific prescription
- `PUT /prescriptions/:id`: Update a prescription (Doctor only)
- `DELETE /prescriptions/:id`: Delete a prescription (Doctor only)

### Medicines
- `POST /medicines`: Add a new medicine (Pharmacist only)
- `GET /medicines`: Get all medicines
- `GET /medicines/:id`: Get a specific medicine
- `PUT /medicines/:id`: Update a medicine (Pharmacist only)
- `DELETE /medicines/:id`: Delete a medicine (Pharmacist only)

## Technology Stack
- **Backend**: Node.js with Express
- **Database**: SQL database with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger