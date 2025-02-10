import React from "react";
import { Container, Typography, Grid, Card, CardContent, Button, Box } from "@mui/material";
import { Lightbulb, People, EmojiEvents, TrackChanges } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{  minHeight: "90vh", py: 5 }}>
            <Container>
                {/* Header Section */}
                <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
                    Welcome to GreenFuture's Innovation Hub
                </Typography>
                <Typography variant="h6" align="center" color="textSecondary" paragraph>
                    Empowering sustainable innovation through collaboration and technology.
                </Typography>

                {/* Features Section */}
                <Grid container spacing={4} mt={3}>
                    {/* Idea Submission */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, boxShadow: 3, bgcolor: "#ffffff" }}>
                            <CardContent>
                                <Lightbulb sx={{ fontSize: 50, color: "#1976d2" }} />
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    Explore Innovative Ideas
                                </Typography>
                                <Typography color="textSecondary">
                                    Share groundbreaking solutions for sustainability and renewable energy.
                                </Typography>
                                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate("/ideas")}>
                                    Explore Ideas
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Collaboration */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, boxShadow: 3, bgcolor: "#ffffff" }}>
                            <CardContent>
                                <People sx={{ fontSize: 50, color: "#28a745" }} />
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    Collaborate with Teams
                                </Typography>
                                <Typography color="textSecondary">
                                    Connect with professionals from different regions to develop ideas.
                                </Typography>
                                <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={() => navigate("/collaborations")}>
                                    Explore Collaborations
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Incentives */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, boxShadow: 3, bgcolor: "#ffffff" }}>
                            <CardContent>
                                <EmojiEvents sx={{ fontSize: 50, color: "#ff9800" }} />
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    Earn Rewards for Contributions
                                </Typography>
                                <Typography color="textSecondary">
                                    Gain points and recognition for submitting valuable ideas.
                                </Typography>
                                <Button variant="contained" color="warning" sx={{ mt: 2 }} onClick={() => navigate("/incentives")}>
                                    View Incentives
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Idea Tracking */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, boxShadow: 3, bgcolor: "#ffffff" }}>
                            <CardContent>
                                <TrackChanges sx={{ fontSize: 50, color: "#d32f2f" }} />
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    Track Your Ideas
                                </Typography>
                                <Typography color="textSecondary">
                                    Monitor the progress and impact of your submitted ideas.
                                </Typography>
                                <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={() => navigate("/track-ideas")}>
                                    Track Ideas
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;
