import * as bcrypt from 'bcrypt';

import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    Unique,
    CreatedAt,
    UpdatedAt, BeforeSave
} from 'sequelize-typescript';

export enum UserRole {
    PATIENT = 'patient',
    DOCTOR = 'doctor',
    PHARMACIST = 'pharmacist',
    ADMIN = 'admin'
}

@Table({
    tableName: 'users',
    timestamps: true
})
export class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull
    @Column(DataType.STRING)
    name!: string;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING)
    email!: string;

    @Column(DataType.STRING)
    telegramUsername!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    password!: string;

    @AllowNull(false)
    @Column(DataType.ENUM(...Object.values(UserRole)))
    role!: UserRole;

    @CreatedAt
    @Column(DataType.DATE)
    createdAt!: Date;

    @UpdatedAt
    @Column(DataType.DATE)
    updatedAt!: Date;

    @BeforeSave
    static async hashPassword(user: User) {
        if(user.changed('password')) {
            const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
            const salt = await bcrypt.genSalt(saltRounds);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}