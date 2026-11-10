using Microsoft.AspNetCore.Builder;
using Serilog;

namespace EasyHousingSolution.Shared.Logging;

public static class SerilogExtensions
{
    public static void ConfigureSerilog(this WebApplicationBuilder builder, string serviceName)
    {
        builder.Host.UseSerilog((context, loggerConfig) =>
        {
            loggerConfig
                .ReadFrom.Configuration(context.Configuration)
                .Enrich.FromLogContext()
                .Enrich.WithProperty("ServiceName", serviceName)
                .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] [{ServiceName}] {Message:lj}{NewLine}{Exception}")
                .WriteTo.File(
                    path: $"logs/{serviceName.ToLowerInvariant()}-.log",
                    rollingInterval: RollingInterval.Day,
                    outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] [{ServiceName}] {Message:lj}{NewLine}{Exception}");
        });
    }
}
