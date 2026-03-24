-- =============================================
-- Stored Procedures for db_diplom Database
-- =============================================

USE db_diplom;
GO

-- ==================== ROLES ====================

-- Get all roles
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetAllRoles')
    DROP PROCEDURE sp_GetAllRoles;
GO
CREATE PROCEDURE sp_GetAllRoles
AS
BEGIN
    SELECT PK_RoleId, RoleName FROM tbl_Roles;
END;
GO

-- Get role by ID
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetRoleById')
    DROP PROCEDURE sp_GetRoleById;
GO
CREATE PROCEDURE sp_GetRoleById
    @RoleId INT
AS
BEGIN
    SELECT PK_RoleId, RoleName FROM tbl_Roles WHERE PK_RoleId = @RoleId;
END;
GO

-- ==================== USERS ====================

-- Get all users
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetAllUsers')
    DROP PROCEDURE sp_GetAllUsers;
GO
CREATE PROCEDURE sp_GetAllUsers
AS
BEGIN
    SELECT PK_UserId, UserLogin, UserPassword, FK_RoleId FROM tbl_User;
END;
GO

-- Get user by ID
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetUserById')
    DROP PROCEDURE sp_GetUserById;
GO
CREATE PROCEDURE sp_GetUserById
    @UserId INT
AS
BEGIN
    SELECT PK_UserId, UserLogin, UserPassword, FK_RoleId FROM tbl_User WHERE PK_UserId = @UserId;
END;
GO

-- Get user by login
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetUserByLogin')
    DROP PROCEDURE sp_GetUserByLogin;
GO
CREATE PROCEDURE sp_GetUserByLogin
    @Login VARCHAR(50)
AS
BEGIN
    SELECT PK_UserId, UserLogin, UserPassword, FK_RoleId FROM tbl_User WHERE UserLogin = @Login;
END;
GO

-- Create user
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CreateUser')
    DROP PROCEDURE sp_CreateUser;
GO
CREATE PROCEDURE sp_CreateUser
    @Login VARCHAR(50),
    @Password VARCHAR(50),
    @RoleId INT
AS
BEGIN
    INSERT INTO tbl_User (UserLogin, UserPassword, FK_RoleId)
    VALUES (@Login, @Password, @RoleId);
    SELECT SCOPE_IDENTITY() AS UserId;
END;
GO

-- Update user
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_UpdateUser')
    DROP PROCEDURE sp_UpdateUser;
GO
CREATE PROCEDURE sp_UpdateUser
    @UserId INT,
    @Login VARCHAR(50),
    @Password VARCHAR(50),
    @RoleId INT
AS
BEGIN
    UPDATE tbl_User 
    SET UserLogin = @Login, UserPassword = @Password, FK_RoleId = @RoleId
    WHERE PK_UserId = @UserId;
END;
GO

-- Delete user
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_DeleteUser')
    DROP PROCEDURE sp_DeleteUser;
GO
CREATE PROCEDURE sp_DeleteUser
    @UserId INT
AS
BEGIN
    DELETE FROM tbl_User WHERE PK_UserId = @UserId;
END;
GO

-- ==================== MEDIA CATALOG ====================

-- Get all media
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetAllMedia')
    DROP PROCEDURE sp_GetAllMedia;
GO
CREATE PROCEDURE sp_GetAllMedia
AS
BEGIN
    SELECT PK_MediaId, FileType, FilePath, Descripti, UploadDate FROM tbl_MediaCatalog;
END;
GO

-- Get media by ID
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetMediaById')
    DROP PROCEDURE sp_GetMediaById;
GO
CREATE PROCEDURE sp_GetMediaById
    @MediaId INT
AS
BEGIN
    SELECT PK_MediaId, FileType, FilePath, Descripti, UploadDate FROM tbl_MediaCatalog WHERE PK_MediaId = @MediaId;
END;
GO

-- Create media
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CreateMedia')
    DROP PROCEDURE sp_CreateMedia;
GO
CREATE PROCEDURE sp_CreateMedia
    @FileType VARCHAR(100),
    @FilePath VARCHAR(250),
    @Description VARCHAR(50),
    @UploadDate DATETIME
