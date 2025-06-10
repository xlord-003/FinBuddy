import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Sparkles, PiggyBank, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../../image/logo.png";
import Chatbot from "../Dashboard/Chatbot";

// Definisikan tema di luar komponen
const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif", // Mengatur font utama menjadi Poppins
  },
  palette: {
    mode: "dark",
    background: {
      default: "#0d1117", //warna dasar gelap
    },
    primary: {
      main: "#3b82f6",
    },
    secondary: {
      main: "#1e40af",
    },
    info: {
      main: "#2563EB",
    },
    customGradient: {
      start: "#111827",
      end: "#0d1117",
    },
  },
});

const PageLayout = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    if (drawerOpen) {
      setDrawerOpen(false);
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <Box
      sx={{ width: 250, bgcolor: "background.default", height: "100%" }}
      onClick={handleDrawerToggle}
    >
      <List>
        {[
          { text: "Home", id: "home" },
          { text: "Manfaat", id: "manfaat" },
          { text: "Fitur", id: "fitur" },
        ].map(({ text, id }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => scrollToSection(id)}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/login")}
            sx={{
              backgroundColor: "#1f2937", // Warna tombol Sign In
              margin: "8px 16px",
              borderRadius: "8px",
            }}
          >
            <ListItemText primary="SIGN IN" sx={{ textAlign: "center" }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/register")}
            sx={{
              backgroundColor: "primary.main", // Warna tombol Sign Up
              margin: "8px 16px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            <ListItemText primary="SIGN UP" sx={{ textAlign: "center" }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      sx={{ bgcolor: "background.default", color: "white", minHeight: "100vh" }}
    >
      <AppBar position="sticky" elevation={1} sx={{ bgcolor: "#111827" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            fontSize={isMobile ? "1rem" : "1.5rem"}
            fontWeight={800}
          >
            FinBuddy
          </Typography>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 3, marginLeft: "4rem" }}>
              <Button color="inherit" onClick={() => scrollToSection("home")}>
                Home
              </Button>
              <Button
                color="inherit"
                onClick={() => scrollToSection("manfaat")}
              >
                About
              </Button>
              <Button color="inherit" onClick={() => scrollToSection("fitur")}>
                Feature
              </Button>
            </Box>
          )}

          {isMobile ? (
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate("/login")}
                sx={{ bgcolor: "#374151", "&:hover": { bgcolor: "#4b5563" } }}
              >
                SIGN IN
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/register")}
              >
                SIGN UP
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>

      <Box
        id="home"
        sx={{
          background: `linear-gradient(180deg, ${theme.palette.customGradient.start} 0%, ${theme.palette.customGradient.end} 100%)`,
          display: "flex",
          alignItems: "center",
          py: { xs: 8, md: 10 }, // Memberi padding vertikal
        }}
      >
        <Container sx={{ textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Typography
              variant={isMobile ? "h3" : "h2"}
              fontWeight="bold"
              sx={{
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Smart Financial Management
            </Typography>

            <Typography
              sx={{ mt: 3, mb: 4, maxWidth: 600, mx: "auto" }}
              color="text.secondary"
            >
              Track expenses and set savings goals. Powered by AI for
              personalized financial recommendations.
            </Typography>

            <Button
              variant="contained"
              onClick={() => navigate("/register")}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "50px",
                color: "white",
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: `0 0 15px ${theme.palette.primary.main}60`,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: "bold",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: `0 0 25px ${theme.palette.primary.main}90`,
                },
              }}
            >
              Start Your Journey
            </Button>

            <Box
              mt={8}
              sx={{
                maxWidth: "1200px",
                mx: "auto",
                p: isMobile ? 20 : 22,
                borderRadius: "16px",
                background: `linear-gradient(to bottom, #1B1F9A, #090A34)`,
                backdropFilter: "blur(5px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37)`,
              }}
            >
              <img
                src={logo}
                alt="FinBuddy"
                style={{ width: isMobile ? 170 : 300, height: "auto" }}
                sx={{
                  width: isMobile ? 80 : 120,
                  height: "auto",
                  margin: "0 auto",
                }}
              />
              <Typography
                variant={isMobile ? "h4" : "h2"}
                fontWeight="bold"
                sx={{ mt: 2 }}
              >
                FinBuddy
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* === PERUBAHAN DI SINI: Menggunakan padding untuk memberi jarak === */}
      <Box
        id="manfaat"
        sx={{
          py: { xs: 10, md: 15 }, // Padding vertikal yang besar
          bgcolor: "background.default",
        }}
        justifyContent="start"
        display="flex"
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              bgcolor: "#1f2937",
              p: { xs: 3, sm: 10 },
              borderRadius: "16px",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ textAlign: "center", mb: 4 }}
            >
              What is FinBuddy?
            </Typography>
            <Typography
              sx={{
                maxWidth: 800,
                mx: "auto",
                fontSize: "1.1rem",
                textAlign: "justify",
                mb: 2,
              }}
              color="text.secondary"
            >
              FinBuddy is a personal finance management application that helps
              you record income and expenses easily and efficiently.
            </Typography>
            <Typography
              sx={{
                maxWidth: 800,
                mx: "auto",
                fontSize: "1.1rem",
                textAlign: "justify",
              }}
              color="text.secondary"
            >
              With a monthly income monitoring feature and weekly expenses.
              FinBuddy also provides savings recommendations that are tailored
              to your spending habits and financial goals. We are here to help
              you manage your finances more wisely and achieve financial targets
              more focused.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container id="fitur" sx={{ py: 15 }}>
        <Typography
          variant="h5"
          textAlign="center"
          fontWeight="bold"
          marginBottom={3}
        >
          Powerful Features for Your Financial Success
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              icon: <Sparkles />,
              title: "Income Recording & Expenses",
              desc: "Record your income in one month and expenses per week",
            },
            {
              icon: <PiggyBank />,
              title: "Savings Tips",
              desc: "Recommend choices for your savings options",
            },
            {
              icon: <BrainCircuit />,
              title: "Quick Financial Summary",
              desc: "Instant summary that lets you understand your financial health in seconds without having to open complicated",
            },
          ].map((feature, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card
                sx={{
                  bgcolor: "#111827",
                  color: "white",
                  height: "100%",
                  width: "500px",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Box sx={{ mb: 2, color: "primary.main" }}>
                    {React.cloneElement(feature.icon, { size: 40 })}
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    sx={{ mt: 1 }}
                  >
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: "#1f2937", py: 10, px: { xs: 2, sm: 4 } }}>
        <Typography
          variant="h5"
          textAlign="center"
          fontWeight="bold"
          marginBottom={3}
        >
          ----------
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              name: "---",
              title: "---",
              text: "---",
            },
            {
              name: "---",
              title: "---",
              text: "---",
            },
          ].map((testimonial, i) => (
            <Grid item xs={12} md={5} key={i}>
              <Card
                sx={{
                  bgcolor: "#3B4B67",
                  color: "white",
                  height: "100%",
                  width: "500px",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {testimonial.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {testimonial.title}
                  </Typography>
                  <Typography sx={{ mt: 1 }} color="text.secondary">
                    {testimonial.text}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Chatbot />

      <Box
        component="footer" // Mengubah Box menjadi elemen <footer> secara semantik
        sx={{
          textAlign: "center",
          py: 4,
          px: 2,
          mt: "auto", // Mendorong footer ke bagian bawah jika konten tidak penuh
          borderTop: 1,
          borderColor: "grey.800",
          bgcolor: "#0d1117", // Sedikit beda warna untuk memisahkan
        }}
      >
        <Typography variant="h6" gutterBottom>
          FinBuddy
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Smart financial management for everyone.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {"Copyright © "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Box>
    </Box>
    
  );
};

const Homepage = () => {
  return (
    <ThemeProvider theme={theme}>
      <PageLayout />
    </ThemeProvider>
  );
};

export default Homepage;