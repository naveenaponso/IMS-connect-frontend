import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import landingImage from "../assets/landing-image.webp"; // Add an image in the assets folder

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width:'100%',
                minHeight: "90vh",
                textAlign: "center",
                background: `url(${landingImage}) center/cover no-repeat`,
                color: "#fff",
                p: 4,
            }}
        >
            <Container maxWidth="md" sx={{ bgcolor: "rgba(0,0,0,0.7)", p: 4, borderRadius: 3 }}>
                <Typography variant="h1" fontWeight="bold" gutterBottom>
                   IMS - Connect
                </Typography>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Welcome to GreenFuture's Innovation Hub
                </Typography>
                <Typography variant="h6" paragraph>
                    Unlock the power of collaboration! Join our community to share and develop innovative ideas that drive sustainability forward.
                </Typography>

                <Box mt={3}>
                    <Button
                        variant="contained"
                        // color="primary"
                        size="large"
                        sx={{ m: 1, px: 4, py: 1 , backgroundColor: "darkblue"}}
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="large"
                        sx={{ m: 1, px: 4, py: 1, borderColor: "white", color: "white" }}
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default LandingPage;
