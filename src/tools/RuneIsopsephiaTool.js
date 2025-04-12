// src/tools/RuneIsopsephiaTool.js
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormLabel,
  Stack,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { XoggRune } from "../utils/xoggrune";
import {
  runeIsopsephia,
  latinToRune,
  teqValues,
  trigrams,
} from "../constants/godsAskingToolset";

const X = new XoggRune();

// Преобразование числа в троичную систему с символами Кроули/Джиллиса
const toBase3WithSymbols = (num) => {
  if (num === 0) return "0";
  let digits = [];
  while (num > 0) {
    digits.push(num % 3);
    num = Math.floor(num / 3);
  }
  return digits
    .reverse()
    .map((d) => (d === 0 ? "0" : d === 1 ? "+" : "-"))
    .join("");
};

// Преобразование троичного числа в десятичное
const base3ToBase10 = (base3Str) => {
  let value = 0;
  for (let i = 0; i < base3Str.length; i++) {
    const digit = base3Str[i] === "0" ? 0 : base3Str[i] === "+" ? 1 : 2;
    value += digit * Math.pow(3, base3Str.length - 1 - i);
  }
  return value;
};

// Преобразование числа в 17-ричную систему
const toBase17 = (num) => {
  if (num === 0) return "0";
  const digits = "0123456789ABCDEFG";
  let result = "";
  while (num > 0) {
    result = digits[num % 17] + result;
    num = Math.floor(num / 17);
  }
  return result;
};

// Вычисление antigram и inverted trigram
const getAntigram = (trigram) => {
  return trigram
    .split("")
    .map((char) => (char === "+" ? "-" : char === "-" ? "+" : char))
    .join("");
};

const getInvertedTrigram = (trigram) => {
  return trigram.split("").reverse().join("");
};

