import React, { useState, useContext } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Badge,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Typography,
    ListItemIcon,
} from "@mui/material";
import { Circle, Menu as MenuIcon, Notifications, ArrowBack } from "@mui/icons-material"; // Import ArrowBack icon
import { AuthContext } from "../context/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { AccountCircle, LogoutRounded } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation(); // Get current location

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

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token); // Decode token to get user data
    console.log("decoded", decoded);
    const email = decoded.email;
    // Mock Notifications
    const notifications_list = [
        {
            id: 1,
            message: "New idea submission from Tokyo office",
            is_read: false,
            created_at: "2023-10-01 10:00 AM",
        },
        {
            id: 2,
            message: "Your idea on Carbon Capture is under review",
            is_read: false,
            created_at: "2023-10-02 11:30 AM",
        },
        {
            id: 3,
            message: "Collaboration request from Berlin team",
            is_read: false,
            created_at: "2023-10-03 09:15 AM",
        },
        {
            id: 4,
            message: "System upgrade scheduled for next week",
            is_read: true,
            created_at: "2023-10-04 03:45 PM",
        },
    ];

    // Count Unread Notifications
    const unreadCount = notifications_list.filter((notification) => !notification.is_read).length;

    return (
        <>
            {/* Top AppBar */}
            <AppBar position="fixed" sx={{ backgroundColor: "rgb(55, 17, 85)" }}>
                <Toolbar>
                    {/* Back Button (Visible only when not on the home page) */}
                    {location.pathname !== "/" && (
                        <IconButton edge="start" color="inherit" onClick={() => navigate("/")} sx={{ mr: 2 }}>
                            <ArrowBack /> {/* Back icon */}
                        </IconButton>
                    )}

                    {/* Mobile Menu Icon */}
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle} sx={{ display: { xs: "block", md: "none" } }}>
                        <MenuIcon />
                    </IconButton>

                    {/* App Title - Clickable */}
                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1, textAlign: { xs: "center", md: "left" }, cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        IMS-Connect
                    </Typography>

                    {/* Notification Icon */}
                    <IconButton color="inherit" onClick={handleNotificationClick}>
                        <Badge badgeContent={unreadCount} color="error">
                            <Notifications />
                        </Badge>
                    </IconButton>
                    <Typography
                        variant="h6"
                    >
                        {email}
                    </Typography>
                    {/* Profile Icon */}
                    <IconButton color="inherit" onClick={handleSettingsClick}>



                        <AccountCircle />
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
                        <AccountCircle /> <ListItemText primary="Profile" />
                    </ListItem>
                    <ListItem button onClick={logout}>
                        <LogoutRounded /> <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>

            {/* Notifications Popup */}
            <Menu anchorEl={notificationAnchor} open={openNotifications} onClose={handleNotificationClose}>
                {notifications_list.length > 0 ? (
                    notifications_list.map((notification) => (
                        <ListItem key={notification.id} sx={{ bgcolor: notification.is_read ? "background.paper" : "action.hover" }}>
                            {/* Unread Indicator */}
                            {!notification.is_read && (
                                <ListItemIcon sx={{ minWidth: 30 }}>
                                    <Circle sx={{ fontSize: 10, color: "primary.main" }} />
                                </ListItemIcon>
                            )}

                            {/* Notification Content */}
                            <ListItemText
                                primary={notification.message}
                                secondary={notification.created_at}
                                primaryTypographyProps={{
                                    fontWeight: notification.is_read ? "normal" : "bold",
                                }}
                                secondaryTypographyProps={{
                                    color: "textSecondary",
                                    fontSize: 12,
                                }}
                            />
                        </ListItem>
                    ))
                ) : (
                    <MenuItem onClick={handleNotificationClose}>No new notifications</MenuItem>
                )}
            </Menu>

            {/* Settings Dropdown */}
            <Menu anchorEl={settingsAnchor} open={openSettings} onClose={handleSettingsClose}>
                <MenuItem onClick={() => { navigate("/profile"); handleSettingsClose(); }}><AccountCircle /> Profile</MenuItem>
                <MenuItem onClick={() => { logout(); handleSettingsClose(); }}> <LogoutRounded /> Logout</MenuItem>
            </Menu>
            <br></br>
            <br></br>
            <br></br>
        </>
    );
};

export default Navbar;