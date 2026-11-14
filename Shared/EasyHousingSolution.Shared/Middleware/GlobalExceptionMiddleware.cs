using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EasyHousingSolution.Shared.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public record ExceptionResponse(
        HttpStatusCode StatusCode,
        string Message,
        string? Details = null);

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
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception caught by GlobalExceptionMiddleware: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    public async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        ExceptionResponse response = exception switch
        {
            ArgumentException argEx => 
                new ExceptionResponse(HttpStatusCode.BadRequest, "Invalid Argument", argEx.Message),

            InvalidOperationException opEx => 
                new ExceptionResponse(HttpStatusCode.BadRequest, "Operation Not Allowed", opEx.Message),

            BadHttpRequestException badReqEx => 
                new ExceptionResponse(HttpStatusCode.BadRequest, "Malformed Request", badReqEx.Message),

            KeyNotFoundException notFoundEx => 
                new ExceptionResponse(HttpStatusCode.NotFound, "Not Found", notFoundEx.Message),

            UnauthorizedAccessException _ => 
                new ExceptionResponse(HttpStatusCode.Unauthorized, "Unauthorized", "Access denied. Authentication required."),

            HttpRequestException _ => 
                new ExceptionResponse(HttpStatusCode.BadGateway, "Service Communication Error", "Failed to communicate with downstream microservice."),

            DbUpdateException _ => 
                new ExceptionResponse(HttpStatusCode.Conflict, "Database Conflict", "Record already exists or violates a database unique constraint."),

            _ => 
                new ExceptionResponse(HttpStatusCode.InternalServerError, "Internal Server Error", "An unexpected error occurred. Please try again later.")
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)response.StatusCode;
        await context.Response.WriteAsJsonAsync(response);
    }
}
