using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WatanGo.Data;
using WatanGo.Data.Seeders;
using WatanGo.Hubs;
using WatanGo.Middleware;
using WatanGo.Models;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

const string corsPolicyName = "DefaultCorsPolicy";

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter(JsonNamingPolicy.SnakeCaseLower)));
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",   // Vite dev server (default)
                "http://localhost:5173",   // Vite alternative dev port
                "http://localhost:4173",   // Vite preview
                "https://localhost:3000",
                "https://localhost:5173",
                "https://watango.onrender.com"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();           // Required for SignalR + JWT
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services
    .AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        options.User.RequireUniqueEmail = false;
        options.Password.RequireDigit = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequiredLength = 1;
        options.Password.RequiredUniqueChars = 1;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

var jwtKey = builder.Configuration["Jwt:Key"]!;
var jwtIssuer = builder.Configuration["Jwt:Issuer"]!;
var jwtAudience = builder.Configuration["Jwt:Audience"]!;

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;

                if (!string.IsNullOrWhiteSpace(accessToken)
                    && (path.StartsWithSegments("/hubs/ride-tracking")
                        || path.StartsWithSegments("/hubs/order-tracking")))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddSignalR();

builder.Services.AddScoped<ISeeder, RoleSeeder>();
builder.Services.AddScoped<ISeeder, UserSeeder>();
builder.Services.AddScoped<ISeeder, RestaurantSeeder>();
builder.Services.AddScoped<ISeeder, MarketItemSeeder>();
builder.Services.AddScoped<ISeeder, DriverRatingSeeder>();
builder.Services.AddScoped<DataSeeder>();

var app = builder.Build();

app.MapOpenApi();
app.MapScalarApiReference();

using (var scope = app.Services.CreateScope())
{
    var dataSeeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
    await dataSeeder.SeedAsync();
}

app.UseMiddleware<GlobalExceptionHandlingMiddleware>();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
// Serve static files from wwwroot (or a fallback path when WebRootPath is null on hosted environments)
var webRoot = app.Environment.WebRootPath
    ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot");
Directory.CreateDirectory(webRoot); // ensure the directory exists before UseStaticFiles
app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(webRoot),
    RequestPath = ""
});
app.UseRouting();
app.UseCors(corsPolicyName);
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () =>
{
    const string page = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>WatanGo API</title>
            <style>
                :root {
                    --bg: #f5f7fb;
                    --card: #ffffff;
                    --text: #0f172a;
                    --muted: #475569;
                    --primary: #0ea5e9;
                    --primary-hover: #0284c7;
                }
                * { box-sizing: border-box; }
                body {
                    margin: 0;
                    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #f5f7fb 0%, #e2e8f0 100%);
                    color: var(--text);
                    min-height: 100vh;
                    display: grid;
                    place-items: center;
                    padding: 24px;
                }
                .card {
                    width: min(680px, 100%);
                    background: var(--card);
                    border-radius: 16px;
                    padding: 32px;
                    box-shadow: 0 20px 45px rgba(2, 8, 23, 0.12);
                    text-align: center;
                }
                h1 {
                    margin: 0 0 12px;
                    font-size: clamp(28px, 4vw, 40px);
                }
                p {
                    margin: 0 0 24px;
                    color: var(--muted);
                    font-size: 18px;
                    line-height: 1.5;
                }
                .btn {
                    display: inline-block;
                    text-decoration: none;
                    border: none;
                    border-radius: 10px;
                    padding: 12px 22px;
                    font-weight: 700;
                    background: var(--primary);
                    color: #fff;
                    transition: background .2s ease-in-out;
                }
                .btn:hover {
                    background: var(--primary-hover);
                }
            </style>
        </head>
        <body>
            <main class="card">
                <h1>WatanGo API is Running</h1>
                <p>The application is working correctly. You can explore and test endpoints in Scalar.</p>
                <a class="btn" href="/scalar/v1">Open Scalar API Docs</a>
            </main>
        </body>
        </html>
        """;

    return Results.Content(page, "text/html");
})
.AllowAnonymous();

app.MapControllers();
app.MapHub<RideTrackingHub>("/hubs/ride-tracking");
app.MapHub<OrderTrackingHub>("/hubs/order-tracking");

app.Run();

