// src/components/GodsAsking/MainControls.js
import React from "react";
import { Button, Tooltip, Box } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import GroupIcon from "@mui/icons-material/Group";
import BrushIcon from "@mui/icons-material/Brush";
import { useLayoutStore } from "../../stores";
import { useSaveModalHandler } from "../../hooks/useSaveModalHandler";

const MainControls = ({
  isQuestionLocked,
  isReturnAllowed,
  isBrushActive,
  layoutLength,
  handleAllowReturn,
  handleBrushActivate,
  handleSaveDivination,
  handleReturnAll,
  selectedNodes,
  handleCreateGroup,
}) => {
  const layoutStore = useLayoutStore();
  const { handleOpenSaveModal } = useSaveModalHandler();

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Tooltip title="Сохранить текущую тряпочку">
        <span>
          <Button
            variant="contained"
            onClick={handleOpenSaveModal}
            disabled={
              !isQuestionLocked ||
              layoutLength === 0 ||
              !layoutStore.isLayoutChanged()
            }
            sx={{ bgcolor: "#4B536E", "&:hover": { bgcolor: "#5B638E" } }}
          >
            <SaveIcon sx={{ color: "#fff" }} />
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="Создать группу из выделенных плашек">
        <span>
          <Button
            variant="contained"
            onClick={handleCreateGroup}
            disabled={selectedNodes.length < 2}
            sx={{ bgcolor: "#4B536E", "&:hover": { bgcolor: "#5B638E" } }}
          >
            <GroupIcon sx={{ color: "#fff" }} />
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="Кисточка для возврата плашки в чашу">
        <span>
          <Button
            variant="contained"
            onClick={handleBrushActivate}
            disabled={!isReturnAllowed || isBrushActive || !isQuestionLocked}
            sx={{ bgcolor: "#4B536E", "&:hover": { bgcolor: "#5B638E" } }}
          >
            <BrushIcon sx={{ color: "#fff" }} />
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
};

export default MainControls;
