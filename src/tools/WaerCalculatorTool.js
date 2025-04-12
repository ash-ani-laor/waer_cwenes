// src/tools/WaerCalculatorTool.js
import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Button,
  Select,
  MenuItem,
  FormLabel,
  Stack,
  Typography,
} from "@mui/material";
import { XoggRune } from "../utils/xoggrune";

const X = new XoggRune();

const WaerCalculatorTool = ({ onClose, onResult }) => {
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [displayA, setDisplayA] = useState("");
  const [displayB, setDisplayB] = useState("");
  const [formatA, setFormatA] = useState("decimal");
  const [formatB, setFormatB] = useState("decimal");
  const [operation, setOperation] = useState("+");
  const [result, setResult] = useState("");
  const [resultFormat, setResultFormat] = useState("decimal");
  const [error, setError] = useState("");

  const validCyrillic = X.__xoggvas_cyr_keyboard.join("") + ".";

  const validateAndTranslit = (value, format) => {
    if (!value) return "";
    if (format === "decimal") {
      if (!/^\d+$/.test(value)) throw new Error("Только цифры для Decimal");
      return value;
    }
    if (format === "hexadecimal") {
      if (!/^[0-9a-bA-B]+$/.test(value))
        throw new Error("Только 0-9, a-b для Hexadecimal");
      return value;
    }
    if (![...value].every((char) => validCyrillic.includes(char)))
      throw new Error("Только кириллица для Beautiful/Unicode");
    return format === "beautiful"
      ? X.ChangeTextEncoding(
          value,
          XoggRune.SYMBOLS_BEAUTIFUL,
          XoggRune.SYMBOLS_CYRILLIC
        )
      : X.ChangeTextEncoding(
          value,
          XoggRune.SYMBOLS_UNICODE,
          XoggRune.SYMBOLS_CYRILLIC
        );
  };

  const convertToDecimal = (value, format) => {
    if (!value) return 0;
    switch (format) {
      case "decimal":
        return parseInt(value);
      case "hexadecimal":
        return parseInt(value, 12);
      case "beautiful":
      case "unicode":
        const result = X.XoggvaIsopsephiaToDecimalInt2(
          value,
          XoggRune.SYMBOLS_CYRILLIC
        );
        if (typeof result === "string") throw new Error(result);
        return result;
      default:
        return 0;
    }
  };

  const calculateResult = () => {
    try {
      setError("");
      const numA = convertToDecimal(inputA, formatA);
      const numB = convertToDecimal(inputB, formatB);
      let calcResult;

      switch (operation) {
        case "+":
          calcResult = numA + numB;
          break;
        case "-":
          calcResult = numA - numB;
          break;
        case "×":
          calcResult = numA * numB;
          break;
        case "÷":
          calcResult = numB !== 0 ? numA / numB : "Error: Деление на ноль";
          break;
        default:
          calcResult = 0;
      }

      if (typeof calcResult === "number") {
        switch (resultFormat) {
          case "decimal":
            setResult(calcResult.toString());
            break;
          case "hexadecimal":
            setResult(calcResult.toString(12));
            break;
          case "beautiful":
            setResult(
              X.Decimal2XoggvaNumber(calcResult, XoggRune.SYMBOLS_BEAUTIFUL)
            );
            break;
          case "unicode":
            setResult(
              X.Decimal2XoggvaNumber(calcResult, XoggRune.SYMBOLS_UNICODE)
            );
            break;
        }
      } else {
        setResult(calcResult);
      }
    } catch (e) {
      setError(e.message);
      setResult("");
    }
  };

  useEffect(() => {
    if (inputA && inputB) calculateResult();
  }, [inputA, inputB, formatA, formatB, operation, resultFormat]);

  const handleInputChange = (setter, displaySetter, format) => (e) => {
    const value = e.target.value;
    setter(value);
    setError("");
    try {
      const translitValue = validateAndTranslit(value, format);
      displaySetter(translitValue);
    } catch (e) {
      setError(e.message);
      displaySetter("");
    }
  };

  const handleReset = () => {
    setInputA("");
    setInputB("");
    setDisplayA("");
    setDisplayB("");
    setFormatA("decimal");
    setFormatB("decimal");
    setOperation("+");
    setResult("");
    setResultFormat("decimal");
    setError("");
  };

  const handleInsert = () => {
    if (onResult && result) {
      onResult(result);
    }
  };

  return (
    <Box sx={{ width: 400, p: 2 }}>
      <FormLabel sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 1 }}>
        Ваэрский калькулятор
      </FormLabel>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            label="Число A"
            value={
              formatA === "decimal" || formatA === "hexadecimal"
                ? inputA
                : displayA
            }
            onChange={handleInputChange(setInputA, setDisplayA, formatA)}
            size="small"
            fullWidth
          />
          <Select
            value={formatA}
            onChange={(e) => setFormatA(e.target.value)}
            size="small"
          >
            <MenuItem value="decimal">Decimal</MenuItem>
            <MenuItem value="hexadecimal">Hexadecimal</MenuItem>
            <MenuItem value="beautiful">Beautiful</MenuItem>
            <MenuItem value="unicode">Unicode</MenuItem>
          </Select>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            label="Число B"
            value={
              formatB === "decimal" || formatB === "hexadecimal"
                ? inputB
                : displayB
            }
            onChange={handleInputChange(setInputB, setDisplayB, formatB)}
            size="small"
            fullWidth
          />
          <Select
            value={formatB}
            onChange={(e) => setFormatB(e.target.value)}
            size="small"
          >
            <MenuItem value="decimal">Decimal</MenuItem>
            <MenuItem value="hexadecimal">Hexadecimal</MenuItem>
            <MenuItem value="beautiful">Beautiful</MenuItem>
            <MenuItem value="unicode">Unicode</MenuItem>
          </Select>
        </Box>
        <Select
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
          size="small"
          fullWidth
        >
          <MenuItem value="+">+</MenuItem>
          <MenuItem value="-">-</MenuItem>
          <MenuItem value="×">×</MenuItem>
          <MenuItem value="÷">÷</MenuItem>
        </Select>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            label="Результат"
            value={result}
            size="small"
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <Select
            value={resultFormat}
            onChange={(e) => setResultFormat(e.target.value)}
            size="small"
          >
            <MenuItem value="decimal">Decimal</MenuItem>
            <MenuItem value="hexadecimal">Hexadecimal</MenuItem>
            <MenuItem value="beautiful">Beautiful</MenuItem>
            <MenuItem value="unicode">Unicode</MenuItem>
          </Select>
        </Box>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Button variant="contained" onClick={calculateResult}>
            Посчитать
          </Button>
          <Button variant="contained" onClick={handleReset}>
            Очистить
          </Button>
          <Button variant="contained" onClick={handleInsert} disabled={!result}>
            Вставить
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Закрыть
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default WaerCalculatorTool;
