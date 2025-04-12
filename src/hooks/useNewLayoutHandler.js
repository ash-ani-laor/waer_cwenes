import { useUiStore, useLayoutStore } from "../stores";
import { newQuestion } from "../constants/newQuestion";
import { GodsAskingToolset } from "../constants/godsAskingToolset";
import { sortOrShuffleSymbols } from "../utils/waerUtils";

export const useNewLayoutHandler = ({
  layoutLength,
  setNewLayoutHandler,
  setStagePosition,
}) => {
  const layoutStore = useLayoutStore();
  const {
    setIsConfirmNewLayoutModalOpen,
    setIsHistoryModalOpen,
    setIsEditing,
    setOriginalTimestamp,
    setIsProtocolMode,
  } = useUiStore();

  const handleNewLayout = () => {
    const newSymbols = GodsAskingToolset.map((item) => ({
      id: item.id,
      symbol: item.symbol,
      isRune: item.isRune,
      indexInJar: item.indexInJar,
      drawn: false,
      revealed: false,
    }));

    layoutStore.setLayout([]);
    layoutStore.setGroups([]);
    const newQ = newQuestion();
    layoutStore.setQuestion(newQ);
    layoutStore.setQuestionFixedTime(null);
    layoutStore.setIsQuestionLocked(false);
    layoutStore.setSymbols(sortOrShuffleSymbols(newSymbols, newQ, false));
    layoutStore.setIsBrushActive(false);
    layoutStore.setIsReturnAllowed(false);
    layoutStore.setDrawMode("without-return");
    layoutStore.setLastSavedState();

    setIsEditing(false);
    setOriginalTimestamp(null);
    setIsHistoryModalOpen(false);
    setIsConfirmNewLayoutModalOpen(false);
    setIsProtocolMode(false);

    setStagePosition({ x: 0, y: 0 });
  };

  const handleNewLayoutWithConfirmation = () => {
    if (layoutLength > 0) {
      const handler = {
        confirm: () => {
          handleNewLayout();
          setIsConfirmNewLayoutModalOpen(false);
        },
        cancel: () => {
          setIsConfirmNewLayoutModalOpen(false);
        },
      };
      setNewLayoutHandler(handler);
      setIsConfirmNewLayoutModalOpen(true);
    } else {
      handleNewLayout();
    }
  };

  return { handleNewLayoutWithConfirmation };
};
