import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider, { AuthContext } from "./context/AuthProvider";
import Login from "./components/user-management/Login";
import Register from "./components/user-management/Register";
import Home from "./components/Home";
import Profile from "./components/user-management/Profile";
import LandingPage from "./components/LandingPage";
import Navbar from "./components/Navbar"; // Import the responsive AppBar
import { Container } from "@mui/material";
import IdeaForm from "./components/idea-management/IdeaForm";
import IdeaList from "./components/idea-management/IdeaList";
import MyCollaborations from "./components/collaboration-management/MyCollaborations";
import AssignTeam from "./components/collaboration-management/AssignTeam";
import Collaborations from "./components/collaboration-management/Collaborations";

function App() {
    return (
        <AuthProvider>
            <Router >
                <AuthRoutes />
            </Router>
        </AuthProvider>
    );
}

function AuthRoutes() {
    const { isAuthenticated } = useContext(AuthContext);
    console.log("isAuthenticated", isAuthenticated);
    return (
        <div style={{ background: 'linear-gradient(135deg,rgb(182, 229, 185),rgb(168, 212, 242))' }}>
            {isAuthenticated && <Navbar />} {/* Show Navbar only after login */}
            <Container>
                <Routes>
                    {isAuthenticated ? (
                        <>
                            {/* Authenticated Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/submit-idea" element={<IdeaForm />} />
                            <Route path="/ideas" element={<IdeaList />} />
                            <Route path="/collaborations" element={<Collaborations />} />
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
        </div>
    );
}

export default App;
