USE [WayleaveManagementDB]
GO
/****** Object:  StoredProcedure [dbo].[SP_GetUsersNotLinkedByUserID]    Script Date: 2022/11/29 12:56:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Kyle Gounden>
-- =============================================
CREATE PROCEDURE [dbo].[SP_GetUsersNotLinkedByUserID]
	-- Add the parameters for the stored procedure here
	@ZoneID int
	AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
SELECT id,FullName FROM (SELECT id,ZonesTable.ZoneID,AspNetUsers.FullName FROM AspNetUsers,ZonesTable WHERE ZoneID=@ZoneID) test
 FULL JOIN ZoneLinkTable
ON test.Id = ZoneLinkTable.AssignedUserID AND ZoneLinkTable.ZoneID=test.ZoneID
WHERE test.ZoneID=@ZoneID AND (ZoneLinkID IS NULL OR ZoneLinkTable.isActive=0);


END
