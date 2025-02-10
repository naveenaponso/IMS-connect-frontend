import React, { useState } from "react";
import { TextField, Button, Typography, Alert, Card, CardContent, Box, Link, Snackbar } from "@mui/material";
import { Person, Email, Lock } from "@mui/icons-material";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import landingImage from "../../assets/landing-image.webp"; // Add an image in the assets folder

const Register = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [retypedPassword, setRetypedPassword] = useState("");
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // State for success message
    const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar visibility
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate if passwords match
        if (formData.password !== retypedPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        try {
            await api.post("/users/register", formData);
            setSuccessMessage("Registration successful! Redirecting to login...");
            setSnackbarOpen(true);

            // Wait for 2 seconds before redirecting to login
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: `url(${landingImage}) center/cover no-repeat` }}>
            <Card sx={{ maxWidth: 400, p: 3 }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>IMS - Connect Register</Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    {passwordError && <Alert severity="error">{passwordError}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <TextField fullWidth margin="normal" label="Name" name="name" InputProps={{ startAdornment: <Person /> }} onChange={handleChange} required />
                        <TextField fullWidth margin="normal" label="Email" name="email" type="email" InputProps={{ startAdornment: <Email /> }} onChange={handleChange} required />
                        <TextField fullWidth margin="normal" label="Password" name="password" type="password" InputProps={{ startAdornment: <Lock /> }} onChange={handleChange} required />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Re-type Password"
                            name="retypedPassword"
                            type="password"
                            InputProps={{ startAdornment: <Lock /> }}
                            onChange={(e) => setRetypedPassword(e.target.value)}
                            required
                        />
                        <Button variant="contained" sx={{ backgroundColor: "darkblue", mt: 2 }} type="submit" fullWidth>Register</Button>
                    </form>

                    <Typography align="center" sx={{ mt: 2 }}>
                        Already have an account?{" "}
                        <Link href="/login" underline="hover" sx={{ cursor: "pointer", color: "darkblue" }}>
                            Login
                        </Link>
                    </Typography>
                </CardContent>
            </Card>

            {/* Success Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000} // 2 seconds before closing
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Register;