AS
BEGIN
    INSERT INTO tbl_MediaCatalog (FileType, FilePath, Descripti, UploadDate)
    VALUES (@FileType, @FilePath, @Description, @UploadDate);
    SELECT SCOPE_IDENTITY() AS MediaId;
END;
GO

-- Update media
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_UpdateMedia')
    DROP PROCEDURE sp_UpdateMedia;
GO
CREATE PROCEDURE sp_UpdateMedia
    @MediaId INT,
    @FileType VARCHAR(100),
    @FilePath VARCHAR(250),
    @Description VARCHAR(50),
    @UploadDate DATETIME
AS
BEGIN
    UPDATE tbl_MediaCatalog 
    SET FileType = @FileType, FilePath = @FilePath, Descripti = @Description, UploadDate = @UploadDate
    WHERE PK_MediaId = @MediaId;
END;
GO

-- Delete media
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_DeleteMedia')
    DROP PROCEDURE sp_DeleteMedia;
GO
CREATE PROCEDURE sp_DeleteMedia
    @MediaId INT
AS
BEGIN
    DELETE FROM tbl_MediaCatalog WHERE PK_MediaId = @MediaId;
END;
GO

-- ==================== CATALOG PECS ====================

-- Get all PECS
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetAllPECS')
    DROP PROCEDURE sp_GetAllPECS;
GO
CREATE PROCEDURE sp_GetAllPECS
AS
BEGIN
    SELECT PK_PECSid, Descripti, filePath, Category, UploadDate FROM tbl_CatalogPECS;
END;
GO

-- Get PECS by ID
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetPECSById')
    DROP PROCEDURE sp_GetPECSById;
GO
CREATE PROCEDURE sp_GetPECSById
    @PECSId INT
AS
BEGIN
    SELECT PK_PECSid, Descripti, filePath, Category, UploadDate FROM tbl_CatalogPECS WHERE PK_PECSid = @PECSId;
END;
GO

-- Get PECS by category
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetPECSByCategory')
    DROP PROCEDURE sp_GetPECSByCategory;
GO
CREATE PROCEDURE sp_GetPECSByCategory
    @Category VARCHAR(50)
AS
BEGIN
    SELECT PK_PECSid, Descripti, filePath, Category, UploadDate FROM tbl_CatalogPECS WHERE Category = @Category;
END;
GO

-- Create PECS
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CreatePECS')
    DROP PROCEDURE sp_CreatePECS;
GO
CREATE PROCEDURE sp_CreatePECS
    @Description VARCHAR(50),
    @FilePath VARCHAR(250),
    @Category VARCHAR(50),
    @UploadDate DATETIME
AS
BEGIN
    INSERT INTO tbl_CatalogPECS (Descripti, filePath, Category, UploadDate)
    VALUES (@Description, @FilePath, @Category, @UploadDate);
    SELECT SCOPE_IDENTITY() AS PECSId;
END;
GO

-- Update PECS
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_UpdatePECS')
    DROP PROCEDURE sp_UpdatePECS;
GO
CREATE PROCEDURE sp_UpdatePECS
    @PECSId INT,
    @Description VARCHAR(50),
    @FilePath VARCHAR(250),
    @Category VARCHAR(50),
    @UploadDate DATETIME
AS
BEGIN
    UPDATE tbl_CatalogPECS 
    SET Descripti = @Description, filePath = @FilePath, Category = @Category, UploadDate = @UploadDate
    WHERE PK_PECSid = @PECSId;
END;
GO

-- Delete PECS
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_DeletePECS')
    DROP PROCEDURE sp_DeletePECS;
GO
CREATE PROCEDURE sp_DeletePECS
    @PECSId INT
AS
BEGIN
    DELETE FROM tbl_CatalogPECS WHERE PK_PECSid = @PECSId;
END;
GO

-- ==================== TASK TEMPLATES ====================

-- Get all templates
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetAllTemplates')
    DROP PROCEDURE sp_GetAllTemplates;
GO
CREATE PROCEDURE sp_GetAllTemplates
AS
BEGIN
    SELECT PK_TemplateId, TemplateName, Descripti FROM tbl_TaskTemplate;
END;
GO

-- Get template by ID
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetTemplateById')
    DROP PROCEDURE sp_GetTemplateById;
