// src/components/comment/CommentaryEditor.js
import React, { useState, useRef } from "react";
import { Box, Button, Menu, MenuItem, IconButton, Modal } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TranslateIcon from "@mui/icons-material/Translate";
import NumbersIcon from "@mui/icons-material/Numbers";
import FunctionsIcon from "@mui/icons-material/Functions";
import CalculateIcon from "@mui/icons-material/Calculate";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh"; // Иконка для нового тулзика
import TranslitTool from "../../tools/TranslitTool";
import NumbersTool from "../../tools/NumbersTool";
import IsopsephiaTool from "../../tools/IsopsephiaTool";
import WaerCalculatorTool from "../../tools/WaerCalculatorTool";
import RuneIsopsephiaTool from "../../tools/RuneIsopsephiaTool"; // Импорт нового тулзика

const CommentaryEditor = ({ initialContent, layout, groups, onChange }) => {
  const isGeneral = !layout;
  const [content, setContent] = useState(isGeneral ? initialContent : "");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [toolModal, setToolModal] = useState(null);
  const editorRef = useRef(null);

  const handleContentChange = () => {
    if (!editorRef.current) return;
    const newContent = editorRef.current.innerHTML;
    if (isGeneral) {
      setContent(newContent);
      onChange(newContent);
    } else {
      setContent(newContent);
      onChange({
        ...initialContent,
        [selectedSymbol?.layoutId || "current"]: newContent,
      });
    }
  };

  const handleSymbolSelect = (symbol) => {
    setSelectedSymbol(symbol);
    const newContent = initialContent[symbol.layoutId] || "";
    setContent(newContent);
    if (editorRef.current) {
      editorRef.current.innerHTML = newContent;
      editorRef.current.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    handleMenuClose();
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const addFormatting = (type) => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    let tag;
    switch (type) {
      case "h1":
        tag = "h1";
        break;
      case "h2":
        tag = "h2";
        break;
      case "h3":
        tag = "h3";
        break;
      case "bold":
        tag = "b";
        break;
      case "italic":
        tag = "i";
        break;
      case "strikethrough":
        tag = "s";
        break;
      case "color":
        const span = document.createElement("span");
        span.style.color = "#FF0000";
        range.surroundContents(span);
        break;
      case "highlight":
        const highlight = document.createElement("span");
        highlight.style.backgroundColor = "#FFFF00";
        range.surroundContents(highlight);
        break;
      default:
        return;
    }

    if (tag) {
      const element = document.createElement(tag);
      range.surroundContents(element);
    }
    editorRef.current.focus();
    handleContentChange();
  };

  const insertToolResult = (result) => {
    if (editorRef.current && result) {
      editorRef.current.focus();
      const selection = window.getSelection();
      let range;

      if (selection.rangeCount) {
        range = selection.getRangeAt(0);
      } else {
        range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      range.deleteContents();
      const textNode = document.createTextNode(result);
      range.insertNode(textNode);

      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);

      handleContentChange();
    }
    setToolModal(null);
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    p: 2,
    borderRadius: 2,
  };

  return (
    <Box>
      {!isGeneral && layout && (
        <Box sx={{ mb: 2 }}>
          <Button
            onClick={handleMenuOpen}
            endIcon={<MoreVertIcon />}
            sx={{ textTransform: "none" }}
          >
            {selectedSymbol
              ? `Символ #${selectedSymbol.dropOrder}: ${selectedSymbol.symbol}`
              : "Выбрать символ"}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {layout.map((node) => (
              <MenuItem
                key={node.layoutId}
                onClick={() => handleSymbolSelect(node)}
                sx={{ textTransform: "none" }}
              >
                #{node.dropOrder}: {node.symbol}
              </MenuItem>
            ))}
            {groups.map((group) => (
              <MenuItem
                key={group.groupId}
                onClick={() =>
                  handleSymbolSelect({
                    layoutId: `group-${group.groupId}`,
                    symbol: `Группа #${group.groupId}`,
                  })
                }
                sx={{ textTransform: "none" }}
              >
                Группа #{group.groupId}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}
      <Box
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        sx={{
          border: "1px solid #4B536E",
          p: 1,
          minHeight: 200,
          outline: "none",
          "&:focus": { borderColor: "#5B638E" },
          whiteSpace: "pre-wrap",
          ...(selectedSymbol &&
            !isGeneral && {
              borderLeft: "4px solid #D4A017",
              pl: 2,
            }),
        }}
      />
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <Button onClick={() => addFormatting("h1")}>H1</Button>
        <Button onClick={() => addFormatting("h2")}>H2</Button>
        <Button onClick={() => addFormatting("h3")}>H3</Button>
        <Button onClick={() => addFormatting("bold")}>B</Button>
        <Button onClick={() => addFormatting("italic")}>I</Button>
        <Button onClick={() => addFormatting("strikethrough")}>S</Button>
        <Button onClick={() => addFormatting("color")}>Цвет</Button>
        <Button onClick={() => addFormatting("highlight")}>Выделить</Button>
        <IconButton onClick={() => setToolModal("translit")}>
          <TranslateIcon />
        </IconButton>
        <IconButton onClick={() => setToolModal("numbers")}>
          <NumbersIcon />
        </IconButton>
        <IconButton onClick={() => setToolModal("isopsephia")}>
          <FunctionsIcon />
        </IconButton>
        <IconButton onClick={() => setToolModal("calculator")}>
          <CalculateIcon />
        </IconButton>
        <IconButton onClick={() => setToolModal("runeIsopsephia")}>
          <AutoFixHighIcon />
        </IconButton>
      </Box>

      <Modal open={toolModal === "translit"} onClose={() => setToolModal(null)}>
        <Box sx={modalStyle}>
          <TranslitTool
            onClose={() => setToolModal(null)}
            onResult={insertToolResult}
          />
        </Box>
      </Modal>
      <Modal open={toolModal === "numbers"} onClose={() => setToolModal(null)}>
        <Box sx={modalStyle}>
          <NumbersTool
            onClose={() => setToolModal(null)}
            onResult={insertToolResult}
          />
        </Box>
      </Modal>
      <Modal
        open={toolModal === "isopsephia"}
        onClose={() => setToolModal(null)}
      >
        <Box sx={modalStyle}>
          <IsopsephiaTool onClose={() => setToolModal(null)} />
        </Box>
      </Modal>
      <Modal
        open={toolModal === "calculator"}
        onClose={() => setToolModal(null)}
      >
        <Box sx={modalStyle}>
          <WaerCalculatorTool
            onClose={() => setToolModal(null)}
            onResult={insertToolResult}
          />
        </Box>
      </Modal>
      <Modal
        open={toolModal === "runeIsopsephia"}
        onClose={() => setToolModal(null)}
      >
        <Box sx={modalStyle}>
          <RuneIsopsephiaTool
            onClose={() => setToolModal(null)}
            onResult={insertToolResult}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default CommentaryEditor;
