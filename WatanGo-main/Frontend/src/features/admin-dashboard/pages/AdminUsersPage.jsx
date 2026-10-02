import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PeopleIcon from "@mui/icons-material/People";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "sonner";
import { ROLES, labelForRole } from "@/lib/auth";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  uploadUserDocuments,
  DOCUMENT_ROLES,
} from "@/api/admin-users";

// ── Constants ─────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: "",
  phone: "",
  role: "customer",
  password: "",
};

// Roles that the admin can assign (all except "admin" itself)
const ASSIGNABLE_ROLES = ROLES.filter((r) => r.value !== "admin");

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,application/pdf";

// ── DocumentUploadSection ─────────────────────────────────────────────────────

function DocumentUploadSection({ files, onChange, disabled, isEditing = false, hasError = false }) {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;
    // Merge — avoid duplicates by name+size
    onChange((prev) => {
      const existing = new Set(prev.map((f) => `${f.name}-${f.size}`));
      const fresh = picked.filter((f) => !existing.has(`${f.name}-${f.size}`));
      return [...prev, ...fresh];
    });
    // Reset input so same file can be re-picked after removal
    e.target.value = "";
  };

  const remove = (index) =>
    onChange((prev) => prev.filter((_, i) => i !== index));

  const isImage = (file) => file.type.startsWith("image/");

  return (
    <Box>
      <Typography
        variant="subtitle2"
        fontWeight={700}
        mb={1}
        color={hasError ? "error" : "primary"}
      >
        {isEditing ? "إضافة وثائق جديدة" : "الوثائق المطلوبة *"}
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
        {isEditing
          ? "اختر ملفات إضافية لإرفاقها بهذا الحساب (JPG / PNG / PDF — حتى 10 ميغابايت)"
          : "رخصة القيادة، الهوية الوطنية، أو أي وثيقة مطلوبة. (JPG / PNG / PDF — حتى 10 ميغابايت للملف)"}
      </Typography>

      {/* Drop zone / pick button */}
      <Box
        onClick={() => !disabled && inputRef.current?.click()}
        sx={{
          border: "2px dashed",
          borderColor: disabled
            ? "action.disabled"
            : hasError
              ? "error.main"
              : "primary.main",
          borderRadius: 2,
          p: 2.5,
          textAlign: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          bgcolor: disabled
            ? "action.disabledBackground"
            : hasError
              ? "error.50"
              : "primary.50",
          transition: "background .15s, border-color .15s",
          "&:hover": disabled
            ? {}
            : hasError
              ? { bgcolor: "error.100" }
              : { bgcolor: "primary.100" },
        }}
      >
        <CloudUploadIcon
          sx={{
            fontSize: 36,
            color: disabled ? "action.disabled" : hasError ? "error.main" : "primary.main",
            mb: 0.5,
          }}
        />
        <Typography
          variant="body2"
          color={disabled ? "text.disabled" : hasError ? "error.main" : "primary.main"}
          fontWeight={600}
        >
          انقر لاختيار الملفات
        </Typography>
        <Typography variant="caption" color={hasError ? "error.main" : "text.secondary"}>
          يمكنك اختيار أكثر من ملف في المرة الواحدة
        </Typography>
      </Box>

      {/* Inline error message */}
      {hasError && (
        <Typography variant="caption" color="error" sx={{ mt: 0.75, display: "block" }}>
          ⚠️ يجب رفع وثيقة واحدة على الأقل للمتابعة.
        </Typography>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
        disabled={disabled}
      />

      {/* Thumbnails / file list */}
      {files.length > 0 && (
        <Stack spacing={1} mt={1.5}>
          {files.map((file, index) => (
            <Box
              key={`${file.name}-${index}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "divider",
                p: 1,
                bgcolor: "background.paper",
              }}
            >
              {/* Preview / icon */}
              {isImage(file) ? (
                <Box
                  component="img"
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1,
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <InsertDriveFileIcon
                  sx={{ width: 48, height: 48, color: "primary.main", flexShrink: 0 }}
                />
              )}

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  noWrap
                  title={file.name}
                >
                  {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>

              <IconButton
                size="small"
                onClick={() => remove(index)}
                disabled={disabled}
                sx={{ flexShrink: 0 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}

// ── UserFormDialog ─────────────────────────────────────────────────────────────

function UserFormDialog({ open, onClose, onSave, initial, isEditing, loading, serverError }) {
  const [form, setForm] = useState(initial);
  // newDocuments = files the admin just picked (not yet saved)
  const [newDocuments, setNewDocuments] = useState([]);
  const [docError, setDocError] = useState(false);

  // Sync form whenever the dialog opens for a different user
  useEffect(() => {
    if (open) {
      setForm(initial);
      setNewDocuments([]);
      setDocError(false);
    }
  }, [open, initial]);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const needsDocs = DOCUMENT_ROLES.has(form.role);

  // Existing documents when editing (stored on the user object passed via initial)
  const existingDocs = isEditing ? (initial.documents ?? []) : [];

  // Clear doc error as soon as a file is added
  const handleDocsChange = (updater) => {
    setNewDocuments(updater);
    setDocError(false);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("أدخل الاسم ورقم الهاتف قبل الحفظ");
      return;
    }
    if (!isEditing && !form.password.trim()) {
      toast.error("كلمة المرور مطلوبة عند إنشاء مستخدم جديد");
      return;
    }
    // On create: at least one doc required. On edit: optional (add more)
    if (!isEditing && needsDocs && newDocuments.length === 0) {
      setDocError(true);
      toast.error("يجب رفع وثيقة واحدة على الأقل للسائق أو صاحب المطعم");
      return;
    }
    onSave({ ...form, documents: newDocuments });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEditing ? "تعديل بيانات مستخدم" : "إضافة مستخدم جديد"}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={2.5} mt={1}>
          {serverError && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {serverError}
            </Alert>
          )}
          <TextField
            label="الاسم الكامل"
            value={form.name}
            onChange={set("name")}
            fullWidth
            size="small"
            disabled={loading}
          />
          <TextField
            label="رقم الهاتف"
            value={form.phone}
            onChange={set("phone")}
            fullWidth
            size="small"
            disabled={loading}
            slotProps={{ htmlInput: { dir: "ltr" } }}
          />
          <FormControl fullWidth size="small" disabled={loading}>
            <InputLabel>نوع الحساب</InputLabel>
            <Select value={form.role} label="نوع الحساب" onChange={set("role")}>
              {ASSIGNABLE_ROLES.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <span>{r.emoji}</span>
                    <span>{r.label}</span>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={isEditing ? "كلمة مرور جديدة (اختياري)" : "كلمة المرور"}
            type="password"
            value={form.password}
            onChange={set("password")}
            fullWidth
            size="small"
            disabled={loading}
            placeholder={isEditing ? "اتركها فارغة بدون تغيير" : ""}
            helperText={!isEditing ? "6 أحرف على الأقل" : ""}
          />

          {/* ── Documents — shown for Driver / RestaurantOwner on BOTH create & edit ── */}
          {needsDocs && (
            <>
              <Divider />

              {/* Existing saved docs (edit mode only) */}
              {isEditing && existingDocs.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} mb={1} color="text.secondary">
                    الوثائق الحالية ({existingDocs.length})
                  </Typography>
                  <Stack spacing={0.75}>
                    {existingDocs.map((doc) => {
                      const isImg = /\.(jpg|jpeg|png|webp)$/i.test(doc.originalName);
                      return (
                        <Box
                          key={doc.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            borderRadius: 1.5,
                            border: "1px solid",
                            borderColor: "divider",
                            p: 1,
                            bgcolor: "action.hover",
                          }}
                        >
                          {isImg ? (
                            <Box
                              component="img"
                              src={doc.url}
                              alt={doc.originalName}
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1,
                                objectFit: "cover",
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <InsertDriveFileIcon
                              sx={{ width: 40, height: 40, color: "primary.main", flexShrink: 0 }}
                            />
                          )}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600} noWrap title={doc.originalName}>
                              {doc.originalName}
                            </Typography>
                            <Button
                              size="small"
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ p: 0, minWidth: 0, fontSize: "0.7rem" }}
                            >
                              فتح الملف
                            </Button>
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              )}

              {/* New documents to upload */}
              <DocumentUploadSection
                files={newDocuments}
                onChange={handleDocsChange}
                disabled={loading}
                isEditing={isEditing}
                hasError={!isEditing && docError}
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={loading}>
          إلغاء
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={14} color="inherit" />}
        >
          {loading ? "جارٍ الحفظ…" : "حفظ"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── UserDetailsDialog ─────────────────────────────────────────────────────────

function UserDetailsDialog({ user, onClose }) {
  if (!user) return null;

  const rows = [
    { label: "الاسم", value: user.name },
    { label: "رقم الهاتف", value: user.phone },
    { label: "الدور", value: labelForRole(user.role) },
  ];

  const hasDocs = user.documents?.length > 0;

  return (
    <Dialog open={Boolean(user)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>تفاصيل المستخدم</DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={1.5} mt={1}>
          {rows.map(({ label, value }) => (
            <Box
              key={label}
              sx={{
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                p: 1.5,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
              <Typography
                fontWeight={600}
                mt={0.25}
                sx={{ wordBreak: "break-all", fontFamily: label === "المعرّف" ? "monospace" : "inherit" }}
              >
                {value}
              </Typography>
            </Box>
          ))}

          {/* Documents */}
          {hasDocs && (
            <Box>
              <Typography variant="subtitle2" fontWeight={700} mb={1} color="primary">
                الوثائق المرفوعة
              </Typography>
              <Stack spacing={1}>
                {user.documents.map((doc) => {
                  const isImg = /\.(jpg|jpeg|png|webp)$/i.test(doc.originalName);
                  return (
                    <Box
                      key={doc.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        borderRadius: 1.5,
                        border: "1px solid",
                        borderColor: "divider",
                        p: 1,
                      }}
                    >
                      {isImg ? (
                        <Box
                          component="img"
                          src={doc.url}
                          alt={doc.originalName}
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 1,
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <InsertDriveFileIcon
                          sx={{ width: 56, height: 56, color: "primary.main", flexShrink: 0 }}
                        />
                      )}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {doc.originalName}
                        </Typography>
                        <Button
                          size="small"
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ p: 0, minWidth: 0, fontSize: "0.72rem" }}
                        >
                          فتح الملف
                        </Button>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>إغلاق</Button>
      </DialogActions>
    </Dialog>
  );
}

// ── DeleteConfirmDialog ───────────────────────────────────────────────────────

function DeleteConfirmDialog({ user, onClose, onConfirm, loading }) {
  return (
    <Dialog open={Boolean(user)} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>تأكيد حذف المستخدم</DialogTitle>
      <Divider />
      <DialogContent>
        <Typography variant="body2" color="text.secondary" mt={1}>
          هل تريد حذف حساب <strong>{user?.name}</strong>؟ لا يمكن التراجع عن
          هذا الإجراء.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={loading}>
          إلغاء
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={loading && <CircularProgress size={14} color="inherit" />}
        >
          {loading ? "جارٍ الحذف…" : "تأكيد الحذف"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Role chip color map ───────────────────────────────────────────────────────

const ROLE_CHIP_COLOR = {
  customer: "default",
  driver: "primary",
  restaurant: "warning",
  shop: "info",
  admin: "error",
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // Dialog state
  const [formDialog, setFormDialog] = useState(null); // null = closed, {} = open
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [detailsUser, setDetailsUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isEditing = Boolean(formDialog?.id);

  // ── Data loading ────────────────────────────────────────────────────────────

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getAllUsers();
    if (result.ok) {
      setUsers(result.users);
    } else {
      setError(result.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // ── Filtered list ───────────────────────────────────────────────────────────

  const filteredUsers = search.trim()
    ? users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.phone.includes(search)
    )
    : users;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const openAdd = () => { setFormError(null); setFormDialog({ ...EMPTY_FORM }); };
  const openEdit = (user) => {
    setFormError(null);
    setFormDialog({
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      password: "",
      // Pass existing docs so the edit dialog can display them
      documents: user.documents ?? [],
    });
  };

  const handleSave = async (form) => {
    setFormLoading(true);

    let result;
    if (isEditing) {
      // Step 1: update user data (name, phone, password, role)
      result = await updateUser(formDialog.id, {
        name: form.name,
        phone: form.phone,
        newPassword: form.password || undefined,
        role: form.role,
      });

      // Step 2: if new documents were picked, upload them
      if (result.ok && form.documents?.length > 0) {
        const docsResult = await uploadUserDocuments(formDialog.id, form.documents);
        if (!docsResult.ok) {
          // User was saved but docs failed — warn without blocking
          toast.warning(`تم حفظ البيانات، لكن فشل رفع الوثائق: ${docsResult.message}`);
          setFormLoading(false);
          setFormDialog(null);
          loadUsers();
          return;
        }
      }
    } else {
      result = await createUser({
        name: form.name,
        phone: form.phone,
        password: form.password,
        role: form.role,
        documents: form.documents ?? [],
      });
    }

    setFormLoading(false);

    if (!result.ok) {
      setFormError(result.message);
      toast.error(result.message);
      return;
    }

    toast.success(isEditing ? "تم تحديث بيانات المستخدم" : "تم إضافة المستخدم بنجاح");
    setFormError(null);
    setFormDialog(null);
    loadUsers();
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    const result = await deleteUser(deleteTarget.id);
    setDeleteLoading(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success("تم حذف المستخدم");
    setDeleteTarget(null);
    loadUsers();
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Stack spacing={3}>
      {/* ── Header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.5 }}>
            <PeopleIcon color="primary" />
            <Typography variant="h5" fontWeight={700}>
              إدارة المستخدمين
            </Typography>
            {!loading && (
              <Chip
                label={`${users.length} مستخدم`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            إدارة حسابات مستخدمي وطن جو — مراجعة الأدوار وإضافة أو تعديل
            الحسابات.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAdd}
            disabled={loading}
          >
            إضافة مستخدم
          </Button>
        </Stack>
      </Box>

      {/* ── Search bar ── */}
      <TextField
        placeholder="ابحث باسم المستخدم أو رقم الهاتف…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        fullWidth
        sx={{ maxWidth: 420 }}
      />

      {/* ── Error banner ── */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* ── Table ── */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: 600 }}>الاسم</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>رقم الهاتف</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>الدور</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>الوثائق</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  إجراءات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mt={1}
                    >
                      جارٍ التحميل…
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 5, color: "text.secondary" }}
                  >
                    {search
                      ? "لا توجد نتائج مطابقة للبحث."
                      : "لا يوجد مستخدمون مسجلون بعد."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>{user.name}</Typography>
                    </TableCell>
                    <TableCell
                      sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}
                    >
                      {user.phone}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={labelForRole(user.role)}
                        color={ROLE_CHIP_COLOR[user.role] ?? "default"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {user.documents?.length > 0 ? (
                        <Chip
                          label={`${user.documents.length} وثيقة`}
                          size="small"
                          color="success"
                          variant="outlined"
                          icon={<InsertDriveFileIcon />}
                        />
                      ) : DOCUMENT_ROLES.has(user.role) ? (
                        <Chip
                          label="لا توجد وثائق"
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      ) : (
                        <Typography variant="caption" color="text.disabled">
                          —
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ justifyContent: "center" }}
                      >
                        <Tooltip title="عرض التفاصيل">
                          <IconButton
                            size="small"
                            onClick={() => setDetailsUser(user)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="تعديل">
                          <span>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => openEdit(user)}
                              disabled={user.role === "admin"}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip
                          title={
                            user.role === "admin"
                              ? "لا يمكن حذف حساب الأدمن"
                              : "حذف"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setDeleteTarget(user)}
                              disabled={user.role === "admin"}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ── Dialogs ── */}
      <UserFormDialog
        open={formDialog !== null}
        onClose={() => { if (!formLoading) { setFormError(null); setFormDialog(null); } }}
        onSave={handleSave}
        initial={formDialog ?? EMPTY_FORM}
        isEditing={isEditing}
        loading={formLoading}
        serverError={formError}
      />
      <UserDetailsDialog
        user={detailsUser}
        onClose={() => setDetailsUser(null)}
      />
      <DeleteConfirmDialog
        user={deleteTarget}
        onClose={() => !deleteLoading && setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </Stack>
  );
}
