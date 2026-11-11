using Microsoft.EntityFrameworkCore;
using FluentValidation;
using EasyHousingSolution.BuyerService.Application.Interfaces;
using EasyHousingSolution.BuyerService.Application.Services;
using EasyHousingSolution.BuyerService.Application.Validators;
using EasyHousingSolution.BuyerService.Domain.Interfaces;
using EasyHousingSolution.BuyerService.Infrastructure.Clients;
using EasyHousingSolution.BuyerService.Infrastructure.Data;
using EasyHousingSolution.BuyerService.Infrastructure.Repositories;
using EasyHousingSolution.Shared.Logging;
using EasyHousingSolution.Shared.Middleware;
using EasyHousingSolution.Shared.Security;

using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Serilog
builder.ConfigureSerilog("BuyerService");

// Database
builder.Services.AddDbContext<BuyerDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories & Services
builder.Services.AddScoped<IBuyerRepository, BuyerRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<IBuyerAppService, BuyerAppService>();
builder.Services.AddScoped<ICartAppService, CartAppService>();

// HttpClient for PropertyService (Option B: inter-service communication)
builder.Services.AddHttpClient<IPropertyServiceClient, PropertyServiceClient>();

// Minimal FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<CreateBuyerDtoValidator>();

// JWT Authentication
builder.Services.AddJwtAuthentication(builder.Configuration);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", p =>
        p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSerilogRequestLogging();
app.UseMiddleware<GlobalExceptionMiddleware>();

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
    var db = scope.ServiceProvider.GetRequiredService<BuyerDbContext>();
    try { db.Database.EnsureCreated(); } catch { }
}

app.Run("http://localhost:5003");
