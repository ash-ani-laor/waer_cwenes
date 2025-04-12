// src/tools/CommentaryTool.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  Modal,
} from "@mui/material";
import { useLayoutStore } from "../stores";
import AddIcon from "@mui/icons-material/Add";
import TranslitTool from "./TranslitTool";
import NumbersTool from "./NumbersTool";
import IsopsephiaTool from "./IsopsephiaTool";
import WaerCalculatorTool from "./WaerCalculatorTool";
import DateConverterTool from "./DateConverterTool";

const CommentaryTool = ({ onClose }) => {
  const layoutStore = useLayoutStore();
  const [cells, setCells] = useState([]);
  const [openTool, setOpenTool] = useState(null);
  const [focusedCell, setFocusedCell] = useState(null);

  const handleAddSymbolCell = () => {
    setCells([...cells, { type: "symbol", symbolId: null, content: "" }]);
  };

  const handleAddGeneralCell = () => {
    setCells([...cells, { type: "general", content: "" }]);
  };

  const handleSymbolChange = (index, symbolId) => {
    setCells((prev) =>
      prev.map((cell, i) => (i === index ? { ...cell, symbolId } : cell))
    );
  };

  const handleContentChange = (index, content) => {
    setCells((prev) =>
      prev.map((cell, i) => (i === index ? { ...cell, content } : cell))
    );
  };

  const handleFocus = (index) => {
    if (focusedCell !== null && focusedCell !== index) {
      const prevEditor = cells[focusedCell]?.editor;
      if (prevEditor) {
        prevEditor.blur();
      }
    }
    setFocusedCell(index);
  };

  const handleBlur = () => {
    setFocusedCell(null);
  };

  const handleClickOutside = (event) => {
    const isClickInsideEditor = cells.some((_, index) => {
      const editorContainer = document.querySelector(`.custom-editor-${index}`);
      const toolbarContainer = document.querySelector(
        `.custom-editor-${index} .MuiBox-root`
      );
      return (
        (editorContainer && editorContainer.contains(event.target)) ||
        (toolbarContainer && toolbarContainer.contains(event.target))
      );
    });
    if (!isClickInsideEditor) {
      setFocusedCell(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [focusedCell]);

  const insertToolResult = (toolName, result, index) => {
    setCells((prev) =>
      prev.map((cell, i) =>
        i === index ? { ...cell, content: cell.content + result } : cell
      )
    );
    setOpenTool(null);
  };

  const handleFormat = (index, command) => {
    document.execCommand(command, false, null);
    const editor = document.querySelector(
      `.custom-editor-${index} [contenteditable]`
    );
    if (editor) {
      handleContentChange(index, editor.innerHTML);
    }
  };

  const toolComponents = {
    translit: (
      <TranslitTool
        onClose={() => setOpenTool(null)}
        onResult={(result) => insertToolResult("translit", result, focusedCell)}
      />
    ),
    numbers: (
      <NumbersTool
        onClose={() => setOpenTool(null)}
        onResult={(result) => insertToolResult("numbers", result, focusedCell)}
      />
    ),
    isopsephia: (
      <IsopsephiaTool
        onClose={() => setOpenTool(null)}
        onResult={(result) =>
          insertToolResult("isopsephia", result, focusedCell)
        }
      />
    ),
    calculator: (
      <WaerCalculatorTool
        onClose={() => setOpenTool(null)}
        onResult={(result) =>
          insertToolResult("calculator", result, focusedCell)
        }
      />
    ),
    dateConverter: (
      <DateConverterTool
        onClose={() => setOpenTool(null)}
        onResult={(result) =>
          insertToolResult("dateConverter", result, focusedCell)
        }
      />
    ),
  };

  return (
    <Box sx={{ width: 800, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Комментарии к раскладу
      </Typography>
      {cells.map((cell, index) => (
        <Box
          key={index}
          sx={{ mb: 2, border: "1px solid #ddd", p: 2, borderRadius: 2 }}
        >
          {cell.type === "symbol" && (
            <Select
              value={cell.symbolId || ""}
              onChange={(e) => handleSymbolChange(index, e.target.value)}
              displayEmpty
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="" disabled>
                Выберите символ
              </MenuItem>
              {layoutStore.layout.map((node) => (
                <MenuItem key={node.layoutId} value={node.layoutId}>
                  #{node.dropOrder}: {node.symbol} (Роль:{" "}
                  {node.role || "Не указана"})
                </MenuItem>
              ))}
            </Select>
          )}
          <Box className={`custom-editor-${index}`}>
            {focusedCell === index && (
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <Button onClick={() => handleFormat(index, "bold")}>
                  Bold
                </Button>
                <Button
                  onClick={() => handleFormat(index, "insertUnorderedList")}
                >
                  Bullet List
                </Button>
                <Button onClick={() => setOpenTool("translit")}>🌐</Button>
                <Button onClick={() => setOpenTool("numbers")}>🔢</Button>
                <Button onClick={() => setOpenTool("isopsephia")}>∑</Button>
                <Button onClick={() => setOpenTool("calculator")}>🧮</Button>
                <Button onClick={() => setOpenTool("dateConverter")}>📅</Button>
              </Box>
            )}
            <Box
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => handleContentChange(index, e.target.innerHTML)}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              dangerouslySetInnerHTML={{ __html: cell.content }}
              sx={{
                minHeight: "100px",
                border: "1px solid #ccc",
                padding: "8px",
                "&:focus": { outline: "none", borderColor: "#1976d2" },
              }}
            />
          </Box>
        </Box>
      ))}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button
          variant="outlined"
          onClick={handleAddSymbolCell}
          startIcon={<AddIcon />}
        >
          Добавить ячейку для символа
        </Button>
        <Button
          variant="outlined"
          onClick={handleAddGeneralCell}
          startIcon={<AddIcon />}
        >
          Добавить общую ячейку
        </Button>
      </Box>
      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={onClose}>
          Закрыть
        </Button>
      </Box>
      {openTool && (
        <Modal open={!!openTool} onClose={() => setOpenTool(null)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              p: 2,
              borderRadius: 2,
            }}
          >
            {toolComponents[openTool]}
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default CommentaryTool;
