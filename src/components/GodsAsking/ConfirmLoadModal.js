//src\components\GodsAsking\ConfirmLoadModal.js
import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const ConfirmLoadModal = ({
  open = false,
  onConfirm,
  onCancel,
  recordHandler,
  message,
}) => {
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
          Подтверждение действия
        </Typography>
        <Typography variant="body2" gutterBottom>
          {message ||
            "У вас есть несохранённый расклад. Это действие приведёт к потере текущего. Продолжить?"}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={onCancel}>
            Отмена
          </Button>
          <Button variant="contained" onClick={onConfirm}>
            Подтвердить
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmLoadModal;
