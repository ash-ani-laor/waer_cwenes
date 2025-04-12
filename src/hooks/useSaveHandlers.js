// src/hooks/useSaveHandlers.js
import { DateTime } from "luxon";
import { getWaerDateTimeString } from "../utils/waerUtils";
import { GodsAskingToolset } from "../constants/godsAskingToolset";
import { sortOrShuffleSymbols } from "../utils/waerUtils";

export const useSaveHandlers = ({
  layoutStore,
  historyStore,
  uiStore,
  stagePosition,
  setStagePosition,
  capturePreview,
}) => {
  const handleSaveDivination = async (title, tags, commentaryData) => {
    const previewWidth = window.innerWidth * 0.7;
    const previewHeight = 600;
    const visibleLayout = layoutStore.layout.filter((node) => {
      const x = node.x + (stagePosition?.x || 0);
      const y = node.y + (stagePosition?.y || 0);
      return x >= 0 && x <= previewWidth && y >= 0 && y <= previewHeight;
    });

    let previewImage = null;
    if (capturePreview && typeof capturePreview === "function") {
      previewImage = await capturePreview();
    }

    const originalRecord = uiStore.isEditing
      ? historyStore.divinationHistory.find(
          (record) => record.timestamp === uiStore.originalTimestamp
        )
      : null;

    const divination = {
      question: layoutStore.question,
      layout: layoutStore.layout,
      visibleLayout,
      stagePosition,
      groups: layoutStore.groups,
      tags: tags || originalRecord?.tags || [],
      timestamp: DateTime.now().toISO(),
      title: title || originalRecord?.title || "",
      questionFixedTime: uiStore.isEditing
        ? originalRecord?.questionFixedTime
        : layoutStore.questionFixedTime?.toISO() || null,
      previewImage: previewImage || originalRecord?.previewImage,
      commentary: commentaryData ||
        originalRecord?.commentary || { general: "", symbols: {} },
    };

    if (uiStore.isEditing) {
      historyStore.editDivination(divination);
    } else {
      historyStore.saveDivinationToHistory(divination);
    }
    layoutStore.setLastSavedState();
    uiStore.setSaveModalOpen(false);
    uiStore.setIsEditing(false);
  };

  const handleExportDivination = async () => {
    let previewImage = null;
    if (capturePreview && typeof capturePreview === "function") {
      previewImage = await capturePreview();
    }

    const drawnIds = layoutStore.layout
      .filter((node) => !node.isReturned)
      .map((node) => node.id);
    const syncedSymbols = layoutStore.symbols.map((sym) => ({
      ...sym,
      drawn: drawnIds.includes(sym.id),
    }));

    const divination = {
      question: layoutStore.question,
      layout: layoutStore.layout,
      symbols: syncedSymbols,
      groups: layoutStore.groups,
      stagePosition,
      drawMode: layoutStore.drawMode,
      isReturnAllowed: layoutStore.isReturnAllowed,
      isQuestionLocked: layoutStore.isQuestionLocked,
      questionFixedTime: layoutStore.questionFixedTime?.toISO() || null,
      previewImage,
      commentary: { general: "", symbols: {} }, // Добавляем заглушку, позже подключим
    };

    const waerDateTime = layoutStore.questionFixedTime
      ? getWaerDateTimeString(layoutStore.questionFixedTime)
      : getWaerDateTimeString(DateTime.now());
    const waerDateString = `дня_${waerDateTime.waerDay}_месяца_${
      waerDateTime.waerMonth
    }_${waerDateTime.waerDayOfYear}_года_${
      waerDateTime.waerYear
    }_в_${waerDateTime.waerTime.replace(/:/g, "_")}`;

    const savedRecord = historyStore.divinationHistory.find(
      (record) =>
        JSON.stringify(record.layout) === JSON.stringify(layoutStore.layout)
    );
    const baseName = savedRecord?.title
      ? `${savedRecord.title} (${layoutStore.question})`
      : `Расклад (${layoutStore.question})`;
    const titlePart = baseName
      .replace(/[^a-zA-Z0-9а-яА-ЯёЁ\s()]/g, "")
      .replace(/\s+/g, "_");
    const fileName = `${titlePart}_${waerDateString}.xrlo`; // Изменили расширение на .xrlo

    const json = JSON.stringify(divination, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportDivination = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        layoutStore.setQuestion(importedData.question || "");
        layoutStore.setLayout(importedData.layout || []);

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

        if (importedData.symbols && importedData.symbols.length > 0) {
          layoutStore.setSymbols(
            syncSymbolsWithLayout(importedData.layout, importedData.symbols)
          );
        } else {
          const drawnIds = (importedData.layout || []).map((node) => node.id);
          const updatedSymbols = GodsAskingToolset.map((item) => ({
            id: item.id,
            symbol: item.symbol,
            isRune: item.isRune,
            indexInJar: item.indexInJar,
            drawn: drawnIds.includes(item.id),
            revealed: false,
          }));
          layoutStore.setSymbols(
            syncSymbolsWithLayout(
              importedData.layout,
              sortOrShuffleSymbols(
                updatedSymbols,
                importedData.question || "",
                layoutStore.isProtocolMode
              )
            )
          );
        }

        layoutStore.setGroups(importedData.groups || []);
        layoutStore.setDrawMode(importedData.drawMode || "with-return");
        layoutStore.setIsReturnAllowed(importedData.isReturnAllowed || false);
        layoutStore.setIsQuestionLocked(importedData.isQuestionLocked || false);
        if (importedData.questionFixedTime) {
          layoutStore.setQuestionFixedTime(
            DateTime.fromISO(importedData.questionFixedTime)
          );
        } else {
          layoutStore.setQuestionFixedTime(null);
        }
        if (importedData.stagePosition) {
          setStagePosition(importedData.stagePosition);
        }
      } catch (error) {
        console.error("Error importing divination:", error);
        alert("Ошибка при импорте файла. Убедитесь, что это корректный JSON.");
      }
    };
    reader.readAsText(file);
  };

  return {
    handleSaveDivination,
    handleExportDivination,
    handleImportDivination,
  };
};
