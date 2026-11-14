using Microsoft.EntityFrameworkCore;
using EasyHousingSolution.CartService.Application.Interfaces;
using EasyHousingSolution.CartService.Application.Services;
using EasyHousingSolution.CartService.Domain.Interfaces;
using EasyHousingSolution.CartService.Infrastructure.Data;
using EasyHousingSolution.CartService.Infrastructure.Repositories;
using EasyHousingSolution.Shared.Logging;
using EasyHousingSolution.Shared.Middleware;
using EasyHousingSolution.Shared.Security;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Serilog
builder.ConfigureSerilog("CartService");

// Database
builder.Services.AddDbContext<CartDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories & Services
builder.Services.AddScoped<ICartRepository, CartRepository>();

// HttpClient for CartAppService (calls PropertyService directly)
builder.Services.AddHttpClient<ICartAppService, CartAppService>(client =>
{
    var baseUrl = builder.Configuration["ServiceUrls:PropertyService"] ?? "http://localhost:5002/";
    client.BaseAddress = new Uri(baseUrl);
});

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
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "EasyHousingSolution.CartService.API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter your token in the input field.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
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

var app = builder.Build();

app.UseSerilogRequestLogging();
app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.Use(async (context, next) =>
    {
        if (context.Request.Path == "/" || context.Request.Path == "")
        {
            context.Response.Redirect("/swagger");
            return;
        }
        await next();
    });

    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Ensure database created
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CartDbContext>();
    try { db.Database.EnsureCreated(); } catch { }
}

app.Run("http://localhost:5004");
