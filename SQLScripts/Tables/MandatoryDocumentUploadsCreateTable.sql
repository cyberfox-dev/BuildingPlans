USE [WayleaveManagementDB]
GO

/****** Object:  Table [dbo].[MandatoryDocumentUploads]    Script Date: 2023/02/08 15:44:10 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[MandatoryDocumentUploads](
	[MandatoryDocumentID] [int] IDENTITY(1,1) NOT NULL,
	[MandatoryDocumentName] [nvarchar](max) NULL,
	[StageID] [int] NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateUpdated] [datetime2](7) NOT NULL,
	[CreatedById] [nvarchar](max) NULL,
	[isActive] [bit] NOT NULL,
 CONSTRAINT [PK_MandatoryDocumentUploads] PRIMARY KEY CLUSTERED 
(
	[MandatoryDocumentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO


