import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Alert } from "@mui/material";

const IdeaTeam = ({ ideaId, isManager }) => {
    const [team, setTeam] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const response = await api.get(`/collaborations/idea/${ideaId}`);
            setTeam(response.data);
        } catch (err) {
            setErrorMessage("Error fetching team members.");
        }
    };

    const handleRemove = async (userId) => {
        try {
            await api.delete("/collaborations/remove", { data: { idea_id: ideaId, user_id: userId } });
            setSuccessMessage("Employee removed from team.");
            fetchTeam();
        } catch (err) {
            setErrorMessage("Error removing employee.");
        }
    };

    return (
        <>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Role</TableCell>
                        {isManager && <TableCell>Actions</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {team.map((member) => (
                        <TableRow key={member.id}>
                            <TableCell>{member.name}</TableCell>
                            <TableCell>{member.team_role}</TableCell>
                            {isManager && (
                                <TableCell>
                                    <Button color="secondary" onClick={() => handleRemove(member.id)}>Remove</Button>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};

export default IdeaTeam;
