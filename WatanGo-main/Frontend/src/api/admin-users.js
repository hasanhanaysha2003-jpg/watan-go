/**
 * admin-users.js
 * API calls for the Admin → User Management section.
 * All requests hit /api/UserManagement (Admin-only, JWT required).
 */
import { apiClient, baseURL } from "./client";
import { mapBackendRole, mapFrontendRole } from "./auth";

// ── Roles that require document uploads ───────────────────────────────────────
export const DOCUMENT_ROLES = new Set(["driver"]);

// ── Role mapping ──────────────────────────────────────────────────────────────

function normalizeDocument(raw) {
  return {
    id: raw.id,
    originalName: raw.originalName,
    // raw.url is a relative path like /uploads/user-docs/{id}/{file}
    // Prefix with the backend base URL so <img src> resolves correctly
    url: raw.url?.startsWith("http") ? raw.url : `${baseURL}${raw.url}`,
    uploadedAt: raw.uploadedAt,
  };
}

function normalizeUser(raw) {
  return {
    id: raw.id,
    name: raw.fullName,
    phone: raw.phoneNumber,
    role: mapBackendRole(raw.role),
    createdAt: raw.createdAt,
    documents: Array.isArray(raw.documents)
      ? raw.documents.map(normalizeDocument)
      : [],
  };
}

/**
 * Extracts a human-readable error string from an Axios error response.
 * Handles all ASP.NET Core error shapes:
 *   1. ValidationProblemDetails  → { errors: { Field: ["msg", ...] } }
 *   2. Custom errors array       → { errors: ["msg", ...] }
 *   3. Plain message field       → { message | Message | title }
 */
function extractError(error, fallback) {
  const data = error.response?.data;
  if (!data) return fallback;

  const errors = data.errors;

  // Shape 1: ASP.NET Core model-validation dict { FieldName: ["error msg"] }
  if (errors && typeof errors === "object" && !Array.isArray(errors)) {
    const firstMessage = Object.values(errors).flat().find(Boolean);
    if (firstMessage) return firstMessage;
  }

  // Shape 2: Custom array of strings  { errors: ["error msg"] }
  if (Array.isArray(errors) && errors.length > 0) return errors[0];

  // Shape 3: Plain message / title
  return data.message ?? data.Message ?? data.title ?? fallback;
}


// ── CRUD ──────────────────────────────────────────────────────────────────────

/** GET /api/UserManagement — list all users */
export async function getAllUsers() {
  try {
    const { data } = await apiClient.get("/api/UserManagement");
    return { ok: true, users: data.map(normalizeUser) };
  } catch (error) {
    return { ok: false, message: extractError(error, "تعذّر جلب قائمة المستخدمين") };
  }
}

/** GET /api/UserManagement/{id} — fetch single user */
export async function getUserById(id) {
  try {
    const { data } = await apiClient.get(`/api/UserManagement/${id}`);
    return { ok: true, user: normalizeUser(data) };
  } catch (error) {
    return { ok: false, message: extractError(error, "تعذّر جلب بيانات المستخدم") };
  }
}

/**
 * POST /api/UserManagement — create a new user.
 * For Driver / RestaurantOwner roles the `documents` array (File[]) must be included.
 * The request is sent as multipart/form-data.
 *
 * @param {{ name: string, phone: string, password: string, role: string, documents?: File[] }} form
 */
export async function createUser({ name, phone, password, role, documents = [] }) {
  try {
    const formData = new FormData();
    formData.append("fullName", name);
    formData.append("phoneNumber", phone);
    formData.append("password", password);
    formData.append("role", mapFrontendRole(role));

    // Attach each file under the field name "Documents" (matches the C# property)
    documents.forEach((file) => formData.append("Documents", file));

    const { data } = await apiClient.post("/api/UserManagement", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { ok: true, user: normalizeUser(data) };
  } catch (error) {
    return { ok: false, message: extractError(error, "تعذّر إنشاء المستخدم") };
  }
}

/**
 * PUT /api/UserManagement/{id} — update name, phone, password, role.
 * @param {string} id
 * @param {{ name: string, phone: string, newPassword?: string, role?: string }} form
 */
export async function updateUser(id, { name, phone, newPassword, role }) {
  try {
    const { data } = await apiClient.put(`/api/UserManagement/${id}`, {
      fullName: name,
      phoneNumber: phone,
      newPassword: newPassword || null,
      newRole: role ? mapFrontendRole(role) : null,
    });
    return { ok: true, user: normalizeUser(data) };
  } catch (error) {
    return { ok: false, message: extractError(error, "تعذّر تحديث المستخدم") };
  }
}

/**
 * POST /api/UserManagement/{id}/documents — upload additional documents to an existing user.
 * @param {string} id
 * @param {File[]} files
 */
export async function uploadUserDocuments(id, files) {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const { data } = await apiClient.post(
      `/api/UserManagement/${id}/documents`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return { ok: true, user: normalizeUser(data) };
  } catch (error) {
    return { ok: false, message: extractError(error, "تعذّر رفع الوثائق") };
  }
}

/**
 * DELETE /api/UserManagement/{id} — delete a user account.
 * @param {string} id
 */
export async function deleteUser(id) {
  try {
    await apiClient.delete(`/api/UserManagement/${id}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: extractError(error, "تعذّر حذف المستخدم") };
  }
}
