USE [WayleaveManagementDB]
GO

/****** Object:  Table [dbo].[ProfessionalsLink]    Script Date: 2022/12/08 08:29:07 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ProfessionalsLink](
	[ProfessionalsLinkID] [int] IDENTITY(1,1) NOT NULL,
	[ApplicationID] [int] NULL,
	[ProfessionalID] [int] NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateUpdated] [datetime2](7) NOT NULL,
	[CreatedById] [nvarchar](max) NULL,
	[isActive] [bit] NOT NULL,
 CONSTRAINT [PK_ProfessionalsLink] PRIMARY KEY CLUSTERED 
(
	[ProfessionalsLinkID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO


