USE [WayleaveManagementDB]
GO

/****** Object:  Table [dbo].[GLCode]    Script Date: 2023/03/13 10:47:39 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[GLCode](
	[GLCodeID] [int] IDENTITY(1,1) NOT NULL,
	[GLCodeName] [nvarchar](max) NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateUpdated] [datetime2](7) NOT NULL,
	[CreatedById] [nvarchar](max) NULL,
	[isActive] [bit] NOT NULL,
 CONSTRAINT [PK_GLCode] PRIMARY KEY CLUSTERED 
(
	[GLCodeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO


