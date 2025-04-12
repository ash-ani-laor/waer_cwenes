//src\components\GodsAsking\SymbolCard.js
import React from "react";
import { Box, Typography } from "@mui/material";
import { useDrag } from "react-dnd";

export const SymbolCard = ({
  symbol,
  revealed,
  index,
  isRune,
  isDrawn,
  isQuestionLocked,
  isProtocolMode,
}) => {
  const canDrag = isQuestionLocked || (isProtocolMode && isQuestionLocked);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "SYMBOL",
      item: { symbol, index },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      canDrag: () => canDrag,
    }),
    [canDrag]
  );

  // Вычисляем размер кружка
  const circleSize = Math.max(20, Math.min(33, window.innerWidth * 0.05));
  const fontSize = circleSize * 0.6;

  return (
    <Box
      ref={canDrag ? drag : null}
      sx={{
        width: `${circleSize}px`,
        height: `${circleSize}px`,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isRune
          ? "linear-gradient(145deg, #6B728E, #4B536E)"
          : "linear-gradient(145deg, #D4A017, #B48C14)",
        color: isRune ? "#fff" : "#000",
        boxShadow: "0 4px 8px rgba(0,0,0,0.3), 0 0 16px rgba(255,215,0,0.8)",
        border: isRune ? "1px solid #4B536E" : "1px solid #B48C14",
        cursor: canDrag ? "grab" : "not-allowed",
        opacity: isDragging || isDrawn ? 0.5 : 1,
        margin: "0",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "scale(1.15)",
          boxShadow: "0 6px 12px rgba(0,0,0,0.4), 0 0 20px rgba(255,215,0,1)",
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontSize: `${fontSize}px`,
          lineHeight: 1,
        }}
      >
        {isProtocolMode || isDrawn || revealed ? symbol : "Х"}
      </Typography>
    </Box>
  );
};
