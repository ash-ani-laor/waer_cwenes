// src/stores/historyStore.js
import { create } from "zustand";
import {
  loadDivinations,
  saveDivination,
  deleteDivination,
} from "../services/divinationHistory";

export const useHistoryStore = create((set) => ({
  divinationHistory: [],
  tags: [],
  tagInput: "",
  filterTag: "",
  setDivinationHistory: (history) => set({ divinationHistory: history }),
  setTags: (tagsOrFn) =>
    set((state) => ({
      tags: typeof tagsOrFn === "function" ? tagsOrFn(state.tags) : tagsOrFn,
    })),
  setTagInput: (tagInput) => set({ tagInput }),
  setFilterTag: (filterTag) => set({ filterTag }),
  loadHistory: async () => {
    try {
      const history = await loadDivinations();
      set({ divinationHistory: history });
    } catch (error) {
      console.error("Failed to load divinations:", error);
    }
  },
  saveDivinationToHistory: async (divination) => {
    try {
      const {
        question,
        layout,
        tags,
        timestamp,
        groups,
        title,
        questionFixedTime,
        previewImage,
      } = divination;
      const saved = await saveDivination(
        question,
        layout,
        tags,
        timestamp,
        title,
        groups,
        questionFixedTime,
        previewImage
      );
      set((state) => {
        const existingIndex = state.divinationHistory.findIndex(
          (d) =>
            d.question === question && d.questionFixedTime === questionFixedTime
        );
        if (existingIndex !== -1) {
          const updatedHistory = [...state.divinationHistory];
          updatedHistory[existingIndex] = { ...divination, ...saved };
          return { divinationHistory: updatedHistory };
        }
        return {
          divinationHistory: [
            ...state.divinationHistory,
            { ...divination, ...saved },
          ],
        };
      });
    } catch (error) {
      console.error("Failed to save divination:", error);
    }
  },
  editDivination: async (divination) => {
    try {
      const {
        question,
        layout,
        tags,
        timestamp,
        groups,
        title,
        questionFixedTime,
        previewImage,
      } = divination;
      await saveDivination(
        question,
        layout,
        tags,
        timestamp,
        title,
        groups,
        questionFixedTime,
        previewImage
      );
      set((state) => ({
        divinationHistory: state.divinationHistory.map((d) =>
          d.question === question && d.questionFixedTime === questionFixedTime
            ? {
                ...d,
                question,
                layout,
                tags,
                groups,
                title,
                questionFixedTime,
                previewImage,
                timestamp,
              }
            : d
        ),
      }));
    } catch (error) {
      console.error("Failed to edit divination:", error);
    }
  },
  deleteDivinationFromHistory: async (timestamp) => {
    try {
      await deleteDivination(timestamp);
      set((state) => ({
        divinationHistory: state.divinationHistory.filter(
          (d) => d.timestamp !== timestamp
        ),
      }));
      const updatedHistory = await loadDivinations();
      set({ divinationHistory: updatedHistory });
    } catch (error) {
      console.error("Failed to delete divination:", error);
    }
  },
}));