GO
CREATE PROCEDURE sp_GetTemplateById
    @TemplateId INT
AS
BEGIN
    SELECT PK_TemplateId, TemplateName, Descripti FROM tbl_TaskTemplate WHERE PK_TemplateId = @TemplateId;
END;
GO

-- Create template
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CreateTemplate')
    DROP PROCEDURE sp_CreateTemplate;
GO
CREATE PROCEDURE sp_CreateTemplate
    @TemplateName VARCHAR(100),
    @Description VARCHAR(255)
AS
BEGIN
    INSERT INTO tbl_TaskTemplate (TemplateName, Descripti)
    VALUES (@TemplateName, @Description);
    SELECT SCOPE_IDENTITY() AS TemplateId;
END;
GO

-- Update template
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_UpdateTemplate')
    DROP PROCEDURE sp_UpdateTemplate;
GO
CREATE PROCEDURE sp_UpdateTemplate
    @TemplateId INT,
    @TemplateName VARCHAR(100),
    @Description VARCHAR(255)
AS
BEGIN
    UPDATE tbl_TaskTemplate 
    SET TemplateName = @TemplateName, Descripti = @Description
    WHERE PK_TemplateId = @TemplateId;
END;
GO

-- Delete template
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_DeleteTemplate')
    DROP PROCEDURE sp_DeleteTemplate;
GO
CREATE PROCEDURE sp_DeleteTemplate
    @TemplateId INT
AS
BEGIN
    DELETE FROM tbl_TaskTemplate WHERE PK_TemplateId = @TemplateId;
END;
GO

-- ==================== TASKS ====================

-- Get all tasks
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetAllTasks')
    DROP PROCEDURE sp_GetAllTasks;
GO
CREATE PROCEDURE sp_GetAllTasks
AS
BEGIN
    SELECT PK_TaskId, Title, Descripti, FK_TemplateId, FK_UserId, DifficultyLevel, UploadDate 
    FROM tbl_Task;
END;
GO

-- Get task by ID
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetTaskById')
    DROP PROCEDURE sp_GetTaskById;
GO
CREATE PROCEDURE sp_GetTaskById
    @TaskId INT
AS
BEGIN
    SELECT PK_TaskId, Title, Descripti, FK_TemplateId, FK_UserId, DifficultyLevel, UploadDate 
    FROM tbl_Task WHERE PK_TaskId = @TaskId;
END;
GO

-- Get tasks by user
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetTasksByUser')
    DROP PROCEDURE sp_GetTasksByUser;
GO
CREATE PROCEDURE sp_GetTasksByUser
    @UserId INT
AS
BEGIN
    SELECT PK_TaskId, Title, Descripti, FK_TemplateId, FK_UserId, DifficultyLevel, UploadDate 
    FROM tbl_Task WHERE FK_UserId = @UserId;
END;
GO

-- Create task
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CreateTask')
    DROP PROCEDURE sp_CreateTask;
GO
CREATE PROCEDURE sp_CreateTask
    @Title VARCHAR(50),
    @Description VARCHAR(50),
    @TemplateId INT,
    @UserId INT,
    @DifficultyLevel VARCHAR(50),
    @UploadDate DATE
AS
BEGIN
    INSERT INTO tbl_Task (Title, Descripti, FK_TemplateId, FK_UserId, DifficultyLevel, UploadDate)
    VALUES (@Title, @Description, @TemplateId, @UserId, @DifficultyLevel, @UploadDate);
    SELECT SCOPE_IDENTITY() AS TaskId;
END;
GO

-- Update task
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_UpdateTask')
    DROP PROCEDURE sp_UpdateTask;
GO
CREATE PROCEDURE sp_UpdateTask
    @TaskId INT,
    @Title VARCHAR(50),
    @Description VARCHAR(50),
    @TemplateId INT,
    @UserId INT,
    @DifficultyLevel VARCHAR(50),
    @UploadDate DATE
AS
BEGIN
    UPDATE tbl_Task 
    SET Title = @Title, Descripti = @Description, FK_TemplateId = @TemplateId, 
        FK_UserId = @UserId, DifficultyLevel = @DifficultyLevel, UploadDate = @UploadDate
    WHERE PK_TaskId = @TaskId;
