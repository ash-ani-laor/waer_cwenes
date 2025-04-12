//src\components\GodsAsking\DeleteModal.js
import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const DeleteModal = ({ open = false, onConfirm, onCancel, record }) => {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Подтверждение удаления
        </Typography>
        <Typography variant="body2" gutterBottom>
          Вы уверены, что хотите удалить расклад "{record?.question}"? Это
          действие нельзя отменить.
        </Typography>
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={onCancel}>
            Отмена
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => onConfirm(record)}
          >
            Удалить
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteModal;
