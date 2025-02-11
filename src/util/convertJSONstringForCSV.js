const convertToCSV = (data) => {
    const headers = ["Idea ID", "Title", "Collaborator Name", "Role", "Assigned At"];
    const csvRows = data.map(row => [
        row.idea_id,
        `"${row.title}"`, // Enclose in quotes to handle commas in text
        `"${row.collaborator_name}"`,
        `"${row.role}"`,
        row.assigned_at
    ].join(","));

    return [headers.join(","), ...csvRows].join("\n");
};

export default convertToCSV;