END;
GO

-- Delete task (also deletes related items)
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_DeleteTask')
    DROP PROCEDURE sp_DeleteTask;
GO
CREATE PROCEDURE sp_DeleteTask
    @TaskId INT
AS
BEGIN
    -- Delete related items first
    DELETE FROM tbl_TaskConstruction WHERE FK_TaskId = @TaskId;
    DELETE FROM tbl_FindOddOneOutItems WHERE FK_TaskId = @TaskId;
    DELETE FROM tbl_MatchImageWordPairs WHERE FK_TaskId = @TaskId;
    DELETE FROM tbl_SequenceItems WHERE FK_TaskId = @TaskId;
    DELETE FROM tbl_SortItems WHERE FK_TaskId = @TaskId;
    -- Delete the task
    DELETE FROM tbl_Task WHERE PK_TaskId = @TaskId;
END;
GO

-- ==================== TASK CONSTRUCTIONS ====================

-- Get constructions by task
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetConstructionsByTask')
    DROP PROCEDURE sp_GetConstructionsByTask;
GO
CREATE PROCEDURE sp_GetConstructionsByTask
    @TaskId INT
AS
BEGIN
    SELECT PK_ConstructionId, FK_TaskId, ParameterName, ParameterValue 
    FROM tbl_TaskConstruction WHERE FK_TaskId = @TaskId;
END;
GO

-- Create construction
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CreateConstruction')
    DROP PROCEDURE sp_CreateConstruction;
GO
CREATE PROCEDURE sp_CreateConstruction
    @TaskId INT,
    @ParameterName VARCHAR(100),
    @ParameterValue VARCHAR(MAX)
AS
BEGIN
    INSERT INTO tbl_TaskConstruction (FK_TaskId, ParameterName, ParameterValue)
    VALUES (@TaskId, @ParameterName, @ParameterValue);
    SELECT SCOPE_IDENTITY() AS ConstructionId;
END;
GO

-- Delete constructions by task
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_DeleteConstructionsByTask')
    DROP PROCEDURE sp_DeleteConstructionsByTask;
GO
CREATE PROCEDURE sp_DeleteConstructionsByTask
    @TaskId INT
AS
BEGIN
    DELETE FROM tbl_TaskConstruction WHERE FK_TaskId = @TaskId;
END;
GO

-- ==================== FIND ODD ONE OUT ITEMS ====================

-- Get find odd items by task
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetFindOddItemsByTask')
    DROP PROCEDURE sp_GetFindOddItemsByTask;
GO
CREATE PROCEDURE sp_GetFindOddItemsByTask
    @TaskId INT
AS
BEGIN
    SELECT PK_ItemId, FK_TaskId, ItemText, IsOddOne, FK_pecsId 
    FROM tbl_FindOddOneOutItems WHERE FK_TaskId = @TaskId;
END;
GO

-- Create find odd item
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CreateFindOddItem')
    DROP PROCEDURE sp_CreateFindOddItem;
GO
CREATE PROCEDURE sp_CreateFindOddItem
    @TaskId INT,
    @ItemText VARCHAR(255),
    @IsOddOne BIT,
    @PECSId INT
AS
BEGIN
    INSERT INTO tbl_FindOddOneOutItems (FK_TaskId, ItemText, IsOddOne, FK_pecsId)
    VALUES (@TaskId, @ItemText, @IsOddOne, @PECSId);
    SELECT SCOPE_IDENTITY() AS ItemId;
END;
GO

-- Delete find odd items by task
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_DeleteFindOddItemsByTask')
    DROP PROCEDURE sp_DeleteFindOddItemsByTask;
GO
CREATE PROCEDURE sp_DeleteFindOddItemsByTask
    @TaskId INT
AS
BEGIN
    DELETE FROM tbl_FindOddOneOutItems WHERE FK_TaskId = @TaskId;
END;
GO

-- ==================== MATCH IMAGE WORD PAIRS ====================

-- Get match pairs by task
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetMatchPairsByTask')
    DROP PROCEDURE sp_GetMatchPairsByTask;
GO
CREATE PROCEDURE sp_GetMatchPairsByTask
    @TaskId INT
