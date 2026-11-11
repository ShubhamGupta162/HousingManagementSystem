using EasyHousingSolution.PropertyService.Application.Interfaces;
using EasyHousingSolution.PropertyService.Application.Services;
using EasyHousingSolution.PropertyService.Application.Validators;
using EasyHousingSolution.PropertyService.Domain.Interfaces;
using EasyHousingSolution.PropertyService.Infrastructure.Data;
using EasyHousingSolution.PropertyService.Infrastructure.Repositories;
using EasyHousingSolution.Shared.Logging;
using EasyHousingSolution.Shared.Middleware;
using EasyHousingSolution.Shared.Security;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
builder.ConfigureSerilog("PropertyService");

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger with JWT Bearer support
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "EasyHousingSolution - PropertyService API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Database configuration
builder.Services.AddDbContext<PropertyDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlServer(connectionString);
});

// JWT Authentication & Authorization
builder.Services.AddJwtAuthentication(builder.Configuration);

// FluentValidation registration
builder.Services.AddValidatorsFromAssemblyContaining<CreatePropertyDtoValidator>();

// Repositories
builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();
builder.Services.AddScoped<IStateRepository, StateRepository>();
builder.Services.AddScoped<ICityRepository, CityRepository>();
builder.Services.AddScoped<IPropertyImageRepository, PropertyImageRepository>();

// Services
builder.Services.AddScoped<IPropertyAppService, PropertyAppService>();
builder.Services.AddScoped<ILocationAppService, LocationAppService>();
builder.Services.AddScoped<IImageAppService, ImageAppService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

// Serilog HTTP request logging
app.UseSerilogRequestLogging();

// Global Exception Middleware
app.UseMiddleware<GlobalExceptionMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Auto-migrate or ensure database exists
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PropertyDbContext>();
    try { db.Database.EnsureCreated(); } catch { }
}

app.Run("http://localhost:5002");