const RuneIsopsephiaTool = ({ onClose, onResult }) => {
  const [inputText, setInputText] = useState("");
  const [customIsopsephia, setCustomIsopsephia] = useState(0);
  const [teqIsopsephia, setTeqIsopsephia] = useState(0);
  const [teqBase3, setTeqBase3] = useState("");
  const [teqBase3Decimal, setTeqBase3Decimal] = useState(0);
  const [teqTrigram, setTeqTrigram] = useState("");
  const [teqLetter, setTeqLetter] = useState("");
  const [teqAntigram, setTeqAntigram] = useState("");
  const [teqAntigramValue, setTeqAntigramValue] = useState(0);
  const [teqInvertedTrigram, setTeqInvertedTrigram] = useState("");
  const [teqInvertedValue, setTeqInvertedValue] = useState(0);
  const [queenBase17, setQueenBase17] = useState("");
  const [xoggrunaIsopsephia, setXoggrunaIsopsephia] = useState(0);
  const [copiedCustom, setCopiedCustom] = useState(false);
  const [copiedTeq, setCopiedTeq] = useState(false);
  const [copiedTeqBase3, setCopiedTeqBase3] = useState(false);
  const [copiedTeqAntigram, setCopiedTeqAntigram] = useState(false);
  const [copiedTeqInverted, setCopiedTeqInverted] = useState(false);
  const [copiedQueenBase17, setCopiedQueenBase17] = useState(false);
  const [copiedXoggruna, setCopiedXoggruna] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputText(value);

    // Преобразуем латинский текст (например, "alu") в руны
    let runeText = "";
    const latinTextNoSpaces = value.toLowerCase().replace(/[^a-z]/g, ""); // Для Ваэрской Изопсефии Рун без пробелов
    for (const char of latinTextNoSpaces) {
      const rune = latinToRune[char];
      if (rune) {
        runeText += rune;
      }
    }

    // Ваэрская Изопсефия Рун (по твоему варианту, без пробелов)
    let customSum = 0;
    for (const char of runeText) {
      if (runeIsopsephia[char]) {
        customSum += runeIsopsephia[char].value;
      }
    }
    setCustomIsopsephia(customSum);

    // TEQ Изопсефия (по Джиллису)
    let teqSum = 0;
    const latinTextNoSpacesForTeq = value.toUpperCase().replace(/[^A-Z]/g, ""); // Только буквы для TEQ
    for (const char of latinTextNoSpacesForTeq) {
      if (teqValues[char]) {
        teqSum += teqValues[char];
      }
    }
    setTeqIsopsephia(teqSum);

    // TEQ в троичной системе (без модуля 27)
    const teqBase3Value = toBase3WithSymbols(teqSum);
    setTeqBase3(teqBase3Value);
    setTeqBase3Decimal(base3ToBase10(teqBase3Value));

    // TEQ Trigram (по модулю 27 для триграммы)
    const teqMod = teqSum % 27;
    const trigramData = trigrams.find((t) => t.value === teqMod);
    setTeqTrigram(trigramData ? trigramData.trigram : "");
    setTeqLetter(trigramData ? trigramData.letter : "");

    // Antigram и Inverted Trigram
    if (trigramData) {
      const antigram = getAntigram(trigramData.trigram);
      const inverted = getInvertedTrigram(trigramData.trigram);
      const antigramData = trigrams.find((t) => t.trigram === antigram);
      const invertedData = trigrams.find((t) => t.trigram === inverted);
      setTeqAntigram(antigram);
      setTeqAntigramValue(antigramData ? antigramData.value : 0);
      setTeqInvertedTrigram(inverted);
      setTeqInvertedValue(invertedData ? invertedData.value : 0);
    } else {
      setTeqAntigram("");
      setTeqAntigramValue(0);
      setTeqInvertedTrigram("");
      setTeqInvertedValue(0);
    }

    // Исчисление Королевы (основание 17)
    setQueenBase17(toBase17(teqSum));

    // Xoggruna Isopsephia (пока заглушка)
    setXoggrunaIsopsephia(0);

    setCopiedCustom(false);
    setCopiedTeq(false);
    setCopiedTeqBase3(false);
    setCopiedTeqAntigram(false);
    setCopiedTeqInverted(false);
    setCopiedQueenBase17(false);
    setCopiedXoggruna(false);
  };

  const handleReset = () => {
    setInputText("");
    setCustomIsopsephia(0);
    setTeqIsopsephia(0);
    setTeqBase3("");
    setTeqBase3Decimal(0);
    setTeqTrigram("");
    setTeqLetter("");
    setTeqAntigram("");
    setTeqAntigramValue(0);
    setTeqInvertedTrigram("");
    setTeqInvertedValue(0);
    setQueenBase17("");
    setXoggrunaIsopsephia(0);
    setCopiedCustom(false);
    setCopiedTeq(false);
    setCopiedTeqBase3(false);
    setCopiedTeqAntigram(false);
    setCopiedTeqInverted(false);
    setCopiedQueenBase17(false);
    setCopiedXoggruna(false);
  };

  const handleCopy = (field) => {
    let value;
    switch (field) {
      case "custom":
        value = customIsopsephia;
        break;
      case "teq":
        value = teqIsopsephia;
        break;
      case "teqBase3":
        value = teqBase3;
        break;
      case "teqAntigram":
        value = teqAntigram;
        break;
      case "teqInverted":
        value = teqInvertedTrigram;
        break;
      case "queenBase17":
        value = queenBase17;
        break;
      case "xoggruna":
        value = xoggrunaIsopsephia;
        break;
      default:
        return;
    }
    navigator.clipboard.writeText(value.toString());
    if (field === "custom") setCopiedCustom(true);
    else if (field === "teq") setCopiedTeq(true);
    else if (field === "teqBase3") setCopiedTeqBase3(true);
    else if (field === "teqAntigram") setCopiedTeqAntigram(true);
    else if (field === "teqInverted") setCopiedTeqInverted(true);
    else if (field === "queenBase17") setCopiedQueenBase17(true);
    else setCopiedXoggruna(true);
  };

  const handleInsert = () => {
    if (onResult) {
      onResult(
        `Ваэрская Изопсефия Рун: ${customIsopsephia}, TEQ Изопсефия: ${teqIsopsephia} (Base3: ${teqBase3} [${teqBase3Decimal}], Trigram: ${teqTrigram}, Letter: ${teqLetter}, Antigram: ${teqAntigram} [${teqAntigramValue}], Inverted: ${teqInvertedTrigram} [${teqInvertedValue}], Исчисление Королевы (основание 17): ${queenBase17}), Xoggruna: ${xoggrunaIsopsephia}`
      );
    }
  };

  return (
    <Box sx={{ width: 400, p: 2 }}>
      <FormLabel sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 1 }}>
        Изопсефия рун
      </FormLabel>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <TextField
          placeholder="Введите руны или латинские буквы (например, ᚠᚢᚦ или alu)"
          value={inputText}
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
              label="Ваэрская Изопсефия Рун"
              value={customIsopsephia}
              InputProps={{ readOnly: true }}
            />
            <IconButton
              size="small"
              onClick={() => handleCopy("custom")}
              disabled={copiedCustom || inputText.length === 0}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="TEQ Изопсефия"
                value={teqIsopsephia}
                InputProps={{ readOnly: true }}
              />
              <IconButton
                size="small"
                onClick={() => handleCopy("teq")}
                disabled={copiedTeq || inputText.length === 0}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="TEQ Base 3"
                value={`${teqBase3} (${teqBase3Decimal})`}
                InputProps={{ readOnly: true }}
              />
              <IconButton
                size="small"
                onClick={() => handleCopy("teqBase3")}
                disabled={copiedTeqBase3 || inputText.length === 0}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="TEQ Trigram"
                value={teqTrigram}
                InputProps={{ readOnly: true }}
              />
              <TextField
                size="small"
                label="Letter"
                value={teqLetter}
                InputProps={{ readOnly: true }}
                sx={{ width: "60px" }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="TEQ Antigram"
                value={`${teqAntigram} (${teqAntigramValue})`}
                InputProps={{ readOnly: true }}
              />
              <IconButton
                size="small"
                onClick={() => handleCopy("teqAntigram")}
                disabled={copiedTeqAntigram || inputText.length === 0}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="TEQ Inverted Trigram"
                value={`${teqInvertedTrigram} (${teqInvertedValue})`}
                InputProps={{ readOnly: true }}
              />
              <IconButton
                size="small"
                onClick={() => handleCopy("teqInverted")}
                disabled={copiedTeqInverted || inputText.length === 0}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="Исчисление Королевы (основание 17)"
                value={queenBase17}
                InputProps={{ readOnly: true }}
              />
              <IconButton
                size="small"
                onClick={() => handleCopy("queenBase17")}
                disabled={copiedQueenBase17 || inputText.length === 0}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="Xoggruna Isopsephia"
              value={xoggrunaIsopsephia}
              InputProps={{ readOnly: true }}
            />
            <IconButton
              size="small"
              onClick={() => handleCopy("xoggruna")}
              disabled={copiedXoggruna || inputText.length === 0}
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
            disabled={inputText.length === 0}
          >
            Очистить
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleInsert}
            disabled={inputText.length === 0}
          >
            Вставить
          </Button>
          <Button size="small" variant="outlined" onClick={onClose}>
            Закрыть
          </Button>
        </Stack>
        <Box sx={{ mt: 2, fontSize: "0.75rem", color: "text.secondary" }}>
          Revealed in the Book of Mutations by Leo R. Gilles, the Saint of the
          EGC proclaimed so in the Wet Emptiness' desert. May you (or the memory
          of you) live long, hail You the King and let your labor, important to
          the people who are inspired by Thelema, be spread, known, and
          practiced.
        </Box>
      </Box>
    </Box>
  );
};

export default RuneIsopsephiaTool;
