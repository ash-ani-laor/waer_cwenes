// src/stores/uiStore.js
import { create } from "zustand";
import { DateTime } from "luxon";

export const useUiStore = create((set) => ({
  currentTime: DateTime.now(),
  isHistoryModalOpen: false,
  isSaveModalOpen: false,
  isConfirmLoadModalOpen: false,
  isConfirmNewLayoutModalOpen: false,
  deleteModalOpen: false,
  divinationToLoad: null,
  isProtocolMode: false,
  isDeleteMode: false,
  isDeleteModalOpen: false,
  isEditing: false,
  originalTimestamp: null,
  selectedDate: null, // ← Новое поле для выбранной даты
  setCurrentTime: (time) => set({ currentTime: time }),
  setIsHistoryModalOpen: (open) => set({ isHistoryModalOpen: open }),
  setSaveModalOpen: (open) => set({ isSaveModalOpen: open }),
  setIsConfirmLoadModalOpen: (open) => set({ isConfirmLoadModalOpen: open }),
  setIsConfirmNewLayoutModalOpen: (open) =>
    set({ isConfirmNewLayoutModalOpen: open }),
  setDeleteModalOpen: (open) => set({ deleteModalOpen: open }),
  setDivinationToLoad: (divination) => set({ divinationToLoad: divination }),
  setIsProtocolMode: (mode) => set({ isProtocolMode: mode }),
  setIsDeleteMode: (mode) => set({ isDeleteMode: mode }),
  setIsDeleteModalOpen: (mode) => set({ isDeleteModalOpen: mode }),
  setIsEditing: (isEditing) => set({ isEditing }),
  setOriginalTimestamp: (timestamp) => set({ originalTimestamp: timestamp }),
  setSelectedDate: (date) => set({ selectedDate: date }), // ← Новый метод
}));
