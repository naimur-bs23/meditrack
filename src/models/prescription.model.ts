import {
    AllowNull,
    AutoIncrement,
    BelongsTo, BelongsToMany,
    Column,
    CreatedAt,
    DataType,
    ForeignKey, HasMany,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt
} from 'sequelize-typescript';
import { User } from './user.model';
import {PrescriptionMedicine} from "./prescription-medicine.model";
import {Medicine} from "./medicine.model";

@Table({
    tableName: 'prescriptions',
    timestamps: true
})
export class Prescription extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    doctorId!: number;

    @BelongsTo(() => User, 'doctorId')
    doctor!: User;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    patientId!: number;

    @BelongsTo(() => User, 'patientId')
    patient!: User;

    @HasMany(() => PrescriptionMedicine)
    prescriptionMedicines!: PrescriptionMedicine[];

    @BelongsToMany(() => Medicine, () => PrescriptionMedicine)
    medicines!: Medicine[];

    @AllowNull(false)
    @Column(DataType.DATE)
    date!: Date;

    @CreatedAt
    @Column(DataType.DATE)
    createdAt!: Date;

    @UpdatedAt
    @Column(DataType.DATE)
    updatedAt!: Date;
}
