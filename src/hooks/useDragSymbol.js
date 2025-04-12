//src\hooks\useDragSymbol.js
import { useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import { sortOrShuffleSymbols } from "../utils/waerUtils";

export const useDragSymbol = ({
  layout,
  setLayout,
  symbols,
  setSymbols,
  drawMode,
  isDivinationMode,
  isBrushActive,
  setIsBrushActive,
  reshuffle,
  isReturnAllowed,
  isProtocolMode,
  question,
  stagePos,
}) => {
  const nextIdRef = useRef(0);
  const dragDataRef = useRef(null);

  useEffect(() => {
    if (layout && layout.length > 0) {
      const maxId = Math.max(...layout.map((node) => node.layoutId), 0);
      nextIdRef.current = maxId + 1;
    } else {
      nextIdRef.current = 0;
    }
  }, [layout]);

  const [, drop] = useDrop(
    () => ({
      accept: "SYMBOL",
      drop: (item, monitor) => {
        const offset = monitor.getClientOffset();
        if (!offset) return;
        const dropArea = document
          .getElementById("layout-area")
          .getBoundingClientRect();
        const rawX = offset.x - dropArea.left - 20;
        const rawY = offset.y - dropArea.top - 20;
        const correctedX = rawX - (stagePos?.x || 0);
        const correctedY = rawY - (stagePos?.y || 0);

        const originalSymbol = symbols.find((s) => s.id === item.index);
        if (!originalSymbol || originalSymbol.drawn) return;

        const symbolToUse =
          item.symbol === "Х" ? originalSymbol.symbol : item.symbol;

        const newNode = {
          layoutId: nextIdRef.current,
          id: item.index,
          symbol: symbolToUse,
          role: "Деятель",
          comment: "",
          x: correctedX,
          y: correctedY,
          order: layout.length + 1,
          dropOrder: nextIdRef.current + 1,
          children: [],
          isReturned: false,
          addedBeforeReturn: !isReturnAllowed,
          isRune: originalSymbol?.isRune || false,
          indexInJar: originalSymbol?.indexInJar,
          isNew: true,
        };

        setLayout((prev) => [...prev, newNode]);
        nextIdRef.current += 1;

        setSymbols((prev) =>
          prev.map((s) => (s.id === item.index ? { ...s, drawn: true } : s))
        );

        if (isDivinationMode && drawMode === "without-return") {
          setSymbols((prev) => prev.filter((sym) => sym.id !== item.index));
        }

        return undefined;
      },
    }),
    [isReturnAllowed, symbols, stagePos]
  );

  const handleDrag = (layoutId, x, y) => {
    setLayout((prev) =>
      prev.map((node) =>
        node.layoutId === layoutId ? { ...node, x, y, isNew: false } : node
      )
    );
  };

  const handleDragStart = (layoutId) => {
    dragDataRef.current = { layoutId };
  };

  const handleDragEnd = () => {};

  const handleDoubleClick = (layoutId) => {
    setLayout((prev) => {
      const maxOrder = Math.max(...prev.map((n) => n.order), 0);
      return prev.map((n) =>
        node.layoutId === layoutId ? { ...n, order: maxOrder + 1 } : n
      );
    });
  };

  const handleReturn = (layoutId) => {
    if (!isReturnAllowed) return;
    const nodeToReturn = layout.find((node) => node.layoutId === layoutId);
    if (!nodeToReturn) return;

    setLayout((prev) =>
      prev.map((node) =>
        node.layoutId === layoutId ? { ...node, isReturned: true } : node
      )
    );

    setSymbols((prev) => {
      const existingSymbol = prev.find((s) => s.id === nodeToReturn.id);
      let updatedSymbols;
      if (existingSymbol) {
        updatedSymbols = prev.map((s) =>
          s.id === nodeToReturn.id ? { ...s, drawn: false, returned: true } : s
        );
      } else {
        updatedSymbols = [
          ...prev,
          {
            id: nodeToReturn.id,
            symbol: nodeToReturn.symbol,
            isRune: nodeToReturn.isRune,
            indexInJar: nodeToReturn.indexInJar,
            drawn: false,
            returned: true,
            revealed: isProtocolMode,
          },
        ];
      }
      return sortOrShuffleSymbols(updatedSymbols, question, isProtocolMode);
    });
  };

  return {
    drop,
    handleDrag,
    handleDragStart,
    handleDragEnd,
    handleDoubleClick,
    handleReturn,
  };
};
