USE [WayleaveManagementDB]
GO

/****** Object:  Table [dbo].[UserProfilesTable]    Script Date: 2023/03/16 09:49:49 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[UserProfilesTable](
	[UserProfileID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [nvarchar](max) NOT NULL,
	[FullName] [nvarchar](max) NOT NULL,
	[Email] [nvarchar](max) NOT NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[isInternal] [bit] NOT NULL,
	[BP_Number] [nvarchar](max) NULL,
	[CompanyName] [nvarchar](max) NULL,
	[CompanyRegNo] [nvarchar](max) NULL,
	[PhyscialAddress] [nvarchar](max) NULL,
	[Directorate] [nvarchar](max) NULL,
	[DepartmentID] [int] NULL,
	[SubDepartmentID] [int] NULL,
	[Branch] [nvarchar](max) NULL,
	[CostCenterNumber] [nvarchar](max) NULL,
	[CostCenterOwner] [nvarchar](max) NULL,
	[CopyOfID] [nvarchar](max) NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateUpdated] [datetime2](7) NOT NULL,
	[CreatedById] [nvarchar](max) NULL,
	[isActive] [bit] NOT NULL,
	[IdNumber] [nvarchar](max) NULL,
	[VatNumber] [nvarchar](max) NULL,
	[isDepartmentAdmin] [bit] NULL,
 CONSTRAINT [PK_UserProfilesTable] PRIMARY KEY CLUSTERED 
(
	[UserProfileID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO


