// src/tools/DateConverterTool.js
import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { XoggRune } from "../utils/xoggrune";
import {
  convertToWaerDate,
  convertToWaerTime,
  convertFromWaerDate,
  convertFromWaerTime,
  getWaerDateTimeString,
} from "../utils/dateUtils";
import { useUiStore } from "../stores";

const DateConverterTool = ({ onClose }) => {
  const xoggRune = new XoggRune();
  const initialGregorianDate = DateTime.now();
  const [gregorianInput, setGregorianInput] = useState("");
  const [waerInput, setWaerInput] = useState("");
  const [waerXoggvaInput, setWaerXoggvaInput] = useState("");
  const selectedDate = useUiStore((state) => state.selectedDate);

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toFormat("dd-MM-yyyy HH:mm:ss");
      setGregorianInput(formattedDate);
      handleConvertGregorianToWaer(formattedDate);
    } else {
      const saved = localStorage.getItem("dateConverterTool");
      if (saved) {
        const { gregorianInput: savedGregorian } = JSON.parse(saved);
        setGregorianInput(savedGregorian);
        handleConvertGregorianToWaer(savedGregorian);
      } else {
        const initial = initialGregorianDate.toFormat("dd-MM-yyyy HH:mm:ss");
        setGregorianInput(initial);
        handleConvertGregorianToWaer(initial);
      }
    }
  }, [selectedDate]);

  const saveToLocalStorage = (gregorian, waer) => {
    localStorage.setItem(
      "dateConverterTool",
      JSON.stringify({ gregorianInput: gregorian, waerInput: waer })
    );
  };

  const handleConvertGregorianToWaer = (value) => {
    console.log("Converting gregorian:", value); // Отладочный лог
    if (!value || typeof value !== "string") {
      alert(
        "Пожалуйста, введите корректную дату в формате ДД-ММ-ГГГГ ЧЧ:ММ:СС"
      );
      return;
    }

    const newDate = DateTime.fromFormat(value.trim(), "dd-MM-yyyy HH:mm:ss");
    if (newDate.isValid) {
      const waerDate = convertToWaerDate(newDate);
      const waerTime = convertToWaerTime(newDate);
      const formattedWaerDateTime = `${waerDate.waerDay
        .toString()
        .padStart(2, "0")}-${waerDate.waerMonth
        .toString()
        .padStart(2, "0")}-${waerDate.waerYear
        .toString()
        .padStart(4, "0")} ${waerTime.waerHour
        .toString()
        .padStart(2, "0")}:${waerTime.waerMinute
        .toString()
        .padStart(2, "0")}:${waerTime.waerSecond.toString().padStart(2, "0")}`;
      setWaerInput(formattedWaerDateTime);

      const waerXoggva = getWaerDateTimeString(newDate);
      const formattedWaerXoggva = `${waerXoggva.waerDay}-${waerXoggva.waerMonth}-${waerXoggva.waerYear} ${waerXoggva.waerTime}`;
      setWaerXoggvaInput(formattedWaerXoggva);

      saveToLocalStorage(value, formattedWaerDateTime);
    } else {
      console.log("Invalid date:", value); // Отладочный лог для невалидной даты
      alert("Некорректные обычные дата и время! Формат: ДД-ММ-ГГГГ ЧЧ:ММ:СС");
    }
  };

  const handleConvertWaerToGregorian = () => {
    const [datePart, timePart] = waerInput.split(" ");
    const [day, month, year] = datePart.split("-").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);

    const gregorianDate = convertFromWaerDate(year, month, day);
    const gregorianTime = convertFromWaerTime(hour, minute, second, 0);

    if (gregorianDate && gregorianTime) {
      const newDate = DateTime.fromObject({
        year: gregorianDate.year,
        month: gregorianDate.month,
        day: gregorianDate.day,
        hour: gregorianTime.hour,
        minute: gregorianTime.minute,
        second: gregorianTime.second,
      });
      const formattedGregorian = newDate.toFormat("dd-MM-yyyy HH:mm:ss");
      setGregorianInput(formattedGregorian);
      saveToLocalStorage(formattedGregorian, waerInput);
    } else {
      alert("Некорректные ваэрские дата и время!");
    }
  };

  const handleGregorianChange = (e) => {
    const value = e.target.value;
    setGregorianInput(value);
  };

  const handleWaerChange = (e) => {
    const value = e.target.value;
    setWaerInput(value);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleClear = () => {
    setGregorianInput("");
    setWaerInput("");
    setWaerXoggvaInput("");
    localStorage.removeItem("dateConverterTool");
  };

  const handleSetCurrentTime = () => {
    const currentTime = DateTime.now().toFormat("dd-MM-yyyy HH:mm:ss");
    setGregorianInput(currentTime);
    handleConvertGregorianToWaer(currentTime);
  };

  return (
    <Box sx={{ width: 500, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Преобразование дат и времени
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          label="Обычные дата и время (ДД-ММ-ГГГГ ЧЧ:ММ:СС)"
          value={gregorianInput}
          onChange={handleGregorianChange}
          sx={{ width: "70%" }}
        />
        <TextField
          label="Год день"
          value={
            gregorianInput
              ? DateTime.fromFormat(gregorianInput, "dd-MM-yyyy HH:mm:ss")
                  .ordinal || ""
              : ""
          }
          InputProps={{ readOnly: true }}
          sx={{ width: "30%" }}
        />
      </Box>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button variant="outlined" onClick={() => handleCopy(gregorianInput)}>
          Копировать
        </Button>
        <Button
          variant="contained"
          onClick={() => handleConvertGregorianToWaer(gregorianInput)} // Явно передаём текущее значение
        >
          Конвертировать в Ваэр
        </Button>
      </Box>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          label="Ваэрские дата и время (ДД-ММ-ГГГГ ЧЧ:ММ:СС)"
          value={waerInput}
          onChange={handleWaerChange}
          sx={{ width: "70%" }}
        />
        <TextField
          label="Ваэр день"
          value={
            waerXoggvaInput
              ? getWaerDateTimeString(
                  DateTime.fromFormat(gregorianInput, "dd-MM-yyyy HH:mm:ss")
                ).waerDayOfYear
              : ""
          }
          InputProps={{ readOnly: true }}
          sx={{ width: "30%" }}
        />
      </Box>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button variant="outlined" onClick={() => handleCopy(waerInput)}>
          Копировать
        </Button>
        <Button variant="contained" onClick={handleConvertWaerToGregorian}>
          Конвертировать в Григорианское
        </Button>
      </Box>
      <TextField
        label="Ваэрские дата и время (в ваэрской системе)"
        value={waerXoggvaInput}
        InputProps={{ readOnly: true }}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="outlined" onClick={handleClear}>
          Очистить
        </Button>
        <Button variant="outlined" onClick={handleSetCurrentTime}>
          Текущее время
        </Button>
        <Button variant="contained" onClick={onClose}>
          Закрыть
        </Button>
      </Box>
    </Box>
  );
};

export default DateConverterTool;
