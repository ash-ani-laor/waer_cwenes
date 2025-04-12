//копмонент сейчас нигде не используется, но для памяти
//src\components\GodsAsking\ExplanationNode.js
import React from "react";
import { Typography, TextField, Select, MenuItem, Box } from "@mui/material";

const ExplanationNode = ({ node, updateNode }) => {
  const mainRoleOptions = [
    "Деятель",
    "Руна",
    "Сила",
    "Выход",
    "4В",
    "4Н",
    "5В",
    "5Н",
    "+",
    "Комментарий",
  ];

  const handleUpdate = (field, value) => {
    updateNode(node.layoutId, field, value);
  };

  return (
    <Box sx={{ borderBottom: "1px solid #ddd", padding: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography>{`${node.dropOrder}. ${node.symbol}`}</Typography>
        <Select
          value={node.role}
          onChange={(e) => handleUpdate("role", e.target.value)}
          size="small"
          sx={{ minWidth: 80 }}
        >
          {mainRoleOptions.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <TextField
        value={node.comment || ""}
        onChange={(e) => handleUpdate("comment", e.target.value)}
        placeholder="Interpretation"
        size="small"
        fullWidth
        multiline
        rows={2}
        sx={{ mt: 1 }}
      />
    </Box>
  );
};

export default ExplanationNode;