AS
BEGIN
    SELECT PK_PairId, FK_TaskId, FK_MediaId, FK_pecsId, Words 
    FROM tbl_MatchImageWordPairs WHERE FK_TaskId = @TaskId;
END;
GO

-- Create match pair
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CreateMatchPair')
    DROP PROCEDURE sp_CreateMatchPair;
GO
CREATE PROCEDURE sp_CreateMatchPair
    @TaskId INT,
    @MediaId INT,
    @PECSId INT,
    @Words VARCHAR(255)
AS
BEGIN
    INSERT INTO tbl_MatchImageWordPairs (FK_TaskId, FK_MediaId, FK_pecsId, Words)
    VALUES (@TaskId, @MediaId, @PECSId, @Words);
    SELECT SCOPE_IDENTITY() AS PairId;
END;
GO

-- Delete match pairs by task
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_DeleteMatchPairsByTask')
    DROP PROCEDURE sp_DeleteMatchPairsByTask;
GO
CREATE PROCEDURE sp_DeleteMatchPairsByTask
    @TaskId INT
AS
BEGIN
    DELETE FROM tbl_MatchImageWordPairs WHERE FK_TaskId = @TaskId;
END;
GO

-- ==================== SEQUENCE ITEMS ====================

-- Get sequence items by task
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetSequenceItemsByTask')
    DROP PROCEDURE sp_GetSequenceItemsByTask;
GO
CREATE PROCEDURE sp_GetSequenceItemsByTask
    @TaskId INT
AS
BEGIN
    SELECT PK_SeqItemId, FK_TaskId, ItemOrder, ItemValue, FK_pecsId 
    FROM tbl_SequenceItems WHERE FK_TaskId = @TaskId ORDER BY ItemOrder;
END;
GO

-- Create sequence item
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CreateSequenceItem')
    DROP PROCEDURE sp_CreateSequenceItem;
GO
CREATE PROCEDURE sp_CreateSequenceItem
    @TaskId INT,
    @ItemOrder INT,
    @ItemValue VARCHAR(255),
    @PECSId INT
AS
BEGIN
    INSERT INTO tbl_SequenceItems (FK_TaskId, ItemOrder, ItemValue, FK_pecsId)
    VALUES (@TaskId, @ItemOrder, @ItemValue, @PECSId);
    SELECT SCOPE_IDENTITY() AS SeqItemId;
END;
GO

-- Delete sequence items by task
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_DeleteSequenceItemsByTask')
    DROP PROCEDURE sp_DeleteSequenceItemsByTask;
GO
CREATE PROCEDURE sp_DeleteSequenceItemsByTask
    @TaskId INT
AS
BEGIN
    DELETE FROM tbl_SequenceItems WHERE FK_TaskId = @TaskId;
END;
GO

-- ==================== SORT ITEMS ====================

-- Get sort items by task
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetSortItemsByTask')
    DROP PROCEDURE sp_GetSortItemsByTask;
GO
CREATE PROCEDURE sp_GetSortItemsByTask
    @TaskId INT
AS
BEGIN
    SELECT PK_SortItemId, FK_TaskId, ItemValue, SortKey, FK_pecsId 
    FROM tbl_SortItems WHERE FK_TaskId = @TaskId;
END;
GO

-- Create sort item
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CreateSortItem')
    DROP PROCEDURE sp_CreateSortItem;
GO
CREATE PROCEDURE sp_CreateSortItem
    @TaskId INT,
    @ItemValue VARCHAR(255),
    @SortKey VARCHAR(255),
    @PECSId INT
AS
BEGIN
    INSERT INTO tbl_SortItems (FK_TaskId, ItemValue, SortKey, FK_pecsId)
    VALUES (@TaskId, @ItemValue, @SortKey, @PECSId);
    SELECT SCOPE_IDENTITY() AS SortItemId;
END;
GO

-- Delete sort items by task
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_DeleteSortItemsByTask')
    DROP PROCEDURE sp_DeleteSortItemsByTask;
GO
CREATE PROCEDURE sp_DeleteSortItemsByTask
    @TaskId INT
AS
BEGIN
    DELETE FROM tbl_SortItems WHERE FK_TaskId = @TaskId;
END;
GO

PRINT 'All stored procedures created successfully!';
GO
