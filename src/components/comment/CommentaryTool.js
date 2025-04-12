// src/components/comment/CommentaryTool.js
import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Button } from "@mui/material";
import { DateTime } from "luxon"; // Добавлен импорт
import { useLayoutStore, useHistoryStore, useUiStore } from "../../stores";
import CommentaryPreview from "./CommentaryPreview";
import CommentaryEditor from "./CommentaryEditor";

const CommentaryTool = ({ onClose }) => {
  const layoutStore = useLayoutStore();
  const historyStore = useHistoryStore();
  const uiStore = useUiStore();
  const [tab, setTab] = useState(0);
  const [generalCommentary, setGeneralCommentary] = useState("");
  const [symbolCommentaries, setSymbolCommentaries] = useState({});

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleSave = () => {
    const commentaryData = {
      general: generalCommentary,
      symbols: symbolCommentaries,
    };
    historyStore.saveDivinationToHistory({
      question: layoutStore.question,
      layout: layoutStore.layout,
      groups: layoutStore.groups,
      commentary: commentaryData,
      timestamp: DateTime.now().toISO(),
      tags: [],
      title: "Расклад с комментариями",
    });
    onClose();
  };

  return (
    <Box sx={{ width: 700, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Комментарии к раскладу
      </Typography>
      <CommentaryPreview
        layout={layoutStore.layout}
        groups={layoutStore.groups}
      />
      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Общие соображения" />
        <Tab label="Комментарии к символам" />
      </Tabs>
      {tab === 0 && (
        <CommentaryEditor
          initialContent={generalCommentary}
          onChange={(content) => setGeneralCommentary(content)}
        />
      )}
      {tab === 1 && (
        <CommentaryEditor
          initialContent={symbolCommentaries}
          layout={layoutStore.layout}
          groups={layoutStore.groups}
          onChange={(content) => setSymbolCommentaries(content)}
        />
      )}
      <Box sx={{ display: "flex", gap: 1, mt: 2, justifyContent: "flex-end" }}>
        <Button variant="outlined" onClick={onClose}>
          Закрыть
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Сохранить
        </Button>
      </Box>
    </Box>
  );
};

export default CommentaryTool;
