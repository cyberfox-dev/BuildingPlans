using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WayleaveManagementSystem.Data;
using WayleaveManagementSystem.Data.Entities;
using WayleaveManagementSystem.IServices;
using WayleaveManagementSystem.Models;
using WayleaveManagementSystem.Service;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);


builder.Logging.AddConsole(); // Logs to console
builder.Logging.AddDebug();


// Add services to the container.

builder.Services.AddControllersWithViews();
builder.Services.Configure<JWTConfig>(builder.Configuration.GetSection("JWTConfig"));
builder.Services.AddDbContext<AppDBContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddIdentity<AppUser, IdentityRole>(opt =>
{
    opt.Password.RequireDigit = false;
    opt.Password.RequireLowercase = false;
    opt.Password.RequireNonAlphanumeric = false;
    opt.Password.RequireUppercase = false;
    opt.Password.RequiredLength = 4;

    opt.User.RequireUniqueEmail = true;
}).AddEntityFrameworkStores<AppDBContext>().AddDefaultTokenProviders(); // Make sure you have AddDefaultTokenProviders here
builder.Services.AddScoped<IProfessionalsService, ProfessionalsService>();
builder.Services.AddScoped<IUserProfileService, UserProfileService>();
builder.Services.AddScoped<IDepartmentsService, DepartmentsService>();
builder.Services.AddScoped<ISubDepartmentService, SubDepartmentsService>();
builder.Services.AddScoped<IZonesServices, ZonesServices>();
builder.Services.AddScoped<IZoneLinkServices, ZoneLinkServices>();
builder.Services.AddScoped<IRolesService, RolesService>();
builder.Services.AddScoped<IStageServices, StageServices>();
builder.Services.AddScoped<IApplicationsService, ApplicationsService>();
builder.Services.AddScoped<IProfessionalsLinksService, ProfessionalsLinksService>();
builder.Services.AddScoped<ICommentBuilderService, CommentBuilderService>();
builder.Services.AddScoped<IDocumentUploadService, DocumentUploadService>();
builder.Services.AddScoped<ISubDepartmentForCommentService, SubDepartmentForCommentService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IMandatoryDocumentUploadsService, MandatoryDocumentUploadsService>();
builder.Services.AddScoped<IGLCodeService, GLCodeService>();
builder.Services.AddScoped<IConfigService, ConfigService>();
builder.Services.AddScoped<INotificationService, NotificationService>();


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    var key = Encoding.ASCII.GetBytes(builder.Configuration["JWTConfig:Key"]);
    var issuer = builder.Configuration["JWTConfig:Issuer"];
    var audience = builder.Configuration["JWTConfig:Audience"];
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = issuer,
        ValidAudience = audience
    };
});

//This is to allow large files to be uploaded for the document upload
builder.Services.Configure<FormOptions>(options =>
{
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartBodyLengthLimit = int.MaxValue;
    options.MultipartHeadersLengthLimit = int.MaxValue;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowWayleaveOrigin",
        builder =>
        {
            builder
                 //.WithOrigins("https://wayleaveqa.capetown.gov.za")
                .WithOrigins("https://wayleave.capetown.gov.za")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder
                .WithOrigins("https://localhost:44440")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin");
app.UseCors("AllowWayleaveOrigin");

app.UseStaticFiles();
//This is to tell the app where to find the uploaded files
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
    RequestPath = new PathString("/Resources")
});
app.UseRouting();
app.UseAuthentication();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
