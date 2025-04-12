// src/tools/NumbersTool.js
import React, { useState } from "react";
import {
  TextField,
  Box,
  Button,
  Stack,
  FormLabel,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { XoggRune } from "../utils/xoggrune";

const isNumeric = (str) => {
  if (typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
};

const X = new XoggRune();

export default function NumbersTool({ onClose, onResult }) {
  const initialOutputs = {
    decimal: "",
    hexadecimal: "",
    beautiful: "",
    unicode: "",
  };
  const [outputs, setOutputs] = useState(initialOutputs);
  const [currentInput, setCurrentInput] = useState("");
  const [copiedFields, setCopiedFields] = useState({
    decimal: false,
    hexadecimal: false,
    beautiful: false,
    unicode: false,
  });

  const handleSelectInput = (e) => {
    let id = e.target.id;
    if (currentInput === "") {
      setCurrentInput(id);
    }
  };

  const handleInputChange = (e) => {
    let value = e.target.value;
    let outputState = {};
    switch (currentInput) {
      case "decimal":
        if (isNumeric(value)) {
          outputState.decimal = value;
          outputState.hexadecimal = parseInt(value).toString(12);
          outputState.beautiful = X.Decimal2XoggvaNumber(value, 1);
          outputState.unicode = X.Decimal2XoggvaNumber(value, 2);
        } else {
          outputState.decimal = value;
          outputState.hexadecimal = "error";
          outputState.beautiful = "error";
          outputState.unicode = "error";
        }
        break;
      case "hexadecimal":
        let decval = parseInt(value, 12);
        if (!isNaN(decval)) {
          outputState.hexadecimal = value;
          outputState.decimal = decval.toString();
          outputState.beautiful = X.Decimal2XoggvaNumber(decval, 1);
          outputState.unicode = X.Decimal2XoggvaNumber(decval, 2);
        } else {
          outputState.hexadecimal = value;
          outputState.decimal = "error";
          outputState.beautiful = "error";
          outputState.unicode = "error";
        }
        break;
      case "beautiful":
        outputState.beautiful = value;
        outputState.decimal = X.XoggvaIsopsephiaToDecimalInt(value);
        outputState.hexadecimal = parseInt(outputState.decimal).toString(12);
        outputState.unicode = X.Decimal2XoggvaNumber(outputState.decimal, 2);
        break;
      case "unicode":
        outputState.unicode = value;
        outputState.decimal = X.XoggvaIsopsephiaToDecimalInt(value, true);
        outputState.hexadecimal = parseInt(outputState.decimal).toString(12);
        outputState.beautiful = X.Decimal2XoggvaNumber(outputState.decimal, 1);
        break;
      default:
    }
    setOutputs(outputState);
    setCopiedFields({
      decimal: false,
      hexadecimal: false,
      beautiful: false,
      unicode: false,
    });
  };

  const handleAnewClick = () => {
    setOutputs(initialOutputs);
    setCurrentInput("");
    setCopiedFields({
      decimal: false,
      hexadecimal: false,
      beautiful: false,
      unicode: false,
    });
  };

  const handleCopy = (field) => {
    navigator.clipboard.writeText(outputs[field]);
    setCopiedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleInsert = () => {
    if (onResult && outputs[currentInput]) {
      onResult(outputs[currentInput]);
    }
  };

  return (
    <Box sx={{ width: 400, p: 2 }}>
      <FormLabel sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 1 }}>
        Преобразование чисел
      </FormLabel>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Stack spacing={1} sx={{ alignItems: "center", width: "100%" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="0"
            value={outputs.decimal}
            id="decimal"
            onChange={handleInputChange}
            slotProps={{
              input: {
                readOnly: currentInput !== "decimal",
                endAdornment: (
                  <>
                    {currentInput === "" && (
                      <Button
                        size="small"
                        id="decimal"
                        onClick={handleSelectInput}
                      >
                        Use
                      </Button>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleCopy("decimal")}
                      disabled={copiedFields.decimal || !outputs.decimal}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </>
                ),
              },
            }}
          />
          <TextField
            fullWidth
            size="small"
            placeholder="0"
            value={outputs.hexadecimal}
            id="hexadecimal"
            onChange={handleInputChange}
            slotProps={{
              input: {
                readOnly: currentInput !== "hexadecimal",
                endAdornment: (
                  <>
                    {currentInput === "" && (
                      <Button
                        size="small"
                        id="hexadecimal"
                        onClick={handleSelectInput}
                      >
                        Use
                      </Button>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleCopy("hexadecimal")}
                      disabled={
                        copiedFields.hexadecimal || !outputs.hexadecimal
                      }
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </>
                ),
              },
            }}
          />
          <TextField
            fullWidth
            size="small"
            placeholder="ф"
            value={outputs.beautiful}
            id="beautiful"
            onChange={handleInputChange}
            slotProps={{
              input: {
                readOnly: currentInput !== "beautiful",
                endAdornment: (
                  <>
                    {currentInput === "" && (
                      <Button
                        size="small"
                        id="beautiful"
                        onClick={handleSelectInput}
                      >
                        Use
                      </Button>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleCopy("beautiful")}
                      disabled={copiedFields.beautiful || !outputs.beautiful}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </>
                ),
              },
            }}
          />
          <TextField
            fullWidth
            size="small"
            placeholder="ϟ"
            value={outputs.unicode}
            id="unicode"
            onChange={handleInputChange}
            slotProps={{
              input: {
                readOnly: currentInput !== "unicode",
                endAdornment: (
                  <>
                    {currentInput === "" && (
                      <Button
                        size="small"
                        id="unicode"
                        onClick={handleSelectInput}
                      >
                        Use
                      </Button>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleCopy("unicode")}
                      disabled={copiedFields.unicode || !outputs.unicode}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </>
                ),
              },
            }}
          />
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Button size="small" variant="contained" onClick={handleAnewClick}>
              Заново
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleInsert}
              disabled={!outputs[currentInput]}
            >
              Вставить
            </Button>
            <Button size="small" variant="outlined" onClick={onClose}>
              Закрыть
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
