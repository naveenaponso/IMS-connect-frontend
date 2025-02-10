import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Avatar,
    Grid,
    Card,
    CardContent,
    Alert,
    Divider,
    InputAdornment,
} from "@mui/material";
import { Edit, Save, Lock, UploadFile, Person, Email, Cake, Phone, Work, LocationOn, Flag, Public } from "@mui/icons-material";
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

                    {/* Profile Picture Section */}
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                        <Avatar
                            src={profilePic || "https://via.placeholder.com/150"}
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
                    </Box>

                    {/* Personal Information Section */}
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Personal Information
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Name"
                                name="name"
                                value={profile.name || ""}
                                onChange={handleChange}
                                disabled={!editable}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Email"
                                value={profile.email || ""}
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Birthdate"
                                name="birthdate"
                                value={profile.birthdate || ""}
                                onChange={handleChange}
                                disabled={!editable}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Cake />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Phone"
                                name="phone"
                                value={profile.phone || ""}
                                onChange={handleChange}
                                disabled={!editable}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Phone />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    {/* Employment Information Section */}
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Employment Information
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Role"
                                value={profile.role || ""}
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Work />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Hire Date"
                                value={profile.hire_date || ""}
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Work />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Branch"
                                value={profile.branch_name || ""}
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOn />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Region"
                                value={profile.region_name || ""}
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Public />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Country"
                                value={profile.country_name || ""}
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Flag />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    {/* Password Reset Section */}
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Reset Password
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <TextField
                                fullWidth
                                type="password"
                                label="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button variant="contained" color="error" startIcon={<Lock />} onClick={handlePasswordReset}>
                                Reset Password
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Edit/Save Buttons */}
                    <Box mt={4} textAlign="center">
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
                </CardContent> 
            </Card>
        </Container>
    );
};

export default Profile;