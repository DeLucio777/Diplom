# TODO: API-несостыковки frontend ↔ backend

Дата анализа: 2026-06-14  
Frontend: `D:\Diplom\Test\creative-task-lab`  
Backend: `D:\Diplom\DiplomProject\server`

## Критичные несостыковки

- [x] **`/api/progress` отсутствует на backend.**
  - Frontend вызывает `progressApi.getAll()` через [`src/services/entitiesApi.ts`](src/services/entitiesApi.ts:168) и использует его в [`ReportsPage.tsx`](src/pages/ReportsPage.tsx:123) и [`ProgressPage.tsx`](src/pages/ProgressPage.tsx:19).
  - Backend регистрирует `GET /api/progress` в [`server/server.ts`](server/server.ts:65), агрегируя данные из `tbl_task_lst_to_data` и `tbl_childInfo` в [`ProgressRepository`](server/src/repositories/ProgressRepository.ts:7).

- [x] **`/api/group-members` отсутствует на backend.**
  - Frontend вызывает `groupsApi.getAllMembers()` через [`src/services/entitiesApi.ts`](src/services/entitiesApi.ts:143) и использует его в [`GroupsPage.tsx`](src/pages/GroupsPage.tsx:31), [`ReportsPage.tsx`](src/pages/ReportsPage.tsx:126), [`AssignmentsPage.tsx`](src/pages/AssignmentsPage.tsx:47).
  - Backend регистрирует `GET/POST/DELETE /api/group-members` в [`groupMembersRoute`](server/src/api/routes/groupMembersRoute.ts:7), используя строки связи `tbl_childrent_to_groups`.

- [x] **`/api/task-list-items` endpoints отсутствуют на backend.**
  - Frontend вызывает `taskListsApi.getAllItems()`, `markCompleted()` и `markTaskCompletedForUser()` через [`src/services/entitiesApi.ts`](src/services/entitiesApi.ts:203).
  - Backend регистрирует `GET /api/task-list-items`, `GET /api/task-list-items/:id`, `PUT /api/task-list-items/:id/complete` и `POST /api/task-list-items/complete-for-user` в [`taskListItemsRoute`](server/src/api/routes/taskListItemsRoute.ts:7).

- [x] **`/api/user-achievements` отсутствует на backend.**
  - Frontend вызывает `getAllUserAchievements()` и `award()` через [`src/services/entitiesApi.ts`](src/services/entitiesApi.ts:179).
  - Backend регистрирует `GET /api/user-achievements`, `GET /api/user-achievements/user/:userId` и `POST /api/user-achievements` в [`userAchievementsRoute`](server/src/api/routes/userAchievementsRoute.ts:7).

- [x] **`POST /api/pecs` отсутствует на backend.**
  - Frontend вызывает `mediaApi.uploadPecs()` через [`src/services/mediaApi.ts`](src/services/mediaApi.ts:7), используется в [`MediaLibraryPage.tsx`](src/pages/MediaLibraryPage.tsx:30).
  - Backend `pecsRoute` имеет `GET /api/pecs`, `GET /api/pecs/:id` и `POST /api/pecs` в [`server/src/api/routes/pecsRoute.ts`](server/src/api/routes/pecsRoute.ts:7).

- [x] **`/api/child-info` отсутствует на backend.**
  - Frontend вызывает `childInfoApi.getAll()` и `childInfoApi.save()` через [`src/services/entitiesApi.ts`](src/services/entitiesApi.ts:80).
  - Используется в [`TaskDetailPage.tsx`](src/pages/TaskDetailPage.tsx:452) и [`ProfilePage.tsx`](src/pages/ProfilePage.tsx:67).
  - Backend регистрирует `/api/child-info` в [`childInfoRoute`](server/src/api/routes/childInfoRoute.ts:7) и работает с `tbl_childInfo`.

- [x] **`/api/teacher-info` отсутствует на backend.**
  - Frontend вызывает `teacherInfoApi.getAll()` и `teacherInfoApi.save()` через [`src/services/entitiesApi.ts`](src/services/entitiesApi.ts:51).
  - `teacherInfoApi.save()` вызывается из `educatorsApi.update()` в [`src/services/entitiesApi.ts`](src/services/entitiesApi.ts:72).
  - Backend регистрирует `/api/teacher-info` в [`teacherInfoRoute`](server/src/api/routes/teacherInfoRoute.ts:7) и работает с `tbl_teacherInfo`.

## Высокий приоритет

