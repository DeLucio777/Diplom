-- =============================================
-- Grant all database permissions for DiplomUser
-- =============================================

USE PECSDatabase;
GO

-- Grant table-level permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::dbo TO DiplomUser;
GO

-- Specific table permissions for all application tables
GRANT SELECT, INSERT, UPDATE, DELETE ON tbl_Users TO DiplomUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON tbl_Roles TO DiplomUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON tbl_TaskTemplate TO DiplomUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON tbl_Tasks TO DiplomUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON tbl_CatalogPECS TO DiplomUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON tbl_MediaCatalog TO DiplomUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON tbl_TaskConstruction TO DiplomUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON tbl_FindOddOneOutItems TO DiplomUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON tbl_MatchImageWordPairs TO DiplomUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON tbl_SequenceItems TO DiplomUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON tbl_SortItems TO DiplomUser;
GO

-- Grant EXECUTE permission for stored procedures (if any)
GRANT EXECUTE TO DiplomUser;
GO

-- Grant VIEW DEFINITION for debugging
GRANT VIEW DEFINITION TO DiplomUser;
GO

PRINT 'All permissions granted to DiplomUser successfully!';
GO
