import React, { useEffect, useState } from "react";
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, Snackbar, Alert, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import api from "../../services/api"; // Adjust path if needed

const Incentives = () => {
    const [rewards, setRewards] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [settings, setSettings] = useState([]);
    const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
    const [selectedSetting, setSelectedSetting] = useState({ key: "", value: "" });
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastSeverity, setToastSeverity] = useState("error");

    // Get user role from token
    const token = localStorage.getItem("token");
    const decoded = token ? jwtDecode(token) : {};
    const isAdmin = decoded.role === "admin";

    useEffect(() => {
        fetchRewards();
        fetchLeaderboard();
        if (isAdmin) fetchSettings();
    }, []);

    // Fetch user rewards
    const fetchRewards = async () => {
        try {
            const response = await api.get("/incentives/my-rewards");
            setRewards(response.data);
        } catch (err) {
            setToastMessage("Error fetching rewards.");
            setToastSeverity("error");
            setToastOpen(true);
        }
    };

    // Fetch leaderboard
    const fetchLeaderboard = async () => {
        try {
            const response = await api.get("/incentives/leaderboard");
            setLeaderboard(response.data);
        } catch (err) {
            setToastMessage("Error fetching leaderboard.");
            setToastSeverity("error");
            setToastOpen(true);
        }
    };

    // Fetch incentive settings (Admin only)
    const fetchSettings = async () => {
        try {
            const response = await api.get("/incentives/settings");
            setSettings(response.data);
        } catch (err) {
            setToastMessage("Error fetching settings.");
            setToastSeverity("error");
            setToastOpen(true);
        }
    };

    // Handle updating settings
    const handleUpdateSetting = async () => {
        try {
            await api.put("/incentives/settings", {
                settingKey: selectedSetting.key,
                settingValue: selectedSetting.value
            });
            fetchSettings();
            setOpenSettingsDialog(false);
            setToastMessage("Incentive setting updated successfully.");
            setToastSeverity("success");
            setToastOpen(true);
        } catch (err) {
            setToastMessage("Error updating setting.");
            setToastSeverity("error");
            setToastOpen(true);
        }
    };

    return (
        <Container>
            <br />
            <Typography variant="h4" fontWeight="bold">Incentives & Rewards</Typography>

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                <Typography variant="h5">Your Earned Rewards</Typography>
            </Box>

            {/* Rewards Table */}
            <Paper sx={{ mt: 2, p: 2 }}>
                {rewards.length === 0 ? (
                    <Typography color="textSecondary" align="center">No rewards available.</Typography>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Points</strong></TableCell>
                                <TableCell><strong>Description</strong></TableCell>
                                <TableCell><strong>Date Earned</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rewards.map((reward) => (
                                <TableRow key={reward.id}>
                                    <TableCell>{reward.points}</TableCell>
                                    <TableCell>{reward.description}</TableCell>
                                    <TableCell>{new Date(reward.created_at).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Paper>

            {/* Leaderboard Section */}
            <Box mt={5}>
                <Typography variant="h5">Top Contributors</Typography>
                <Paper sx={{ mt: 2, p: 2 }}>
                    {leaderboard.length === 0 ? (
                        <Typography color="textSecondary" align="center">No leaderboard data available.</Typography>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Name</strong></TableCell>
                                    <TableCell><strong>Total Points</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {leaderboard.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.total_points}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Paper>
            </Box>

            {/* Incentive Settings (Admin Only) */}
            {isAdmin && (
                <Box mt={5}>
                    <Typography variant="h5">Incentive Settings</Typography>
                    <Paper sx={{ mt: 2, p: 2 }}>
                        {settings.length === 0 ? (
                            <Typography color="textSecondary" align="center">No settings available.</Typography>
                        ) : (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Setting</strong></TableCell>
                                        <TableCell><strong>Value</strong></TableCell>
                                        <TableCell align="right"><strong>Actions</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {settings.map((setting) => (
                                        <TableRow key={setting.setting_key}>
                                            <TableCell>{setting.setting_key.replace("_", " ")}</TableCell>
                                            <TableCell>{setting.setting_value}</TableCell>
                                            <TableCell align="right">
                                                <Button variant="outlined" color="primary" onClick={() => {
                                                    setSelectedSetting({ key: setting.setting_key, value: setting.setting_value });
                                                    setOpenSettingsDialog(true);
                                                }}>
                                                    Edit
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </Paper>
                </Box>
            )}

            {/* Edit Settings Dialog (Admin Only) */}
            <Dialog open={openSettingsDialog} onClose={() => setOpenSettingsDialog(false)} fullWidth>
                <DialogTitle>Edit Incentive Setting</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Value"
                        type="number"
                        value={selectedSetting.value}
                        onChange={(e) => setSelectedSetting({ ...selectedSetting, value: e.target.value })}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSettingsDialog(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleUpdateSetting} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for messages */}
            <Snackbar
                open={toastOpen}
                autoHideDuration={6000}
                onClose={() => setToastOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity={toastSeverity} onClose={() => setToastOpen(false)} sx={{ width: "100%" }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Incentives;
