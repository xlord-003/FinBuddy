import React from "react";
import { AppBar, styled, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import logo from '../../image/logo.png';

const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "var(--secondary-color)",
    boxShadow: "none", // hapus bayangan/shadow
    borderBottom: "0.7px solid var(--border-color)", // tambahkan border
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
        display : { xs: "none", sm: "block" }
    },
    
});

const Navbar = () => {
    return (
        <AppBar position="stcky">
            <StyledToolbar>
                <MenuIcon />
                <StyledTypography display={"flex"} marginRight={"auto"}>
                    <img src={logo} alt="logo" width={55} height={35}/>
                    FinBuddy
                </StyledTypography>
                <PersonIcon />
            </StyledToolbar>
        </AppBar>
    );
};

export default Navbar;
