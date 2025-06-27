import {
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from "sequelize-typescript";
import {Prescription} from "./prescription.model";
import {Medicine} from "./medicine.model";

@Table({
    tableName: 'prescription_medicines',
    timestamps: false
})
export class PrescriptionMedicine extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => Prescription)
    @Column(DataType.INTEGER)
    prescriptionId!: number;

    @ForeignKey(() => Medicine)
    @Column(DataType.INTEGER)
    medicineId!: number;

    @BelongsTo(() => Medicine, 'medicineId')
    medicine!: Medicine;

    @Column(DataType.STRING)
    dosage!: string;

    @Column(DataType.STRING)
    instructions!: string;
}