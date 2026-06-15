import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

// Routes
import tasksRoute from './src/api/routes/tasksRoute';
import taskItemsRoute from './src/api/routes/taskItemsRoute';
import rolesRoute from './src/api/routes/rolesRoute';
import usersRoute from './src/api/routes/usersRoute';
import templatesRoute from './src/api/routes/templatesRoute';
import pecsRoute from './src/api/routes/pecsRoute';
import mediaRoute from './src/api/routes/mediaRoute';
import authRoute from './src/api/routes/authRoute';
import childrenRoute from './src/api/routes/childrenRoute';
import educatorsRoute from './src/api/routes/educatorsRoute';
import diseasesRoute from './src/api/routes/diseasesRoute';
import groupsRoute from './src/api/routes/groupsRoute';
import taskListsRoute from './src/api/routes/taskListsRoute';
import achievementsRoute from './src/api/routes/achievementsRoute';
import childInfoRoute from './src/api/routes/childInfoRoute';
import teacherInfoRoute from './src/api/routes/teacherInfoRoute';
import groupMembersRoute from './src/api/routes/groupMembersRoute';
import taskListItemsRoute from './src/api/routes/taskListItemsRoute';
import userAchievementsRoute from './src/api/routes/userAchievementsRoute';
import progressRoute from './src/api/routes/progressRoute';

import { initDatabase } from './src/middlewares/dbConetxt';

// ------------------------------
// 1. Multer — загрузка файлов
// ------------------------------
const upload = multer({ storage: multer.memoryStorage() });

// ------------------------------
// Express app
// ------------------------------
const app = express();

app.use(cors());
app.use(express.json());

// Multer должен быть ДО роутов
app.use(upload.single('file'));

// ------------------------------
// 2. Раздача статики /uploads
// ------------------------------
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ------------------------------
// 3. Роуты API
// ------------------------------
app.use('/api/tasks', tasksRoute);
app.use('/api', taskItemsRoute);
app.use('/api/roles', rolesRoute);
app.use('/api/users', usersRoute);
app.use('/api/templates', templatesRoute);
app.use('/api/pecs', pecsRoute);
app.use('/api/media', mediaRoute);
app.use('/api/auth', authRoute);
app.use('/api/children', childrenRoute);
app.use('/api/educators', educatorsRoute);
app.use('/api/diseases', diseasesRoute);
app.use('/api/groups', groupsRoute);
app.use('/api/task-lists', taskListsRoute);
app.use('/api/achievements', achievementsRoute);
app.use('/api/child-info', childInfoRoute);
app.use('/api/teacher-info', teacherInfoRoute);
app.use('/api/group-members', groupMembersRoute);
app.use('/api/task-list-items', taskListItemsRoute);
app.use('/api/user-achievements', userAchievementsRoute);
app.use('/api/progress', progressRoute);

// ------------------------------
// 4. Запуск сервера
// ------------------------------
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
