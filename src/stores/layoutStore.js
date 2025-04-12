//src\stores\layoutStore.js
import { create } from "zustand";
import { DateTime } from "luxon";
import { mysticalSeeder } from "../utils/mysticalSeeder";
import { GodsAskingToolset } from "../constants/godsAskingToolset";
import { newQuestion } from "../constants/newQuestion";

export const useLayoutStore = create((set, get) => {
  // Перемешиваем символы при инициализации
  const initialQuestion = newQuestion();
  const currentDateTime = DateTime.now().toISO();
  const shuffledIndices = mysticalSeeder(initialQuestion, currentDateTime);
  const initialSymbols = shuffledIndices.map((index) => {
    const toolsetItem = GodsAskingToolset.find(
      (item) => item.indexInJar === index
    );
    return {
      id: toolsetItem.id,
      symbol: toolsetItem.symbol,
      isRune: toolsetItem.isRune,
      indexInJar: toolsetItem.indexInJar,
      drawn: false,
      revealed: false,
    };
  });

  return {
    question: initialQuestion,
    questionFixedTime: null,
    symbols: initialSymbols,
    layout: [],
    groups: [],
    lastSavedLayout: [],
    lastSavedGroups: [],
    drawMode: "without-return",
    isReturnAllowed: false,
    isBrushActive: false,
    isQuestionLocked: false,
    setQuestion: (question) => set({ question }),
    setQuestionFixedTime: (time) => set({ questionFixedTime: time }),
    setSymbols: (symbolsOrFn) =>
      set((state) => ({
        symbols:
          typeof symbolsOrFn === "function"
            ? symbolsOrFn(state.symbols)
            : symbolsOrFn,
      })),
    setLayout: (layoutOrFn) =>
      set((state) => ({
        layout:
          typeof layoutOrFn === "function"
            ? layoutOrFn(state.layout)
            : layoutOrFn,
      })),
    setGroups: (groupsOrFn) =>
      set((state) => ({
        groups:
          typeof groupsOrFn === "function"
            ? groupsOrFn(state.groups)
            : groupsOrFn,
      })),
    setLastSavedState: () =>
      set((state) => ({
        lastSavedLayout: JSON.parse(JSON.stringify(state.layout)),
        lastSavedGroups: JSON.parse(JSON.stringify(state.groups)),
      })),
    isLayoutChanged: () => {
      const state = get();
      return (
        JSON.stringify(state.layout) !==
          JSON.stringify(state.lastSavedLayout) ||
        JSON.stringify(state.groups) !== JSON.stringify(state.lastSavedGroups)
      );
    },
    setDrawMode: (drawMode) => set({ drawMode }),
    setIsReturnAllowed: (isReturnAllowed) => set({ isReturnAllowed }),
    setIsBrushActive: (isBrushActive) => set({ isBrushActive }),
    setIsQuestionLocked: (isQuestionLocked) => set({ isQuestionLocked }),
    resetSymbols: () =>
      set((state) => {
        const currentDateTime = DateTime.now().toISO();
        const shuffledIndices = mysticalSeeder(state.question, currentDateTime);
        const updatedSymbols = shuffledIndices.map((index) => {
          const toolsetItem = GodsAskingToolset.find(
            (item) => item.indexInJar === index
          );
          return {
            id: toolsetItem.id,
            symbol: toolsetItem.symbol,
            isRune: toolsetItem.isRune,
            indexInJar: toolsetItem.indexInJar,
            drawn: false,
            revealed: false,
          };
        });
        return { symbols: updatedSymbols };
      }),
    setNodeRole: (layoutId, role) =>
      set((state) => ({
        layout: state.layout.map((node) =>
          node.layoutId === layoutId ? { ...node, role } : node
        ),
      })),
  };
});
