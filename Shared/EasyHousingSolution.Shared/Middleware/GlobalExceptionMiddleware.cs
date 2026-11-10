using System.Net;
using System.Text.Json;
using EasyHousingSolution.Shared.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace EasyHousingSolution.Shared.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Resource not found for request {Method} {Path}: {Message}", 
                context.Request.Method, context.Request.Path, ex.Message);
            await HandleExceptionAsync(context, HttpStatusCode.NotFound, ex.Message);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation failure for request {Method} {Path}: {Message}", 
                context.Request.Method, context.Request.Path, ex.Message);
            await HandleExceptionAsync(context, HttpStatusCode.BadRequest, ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Business rule constraint violated for request {Method} {Path}: {Message}", 
                context.Request.Method, context.Request.Path, ex.Message);
            await HandleExceptionAsync(context, HttpStatusCode.BadRequest, ex.Message);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized access attempt for request {Method} {Path}: {Message}", 
                context.Request.Method, context.Request.Path, ex.Message);
            await HandleExceptionAsync(context, HttpStatusCode.Unauthorized, "Unauthorized access.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled critical exception on request {Method} {Path}: {Message}", 
                context.Request.Method, context.Request.Path, ex.Message);
            await HandleExceptionAsync(context, HttpStatusCode.InternalServerError, 
                "An unexpected server error occurred. Please try again later.", new List<string> { ex.Message });
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, HttpStatusCode statusCode, string message, List<string>? errors = null)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var response = ApiResponse<object>.Fail(message, errors);
        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        var json = JsonSerializer.Serialize(response, jsonOptions);
        await context.Response.WriteAsync(json);
    }
}
