// src/hooks/useProtocolModeHandler.js
import { useUiStore, useLayoutStore } from "../stores";

export const useProtocolModeHandler = () => {
  const layoutStore = useLayoutStore();
  const { isProtocolMode, setIsProtocolMode } = useUiStore();

  const handleToggleProtocolMode = () => {
    const newMode = !isProtocolMode;
    console.log("Toggling to:", newMode ? "Protocol" : "Divination");
    setIsProtocolMode(newMode);
    if (newMode) {
      // Переключаемся в протокол
      layoutStore.setSymbols((prev) =>
        prev.map((symbol) => ({ ...symbol, revealed: true }))
      );
    } else {
      // Переключаемся в дивинацию
      layoutStore.resetSymbols();
    }
  };

  return { handleToggleProtocolMode };
};
