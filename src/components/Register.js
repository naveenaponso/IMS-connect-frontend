import React, { useState } from "react";
import { TextField, Button, Container, Typography, Alert, Card, CardContent, Box } from "@mui/material";
import { Person, Email, Lock, LocationOn } from "@mui/icons-material";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", location_id: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/register", formData);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f0f2f5" }}>
            <Card sx={{ maxWidth: 400, p: 3 }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>Register</Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <TextField fullWidth margin="normal" label="Name" name="name" InputProps={{ startAdornment: <Person /> }} onChange={handleChange} required />
                        <TextField fullWidth margin="normal" label="Email" name="email" type="email" InputProps={{ startAdornment: <Email /> }} onChange={handleChange} required />
                        <TextField fullWidth margin="normal" label="Password" name="password" type="password" InputProps={{ startAdornment: <Lock /> }} onChange={handleChange} required />
                        <TextField fullWidth margin="normal" label="Location ID" name="location_id" InputProps={{ startAdornment: <LocationOn /> }} onChange={handleChange} required />
                        <Button variant="contained" color="primary" type="submit" fullWidth>Register</Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Register;
