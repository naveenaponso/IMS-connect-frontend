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
    CircularProgress,
    TextField,
    TablePagination,
    TableSortLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Select,
} from "@mui/material";
import { Add, Description } from "@mui/icons-material"; // Import Description icon
import api from "../../services/api";
import AssignTeam from "./AssignTeam";
import { jwtDecode } from "jwt-decode";
import CollaborationDetails from "./CollaborationDetails";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // Import DatePicker for date selection
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { set } from "date-fns";

const Collaborations = () => {
    const [ideas, setIdeas] = useState([]);
    const [filteredIdeas, setFilteredIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastSeverity] = useState("error");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortField, setSortField] = useState("title");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchQuery, setSearchQuery] = useState("");

    const [openReportDialog, setOpenReportDialog] = useState(false); // State for report dialog
    const [reportType, setReportType] = useState("collaborations"); // State for report type
    const [startDate, setStartDate] = useState(null); // State for start date
    const [endDate, setEndDate] = useState(null); // State for end date

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [token] = useState(localStorage.getItem("token"));
    const decoded = jwtDecode(token);
    const user = { id: decoded.id, role: decoded.role };
    const isManager = user?.role === "manager";
    const [availableUsers, setAvailableUsers] = useState([]);

    useEffect(() => {
        fetchApprovedIdeas();
    }, []);

    useEffect(() => {
        // Apply sorting, filtering, and pagination on the frontend
        const filtered = ideas.filter((idea) =>
            idea.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const sorted = filtered.sort((a, b) => {
            if (sortOrder === "asc") {
                return a[sortField] > b[sortField] ? 1 : -1;
            } else {
                return a[sortField] < b[sortField] ? 1 : -1;
            }
        });

        const paginated = sorted.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );

        setFilteredIdeas(paginated);
    }, [ideas, searchQuery, sortField, sortOrder, page, rowsPerPage]);

    const fetchApprovedIdeas = async () => {
        try {
            const startTime = Date.now();
            const response = await api.get("/collaborations/approved");
            const endTime = Date.now();
            const timeTaken = endTime - startTime;

            if (timeTaken < 1000) {
                setTimeout(() => {
                    setIdeas(response.data);
                    setLoading(false);
                }, 1000 - timeTaken);
            } else {
                setIdeas(response.data);
                setLoading(false);
            }
        } catch (err) {
            setToastMessage("Error fetching approved ideas");
            setToastOpen(true);
            setLoading(false);
        }
    };

    const handleViewCollaborations = async (idea) => {
        try {
            const response = await api.get(`/collaborations/idea/${idea.id}`);
            setSelectedIdea({ ...idea, collaborators: response.data });
            setOpenDetailDialog(true);
        } catch (err) {
            setToastMessage("Error fetching collaboration details");
            setToastOpen(true);
        }
    };

    const fetchAvailableUsers = async () => {
        try {
            const response = await api.get("/collaborations/available-collaborators");
            setAvailableUsers(response.data);
        } catch (err) {
            console.error("Error fetching available users:", err);
        }
    };

    const handleCloseToast = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setToastOpen(false);
    };

    const handleOpenAssignDialog = (idea) => {
        setSelectedIdea(idea);
        fetchAvailableUsers();
        setOpenAssignDialog(true);
    };

    const handleCloseAssignDialog = () => {
        setSelectedIdea(null);
        fetchApprovedIdeas();
        setOpenAssignDialog(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (field) => {
        const isAsc = sortField === field && sortOrder === "asc";
        setSortField(field);
        setSortOrder(isAsc ? "desc" : "asc");
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    // Open Report Dialog
    const handleOpenReportDialog = () => {
        setOpenReportDialog(true);
    };

    // Close Report Dialog
    const handleCloseReportDialog = () => {
        setStartDate(null);
        setEndDate(null);
        setOpenReportDialog(false);
    };

    // Handle Report Generation
    const handleGenerateReport = async () => {
        if (!startDate || !endDate) {
            setToastMessage("Please select both start and end dates.");
            setToastOpen(true);
            return;
        }

        try {
            const startDateFormatted = startDate.toISOString().split("T")[0];
            const endDateFormatted = endDate.toISOString().split("T")[0];

            const response = await api.get(
                `/reports/collaborations?startDate=${startDateFormatted}&endDate=${endDateFormatted}`,
                { responseType: "blob" } // Ensure the response is treated as a blob
            );

            // Create a URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "collaborations_report.csv"); // Set the file name
            document.body.appendChild(link);
            link.click(); // Trigger the download
            link.remove(); // Clean up

            handleCloseReportDialog(); // Close the dialog
        } catch (err) {
            setToastMessage("Error generating report");
            setToastOpen(true);
        }
    };

    return (
        <Container>
            <br />
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">
                    Explore Collaborations
                </Typography>
                {isManager &&
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<Description />} // Add report icon
                        onClick={handleOpenReportDialog} // Open report dialog
                    >
                        Generate Report
                    </Button>
                }
            </Box>

            {/* Report Dialog */}
            <Dialog open={openReportDialog} onClose={handleCloseReportDialog}>
                <DialogTitle>Generate Report</DialogTitle>
                <DialogContent>
                    <Box sx={{ minWidth: 400, mt: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                            />
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                            />
                        </LocalizationProvider>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReportDialog}>Cancel</Button>
                    <Button onClick={handleGenerateReport} color="primary">
                        Generate
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Search Input */}
            <TextField
                fullWidth
                label="Search"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearch}
                sx={{ mb: 3 }}
                component={Paper}
            />

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress color="success" size={60} />
                </Box>
            ) : (
                <>
                    {filteredIdeas.length === 0 ? (
                        <Typography variant="h6" color="textSecondary" align="center">
                            No collaborations available.
                        </Typography>
                    ) : (
                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <TableSortLabel
                                                active={sortField === "title"}
                                                direction={sortOrder}
                                                onClick={() => handleSort("title")}
                                            >
                                                <Typography fontWeight="bold">Title</Typography>
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={sortField === "status"}
                                                direction={sortOrder}
                                                onClick={() => handleSort("status")}
                                            >
                                                <Typography fontWeight="bold">Status</Typography>
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="center">
                                            <TableSortLabel
                                                active={sortField === "active_collaborators"}
                                                direction={sortOrder}
                                                onClick={() => handleSort("active_collaborators")}
                                            >
                                                <Typography fontWeight="bold">Active Collaborators</Typography>
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography fontWeight="bold">Actions</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredIdeas.map((idea) => (
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
                                                            handleOpenAssignDialog(idea);
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
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={ideas.length} // Total number of ideas (not filtered)
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    )}
                </>
            )}

            {isMobile && isManager && (
                <Fab color="primary" sx={{ position: "fixed", bottom: 20, right: 20 }} onClick={() => setOpenAssignDialog(true)}>
                    <Add />
                </Fab>
            )}

            <CollaborationDetails
                open={openDetailDialog}
                onClose={() => setOpenDetailDialog(false)}
                selectedIdea={selectedIdea}
                isManager={isManager}
            />

            {selectedIdea && (
                <AssignTeam
                    ideaId={selectedIdea.id}
                    open={openAssignDialog}
                    onClose={handleCloseAssignDialog}
                    users={availableUsers}
                />
            )}

            <Snackbar
                open={toastOpen}
                autoHideDuration={5000}
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