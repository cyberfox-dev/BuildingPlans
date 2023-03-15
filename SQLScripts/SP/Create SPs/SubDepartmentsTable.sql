USE [WayleaveManagementDB]
GO

/****** Object:  Table [dbo].[SubDepartmentsTable]    Script Date: 2023/03/15 09:04:42 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[SubDepartmentsTable](
	[SubDepartmentID] [int] IDENTITY(1,1) NOT NULL,
	[SubDepartmentName] [nvarchar](max) NULL,
	[DepartmentID] [int] NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateUpdated] [datetime2](7) NOT NULL,
	[CreatedById] [nvarchar](max) NULL,
	[isActive] [bit] NOT NULL,
	[SubDepartmentAdminUserID] [nvarchar](max) NULL,
 CONSTRAINT [PK_SubDepartmentsTable] PRIMARY KEY CLUSTERED 
(
	[SubDepartmentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO


