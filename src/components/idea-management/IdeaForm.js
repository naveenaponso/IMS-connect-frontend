import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Alert, MenuItem } from "@mui/material";
import api from "../../services/api";

const categories = ["Renewable Energy", "Urban Development", "Sustainability", "Water Conservation", "Others"];

const IdeaForm = ({ onIdeaSubmitted }) => {
    const [idea, setIdea] = useState({ title: "", description: "", category: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => setIdea({ ...idea, [e.target.name]: e.target.value });

    // Function to submit an idea to the server
    const submitIdeaToServer = async (idea) => {
        try {
            const response = await api.post("/ideas/", idea);
            setMessage("Idea submitted successfully!");
            onIdeaSubmitted(response.data.idea); // Refresh idea list
            setIdea({ title: "", description: "", category: "" }); // Clear form
        } catch (err) {
            setError("Error submitting idea");
        }
    };

    // Function to save an idea to localStorage
    const saveIdeaToLocalStorage = (idea) => {
        const offlineIdeas = JSON.parse(localStorage.getItem("offlineIdeas")) || [];
        offlineIdeas.push(idea);
        localStorage.setItem("offlineIdeas", JSON.stringify(offlineIdeas));
        setMessage("Idea saved offline. It will be submitted when you are online.");
        setIdea({ title: "", description: "", category: "" }); // Clear form
    };

    // Function to sync offline ideas when online
    const syncOfflineIdeas = async () => {
        const offlineIdeas = JSON.parse(localStorage.getItem("offlineIdeas")) || [];
        if (offlineIdeas.length > 0 && navigator.onLine) {
            for (const idea of offlineIdeas) {
                await submitIdeaToServer(idea);
            }
            localStorage.removeItem("offlineIdeas"); // Clear offline ideas after syncing
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (navigator.onLine) {
            await submitIdeaToServer(idea);
        } else {
            saveIdeaToLocalStorage(idea);
        }
    };

    // Sync offline ideas when the user comes back online
    useEffect(() => {
        const handleOnlineStatus = () => {
            if (navigator.onLine) {
                syncOfflineIdeas();
            }
        };

        window.addEventListener("online", handleOnlineStatus);
        return () => window.removeEventListener("online", handleOnlineStatus);
    }, []);

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