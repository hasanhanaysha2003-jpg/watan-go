using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WatanGo.Constants;
using WatanGo.Contracts.UserManagement;
using WatanGo.Data;
using WatanGo.Models;

namespace WatanGo.Controllers;

/// <summary>
/// Full CRUD for platform users (Admin-only).
/// Supports listing, creating, updating, changing roles, and deleting any user account.
/// When creating a Driver or RestaurantOwner the admin may upload multiple document images.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = AppRoles.Admin)]
public sealed class UserManagementController : ControllerBase
{
    private static readonly HashSet<string> DocumentRoles =
        [AppRoles.Driver];

    private static readonly HashSet<string> AllowedExtensions =
        [".jpg", ".jpeg", ".png", ".webp", ".pdf"];

    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _db;
    private readonly IWebHostEnvironment _env;

    public UserManagementController(
        UserManager<ApplicationUser> userManager,
        ApplicationDbContext db,
        IWebHostEnvironment env)
    {
        _userManager = userManager;
        _db = db;
        _env = env;
    }

    // ── GET api/UserManagement ────────────────────────────────────────────────
    /// <summary>Returns all platform users with their roles.</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetAllUsers()
    {
        var users = await _userManager.Users
            .Include(u => u.Documents)
            .OrderBy(u => u.FullName)
            .ToListAsync();

        var result = new List<UserResponse>();
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            result.Add(MapToResponse(user, roles));
        }

