import React, { useEffect, useState, useCallback } from "react";
import { Box, TextField, Button, Typography, List, ListItem, ListItemText } from "@mui/material";
import api from "../../services/api";

const CommentSection = ({ ideaId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const fetchComments = useCallback(async () => {
        try {
            const response = await api.get(`/ideas/${ideaId}/comments/`);
            setComments(response.data);
        } catch {
            // alert("Error fetching comments");
        }
    }, [ideaId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            await api.post("/ideas/comments", { ideaId, comment: newComment });
            fetchComments(); // Refresh comments
            setNewComment(""); // Clear input
        } catch {
            // alert("Error adding comment");
        }
    };

    return (
        <Box sx={{ mt: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
            <Typography variant="h6">Comments</Typography>

            <List>
                {comments.length === 0 ? (
                    <Typography color="textSecondary">No comments yet.</Typography>
                ) : (
                    comments.map((comment) => (
                        <ListItem key={comment.id} sx={{ borderBottom: "1px solid #eee" }}>
                            <ListItemText primary={comment.comment} secondary={`By ${comment.user_name} on ${comment.created_at}`} />
                        </ListItem>
                    ))
                )}
            </List>

            <TextField fullWidth label="Add a comment" value={newComment} onChange={(e) => setNewComment(e.target.value)} sx={{ mt: 1 }} />
            <Button variant="contained" onClick={handleAddComment} sx={{ mt: 1 }}>Post</Button>
        </Box>
    );
};

export default CommentSection;