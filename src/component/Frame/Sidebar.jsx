import React from "react";
import { Link } from "react-router-dom";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import CreateIcon from '@mui/icons-material/Create';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import SavingsIcon from '@mui/icons-material/Savings';

const Sidebar = () => {

    return (
        <Box
            position="sticky"
            bgcolor="var(--secondary-color)"
            borderRight={"1px solid var(--border-color)"}
            flex={1}
            p={2}
            sx={{ 
                display: { xs: "none", sm: "block" },
                height: "86.5vh",
                width: "230px"
            }}
        >

            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/dashboard">
                        <ListItemIcon>
                            <DashboardIcon sx={{ color: "white" }}/>
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/income">
                        <ListItemIcon>
                            <CreateIcon sx={{ color: "white" }}/>
                        </ListItemIcon>
                        <ListItemText primary="Income" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/expenses">
                        <ListItemIcon>
                            <CreateIcon sx={{ color: "white" }}/>
                        </ListItemIcon>
                        <ListItemText primary="Expenses" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/history">
                        <ListItemIcon>
                            <HistoryRoundedIcon sx={{ color: "white" }}/>
                        </ListItemIcon>
                        <ListItemText primary="History" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/savetips">
                        <ListItemIcon>
                            <SavingsIcon sx={{ color: "white" }}/>
                        </ListItemIcon>
                        <ListItemText primary="Save Tips" />
                    </ListItemButton>
                </ListItem>
            </List>

        </Box >
    );
};

export default Sidebar;
