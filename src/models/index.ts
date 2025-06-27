import {Sequelize} from "sequelize-typescript";
import {User} from "./user.model";
import {Prescription} from "./prescription.model";


export const sequelize = new Sequelize({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'postgres',
    models: [User, Prescription],
    logging: false,
});