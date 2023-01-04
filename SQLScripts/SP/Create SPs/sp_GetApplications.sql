USE [WayleaveManagementDB]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetApplicationByStatusReport]    Script Date: 2023/01/04 14:54:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Venolin Naidoo
-- Create date: 2023-01-04
-- Description:	Gets Applications depending on who is logged into the system. All Applications are returned for internal users, whereas, if an external user is logged in, only their applications are returned.
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetApplications]
	-- Add the parameters for the stored procedure here
	@IsInternal bit, 
	@UserID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @NUM_RESULTS AS INT

IF (@IsInternal = 1)
	BEGIN  --Internal user, so return all applications
		SELECT Application.* FROM Application
		INNER JOIN UserProfilesTable
		ON UserProfilesTable.UserID=Application.UserID
	END
ELSE
	BEGIN --External user, so only return their applications
		SELECT Application.* FROM Application
		INNER JOIN UserProfilesTable
		ON UserProfilesTable.UserID=Application.UserID
		WHERE Application.UserID=@UserID
	END

END
