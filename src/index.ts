import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import router from "./routes/app.routes";
import {setupSwagger} from "./swagger/swagger";
import {sequelize} from "./models";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);
setupSwagger(app);

async function start() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established.');

        await sequelize.sync({ alter: true }); // or { force: true } in dev to reset tables
        console.log('Models synchronized with the database.');

        app.listen(PORT, () => {
            console.log(`Server listening at http://localhost:${PORT}`);
            console.log(`API base path: http://localhost:${PORT}/api`);
            console.log(`Swagger docs: http://localhost:${PORT}/api/docs`);
        });
    } catch (error) {
        console.error('Unable to start the server:', error);
    }
}

start();