        return Ok(result);
    }

    // ── GET api/UserManagement/{id} ───────────────────────────────────────────
    /// <summary>Returns a single user by ID, including their uploaded documents.</summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<UserResponse>> GetUser(string id)
    {
        var user = await _userManager.Users
            .Include(u => u.Documents)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user is null)
            return NotFound(new { Message = "User not found." });

        var roles = await _userManager.GetRolesAsync(user);
        return Ok(MapToResponse(user, roles));
    }

    // ── POST api/UserManagement ───────────────────────────────────────────────
    /// <summary>
    /// Creates a new user account with any role (including customer).
    /// For Driver / RestaurantOwner you may include multiple files via multipart/form-data.
    /// Other fields (FullName, PhoneNumber, Password, Role) are sent as form fields.
    /// </summary>
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<UserResponse>> CreateUser([FromForm] CreateUserRequest request)
    {
        if (!AppRoles.All.Contains(request.Role))
            return BadRequest(new { Message = $"Role must be one of: {string.Join(", ", AppRoles.All)}." });

        if (request.Role == AppRoles.Admin)
            return BadRequest(new { Message = "Cannot create additional Admin accounts." });

        var existing = await _userManager.FindByNameAsync(request.PhoneNumber);
        if (existing is not null)
            return Conflict(new { Message = "Phone number is already registered." });

        // Validate files if role requires documents
        var files = request.Documents ?? new FormFileCollection();
        if (DocumentRoles.Contains(request.Role) && files.Count == 0)
            return BadRequest(new { Message = "يجب رفع وثيقة واحدة على الأقل للسائق أو صاحب المطعم." });

        foreach (var file in files)
        {
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(ext))
                return BadRequest(new { Message = $"نوع الملف غير مسموح به: {file.FileName}. المسموح به: {string.Join(", ", AllowedExtensions)}" });

            if (file.Length > 10 * 1024 * 1024) // 10 MB
                return BadRequest(new { Message = $"حجم الملف {file.FileName} يتجاوز الحد الأقصى (10 ميغابايت)." });
        }

        // Create the user
        var user = new ApplicationUser
        {
            UserName    = request.PhoneNumber,
            PhoneNumber = request.PhoneNumber,
            FullName    = request.FullName
        };

        var createResult = await _userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
            return BadRequest(new { Errors = createResult.Errors.Select(e => e.Description) });

        var roleResult = await _userManager.AddToRoleAsync(user, request.Role);
        if (!roleResult.Succeeded)
            return BadRequest(new { Errors = roleResult.Errors.Select(e => e.Description) });

        // Save document files
        if (files.Count > 0)
            await SaveDocumentsAsync(user, files);

        // Reload with documents
        await _db.Entry(user).Collection(u => u.Documents).LoadAsync();

        var roles = await _userManager.GetRolesAsync(user);
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, MapToResponse(user, roles));
    }

    // ── POST api/UserManagement/{id}/documents ────────────────────────────────
    /// <summary>Upload additional documents for an existing Driver or RestaurantOwner.</summary>
    [HttpPost("{id}/documents")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<UserResponse>> UploadDocuments(string id, [FromForm] IFormFileCollection files)
    {
        var user = await _userManager.Users
            .Include(u => u.Documents)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user is null)
            return NotFound(new { Message = "User not found." });

        var roles = await _userManager.GetRolesAsync(user);
        if (!DocumentRoles.Contains(roles.FirstOrDefault() ?? ""))
            return BadRequest(new { Message = "رفع الوثائق متاح فقط للسائقين وأصحاب المطاعم." });

        if (files is null || files.Count == 0)
            return BadRequest(new { Message = "لم يتم إرفاق أي ملفات." });

        foreach (var file in files)
        {
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(ext))
                return BadRequest(new { Message = $"نوع الملف غير مسموح به: {file.FileName}." });

            if (file.Length > 10 * 1024 * 1024)
                return BadRequest(new { Message = $"حجم الملف {file.FileName} يتجاوز الحد الأقصى (10 ميغابايت)." });
        }

        await SaveDocumentsAsync(user, files);

        await _db.Entry(user).Collection(u => u.Documents).LoadAsync();
        return Ok(MapToResponse(user, roles));
    }

    // ── PUT api/UserManagement/{id} ───────────────────────────────────────────
    /// <summary>Updates name, phone, optional new password, and role for a user.</summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<UserResponse>> UpdateUser(string id, UpdateUserRequest request)
    {
        var user = await _userManager.Users
            .Include(u => u.Documents)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user is null)
            return NotFound(new { Message = "User not found." });

        var currentRoles = await _userManager.GetRolesAsync(user);
        if (currentRoles.Contains(AppRoles.Admin))
            return BadRequest(new { Message = "Admin account cannot be modified." });

        if (user.UserName != request.PhoneNumber)
        {
            var phoneInUse = await _userManager.FindByNameAsync(request.PhoneNumber);
            if (phoneInUse is not null)
                return Conflict(new { Message = "Phone number is already in use." });
        }

        user.FullName    = request.FullName;
        user.UserName    = request.PhoneNumber;
        user.PhoneNumber = request.PhoneNumber;

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
            return BadRequest(new { Errors = updateResult.Errors.Select(e => e.Description) });

        if (!string.IsNullOrWhiteSpace(request.NewPassword))
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var pwResult = await _userManager.ResetPasswordAsync(user, token, request.NewPassword);
            if (!pwResult.Succeeded)
                return BadRequest(new { Errors = pwResult.Errors.Select(e => e.Description) });
        }

        if (!string.IsNullOrWhiteSpace(request.NewRole) && !AppRoles.All.Contains(request.NewRole))
            return BadRequest(new { Message = $"Role must be one of: {string.Join(", ", AppRoles.All)}." });

        if (!string.IsNullOrWhiteSpace(request.NewRole) && request.NewRole != AppRoles.Admin)
        {
            var currentRole = currentRoles.FirstOrDefault();
            if (currentRole is not null && currentRole != request.NewRole)
            {
                await _userManager.RemoveFromRoleAsync(user, currentRole);
                await _userManager.AddToRoleAsync(user, request.NewRole);
            }
        }

        var roles = await _userManager.GetRolesAsync(user);
        return Ok(MapToResponse(user, roles));
    }

    // ── DELETE api/UserManagement/{id} ────────────────────────────────────────
    /// <summary>Deletes a user account and their uploaded documents.</summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _userManager.Users
            .Include(u => u.Documents)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user is null)
            return NotFound(new { Message = "User not found." });

        var roles = await _userManager.GetRolesAsync(user);
        if (roles.Contains(AppRoles.Admin))
            return BadRequest(new { Message = "Admin account cannot be deleted." });

        // Delete physical files
        var userDocDir = GetUserDocDir(id);
        if (Directory.Exists(userDocDir))
            Directory.Delete(userDocDir, recursive: true);

        var deleteResult = await _userManager.DeleteAsync(user);
        if (!deleteResult.Succeeded)
            return BadRequest(new { Errors = deleteResult.Errors.Select(e => e.Description) });

        return NoContent();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private async Task SaveDocumentsAsync(ApplicationUser user, IFormFileCollection files)
    {
        var dir = GetUserDocDir(user.Id);
        Directory.CreateDirectory(dir);

        foreach (var file in files)
        {
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            var storedName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(dir, storedName);

            await using var stream = System.IO.File.Create(filePath);
            await file.CopyToAsync(stream);

            _db.UserDocuments.Add(new UserDocument
            {
                UserId       = user.Id,
                FileName     = storedName,
                OriginalName = file.FileName,
                UploadedAt   = DateTime.UtcNow
            });
        }

        await _db.SaveChangesAsync();
    }

    /// <summary>
    /// Returns the physical directory where a user's documents are stored.
    /// Falls back to ContentRootPath/wwwroot when WebRootPath is null (e.g. cloud hosting).
    /// </summary>
    private string GetUserDocDir(string userId)
    {
        var webRoot = _env.WebRootPath
            ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        return Path.Combine(webRoot, "uploads", "user-docs", userId);
    }

    private string BuildDocUrl(string userId, string fileName) =>
        $"/uploads/user-docs/{userId}/{fileName}";

    private UserResponse MapToResponse(ApplicationUser user, IEnumerable<string> roles) =>
        new()
        {
            Id          = user.Id,
            FullName    = user.FullName,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            Role        = roles.FirstOrDefault() ?? string.Empty,
            CreatedAt   = user.CreatedAt,
            Documents   = user.Documents
                .OrderBy(d => d.UploadedAt)
                .Select(d => new UserDocumentResponse
                {
                    Id           = d.Id,
                    OriginalName = d.OriginalName,
                    Url          = BuildDocUrl(user.Id, d.FileName),
                    UploadedAt   = d.UploadedAt
                })
                .ToList()
        };
}
