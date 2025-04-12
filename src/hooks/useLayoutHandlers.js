//src\hooks\useLayoutHandlers.js
import { DateTime } from "luxon";
import { getWaerDateTimeString } from "../utils/waerUtils";

export const useLayoutHandlers = ({
  layoutStore,
  reshuffleRef,
  selectedNodes,
  setSelectedNodes,
  createGroup,
}) => {
  const handleAllowReturn = () => layoutStore.setIsReturnAllowed(true);
  const handleBrushActivate = () => layoutStore.setIsBrushActive(true);
  const handleReturnAll = () => reshuffleRef.current?.();
  const handleQuestionChange = (value) => layoutStore.setQuestion(value);
  const handleLockQuestion = () => {
    layoutStore.setQuestionFixedTime(DateTime.now());
    layoutStore.setIsQuestionLocked(true);
  };
  const handleCreateGroup = () => {
    if (selectedNodes.length >= 2) {
      createGroup(selectedNodes);
      setSelectedNodes([]);
    }
  };

  return {
    handleAllowReturn,
    handleBrushActivate,
    handleReturnAll,
    handleQuestionChange,
    handleLockQuestion,
    handleCreateGroup,
  };
};
