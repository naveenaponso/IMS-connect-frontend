import React, { useState, useContext } from "react";
import { TextField, Button, Typography, Alert, Card, CardContent, Box, Link } from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import landingImage from "../../assets/landing-image.webp"; // Add an image in the assets folder

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/users/login", credentials);
            login(response.data.token);
            navigate("/home");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <>

            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: `url(${landingImage}) center/cover no-repeat` }}>

                <Card sx={{ maxWidth: 400, p: 3 }}>
                    <CardContent>
                        <Typography variant="h4" align="center" gutterBottom>IMS - Connect Login</Typography>
                        {/* <Typography variant="h4" align="center" gutterBottom>Login</Typography> */}
                        {error && <Alert severity="error">{error}</Alert>}
                        <form onSubmit={handleSubmit}>
                            <TextField fullWidth margin="normal" label="Email" name="email" type="email" InputProps={{ startAdornment: <Email /> }} onChange={handleChange} required />
                            <TextField fullWidth margin="normal" label="Password" name="password" type="password" InputProps={{ startAdornment: <Lock /> }} onChange={handleChange} required />
                            <Button variant="contained" sx={{ backgroundColor: "darkblue" }} type="submit" fullWidth>Login</Button>
                        </form>
                        <Typography align="center" sx={{ mt: 2 }}>
                            Don't have an account?{" "}
                            <Link href="/register" underline="hover" sx={{ cursor: "pointer", color: "darkblue" }}>
                                Register
                            </Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </>

    );
};

export default Login;
