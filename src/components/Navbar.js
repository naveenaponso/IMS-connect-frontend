import React, { useState, useContext } from "react";
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Badge, Drawer, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Menu as MenuIcon, Notifications, Settings } from "@mui/icons-material";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // State for Mobile Menu (Drawer)
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    // State for Notifications Popup
    const [notificationAnchor, setNotificationAnchor] = useState(null);
    const openNotifications = Boolean(notificationAnchor);
    const handleNotificationClick = (event) => setNotificationAnchor(event.currentTarget);
    const handleNotificationClose = () => setNotificationAnchor(null);

    // State for Settings Dropdown
    const [settingsAnchor, setSettingsAnchor] = useState(null);
    const openSettings = Boolean(settingsAnchor);
    const handleSettingsClick = (event) => setSettingsAnchor(event.currentTarget);
    const handleSettingsClose = () => setSettingsAnchor(null);

    // Mock Notifications (Based on Case Study)
    const notifications = [
        "New idea submission from Tokyo office",
        "Your idea on Carbon Capture is under review",
        "Collaboration request from Berlin team",
        "System upgrade scheduled for next week",
    ];

    return (
        <>
            {/* Top AppBar */}
            <AppBar position="static">
                <Toolbar>
                    {/* Mobile Menu Icon */}
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle} sx={{ display: { xs: "block", md: "none" } }}>
                        <MenuIcon />
                    </IconButton>

                    {/* App Title */}
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: { xs: "center", md: "left" } }} onClick={() => navigate("/")}>
                        IMS-Connect
                    </Typography>

                    {/* Notification Icon */}
                    <IconButton color="inherit" onClick={handleNotificationClick}>
                        <Badge badgeContent={notifications.length} color="error">
                            <Notifications />
                        </Badge>
                    </IconButton>

                    {/* Settings Icon */}
                    <IconButton color="inherit" onClick={handleSettingsClick}>
                        <Settings />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer Menu */}
            <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
                <List>
                    <ListItem button onClick={() => navigate("/home")}>
                        <ListItemText primary="Home" />
                    </ListItem>
                    <ListItem button onClick={() => navigate("/profile")}>
                        <ListItemText primary="Profile" />
                    </ListItem>
                    <ListItem button onClick={logout}>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>

            {/* Notifications Popup */}
            <Menu anchorEl={notificationAnchor} open={openNotifications} onClose={handleNotificationClose}>
                {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <MenuItem key={index} onClick={handleNotificationClose}>
                            {notification}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem onClick={handleNotificationClose}>No new notifications</MenuItem>
                )}
            </Menu>

            {/* Settings Dropdown */}
            <Menu anchorEl={settingsAnchor} open={openSettings} onClose={handleSettingsClose}>
                <MenuItem onClick={() => { navigate("/profile"); handleSettingsClose(); }}>Profile</MenuItem>
                <MenuItem onClick={() => { logout(); handleSettingsClose(); }}>Logout</MenuItem>
            </Menu>
        </>
    );
};

export default Navbar;
