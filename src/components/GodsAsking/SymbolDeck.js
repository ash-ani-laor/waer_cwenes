//src\components\GodsAsking\SymbolDeck.js
import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { sortOrShuffleSymbols } from "../../utils/waerUtils";
import { SymbolCard } from "./SymbolCard";

const SymbolDeck = ({
  symbols,
  setSymbols,
  isDivinationMode,
  question,
  reshuffle,
  isQuestionLocked,
  isProtocolMode,
  layout,
}) => {
  const handleReshuffle = () => {
    const updatedSymbols = sortOrShuffleSymbols(
      symbols,
      question,
      isProtocolMode
    );
    setSymbols(updatedSymbols);
  };

  useEffect(() => {
    if (reshuffle) reshuffle.current = handleReshuffle;
  }, [reshuffle, question, layout, symbols]);

  const sortedSymbols = Array.isArray(symbols)
    ? (isProtocolMode
        ? [...symbols].sort((a, b) => a.id - b.id)
        : symbols
      ).filter(
        (sym) =>
          !sym.drawn ||
          (sym.drawn &&
            layout.some((node) => node.id === sym.id && node.isReturned))
      )
    : [];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(11, minmax(0, 33px))",
        height: "450px",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "0.5vw 0.2vw 0.2vw 0.5vw",
        border: "2px solid #4B536E",
        borderRadius: 4,
        background: "linear-gradient(145deg, #2E2E2E, #1A1A1A)",
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)",
        rowGap: "0.1vw",
        columnGap: "0.2vw",
      }}
    >
      {sortedSymbols.map((sym) => (
        <Box
          key={sym.id}
          sx={{
            width: "33px",
            height: "33px",
          }}
        >
          <SymbolCard
            symbol={sym.symbol}
            revealed={sym.revealed}
            index={sym.id}
            isRune={sym.isRune}
            isDrawn={isDivinationMode && sym.drawn}
            isQuestionLocked={isQuestionLocked}
            isProtocolMode={isProtocolMode}
          />
        </Box>
      ))}
    </Box>
  );
};

export default SymbolDeck;
