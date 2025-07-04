export interface MedicineItem {
    medicineId: number;
    dosage: string;
    instructions: string;
    durationDays: number;
    scheduleTimes: string[];
}

export interface PrescriptionRequest {
    patientId: number;
    date: Date;
    prescriptionMedicines: MedicineItem[];
}