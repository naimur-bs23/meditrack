import {
    AutoIncrement,
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt
} from "sequelize-typescript";
import {PrescriptionMedicine} from "./prescription-medicine.model";

@Table({
    tableName: 'medicine_reminders',
    timestamps: true
})
export class MedicineReminder extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => PrescriptionMedicine)
    @Column(DataType.INTEGER)
    prescriptionMedicineId!: number;

    @BelongsTo(() => PrescriptionMedicine, 'prescriptionMedicineId')
    prescriptionMedicine!: PrescriptionMedicine;

    @Column(DataType.DATE)
    reminderTime!: Date;

    @Column(DataType.BOOLEAN)
    sent!: boolean;

    @Column(DataType.BOOLEAN)
    acknowledged!: boolean;

    @Column(DataType.DATE)
    acknowledgedTime!: Date;

    @CreatedAt
    @Column(DataType.DATE)
    createdAt!: Date;

    @UpdatedAt
    @Column(DataType.DATE)
    updatedAt!: Date;
}