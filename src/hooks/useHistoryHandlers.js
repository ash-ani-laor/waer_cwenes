// src/hooks/useHistoryHandlers.js
import { DateTime } from "luxon";

export const useHistoryHandlers = ({
  layoutStore,
  historyStore,
  uiStore,
  setRecordHandler,
  setRecordToDelete,
}) => {
  const handleLoadDivination = (record) => {
    const syncSymbolsWithLayout = (layout, symbols) => {
      const drawnIds = layout
        .filter((node) => !node.isReturned) // Исключаем возвращённые
        .map((node) => node.id);
      return symbols.map((sym) => ({
        ...sym,
        drawn: drawnIds.includes(sym.id),
        revealed: layoutStore.isProtocolMode, // Учитываем режим протокола
      }));
    };

    if (layoutStore.layout.length > 0) {
      const handler = {
        confirm: () => {
          layoutStore.setLayout(record.layout);
          layoutStore.setGroups(record.groups || []);
          layoutStore.setQuestion(
            typeof record.question === "string" ? record.question : ""
          );
          layoutStore.setQuestionFixedTime(
            record.questionFixedTime
              ? DateTime.fromISO(record.questionFixedTime)
              : null
          );
          layoutStore.setIsQuestionLocked(!!record.questionFixedTime);
          layoutStore.setSymbols(
            syncSymbolsWithLayout(record.layout, layoutStore.symbols)
          );
          uiStore.setIsEditing(true);
          uiStore.setOriginalTimestamp(record.timestamp);
          uiStore.setIsHistoryModalOpen(false);
          uiStore.setIsConfirmLoadModalOpen(false);
          layoutStore.setLastSavedState();
          historyStore.setTags(record.tags || []);
          historyStore.setTagInput("");
        },
        cancel: () => uiStore.setIsConfirmLoadModalOpen(false),
      };
      setRecordHandler(handler);
      uiStore.setIsConfirmLoadModalOpen(true);
    } else {
      layoutStore.setLayout(record.layout);
      layoutStore.setGroups(record.groups || []);
      layoutStore.setQuestion(
        typeof record.question === "string" ? record.question : ""
      );
      layoutStore.setQuestionFixedTime(
        record.questionFixedTime
          ? DateTime.fromISO(record.questionFixedTime)
          : null
      );
      layoutStore.setIsQuestionLocked(!!record.questionFixedTime);
      layoutStore.setSymbols(
        syncSymbolsWithLayout(record.layout, layoutStore.symbols)
      );
      uiStore.setIsEditing(true);
      uiStore.setOriginalTimestamp(record.timestamp);
      uiStore.setIsHistoryModalOpen(false);
      layoutStore.setLastSavedState();
      historyStore.setTags(record.tags || []);
      historyStore.setTagInput("");
    }
  };

  const handleDeleteRecord = (record) => {
    setRecordToDelete(record);
    uiStore.setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (recordToDelete) => {
    if (recordToDelete) {
      historyStore.deleteDivinationFromHistory(recordToDelete.timestamp);
      setRecordToDelete(null);
    }
    uiStore.setIsDeleteModalOpen(false);
  };

  const handleCancelDelete = () => {
    uiStore.setIsDeleteModalOpen(false);
    setRecordToDelete(null);
  };

  const handleToggleDeleteMode = () =>
    uiStore.setIsDeleteMode(!uiStore.isDeleteMode);

  const handleAddTag = (tag) => {
    if (tag && typeof tag === "string" && tag.trim()) {
      historyStore.setTags((prev) => [...new Set([...prev, tag.trim()])]);
    }
  };

  const handleDeleteTag = (tag) => {
    historyStore.setTags((prev) => prev.filter((t) => t !== tag));
  };

  return {
    handleLoadDivination,
    handleDeleteRecord,
    handleConfirmDelete,
    handleCancelDelete,
    handleToggleDeleteMode,
    handleAddTag,
    handleDeleteTag,
  };
};
