USE [WayleaveManagementDB]
GO
/****** Object:  StoredProcedure [dbo].[SP_GetUsersLinkedByZoneID]    Script Date: 2022/11/30 11:22:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE [dbo].[SP_GetUsersLinkedByZoneID] 
	-- Add the parameters for the stored procedure here
	@ZoneID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT id,FullName,ZoneLinkTable.ZoneLinkID FROM  AspNetUsers
 JOIN ZoneLinkTable
ON ZoneLinkTable.AssignedUserID = AspNetUsers.Id
WHERE ZoneLinkTable.isActive=1 AND ZoneLinkTable.ZoneID = @ZoneID;
END
