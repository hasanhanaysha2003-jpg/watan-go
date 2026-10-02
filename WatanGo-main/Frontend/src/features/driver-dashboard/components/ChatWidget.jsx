import { useEffect, useRef, useState } from "react";
import {
  Box, Fab, IconButton, InputBase, Paper,
  Stack, Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MessageIcon from "@mui/icons-material/Message";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const SUPPORT_REPLIES = [
  "تم استلام رسالتك، سنراجع الطلب الآن.",
  "يرجى مشاركة رقم الطلب وسنساعدك مباشرة.",
  "العنوان مؤكد، يمكنك المتابعة حسب المسار الحالي.",
  "شكرا لتواصلك، فريق الدعم معك خطوة بخطوة.",
];

export function ChatWidget({ initialMessages, forceOpen, onOpenChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages ?? []);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const open = forceOpen ?? isOpen;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, open]);

  useEffect(() => {
    if (forceOpen !== undefined) setIsOpen(forceOpen);
  }, [forceOpen]);

  const setOpen = (next) => {
    setIsOpen(next);
    onOpenChange?.(next);
  };

  const sendMessage = () => {
    const value = input.trim();
    if (!value) return;

    const newMsg = { id: crypto.randomUUID(), sender: "driver", message: value, timestamp: new Date(), status: "sent" };
    setMessages((cur) => [...cur, newMsg]);
    setInput("");
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((cur) => cur.map((m) => (m.id === newMsg.id ? { ...m, status: "read" } : m)));
      setMessages((cur) => [
        ...cur,
        { id: crypto.randomUUID(), sender: "support", message: SUPPORT_REPLIES[Math.floor(Math.random() * SUPPORT_REPLIES.length)], timestamp: new Date(), status: "delivered" },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <>
      <Fab
        color={open ? "error" : "primary"}
        onClick={() => setOpen(!open)}
        aria-label="فتح محادثة الدعم"
        sx={{ position: "fixed", bottom: { xs: 20, sm: 24 }, left: { xs: 20, sm: 24 }, zIndex: 40 }}
      >
        {open ? <CloseIcon /> : <MessageIcon />}
      </Fab>

      {open && (
        <Paper
          dir="rtl"
          elevation={8}
          sx={{
            position: "fixed",
            bottom: { xs: 88, sm: 96 },
            left: { xs: 12, right: 12, sm: 24 },
            right: { xs: 12, sm: "auto" },
            width: { xs: "auto", sm: 390 },
            zIndex: 40,
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Header */}
          <Stack
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between", px: 2, py: 1.75, borderBottom: "1px solid", borderColor: "divider", bgcolor: (theme) => alpha(theme.palette.action.hover, 0.4) }}
          >
            <Box>
              <Typography fontWeight={700}>محادثة الدعم</Typography>
              <Typography variant="caption" color="info.main">الفريق يكتب عادة خلال دقيقة</Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} size="small"><CloseIcon fontSize="small" /></IconButton>
          </Stack>

          {/* Messages */}
          <Box sx={{ height: { xs: 320, sm: 380 }, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Box sx={{ borderRadius: "12px 12px 4px 12px", bgcolor: (theme) => alpha(theme.palette.action.hover, 0.5), px: 2, py: 1.25 }}>
                  <Stack direction="row" spacing={0.5}>
                    {[0, 120, 240].map((delay) => (
                      <Box key={delay} sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "text.disabled", animation: `bounce 1s ${delay}ms infinite` }} />
                    ))}
                  </Stack>
                </Box>
              </Box>
            )}
            <Box ref={bottomRef} />
          </Box>

          {/* Input */}
          <Box sx={{ p: 1.5, borderTop: "1px solid", borderColor: "divider", bgcolor: (theme) => alpha(theme.palette.background.paper, 0.8) }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <InputBase
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                placeholder="اكتب رسالتك..."
                fullWidth
                sx={(theme) => ({
                  px: 1.75, py: 0.75, borderRadius: 2.5,
                  border: "1px solid", borderColor: "divider",
                  bgcolor: alpha(theme.palette.action.hover, 0.3),
                  fontSize: 14,
                  "&.Mui-focused": { borderColor: "primary.main" },
                })}
              />
              <Fab
                color="primary"
                size="small"
                disabled={!input.trim()}
                onClick={sendMessage}
                aria-label="إرسال"
                sx={{ flexShrink: 0, width: 40, height: 40, minHeight: 40 }}
              >
                <SendIcon sx={{ fontSize: 18 }} />
              </Fab>
            </Stack>
          </Box>
        </Paper>
      )}
    </>
  );
}

function MessageBubble({ message }) {
  const isMine = message.sender === "driver";
  return (
    <Box sx={{ display: "flex", justifyContent: isMine ? "flex-start" : "flex-end" }}>
      <Box
        sx={(theme) => ({
          maxWidth: "82%",
          px: 2, py: 1,
          borderRadius: isMine ? "12px 12px 12px 4px" : "12px 12px 4px 12px",
          bgcolor: isMine ? alpha(theme.palette.action.hover, 0.5) : theme.palette.primary.main,
          color: isMine ? "text.primary" : theme.palette.primary.contrastText,
        })}
      >
        <Typography variant="body2">{message.message}</Typography>
        <Stack direction="row" spacing={0.5} mt={0.5} sx={{ alignItems: "center", justifyContent: "flex-end" }}>
          <Typography variant="caption" sx={{ opacity: 0.75, fontSize: 11 }}>
            {message.timestamp.toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" })}
          </Typography>
          {isMine && (
            message.status === "read"
              ? <DoneAllIcon sx={{ fontSize: 14, color: "#22d3ee", opacity: 0.9 }} />
              : message.status === "delivered"
                ? <DoneAllIcon sx={{ fontSize: 14, opacity: 0.75 }} />
                : <DoneIcon sx={{ fontSize: 14, opacity: 0.75 }} />
          )}
        </Stack>
      </Box>
    </Box>
  );
}
