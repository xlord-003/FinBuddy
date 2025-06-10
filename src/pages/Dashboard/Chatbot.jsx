import React, { useState } from "react";
import {
  Box,
  Paper,
  IconButton,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Avatar,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person"; // Ikon untuk user
import SmartToyIcon from "@mui/icons-material/SmartToy"; // Ikon untuk chatbot

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setIsLoading(true);

      try {
        const response = await fetch("http://localhost:5000/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }),
        });

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setMessages((prev) => [
          ...prev,
          { text: data.response, sender: "bot" },
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { text: `Error: ${error.message}`, sender: "bot" },
        ]);
      }

      setInput("");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1300,
      }}
    >
      {!isOpen && (
        <IconButton
          onClick={toggleChatbot}
          sx={{
            bgcolor: "var(--secondary-color, #1a1a1a)",
            color: "white",
            "&:hover": { bgcolor: "#333" },
            width: 64,
            height: 64,
          }}
          aria-label="Open chatbot"
        >
          <ChatIcon sx={{ fontSize: 32 }} />
        </IconButton>
      )}

      {isOpen && (
        <Paper
          elevation={4}
          sx={{
            width: { xs: 360, sm: 450, md: 500 },
            height: 600,
            display: "flex",
            flexDirection: "column",
            bgcolor: "var(--secondary-color, #1a1a1a)",
            color: "white",
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: "1px solid var(--border-color, #333)",
            }}
          >
            <Typography variant="h5">Chatbot</Typography>
            <IconButton
              onClick={toggleChatbot}
              sx={{ color: "white", fontSize: 28 }}
              aria-label="Close chatbot"
            >
              <CloseIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {messages.length === 0 && (
              <Typography
                sx={{ textAlign: "center", color: "gray", fontSize: "1.1rem" }}
              >
                Mulai percakapan!
              </Typography>
            )}
            <List>
              {messages.map((message, index) => (
                <ListItem
                  key={index}
                  sx={{
                    justifyContent:
                      message.sender === "user" ? "flex-end" : "flex-start",
                    mb: 1,
                    flexDirection:
                      message.sender === "user" ? "row-reverse" : "row", // Balik urutan untuk user
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor:
                        message.sender === "user" ? "#1976d2" : "#444",
                      mr: message.sender === "user" ? 0 : 1, // Margin sesuai sender
                      ml: message.sender === "user" ? 1 : 0,
                    }}
                  >
                    {message.sender === "user" ? (
                      <PersonIcon sx={{ fontSize: 24 }} />
                    ) : (
                      <SmartToyIcon sx={{ fontSize: 24 }} />
                    )}
                  </Avatar>
                  <ListItemText
                    primary={message.text}
                    sx={{
                      bgcolor:
                        message.sender === "user" ? "#1976d2" : "#444",
                      borderRadius: 3,
                      p: 2,
                      maxWidth: "80%",
                      color: "white",
                      fontSize: "1.1rem",
                    }}
                  />
                </ListItem>
              ))}
              {isLoading && (
                <ListItem sx={{ justifyContent: "center" }}>
                  <CircularProgress size={32} sx={{ color: "white" }} />
                </ListItem>
              )}
            </List>
          </Box>

          <Box sx={{ p: 3, borderTop: "1px solid var(--border-color, #333)" }}>
            <TextField
              fullWidth
              size="medium"
              placeholder="Ketik pesan..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              sx={{
                "& .MuiInputBase-input": { color: "white", fontSize: "1.1rem" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "gray" },
                  "&:hover fieldset": { borderColor: "white" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={isLoading}
              sx={{
                mt: 2,
                width: "100%",
                padding: "12px",
                fontSize: "1.1rem",
              }}
            >
              {isLoading ? "Mengirim..." : "Kirim"}
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Chatbot;