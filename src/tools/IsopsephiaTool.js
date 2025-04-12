// src/tools/IsopsephiaTool.js
import React from "react";
import {
  TextField,
  Box,
  Button,
  Stack,
  FormLabel,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { WaerIsopsephia } from "../utils/isopsephia";

const isPrime = (num) => {
  if (isNaN(num)) return false;
  for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
    if (num % i === 0) return false;
  }
  return num > 1;
};

export default function IsopsephiaTool({ onClose }) {
  // Убрали onResult
  const I = new WaerIsopsephia();
  const [textAreaText, setTextAreaText] = React.useState("");
  const [decimalOutput, setDecimalOutput] = React.useState("0");
  const [hexadecimalOutput, setHexadecimalOutput] = React.useState("0");
  const [beautifulOutput, setBeautifulOutput] = React.useState("ф");
  const [unicodeOutput, setUnicodeOutput] = React.useState("ϟ");
  const [copiedFields, setCopiedFields] = React.useState({
    decimal: false,
    hexadecimal: false,
    beautiful: false,
    unicode: false,
    full: false,
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTextAreaText(value);
    setDecimalOutput(I.textToDecimal(value));
    setHexadecimalOutput(I.textToHexadecimal(value));
    setBeautifulOutput(I.textToBeautiful(value));
    setUnicodeOutput(I.textToUnicode(value));
    setCopiedFields({
      decimal: false,
      hexadecimal: false,
      beautiful: false,
      unicode: false,
      full: false,
    });
  };

  const handleReset = () => {
    setTextAreaText("");
    setDecimalOutput("0");
    setHexadecimalOutput("0");
    setBeautifulOutput("ф");
    setUnicodeOutput("ϟ");
    setCopiedFields({
      decimal: false,
      hexadecimal: false,
      beautiful: false,
      unicode: false,
      full: false,
    });
  };

  const handleCopyOutputOnly = (field) => {
    let textToCopy;
    switch (field) {
      case "decimal":
        textToCopy = `"${textAreaText}"\n${decimalOutput}₁₀`;
        break;
      case "hexadecimal":
        textToCopy = `"${textAreaText}"\n${hexadecimalOutput}₁₂`;
        break;
      case "beautiful":
        textToCopy = `"${textAreaText}"\n${beautifulOutput}`;
        break;
      case "unicode":
        textToCopy = `"${textAreaText}"\n${unicodeOutput}`;
        break;
      default:
        throw new Error("Unknown output type: " + field);
    }
    navigator.clipboard.writeText(textToCopy);
    setCopiedFields((prev) => ({ ...prev, [field]: true }));
  };

  const isOutputPrime = () => {
    const decimalValue = parseInt(I.textToDecimal(textAreaText));
    return isPrime(decimalValue);
  };

  return (
    <Box sx={{ width: 400, p: 2 }}>
      <FormLabel sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 1 }}>
        Преобразование изопсефии
      </FormLabel>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <TextField
          placeholder="Текст кириллицей"
          value={textAreaText}
          onChange={handleInputChange}
          multiline
          minRows={2}
          size="small"
          sx={{ width: "100%" }}
        />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={decimalOutput}
              slotProps={{
                input: {
                  readOnly: true,
                  sx: { color: isOutputPrime() ? "red" : "inherit" },
                },
              }}
            />
            <IconButton
              size="small"
              onClick={() => handleCopyOutputOnly("decimal")}
              disabled={copiedFields.decimal || textAreaText.length === 0}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={hexadecimalOutput}
              slotProps={{
                input: {
                  readOnly: true,
                  sx: { color: isOutputPrime() ? "red" : "inherit" },
                },
              }}
            />
            <IconButton
              size="small"
              onClick={() => handleCopyOutputOnly("hexadecimal")}
              disabled={copiedFields.hexadecimal || textAreaText.length === 0}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={beautifulOutput}
              slotProps={{
                input: {
                  readOnly: true,
                  sx: { color: isOutputPrime() ? "red" : "inherit" },
                },
              }}
            />
            <IconButton
              size="small"
              onClick={() => handleCopyOutputOnly("beautiful")}
              disabled={copiedFields.beautiful || textAreaText.length === 0}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={unicodeOutput}
              slotProps={{
                input: {
                  readOnly: true,
                  sx: { color: isOutputPrime() ? "red" : "inherit" },
                },
              }}
            />
            <IconButton
              size="small"
              onClick={() => handleCopyOutputOnly("unicode")}
              disabled={copiedFields.unicode || textAreaText.length === 0}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Button
            size="small"
            variant="contained"
            onClick={handleReset}
            disabled={textAreaText.length === 0}
          >
            Очистить
          </Button>
          <Button size="small" variant="outlined" onClick={onClose}>
            Закрыть
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
