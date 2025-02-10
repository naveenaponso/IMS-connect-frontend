import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Box,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";
import api from "../../services/api";
 
const AssignTeam = ({ ideaId, open, onClose, users }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [role, setRole] = useState("Contributor");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("error");

    const handleAssign = async () => {
        if (selectedUsers.length === 0) {
            setSnackbarMessage("Please select at least one user.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        try {
            await api.post("/collaborations/assign", { idea_id: ideaId, user_ids: selectedUsers, role });
            setSnackbarMessage("Team assigned successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setTimeout(() => onClose(), 2000); // Close dialog after 2 seconds
        } catch (err) {
            setSnackbarMessage(err.response?.data?.message || "Error assigning team.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return; // Don't close the snackbar if the user clicks away
        }
        setSnackbarOpen(false); // Close the snackbar
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>Assign Team to Idea</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Team Role</InputLabel>
                        <Select value={role} onChange={(e) => setRole(e.target.value)}>
                            <MenuItem value="Contributor">Contributor</MenuItem>
                            <MenuItem value="Team Lead">Team Lead</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Select Employees</InputLabel>
                        <Select
                            multiple
                            value={selectedUsers}
                            onChange={(e) => setSelectedUsers(e.target.value)}
                            renderValue={(selected) => selected.map((id) => users.find((user) => user.id === id)?.name).join(", ")}
                        >
                            {users && users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.name} ({user.role})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">Cancel</Button>
                    <Button onClick={handleAssign} color="success">Assign</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Error and Success Messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000} // Auto-hide after 6 seconds
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position the snackbar
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AssignTeam;