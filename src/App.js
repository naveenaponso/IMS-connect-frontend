import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider, { AuthContext } from "./context/AuthProvider";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import LandingPage from "./components/LandingPage";
import Navbar from "./components/Navbar"; // Import the responsive AppBar
import { Container } from "@mui/material";

function App() {
    return (
        <AuthProvider>
            <Router>
                <AuthRoutes />
            </Router>
        </AuthProvider>
    );
}

function AuthRoutes() {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <>
            {isAuthenticated && <Navbar />} {/* Show Navbar only after login */}
            <Container>
                <Routes>
                    {isAuthenticated ? (
                        <>
                            {/* Authenticated Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/profile" element={<Profile />} />
                            {/* Redirect unknown paths to home */}
                            <Route path="*" element={<Home />} />
                        </>
                    ) : (
                        <>
                            {/* Unauthenticated Routes */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            {/* Redirect unknown paths to landing page */}
                            <Route path="*" element={<LandingPage />} />
                        </>
                    )}
                </Routes>
            </Container>
        </>
    );
}

export default App;
