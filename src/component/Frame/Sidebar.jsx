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
            bgcolor="var(--secondary-color)"
            borderRight={"1px solid var(--border-color)"}
            flex={1}
            p={2}
            sx={{ 
                display: { xs: "none", sm: "block" },
                height: "86vh",
                width: "230px"
            }}
        >

            <List>
                <ListItem disablePadding>
                    <ListItemButton component="a" to="/dashboard">
                        <ListItemIcon>
                            <DashboardIcon sx={{ color: "white" }}/>
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component="a" to="/add">
                        <ListItemIcon>
                            <CreateIcon sx={{ color: "white" }}/>
                        </ListItemIcon>
                        <ListItemText primary="Add" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component="a" to="/history">
                        <ListItemIcon>
                            <HistoryRoundedIcon sx={{ color: "white" }}/>
                        </ListItemIcon>
                        <ListItemText primary="History" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component="a" to="/SaveTips">
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
