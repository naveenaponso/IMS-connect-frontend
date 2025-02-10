import React, { useEffect, useState } from "react";
import api, { getEmployeeCollaborations } from "../../services/api";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

const MyCollaborations = () => {
    const [collaborations, setCollaborations] = useState([]);

    useEffect(() => {
        fetchCollaborations();
    }, []);

    const fetchCollaborations = async () => {
        try {
            const response = await api.get("/collaborations/my-collaborations");
            setCollaborations(response.data);
        } catch (err) {
            console.error("Error fetching collaborations");
        }
    };

    return (
        <div>
            <Typography variant="h5">My Collaborations</Typography>
            <List>
                {collaborations.map((collab) => (
                    <ListItem key={collab.idea_id}>
                        <ListItemText primary={collab.title} secondary={`Role: ${collab.team_role}, Status: ${collab.status}`} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default MyCollaborations;
