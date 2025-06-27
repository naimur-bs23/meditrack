import {
    AllowNull,
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
} from 'sequelize-typescript';
import { User } from './user.model';

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

    // TODO: Use Medicine Model when available
    @AllowNull(false)
    @Column(DataType.ARRAY(DataType.STRING))
    medicineList!: string[];

    @AllowNull(false)
    @Column(DataType.STRING)
    dosage!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    instructions!: string;

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
