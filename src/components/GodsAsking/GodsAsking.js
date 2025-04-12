// src/components/GodsAsking/GodsAsking.js
import React, { useEffect, useRef, useState } from "react";
import { Typography, Box } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DateTime } from "luxon";
import { useLayoutStore, useHistoryStore, useUiStore } from "../../stores";
import SymbolDeck from "./SymbolDeck";
import SymbolLayout from "./SymbolLayout";
import ControlPanel from "./ControlPanel";
import QuestionPanel from "./QuestionPanel";
// import ExplanationNode from "./ExplanationNode";
import ClockDisplay from "./ClockDisplay";
import {
  useGroupManager,
  useLayoutHandlers,
  useHistoryHandlers,
  useSaveHandlers,
} from "../../hooks";
import DivinationModals from "./DivinationModals";

const GodsAsking = () => {
  const layoutStore = useLayoutStore();
  const historyStore = useHistoryStore();
  const uiStore = useUiStore(); // Получаем стор как хук
  const isProtocolMode = useUiStore((state) => state.isProtocolMode); // Получаем значение через селектор

  const reshuffleRef = useRef(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [recordHandler, setRecordHandler] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [newLayoutHandler, setNewLayoutHandler] = useState(null);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const capturePreviewRef = useRef(null);

  const {
    handleAllowReturn,
    handleBrushActivate,
    handleReturnAll,
    handleQuestionChange,
    handleLockQuestion,
    handleCreateGroup,
  } = useLayoutHandlers({
    layoutStore,
    reshuffleRef,
    selectedNodes,
    setSelectedNodes,
    createGroup: useGroupManager({
      layout: layoutStore.layout,
      setLayout: layoutStore.setLayout,
      groups: layoutStore.groups,
      setGroups: layoutStore.setGroups,
    }).createGroup,
  });

  const {
    handleLoadDivination,
    handleDeleteRecord,
    handleConfirmDelete,
    handleCancelDelete,
    handleToggleDeleteMode,
    handleAddTag,
    handleDeleteTag,
  } = useHistoryHandlers({
    layoutStore,
    historyStore,
    setRecordHandler,
    setRecordToDelete,
  });

  const {
    handleSaveDivination,
    handleExportDivination,
    handleImportDivination,
  } = useSaveHandlers({
    layoutStore,
    historyStore,
    uiStore,
    stagePosition,
    setStagePosition,
    capturePreview: capturePreviewRef.current,
  });

  useEffect(() => {
    historyStore.loadHistory();
  }, [historyStore]);

  useEffect(() => {
    const waerSecondInterval = 2400;
    const interval = setInterval(() => {
      uiStore.setCurrentTime(DateTime.now());
    }, waerSecondInterval);
    return () => clearInterval(interval);
  }, [uiStore]);

  useEffect(() => {
    if (!isProtocolMode) {
      layoutStore.resetSymbols(); // Инициализация в режиме дивинации
    }
  }, []); // Вызываем один раз при монтировании

  // Отладочный useEffect для отслеживания смены режима
  useEffect(() => {
    console.log("isProtocolMode changed:", isProtocolMode);
    if (isProtocolMode) {
      console.log("Switching to protocol mode");
      layoutStore.setSymbols((prev) =>
        prev.map((symbol) => ({ ...symbol, revealed: true }))
      );
    }
  }, [isProtocolMode]); // Зависимость только от isProtocolMode

  const sortedLayoutForComments = [...layoutStore.layout].sort(
    (a, b) => a.dropOrder - b.dropOrder
  );

  const allTags = Array.from(
    new Set(
      historyStore.divinationHistory.flatMap((record) => record.tags || [])
    )
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          p: 2,
          minHeight: "100vh",
          maxHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          background: "linear-gradient(145deg, #1A1A1A, #2E2E2E)",
        }}
      >
        <ControlPanel
          isQuestionLocked={layoutStore.isQuestionLocked}
          isReturnAllowed={layoutStore.isReturnAllowed}
          isBrushActive={layoutStore.isBrushActive}
          layoutLength={layoutStore.layout.length}
          handleAllowReturn={handleAllowReturn}
          handleBrushActivate={handleBrushActivate}
          handleSaveDivination={handleSaveDivination}
          handleReturnAll={handleReturnAll}
          onOpenHistory={() => uiStore.setIsHistoryModalOpen(true)}
          selectedNodes={selectedNodes}
          handleCreateGroup={handleCreateGroup}
          setNewLayoutHandler={setNewLayoutHandler}
          handleExportDivination={handleExportDivination}
          handleImportDivination={handleImportDivination}
          setStagePosition={setStagePosition}
        />
        <ClockDisplay />
        <QuestionPanel
          question={layoutStore.question}
          isQuestionLocked={layoutStore.isQuestionLocked}
          handleQuestionChange={handleQuestionChange}
          handleLockQuestion={handleLockQuestion}
          questionFixedTime={layoutStore.questionFixedTime}
        />
        <Box sx={{ flex: 1, display: "flex", gap: 2, minHeight: 0 }}>
          <Box sx={{ width: "35%", minWidth: 200 }}>
            <SymbolDeck
              symbols={layoutStore.symbols}
              setSymbols={layoutStore.setSymbols}
              isDivinationMode={true}
              question={layoutStore.question}
              reshuffle={reshuffleRef}
              isQuestionLocked={layoutStore.isQuestionLocked}
              isProtocolMode={isProtocolMode}
              layout={layoutStore.layout}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0, width: "100%", height: "100%" }}>
            <SymbolLayout
              layout={layoutStore.layout}
              setLayout={layoutStore.setLayout}
              symbols={layoutStore.symbols}
              setSymbols={layoutStore.setSymbols}
              drawMode={layoutStore.drawMode}
              isDivinationMode={true}
              isBrushActive={layoutStore.isBrushActive}
              setIsBrushActive={layoutStore.setIsBrushActive}
              reshuffle={reshuffleRef.current}
              isReturnAllowed={layoutStore.isReturnAllowed}
              selectedNodes={selectedNodes}
              setSelectedNodes={setSelectedNodes}
              onCreateGroup={handleCreateGroup}
              isProtocolMode={isProtocolMode}
              question={layoutStore.question}
              setStagePosition={setStagePosition}
              onCapturePreview={(fn) => (capturePreviewRef.current = fn)}
            />
          </Box>
        </Box>
        <Box
          sx={{
            height: "20px",
            bgcolor: "#2E2E2E",
            p: 0.5,
            textAlign: "center",
            borderTop: "1px solid #4B536E",
            position: "sticky",
            bottom: 0,
            zIndex: 1000,
          }}
        >
          <Typography variant="caption" color="#B0B0B0">
            Waer Divination Tool v1.0
          </Typography>
        </Box>
      </Box>
      <DivinationModals
        uiStore={uiStore}
        historyStore={historyStore}
        allTags={allTags}
        layoutStore={layoutStore}
        handleLoadDivination={handleLoadDivination}
        handleDeleteRecord={handleDeleteRecord}
        handleToggleDeleteMode={handleToggleDeleteMode}
        handleConfirmDelete={handleConfirmDelete}
        handleCancelDelete={handleCancelDelete}
        recordHandler={recordHandler}
        recordToDelete={recordToDelete}
        handleConfirmSave={(title, tags) => handleSaveDivination(title, tags)}
        handleCancelEdit={() => {
          uiStore.setSaveModalOpen(false);
          uiStore.setIsEditing(false);
        }}
        handleAddTag={handleAddTag}
        handleDeleteTag={handleDeleteTag}
        handleLayoutChange={(newLayout) => layoutStore.setLayout(newLayout)}
        newLayoutHandler={newLayoutHandler}
      />
    </DndProvider>
  );
};

export default GodsAsking;
