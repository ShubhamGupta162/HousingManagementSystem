using EasyHousingSolution.CartService.Application.Interfaces;
using EasyHousingSolution.CartService.Application.Services;
using EasyHousingSolution.CartService.Application.Validators;
using EasyHousingSolution.CartService.Domain.Interfaces;
using EasyHousingSolution.CartService.Infrastructure.Clients;
using EasyHousingSolution.CartService.Infrastructure.Data;
using EasyHousingSolution.CartService.Infrastructure.Repositories;
using EasyHousingSolution.Shared.Logging;
using EasyHousingSolution.Shared.Middleware;
using EasyHousingSolution.Shared.Security;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
builder.ConfigureSerilog("CartService");

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger with JWT Bearer support
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "EasyHousingSolution - CartService API", Version = "v1" });
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
builder.Services.AddDbContext<CartDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlServer(connectionString);
});

// JWT Authentication & Authorization
builder.Services.AddJwtAuthentication(builder.Configuration);

// FluentValidation registration
builder.Services.AddValidatorsFromAssemblyContaining<AddToCartDtoValidator>();

// Repositories
builder.Services.AddScoped<ICartRepository, CartRepository>();

// Inter-Service Communication via HttpClient (Option B)
var propertyServiceUrl = builder.Configuration["Services:PropertyServiceUrl"] ?? "http://localhost:5002";
builder.Services.AddHttpClient<IPropertyServiceClient, PropertyServiceClient>(client =>
{
    client.BaseAddress = new Uri(propertyServiceUrl);
});

// Services
builder.Services.AddScoped<ICartAppService, CartAppService>();

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

app.Run();