- [x] **Frontend ожидает `PUT/DELETE /api/users/:id`, backend их не имеет.**
  - Frontend: [`src/services/entitiesApi.ts`](src/services/entitiesApi.ts:23).
  - Используется в [`ProfilePage.tsx`](src/pages/ProfilePage.tsx:90).
  - Backend users-route поддерживает `PUT/DELETE /api/users/:id` в [`server/src/api/routes/usersRoute.ts`](server/src/api/routes/usersRoute.ts:23).

- [x] **Frontend ожидает, что `/api/auth/register` создаст `tbl_childInfo`/`tbl_teacherInfo`, backend этого не делает.**
  - Frontend-комментарий в [`src/services/authApi.ts`](src/services/authApi.ts:29).
  - Backend `AuthController.register()` создаёт `tbl_User` и профиль `tbl_childInfo`/`tbl_teacherInfo` по roleId в [`server/src/api/controllers/AuthController.ts`](server/src/api/controllers/AuthController.ts:59).

- [x] **Payload для обновления ребёнка не совпадает.**
  - Frontend отправляет `FullName`, `email`, `phone`, `age`, `speak_level`, `FK_disease_id` в [`src/services/entitiesApi.ts`](src/services/entitiesApi.ts:119).
  - Используется в [`ChildrenPage.tsx`](src/pages/ChildrenPage.tsx:84) и [`ChildrenPage.tsx`](src/pages/ChildrenPage.tsx:117).
  - Backend `ChildrenController.update()` нормализует frontend payload в `first_name/second_name` и `ChildInfo` в [`server/src/api/controllers/ChildrenController.ts`](server/src/api/controllers/ChildrenController.ts:81).

- [x] **Payload для обновления педагога не совпадает.**
  - Frontend отправляет `FullName`, `Specialization`, `Phone`, `Email` в [`src/services/entitiesApi.ts`](src/services/entitiesApi.ts:66).
  - Используется в [`EducatorsPage.tsx`](src/pages/EducatorsPage.tsx:48) и [`ProfilePage.tsx`](src/pages/ProfilePage.tsx:94).
  - Backend `EducatorsController.update()` нормализует payload, а `EducatorsRepository.update()` обновляет `tbl_teacherInfo` и связанные поля `tbl_User` в [`server/src/repositories/EducatorsRepository.ts`](server/src/repositories/EducatorsRepository.ts:99).

- [x] **Payload создания task list не совпадает.**
  - Frontend отправляет плоский объект `{ Title, Descripti, teacher_id, date_complite, taskIds, userIds }` в [`src/pages/AssignmentsPage.tsx`](src/pages/AssignmentsPage.tsx:121).
  - Тип `TaskListCreate` описан в [`src/services/entitiesApi.ts`](src/services/entitiesApi.ts:191).
  - Backend `TaskListsController.create()` принимает плоский payload и сохраняет поддерживаемые БД поля `teacher_id/date_complite` в [`server/src/api/controllers/TaskListsController.ts`](server/src/api/controllers/TaskListsController.ts:50).

- [x] **Publish task: frontend и backend используют разные имена поля.**
  - Frontend отправляет `{ public_task: published }` в [`src/services/tasksApi.ts`](src/services/tasksApi.ts:52).
  - Backend `TaskController.publish()` принимает `public_task` или `published` в [`server/src/api/controllers/taskController.ts`](server/src/api/controllers/taskController.ts:153).
  - Backend возвращает `{ success: true }`, frontend просто проверяет `r !== null`: [`src/services/tasksApi.ts`](src/services/tasksApi.ts:52).

- [x] **Group membership API-контракт не совпадает.**
  - Frontend `addMember()` вызывает `/api/group-members` и отправляет `{ FK_group_id, FK_user_id }`: [`src/services/entitiesApi.ts`](src/services/entitiesApi.ts:160).
  - Frontend `removeMember(memberId)` удаляет по id связи: [`src/services/entitiesApi.ts`](src/services/entitiesApi.ts:162).
  - Backend поддерживает `/api/group-members` и принимает `FK_group_id`/`FK_user_id` или `groupId`/`userId` в [`server/src/api/routes/groupMembersRoute.ts`](server/src/api/routes/groupMembersRoute.ts:7).

## Средний/низкий приоритет

