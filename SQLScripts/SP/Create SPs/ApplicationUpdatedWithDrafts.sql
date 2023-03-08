USE [WayleaveManagementDB]
GO

/****** Object:  Table [dbo].[Application]    Script Date: 2023/03/02 09:31:55 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Application](
	[ApplicationID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [nvarchar](max) NOT NULL,
	[FullName] [nvarchar](max) NOT NULL,
	[Email] [nvarchar](max) NOT NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[PhyscialAddress] [nvarchar](max) NULL,
	[ReferenceNumber] [nvarchar](max) NULL,
	[CompanyRegNo] [nvarchar](max) NULL,
	[TypeOfApplication] [nvarchar](max) NULL,
	[NotificationNumber] [nvarchar](max) NULL,
	[WBSNumber] [nvarchar](max) NULL,
	[PhysicalAddressOfProject] [nvarchar](max) NULL,
	[DescriptionOfProject] [nvarchar](max) NULL,
	[NatureOfWork] [nvarchar](max) NULL,
	[ExcavationType] [nvarchar](max) NULL,
	[ExpectedStartDate] [datetime2](7) NULL,
	[ExpectedEndDate] [datetime2](7) NULL,
	[Location] [nvarchar](max) NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateUpdated] [datetime2](7) NOT NULL,
	[CreatedById] [nvarchar](max) NULL,
	[isActive] [bit] NOT NULL,
	[ApplicationStatus] [nvarchar](max) NULL,
	[CurrentStageName] [nvarchar](max) NULL,
	[CurrentStageNumber] [int] NULL,
	[CurrentStageStartDate] [datetime2](7) NULL,
	[NextStageName] [nvarchar](max) NULL,
	[NextStageNumber] [int] NULL,
	[PreviousStageName] [nvarchar](max) NULL,
	[PreviousStageNumber] [int] NULL,
	[isDrafted] [bit] NOT NULL DEFAULT (CONVERT([bit],(0))),
 CONSTRAINT [PK_Application] PRIMARY KEY CLUSTERED 
(
	[ApplicationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO


