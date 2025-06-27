export interface PrescriptionRequest {
    doctorId: number;
    patientId: number;
    medicineList: string[];
    dosage: string;
    instructions: string;
    date: Date;
}