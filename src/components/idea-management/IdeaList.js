import React, { useEffect, useState } from "react";
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Button, Fab, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery, useTheme, Box, Snackbar, Alert } from "@mui/material";
import { Add } from "@mui/icons-material";
import api from "../../services/api";
import IdeaForm from "./IdeaForm";
import IdeaDetail from "./IdeaDetail"; // Import IdeaDetail component

const IdeaList = () => {
    const [ideas, setIdeas] = useState([]);
    // const [error, setError] = useState("");
    const [toastOpen, setToastOpen] = useState(false); // State for toast visibility
    const [toastMessage, setToastMessage] = useState(""); // State for toast message
    const [toastSeverity, setToastSeverity] = useState("error"); // State for toast severity (error, success, etc.)

    const [selectedIdea, setSelectedIdea] = useState(null); // Track selected idea
    const [openDialog, setOpenDialog] = useState(false); // Idea submission dialog

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        fetchIdeas();
    }, []);

    const fetchIdeas = async () => {
        try {
            const response = await api.get("/ideas/");
            setIdeas(response.data);
        } catch (err) {
            setToastMessage("Error fetching ideas");
            setToastOpen(true);
        }
    };

    const handleCloseToast = (event, reason) => {
        if (reason === "clickaway") {
            return; // Don't close the toast if the user clicks away
        }
        setToastOpen(false); // Close the toast
    };


    return (
        <Container>
            <br></br>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">
                    Explore Ideas
                </Typography>
                {/* Open Idea Submission Dialog */}
                {/* Show Submit Idea Button only in Web View */}
                {!isMobile && (
                    <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
                        Submit Idea
                    </Button>
                )}
            </Box>

            
            {/* {error && <Typography color="error">{error}</Typography>} */}

            {/* Show No Ideas Message */}
            {ideas.length === 0 ? (
                <Typography variant="h6" color="textSecondary" align="center">
                    No ideas available. Be the first to submit one!
                </Typography>
            ) : (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography fontWeight="bold">Title</Typography></TableCell>
                                <TableCell><Typography fontWeight="bold">Author</Typography></TableCell>
                                <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
                                <TableCell align="center"><Typography fontWeight="bold">Votes</Typography></TableCell>
                                <TableCell align="center"><Typography fontWeight="bold">Comments</Typography></TableCell>
                                <TableCell align="center"><Typography fontWeight="bold">Actions</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ideas.map((idea) => (
                                <TableRow key={idea.id} hover>
                                    <TableCell>{idea.title}</TableCell>
                                    <TableCell>{idea.author_name}</TableCell>
                                    <TableCell>{idea.status}</TableCell>
                                    <TableCell align="center">{idea.vote_count || 0}</TableCell>
                                    <TableCell align="center">{idea.comment_count || 0}</TableCell>
                                    <TableCell align="center">
                                        <Button variant="outlined" onClick={() => setSelectedIdea(idea)}>View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Floating Submit Idea Button for Mobile View */}
            {isMobile && (
                <Fab color="primary" sx={{ position: "fixed", bottom: 20, right: 20 }} onClick={() => setOpenDialog(true)}>
                    <Add />
                </Fab>
            )}

            {/* Dialog for Idea Submission */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Submit a New Idea</DialogTitle>
                <DialogContent>
                    <IdeaForm onIdeaSubmitted={(newIdea) => {
                        fetchIdeas(); // Refresh idea list
                        setOpenDialog(false);
                    }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for Viewing Idea Details */}
            {selectedIdea && (
                <IdeaDetail idea={selectedIdea} onClose={() => {setSelectedIdea(null);fetchIdeas()}} />
            )}
            <Snackbar
                open={toastOpen}
                autoHideDuration={6000} // Auto-hide after 6 seconds
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position the toast
            >
                <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: "100%" }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default IdeaList;
