using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WatanGo.Constants;
using WatanGo.Contracts.Admin;
using WatanGo.Models;

namespace WatanGo.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = AppRoles.Admin)]
public sealed class AdminController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public AdminController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet("accounts")]
    public async Task<ActionResult<IEnumerable<AccountResponse>>> GetAllAccounts()
    {
        var users = await _userManager.Users.ToListAsync();

        var responses = new List<AccountResponse>();
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            responses.Add(MapToResponse(user, roles));
        }

        return Ok(responses);
    }

    [HttpGet("accounts/{id}")]
    public async Task<ActionResult<AccountResponse>> GetAccount(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound(new { Message = "Account not found." });

        var roles = await _userManager.GetRolesAsync(user);
        return Ok(MapToResponse(user, roles));
    }

    [HttpPost("accounts")]
    public async Task<ActionResult<AccountResponse>> CreateAccount(CreateAccountRequest request)
    {
        if (!AppRoles.AdminManaged.Contains(request.Role))
            return BadRequest(new { Message = $"Role must be one of: {string.Join(", ", AppRoles.AdminManaged)}." });

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

        var assignRoleResult = await _userManager.AddToRoleAsync(user, request.Role);
        if (!assignRoleResult.Succeeded)
            return BadRequest(new { Errors = assignRoleResult.Errors.Select(e => e.Description) });

        var roles = await _userManager.GetRolesAsync(user);
        return CreatedAtAction(nameof(GetAccount), new { id = user.Id }, MapToResponse(user, roles));
    }

    [HttpPut("accounts/{id}")]
    public async Task<ActionResult<AccountResponse>> UpdateAccount(string id, UpdateAccountRequest request)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound(new { Message = "Account not found." });

        if (user.UserName != request.PhoneNumber)
        {
            var phoneInUse = await _userManager.FindByNameAsync(request.PhoneNumber);
            if (phoneInUse is not null)
                return Conflict(new { Message = "Phone number is already in use." });
        }

        user.FullName = request.FullName;
        user.UserName = request.PhoneNumber;
        user.PhoneNumber = request.PhoneNumber;

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
            return BadRequest(new { Errors = updateResult.Errors.Select(e => e.Description) });

        if (!string.IsNullOrWhiteSpace(request.NewPassword))
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var passwordResult = await _userManager.ResetPasswordAsync(user, token, request.NewPassword);
            if (!passwordResult.Succeeded)
                return BadRequest(new { Errors = passwordResult.Errors.Select(e => e.Description) });
        }

        var roles = await _userManager.GetRolesAsync(user);
        return Ok(MapToResponse(user, roles));
    }

    [HttpDelete("accounts/{id}")]
    public async Task<IActionResult> DeleteAccount(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound(new { Message = "Account not found." });

        var roles = await _userManager.GetRolesAsync(user);
        if (roles.Contains(AppRoles.Admin))
            return BadRequest(new { Message = "Admin account cannot be deleted." });

        var deleteResult = await _userManager.DeleteAsync(user);
        if (!deleteResult.Succeeded)
            return BadRequest(new { Errors = deleteResult.Errors.Select(e => e.Description) });

        return NoContent();
    }

    private static AccountResponse MapToResponse(ApplicationUser user, IEnumerable<string> roles) =>
        new()
        {
            Id = user.Id,
            FullName = user.FullName,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            Role = roles.FirstOrDefault() ?? string.Empty
        };
}
