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
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useMediaQuery,
    useTheme,
    Box,
    Snackbar,
    Alert,
    CircularProgress,
    TextField,
    TableSortLabel,
    TablePagination,
    Card,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import api from "../../services/api";
import IdeaForm from "./IdeaForm";
import IdeaDetail from "./IdeaDetail";

const IdeaList = () => {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastSeverity] = useState("error");
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    // State for search
    const [searchTerm, setSearchTerm] = useState("");

    // State for sorting
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("title");

    // State for pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        fetchIdeas();
    }, []);

    const fetchIdeas = async () => {
        try {
            const startTime = Date.now();
            const response = await api.get("/ideas/");
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
            setToastMessage("Error fetching ideas");
            setToastOpen(true);
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setPage(0); // Reset to the first page when searching
    };

    // Handle sorting
    const handleSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    // Handle pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page when changing rows per page
    };

    // Filter and sort ideas
    const filteredAndSortedIdeas = ideas
        .filter((idea) =>
            idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            idea.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            idea.status.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (order === "asc") {
                if (orderBy === "vote_count" || orderBy === "comment_count") {
                    return (a[orderBy] || 0) > (b[orderBy] || 0) ? 1 : -1;
                } else {
                    return a[orderBy] > b[orderBy] ? 1 : -1;
                }
            } else {
                if (orderBy === "vote_count" || orderBy === "comment_count") {
                    return (a[orderBy] || 0) < (b[orderBy] || 0) ? 1 : -1;
                } else {
                    return a[orderBy] < b[orderBy] ? 1 : -1;
                }
            }
        });

    // Paginate ideas
    const paginatedIdeas = filteredAndSortedIdeas.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleCloseToast = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setToastOpen(false);
    };

    return (
        <Container>
            <br></br>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">
                    Explore Ideas
                </Typography>
                {!isMobile && (
                    <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
                        Submit Idea
                    </Button>
                )}
            </Box>

            {/* Search Input */}
            <TextField
                fullWidth
                label="Search Ideas"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearch}
                sx={{ mb: 3 }}
                component={Paper}
            />

            {/* Show Loader if Loading */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress size={60} />
                </Box>
            ) : (
                <>
                    {/* Show No Ideas Message */}
                    {filteredAndSortedIdeas.length === 0 ? (
                        <Typography variant="h6" color="textSecondary" align="center">
                            No ideas available.
                        </Typography>
                    ) : (
                        <>
                            <TableContainer component={Paper} sx={{ mt: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === "title"}
                                                    direction={orderBy === "title" ? order : "asc"}
                                                    onClick={() => handleSort("title")}
                                                >
                                                    <Typography fontWeight="bold">Title</Typography>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === "author_name"}
                                                    direction={orderBy === "author_name" ? order : "asc"}
                                                    onClick={() => handleSort("author_name")}
                                                >
                                                    <Typography fontWeight="bold">Author</Typography>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === "status"}
                                                    direction={orderBy === "status" ? order : "asc"}
                                                    onClick={() => handleSort("status")}
                                                >
                                                    <Typography fontWeight="bold">Status</Typography>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell align="center">
                                                <TableSortLabel
                                                    active={orderBy === "vote_count"}
                                                    direction={orderBy === "vote_count" ? order : "asc"}
                                                    onClick={() => handleSort("vote_count")}
                                                >
                                                    <Typography fontWeight="bold">Votes</Typography>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell align="center">
                                                <TableSortLabel
                                                    active={orderBy === "comment_count"}
                                                    direction={orderBy === "comment_count" ? order : "asc"}
                                                    onClick={() => handleSort("comment_count")}
                                                >
                                                    <Typography fontWeight="bold">Comments</Typography>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography fontWeight="bold">Actions</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedIdeas.map((idea) => (
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

                            {/* Pagination */}
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={filteredAndSortedIdeas.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </>
                    )}
                </>
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
                        fetchIdeas();
                        setOpenDialog(false);
                    }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for Viewing Idea Details */}
            {selectedIdea && (
                <IdeaDetail idea={selectedIdea} onClose={() => { setSelectedIdea(null); fetchIdeas(); }} />
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

export default IdeaList;