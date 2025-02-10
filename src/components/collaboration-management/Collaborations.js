import React, { useEffect, useState } from "react";
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Button,
    Box,
    Fab,
    useMediaQuery,
    useTheme,
    Snackbar,
    Alert,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import api from "../../services/api";
import AssignTeam from "./AssignTeam";
import { jwtDecode } from "jwt-decode";
import CollaborationDetails from "./CollaborationDetails";

const Collaborations = () => {
    const [ideas, setIdeas] = useState([]);
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastSeverity] = useState("error");

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [token] = useState(localStorage.getItem("token"));
    const decoded = jwtDecode(token);
    const user = { id: decoded.id, role: decoded.role };
    const isManager = user?.role === "manager";

    useEffect(() => {
        fetchApprovedIdeas();
    }, []);

    const fetchApprovedIdeas = async () => {
        try {
            const response = await api.get("/collaborations/approved");
            setIdeas(response.data);
        } catch (err) {
            setToastMessage("Error fetching approved ideas");
            setToastOpen(true);
        }
    };

    const handleViewCollaborations = async (idea) => {
        try {
            const response = await api.get(`/collaborations/idea/${idea.id}`);
            setSelectedIdea({ ...idea, collaborators: response.data });
            setOpenDetailDialog(true);
        } catch (err) {
            setToastMessage("Error fetching collaboration deta  ils");
            setToastOpen(true);
        }
    };

    const handleCloseToast = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setToastOpen(false);
    };

    return (
        <Container>
            <br />
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">
                    Explore Collaborations
                </Typography>
            </Box>

            {ideas.length === 0 ? (
                <Typography variant="h6" color="textSecondary" align="center">
                    No collaborations available.
                </Typography>
            ) : (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography fontWeight="bold">Title</Typography></TableCell>
                                <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
                                <TableCell align="center"><Typography fontWeight="bold">Active Collaborators</Typography></TableCell>
                                <TableCell align="center"><Typography fontWeight="bold">Actions</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ideas.map((idea) => (
                                <TableRow key={idea.id} hover>
                                    <TableCell>{idea.title}</TableCell>
                                    <TableCell>{idea.status}</TableCell>
                                    <TableCell align="center">{idea.active_collaborators}</TableCell>
                                    <TableCell align="center">
                                        <Button variant="outlined" color="success" onClick={() => handleViewCollaborations(idea)} sx={{ mr: 1 }}>
                                            View
                                        </Button>
                                        {isManager && (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => {
                                                    setSelectedIdea(idea);
                                                    setOpenAssignDialog(true);
                                                }}
                                            >
                                                Assign Team
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Floating Assign Team Button for Mobile View */}
            {isMobile && isManager && (
                <Fab color="primary" sx={{ position: "fixed", bottom: 20, right: 20 }} onClick={() => setOpenAssignDialog(true)}>
                    <Add />
                </Fab>
            )}

            {/* Collaboration Details Dialog */}
            <CollaborationDetails
                open={openDetailDialog}
                onClose={() => setOpenDetailDialog(false)}
                selectedIdea={selectedIdea}
                isManager={isManager}
            />

            {/* Assign Team Dialog */}
            {selectedIdea && (
                <AssignTeam
                    ideaId={selectedIdea.id}
                    open={openAssignDialog}
                    onClose={() => setOpenAssignDialog(false)}
                    users={[]} // Fetch users dynamically
                />
            )}

            {/* Toast for Error Messages */}
            <Snackbar
                open={toastOpen}
                autoHideDuration={6000}
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: "100%" }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Collaborations;