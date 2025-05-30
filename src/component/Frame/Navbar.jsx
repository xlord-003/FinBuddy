import React from "react";
import { AppBar, Fade, Menu, MenuItem, styled, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import logo from '../../image/logo.png';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "var(--secondary-color)",
    boxShadow: "none",
    borderBottom: "0.7px solid var(--border-color)",
});

const StyledTypography = styled(Typography)({
    variant: "h6",
    fontWeight: 700,
    color: "var(--primary-font-color)",
    fontFamily: "poppins",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    sx: {
        display: { xs: "none", sm: "block" }
    },

});

const Navbar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            console.log("User signed out successfully");
            handleClose(); // Tutup menu setelah logout
            navigate("/login"); // Arahkan ke halaman login
        } catch (error) {
            console.error("Error signing out: ", error);
            alert("Gagal logout: " + error.message);
        }
    };

    return (
        <AppBar position="relative" >
            <StyledToolbar>
                <MenuIcon />
                <StyledTypography display={"flex"} marginRight={"auto"}>
                    <img src={logo} alt="logo" width={55} height={35} />
                    FinBuddy
                </StyledTypography>
                <div>
                    <PersonIcon
                        id="fade-button"
                        aria-controls={open ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    />
                    <Menu
                        id="fade-menu"
                        MenuListProps={{
                            'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </div>
            </StyledToolbar>
        </AppBar>
    );
};

export default Navbar;
