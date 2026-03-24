import express from 'express';
import tasksRoute from './src/api/routes/tasksRoute';
import rolesRoute from './src/api/routes/rolesRoute';
import usersRoute from './src/api/routes/usersRoute';
import templatesRoute from './src/api/routes/templatesRoute';
import pecsRoute from './src/api/routes/pecsRoute';
import mediaRoute from './src/api/routes/mediaRoute';
import authRoute from './src/api/routes/authRoute';
import { initDatabase } from './src/middlewares/dbConetxt';

const app = express();

app.use(express.json());

// Routes
app.use('/api/tasks', tasksRoute);
app.use('/api/roles', rolesRoute);
app.use('/api/users', usersRoute);
app.use('/api/templates', templatesRoute);
app.use('/api/pecs', pecsRoute);
app.use('/api/media', mediaRoute);
app.use('/api/auth', authRoute);

async function startServer() {
    try {
        await initDatabase();
        console.log('База данных инициализирована');
        
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Не удалось запустить сервер:', error);
        process.exit(1);
    }
}

startServer();
