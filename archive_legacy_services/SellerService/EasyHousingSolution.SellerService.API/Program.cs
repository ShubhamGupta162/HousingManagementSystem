using Microsoft.EntityFrameworkCore;
using FluentValidation;
using EasyHousingSolution.SellerService.Application.Interfaces;
using EasyHousingSolution.SellerService.Application.Services;
using EasyHousingSolution.SellerService.Application.Validators;
using EasyHousingSolution.SellerService.Domain.Interfaces;
using EasyHousingSolution.SellerService.Infrastructure.Data;
using EasyHousingSolution.SellerService.Infrastructure.Repositories;
using EasyHousingSolution.Shared.Logging;
using EasyHousingSolution.Shared.Middleware;
using EasyHousingSolution.Shared.Security;

using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Serilog
builder.ConfigureSerilog("SellerService");

// Database
builder.Services.AddDbContext<SellerDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories & Services
builder.Services.AddScoped<ISellerRepository, SellerRepository>();
builder.Services.AddScoped<ISellerAppService, SellerAppService>();

// Minimal FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<CreateSellerDtoValidator>();

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
    var db = scope.ServiceProvider.GetRequiredService<SellerDbContext>();
    try { db.Database.EnsureCreated(); } catch { }
}

app.Run("http://localhost:5004");
