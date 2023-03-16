USE [WayleaveManagementDB]
GO

/****** Object:  Table [dbo].[SubDepartmentForComment]    Script Date: 2023/03/15 09:05:02 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[SubDepartmentForComment](
	[SubDepartmentForCommentID] [int] IDENTITY(1,1) NOT NULL,
	[ApplicationID] [int] NULL,
	[SubDepartmentID] [int] NULL,
	[SubDepartmentName] [nvarchar](max) NULL,
	[UserAssaignedToComment] [nvarchar](max) NULL,
	[CommentStatus] [nvarchar](max) NULL,
	[isAwaitingClarity] [bit] NULL,
	[IsRefered] [bit] NULL,
	[ReferedToUserID] [nvarchar](max) NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateUpdated] [datetime2](7) NOT NULL,
	[CreatedById] [nvarchar](max) NULL,
	[isActive] [bit] NOT NULL,
 CONSTRAINT [PK_SubDepartmentForComment] PRIMARY KEY CLUSTERED 
(
	[SubDepartmentForCommentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO


