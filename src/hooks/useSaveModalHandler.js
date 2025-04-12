// src/hooks/useSaveModalHandler.js
import { useUiStore } from "../stores";

export const useSaveModalHandler = () => {
  const setSaveModalOpen = useUiStore((state) => state.setSaveModalOpen);

  const handleOpenSaveModal = () => setSaveModalOpen(true);

  return { handleOpenSaveModal };
};
