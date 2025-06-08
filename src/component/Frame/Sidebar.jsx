import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
    Box, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText,
    Drawer,
    useTheme,
    useMediaQuery
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import CreateIcon from '@mui/icons-material/Create';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import SavingsIcon from '@mui/icons-material/Savings';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const menuItems = [
        { path: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
        { path: "/income", label: "Income", icon: <AttachMoneyIcon /> },
        { path: "/expenses", label: "Expenses", icon: <CreateIcon /> },
        { path: "/history", label: "History", icon: <HistoryRoundedIcon /> },
        { path: "/savetips", label: "Save Tips", icon: <SavingsIcon /> },
    ];

    const sidebarContent = (
        <Box
            sx={{ 
                width: 250,
                height: "100%",
                bgcolor: "var(--secondary-color)",
                borderRight: "1px solid var(--border-color)",
                pt: 2
            }}
        >
            <List>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.path} disablePadding>
                            <ListItemButton 
                                component={Link} 
                                to={item.path}
                                onClick={isMobile ? onClose : undefined}
                                sx={{
                                    mx: 1,
                                    borderRadius: 1,
                                    backgroundColor: isActive ? "rgba(255, 255, 255, 0.1)" : "transparent",
                                    color: "white",
                                    '&:hover': {
                                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ 
                                    color: isActive ? "white" : "white",
                                    minWidth: 40
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 400
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );

    if (isMobile) {
        return (
            <Drawer
                anchor="left"
                open={isOpen}
                onClose={onClose}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
            >
                {sidebarContent}
            </Drawer>
        );
    }

    return (
        <Box
            sx={{
                width: isOpen ? 250 : 0,
                transition: "width 0.3s ease-in-out",
                overflow: "hidden",
                position: "sticky",
                top: 0,
                height: "calc(100vh - 64px)",
                display: { xs: "none", md: "block" }
            }}
        >
            {isOpen && sidebarContent}
        </Box>
    );
};

export default Sidebar;