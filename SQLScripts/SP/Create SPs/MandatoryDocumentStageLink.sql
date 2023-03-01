USE [WayleaveManagementDB]
GO

/****** Object:  Table [dbo].[MandatoryDocumentStageLink]    Script Date: 2023/02/16 09:07:49 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[MandatoryDocumentStageLink](
	[MandatoryDocumentStageLinkID] [int] IDENTITY(1,1) NOT NULL,
	[MandatoryDocumentID] [int] NULL,
	[StageID] [int] NOT NULL,
	[StageName] [nvarchar](max) NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateUpdated] [datetime2](7) NOT NULL,
	[CreatedById] [nvarchar](max) NULL,
	[isActive] [bit] NOT NULL,
 CONSTRAINT [PK_MandatoryDocumentStageLink] PRIMARY KEY CLUSTERED 
(
	[MandatoryDocumentStageLinkID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO


