import React, { useState } from "react";
import { TextField, Button, Container, Typography, Alert, MenuItem } from "@mui/material";
import api from "../../services/api";

const categories = ["Renewable Energy", "Urban Development", "Sustainability", "Water Conservation", "Others"];

const IdeaForm = ({ onIdeaSubmitted }) => {
    const [idea, setIdea] = useState({ title: "", description: "", category: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => setIdea({ ...idea, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/ideas/", idea);
            setMessage("Idea submitted successfully!");
            onIdeaSubmitted(response.data.idea); // Refresh idea list
            setIdea({ title: "", description: "", category: "" }); // Clear form
        } catch (err) {
            setError("Error submitting idea");
        }
    };

    return (
        <Container maxWidth="sm">
            {error && <Alert severity="error">{error}</Alert>}
            {message && <Alert severity="success">{message}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField fullWidth margin="normal" label="Title" name="title" value={idea.title} onChange={handleChange} required />
                <TextField fullWidth multiline rows={3} margin="normal" label="Description" name="description" value={idea.description} onChange={handleChange} required />
                <TextField fullWidth select margin="normal" label="Category" name="category" value={idea.category} onChange={handleChange} required>
                    {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                            {cat}
                        </MenuItem>
                    ))}
                </TextField>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Submit Idea
                </Button>
            </form>
        </Container>
    );
};

export default IdeaForm;
