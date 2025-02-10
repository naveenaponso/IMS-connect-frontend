import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";
import { ThumbUp } from "@mui/icons-material";
import api from "../../services/api";
import CommentSection from "./CommentSection";
import { jwtDecode } from "jwt-decode";

const IdeaDetail = ({ idea, onClose }) => {
    const [token] = useState(localStorage.getItem("token"));
    const decoded = jwtDecode(token);
    const user={id: decoded.id, role: decoded.role};
    // console.log('user', user) // Get     user info from context
    const isManager = user?.role === "manager"; // Check if user is a manager

    const [voteCount, setVoteCount] = useState(idea.vote_count || 0);
    const [status, setStatus] = useState(idea.status); // Track idea status
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastSeverity, setToastSeverity] = useState("error");

    const handleUpvote = async () => {
        try {
            await api.post(`/ideas/${idea.id}/upvote`);
            setVoteCount(voteCount + 1);
        } catch (err) {
            setToastMessage(err.response?.data?.message || "Error upvoting idea");
            setToastSeverity("error");
            setToastOpen(true);
        }
    };

    const handleApprove = async () => {
        try {
            await api.put(`/ideas/${idea.id}/status`,{ status: "approved" }); // Call backend API
            setStatus("approved"); // Update local state
            setToastMessage("Idea approved successfully!");
            setToastSeverity("success");
            setToastOpen(true);
        } catch (err) {
            setToastMessage(err.response?.data?.message || "Error approving idea");
            setToastSeverity("error");
            setToastOpen(true);
        }
    };

    const handleCloseToast = (event, reason) => {
        if (reason === "clickaway") return;
        setToastOpen(false);
    };

    return (
        <>
            <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
                <DialogTitle>{idea.title}</DialogTitle>
                <DialogContent>
                    <Typography variant="subtitle1" color="textSecondary">
                        By {idea.author_name} | Category: {idea.category} | Submitted On: {idea.created_at}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {idea.description}
                    </Typography>
                    <Typography variant="h6" color="secondary" sx={{ mt: 2 }}>
                        Status: {status}
                    </Typography>
                    <Typography sx={{ mt: 1 }}>Votes: {voteCount}</Typography>

                    <Button variant="contained" startIcon={<ThumbUp />} onClick={handleUpvote} sx={{ mt: 2, mr: 1 }}>
                        Upvote
                    </Button>

                    {/* Approve Button (Only for Managers) */}
                    {isManager && status !== "approved" && (
                        <Button variant="contained" color="error" onClick={handleApprove} sx={{ mt: 2 }}>
                            Approve
                        </Button>
                    )}

                    {/* Comments Section */}
                    <CommentSection ideaId={idea.id} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Toast Notification */}
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
        </>
    );
};

export default IdeaDetail;
