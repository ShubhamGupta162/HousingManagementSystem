using EasyHousingSolution.Shared.Logging;
using EasyHousingSolution.Shared.Middleware;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
builder.ConfigureSerilog("ApiGateway");

// Load Ocelot configuration
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// Add Ocelot services
builder.Services.AddOcelot(builder.Configuration);

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Serilog HTTP request logging
app.UseSerilogRequestLogging();

// Global Exception Middleware
app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseCors("AllowAll");

await app.UseOcelot();

app.Run();
