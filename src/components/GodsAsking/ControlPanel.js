// src/components/GodsAsking/ControlPanel.js
import React from "react";
import { Box } from "@mui/material";
import MainControls from "./MainControls";
import ToolButtons from "./ToolButtons";
import ExtraMenu from "./ExtraMenu";

const ControlPanel = ({
  isQuestionLocked,
  isReturnAllowed,
  isBrushActive,
  layoutLength,
  handleAllowReturn,
  handleBrushActivate,
  handleSaveDivination,
  handleReturnAll,
  onOpenHistory,
  selectedNodes,
  handleCreateGroup,
  setNewLayoutHandler,
  handleExportDivination,
  handleImportDivination,
  setStagePosition,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        mb: 0.5,
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "#2E2E2E",
        p: 0.5,
        borderRadius: 2,
        border: "1px solid #4B536E",
      }}
    >
      <MainControls
        isQuestionLocked={isQuestionLocked}
        isReturnAllowed={isReturnAllowed}
        isBrushActive={isBrushActive}
        layoutLength={layoutLength}
        handleAllowReturn={handleAllowReturn}
        handleBrushActivate={handleBrushActivate}
        handleSaveDivination={handleSaveDivination}
        handleReturnAll={handleReturnAll}
        selectedNodes={selectedNodes}
        handleCreateGroup={handleCreateGroup}
      />
      <ToolButtons />
      <ExtraMenu
        isQuestionLocked={isQuestionLocked}
        isReturnAllowed={isReturnAllowed}
        layoutLength={layoutLength}
        onOpenHistory={onOpenHistory}
        setNewLayoutHandler={setNewLayoutHandler}
        handleExportDivination={handleExportDivination}
        handleImportDivination={handleImportDivination}
        setStagePosition={setStagePosition}
      />
    </Box>
  );
};

export default ControlPanel;
