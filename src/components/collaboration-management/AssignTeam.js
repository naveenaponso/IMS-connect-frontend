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
    Autocomplete, // Import Autocomplete
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
            await api.post("/collaborations/assign", { idea_id: ideaId, user_ids: selectedUsers.map(user => user.id), role });
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
                    {/* Role Dropdown with Fixed Floating Label */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="role-label">Team Role</InputLabel>
                        <Select
                            labelId="role-label"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            label="Team Role" // Add label for floating behavior
                        >
                            <MenuItem value="Contributor">Contributor</MenuItem>
                            <MenuItem value="Team Lead">Team Lead</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Autocomplete for Selecting Users */}
                    <Autocomplete
                        multiple
                        options={users || []}
                        getOptionLabel={(user) => `${user.name} (${user.role})`}
                        value={selectedUsers}
                        onChange={(event, newValue) => setSelectedUsers(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Employees"
                                margin="normal"
                                fullWidth
                                placeholder="Search users..."
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">Cancel</Button>
                    <Button onClick={handleAssign} color="success">Assign</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Error and Success Messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000} // Auto-hide after 6 seconds
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