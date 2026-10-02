using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WatanGo.Constants;
using WatanGo.Contracts.Authentication;
using WatanGo.Models;

namespace WatanGo.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthenticationController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public AuthenticationController(
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<AuthenticationResponse>> Register(RegisterRequest request)
    {
        var existingUser = await _userManager.FindByNameAsync(request.PhoneNumber);
        if (existingUser is not null)
            return Conflict(new { Message = "Phone number is already registered." });

        var user = new ApplicationUser
        {
            UserName = request.PhoneNumber,
            PhoneNumber = request.PhoneNumber,
            FullName = request.FullName
        };

        var createResult = await _userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
            return BadRequest(new { Errors = createResult.Errors.Select(e => e.Description) });

        var assignRoleResult = await _userManager.AddToRoleAsync(user, AppRoles.User);
        if (!assignRoleResult.Succeeded)
            return BadRequest(new { Errors = assignRoleResult.Errors.Select(e => e.Description) });

        var (token, expiresAtUtc) = CreateJwtToken(user, AppRoles.User);

        return Ok(new AuthenticationResponse
        {
            Token = token,
            ExpiresAtUtc = expiresAtUtc,
            FullName = user.FullName,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            Role = AppRoles.User
        });
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<AuthenticationResponse>> Login(LoginRequest request)
    {
        var user = await _userManager.FindByNameAsync(request.PhoneNumber);
        if (user is null)
            return Unauthorized(new { Message = "Invalid phone number or password." });

        var validPassword = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!validPassword)
            return Unauthorized(new { Message = "Invalid phone number or password." });

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? string.Empty;
        var (token, expiresAtUtc) = CreateJwtToken(user, role);

        return Ok(new AuthenticationResponse
        {
            Token = token,
            ExpiresAtUtc = expiresAtUtc,
            FullName = user.FullName,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            Role = role
        });
    }

    private (string Token, DateTime ExpiresAtUtc) CreateJwtToken(ApplicationUser user, string role)
    {
        var key = _configuration["Jwt:Key"]!;
        var issuer = _configuration["Jwt:Issuer"]!;
        var audience = _configuration["Jwt:Audience"]!;

        var expiresAtUtc = DateTime.UtcNow.AddYears(1);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.UniqueName, user.UserName ?? string.Empty),
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Name, user.UserName ?? string.Empty),
            new(ClaimTypes.Role, role)
        };

        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiresAtUtc,
            signingCredentials: signingCredentials);

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAtUtc);
    }
}
