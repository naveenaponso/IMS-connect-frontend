import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, Box, Avatar, Grid, Card, CardContent, Alert } from "@mui/material";
import { Edit, Save, Lock, UploadFile } from "@mui/icons-material";
import api from "../../services/api";

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [editable, setEditable] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [profilePic, setProfilePic] = useState(null);

    useEffect(() => {
        // Fetch profile details
        const fetchProfile = async () => {
            try {
                const response = await api.get("/users/profile");
                setProfile(response.data.user);
            } catch (err) {
                setError("Failed to fetch profile");
            }
        };
        fetchProfile();
    }, []);

    const handleEditToggle = () => setEditable(!editable);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            await api.put("/users/profile", profile);
            setMessage("Profile updated successfully");
            setEditable(false);
        } catch (err) {
            setError("Failed to update profile");
        }
    };

    const handlePasswordReset = async () => {
        try {
            await api.put("/users/profile/reset-password", { newPassword });
            setMessage("Password updated successfully");
            setNewPassword("");
        } catch (err) {
            setError("Failed to reset password");
        }
    };

    const handleProfilePicUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Container maxWidth="md">
            <Card sx={{ mt: 5, p: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                        My Profile
                    </Typography>

                    {error && <Alert severity="error">{error}</Alert>}
                    {message && <Alert severity="success">{message}</Alert>}

                    <Grid container spacing={3} alignItems="center">
                        {/* Profile Picture */}
                        <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                            <Avatar
                                src={profilePic || "https://via.placeholder.com/150"} // Default image
                                sx={{ width: 120, height: 120, margin: "auto", mb: 2 }}
                            />
                            <input
                                accept="image/*"
                                type="file"
                                id="upload-button"
                                style={{ display: "none" }}
                                onChange={handleProfilePicUpload}
                            />
                            <label htmlFor="upload-button">
                                <Button variant="contained" component="span" startIcon={<UploadFile />}>
                                    Upload
                                </Button>
                            </label>
                        </Grid>

                        {/* Profile Details */}
                        <Grid item xs={12} md={8}>
                            {/* Read-Only Fields */}
                            <TextField fullWidth margin="normal" label="Email" value={profile.email || ""} InputProps={{ readOnly: true }} />
                            <TextField fullWidth margin="normal" label="Role" value={profile.role || ""} InputProps={{ readOnly: true }} />
                            <TextField fullWidth margin="normal" label="Joined On" value={profile.created_at || ""} InputProps={{ readOnly: true }} />

                            {/* Editable Fields */}
                            <TextField fullWidth margin="normal" label="Name" name="name" value={profile.name || ""} onChange={handleChange} disabled={!editable} />
                            <TextField fullWidth margin="normal" label="Location ID" name="location_id" value={profile.location_id || ""} onChange={handleChange} disabled={!editable} />
                        </Grid>
                    </Grid>

                    {/* Buttons for Editing */}
                    <Box mt={2} textAlign="center">
                        {editable ? (
                            <Button variant="contained" color="success" startIcon={<Save />} onClick={handleUpdate} sx={{ mx: 1 }}>
                                Save Changes
                            </Button>
                        ) : (
                            <Button variant="contained" color="primary" startIcon={<Edit />} onClick={handleEditToggle} sx={{ mx: 1 }}>
                                Edit Profile
                            </Button>
                        )}
                    </Box>

                    {/* Password Reset Section */}
                    <Box mt={4} textAlign="center">
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Reset Password
                        </Typography>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth type="password" label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button variant="contained" color="error" startIcon={<Lock />} onClick={handlePasswordReset}>
                                    Reset Password
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Profile;
