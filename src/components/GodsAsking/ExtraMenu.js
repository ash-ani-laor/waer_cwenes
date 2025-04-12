// src/components/GodsAsking/ExtraMenu.js
import React, { useState } from "react";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNewLayoutHandler } from "../../hooks/useNewLayoutHandler";
import { useProtocolModeHandler } from "../../hooks/useProtocolModeHandler";
import { useUiStore } from "../../stores";

const ExtraMenu = ({
  isQuestionLocked,
  isReturnAllowed,
  layoutLength,
  onOpenHistory,
  setNewLayoutHandler,
  handleExportDivination,
  handleImportDivination,
  setStagePosition,
  handleAllowReturn,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isProtocolMode = useUiStore((state) => state.isProtocolMode);
  const { handleNewLayoutWithConfirmation } = useNewLayoutHandler({
    layoutLength,
    setNewLayoutHandler,
    setStagePosition,
  });
  const { handleToggleProtocolMode } = useProtocolModeHandler();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box>
      <IconButton onClick={handleMenuOpen}>
        <MoreVertIcon sx={{ color: "#B0B0B0" }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { bgcolor: "#2E2E2E", color: "#B0B0B0" } }}
      >
        <MenuItem
          onClick={() => {
            handleToggleProtocolMode();
            handleMenuClose();
          }}
          sx={{ "&:hover": { bgcolor: "#4B536E" } }}
        >
          {isProtocolMode ? "Режим дивинации" : "Режим протокола"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleAllowReturn();
            handleMenuClose();
          }}
          disabled={!isQuestionLocked || isReturnAllowed}
          sx={{ "&:hover": { bgcolor: "#4B536E" } }}
        >
          Разрешить возврат
        </MenuItem>
        <MenuItem
          onClick={() => {
            onOpenHistory();
            handleMenuClose();
          }}
          sx={{ "&:hover": { bgcolor: "#4B536E" } }}
        >
          История раскладов
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleExportDivination();
            handleMenuClose();
          }}
          sx={{ "&:hover": { bgcolor: "#4B536E" } }}
        >
          Экспорт
        </MenuItem>
        <MenuItem component="label" sx={{ "&:hover": { bgcolor: "#4B536E" } }}>
          Импорт
          <input
            type="file"
            accept=".json"
            hidden
            onChange={(e) => {
              handleImportDivination(e);
              handleMenuClose();
            }}
          />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleNewLayoutWithConfirmation();
            handleMenuClose();
          }}
          disabled={layoutLength === 0}
          sx={{ "&:hover": { bgcolor: "#4B536E" } }}
        >
          Новый расклад
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ExtraMenu;