- [x] **Frontend экспортирует unused item-list endpoints, которых нет на backend.**
  - `getAllConstructions`, `getAllFindOddItems`, `getAllMatchPairs`, `getAllSequenceItems`, `getAllSortItems` объявлены в [`src/services/tasksApi.ts`](src/services/tasksApi.ts:21).
  - Backend регистрирует глобальные endpoints `/api/task-constructions`, `/api/find-odd-items`, `/api/match-pairs`, `/api/sequence-items` и `/api/sort-items` в [`taskItemsRoute`](server/src/api/routes/taskItemsRoute.ts:7); task-scoped endpoints под `/api/tasks/:taskId/...` сохранены в [`tasksRoute`](server/src/api/routes/tasksRoute.ts:13).

- [ ] **`TaskList` type содержит поля, которых нет в backend/API.**
  - `Title` и `Descripti` есть в frontend-типе [`src/types/models.ts`](src/types/models.ts:155).
  - Backend-сущность/repo используют только `PK_id`, `date_complite`, `teacher_id`: [`server/src/entities/taskList.ts`](server/src/entities/taskList.ts:1), [`server/src/repositories/TaskListsRepository.ts`](server/src/repositories/TaskListsRepository.ts:11).

- [ ] **`UserAchievement` type содержит поле, которого нет в БД.**
  - Frontend ожидает `earned_date` в [`src/types/models.ts`](src/types/models.ts:191).
  - SQL-схема `tbl_users_achievement` содержит только `id`, `achivement_id`, `user_id`.

- [x] **`ProgressRecord` model не соответствует предоставленной БД.**
  - Frontend-модель: [`src/types/models.ts`](src/types/models.ts:172).
  - В SQL-схеме нет `tbl_Progress`/`tbl_Assignment`, поэтому backend `/api/progress` агрегирует данные из `tbl_task_lst_to_data` и `tbl_childInfo` в [`ProgressRepository`](server/src/repositories/ProgressRepository.ts:7).

- [x] **PECS upload: если добавлять endpoint, нужно согласовать имена полей.**
  - Frontend отправляет `description` и `category` в [`src/services/mediaApi.ts`](src/services/mediaApi.ts:7).
  - SQL-колонки: `Descripti`, `filePath`, `Category`; backend принимает `description`/`category`, сохраняет в `Descripti`/`filePath`/`Category` в [`server/src/repositories/PECSRepository.ts`](server/src/repositories/PECSRepository.ts:29).

- [x] **Проверка уникальности логина реализована через `/api/users`.**
  - Frontend `usersApi.isLoginTaken()` и `authApi.isLoginTaken()` получают всех пользователей: [`src/services/entitiesApi.ts`](src/services/entitiesApi.ts:31), [`src/services/authApi.ts`](src/services/authApi.ts:16).
  - Backend имеет `findByLogin()` и route `/api/users/by-login/:login` в [`server/src/api/routes/usersRoute.ts`](server/src/api/routes/usersRoute.ts:21).

## Рекомендуемые варианты исправления

- [x] **Выбрать единый API-контракт:** добавлены backend endpoints под frontend (`/api/child-info`, `/api/teacher-info`, `/api/group-members`, `/api/task-list-items`, `/api/user-achievements`, `/api/progress`, `POST /api/pecs`, `/api/task-constructions`, `/api/find-odd-items`, `/api/match-pairs`, `/api/sequence-items`, `/api/sort-items`) и сохранены совместимые старые маршруты.
- [x] **Для child/teacher info:** добавлены отдельные endpoints `/api/child-info` и `/api/teacher-info`, старый `/api/users/:userId/info` сохранён.
- [x] **Для task-list items:** добавлены backend endpoints под frontend (`GET /api/task-list-items`, `PUT /api/task-list-items/:id/complete`, `POST /api/task-list-items/complete-for-user`), старый `/api/task-lists/:id/items` сохранён.
- [x] **Для achievements:** добавлен `/api/user-achievements`; старый `/api/achievements/user/:userId` и `/api/achievements/award` сохранены.
- [x] **Для progress:** реализован `/api/progress` как агрегация по `tbl_task_lst_to_data` и `tbl_childInfo`, потому что в БД нет `tbl_Progress`/`tbl_Assignment`.
- [x] **Для groups:** добавлен `/api/group-members`; старые `/api/groups/:groupId/members` маршруты сохранены.
- [x] **Для task publish:** backend принимает и `public_task`, и `published`.
- [x] **Для task list create:** backend принимает плоский payload frontend и старый `{ taskList, taskIds, userIds }`.
- [x] **Для users update/delete:** добавлены `PUT/DELETE /api/users/:id`.
- [x] **Для PECS upload:** добавлен `POST /api/pecs` с multer upload и полями `description`/`category`.
