import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";
import IdeaTeam from "./IdeaTeam";

const CollaborationDetails = ({ open, onClose, selectedIdea, isManager }) => {
    if (!selectedIdea) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{selectedIdea.title}</DialogTitle>
            <DialogContent>
                <Typography variant="subtitle1" color="textSecondary">
                    By {selectedIdea.author_name} | Category: {selectedIdea.category} | Submitted On: {selectedIdea.created_at}
                </Typography>
                <Typography variant="h6" color="secondary" sx={{ mt: 2 }}>
                    Status: {selectedIdea.status}
                </Typography>
                <br />
                <IdeaTeam ideaId={selectedIdea.id} isManager={isManager} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CollaborationDetails;