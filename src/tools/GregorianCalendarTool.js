// src/tools/GregorianCalendarTool.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Tooltip,
  Button,
} from "@mui/material";
import { DateTime } from "luxon";
import { ArrowBack, ArrowForward, Home } from "@mui/icons-material";
import {
  getWeeksInMonth,
  WeekendStyles,
  convertToWaerDate,
  waerMonths,
} from "../utils/dateUtils";
import { useUiStore } from "../stores";

const GregorianCalendarTool = ({ onClose, openDateConverter }) => {
  const [currentDate, setCurrentDate] = useState(DateTime.now());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showTooltips, setShowTooltips] = useState(true);
  const { selectedDate, setSelectedDate } = useUiStore((state) => ({
    selectedDate: state.selectedDate,
    setSelectedDate: state.setSelectedDate,
  }));

  const weeks = getWeeksInMonth(currentDate);

  useEffect(() => {
    if (selectedDate && !selectedDay) {
      setSelectedDay(selectedDate);
    }
  }, [selectedDate]);

  const handleMonthChange = (delta) => {
    setCurrentDate(currentDate.plus({ months: delta }));
    setSelectedDay(null);
  };

  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value, 10);
    setCurrentDate(currentDate.set({ year: newYear }));
    setSelectedDay(null);
  };

  const handleResetToToday = () => {
    const today = DateTime.now();
    setCurrentDate(today);
    setSelectedDay(today);
    setSelectedDate(today);
  };

  const handleDateSelect = (day) => {
    setSelectedDay(day);
    setSelectedDate(day);
  };

  return (
    <Box sx={{ width: 500, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Григорианский календарь
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 2,
        }}
      >
        <IconButton onClick={() => handleMonthChange(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="subtitle1" sx={{ flex: 1, textAlign: "center" }}>
          {currentDate.toFormat("MMMM yyyy", { locale: "ru" })}
        </Typography>
        <IconButton onClick={() => handleMonthChange(1)}>
          <ArrowForward />
        </IconButton>
        <Select
          value={currentDate.year}
          onChange={handleYearChange}
          size="small"
        >
          {[...Array(100).keys()].map((offset) => (
            <MenuItem key={offset} value={currentDate.year - 50 + offset}>
              {currentDate.year - 50 + offset}
            </MenuItem>
          ))}
        </Select>
        <IconButton onClick={handleResetToToday} title="Сегодня">
          <Home />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={showTooltips}
              onChange={(e) => setShowTooltips(e.target.checked)}
            />
          }
          label="Показывать подсказки"
        />
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            onClose();
            openDateConverter();
          }}
          disabled={!selectedDay}
        >
          Открыть в конвертере
        </Button>
      </Box>
      <Table>
        <TableBody>
          {weeks.map((week, index) => (
            <TableRow key={index}>
              {week.map((day) => {
                const isToday = day.hasSame(DateTime.now(), "day");
                const isWeekend = day.weekday === 6 || day.weekday === 7;
                const isSelected =
                  selectedDay && day.hasSame(selectedDay, "day");
                const waerDate = convertToWaerDate(day);

                return (
                  <TableCell
                    key={day.toISODate()}
                    onClick={() => handleDateSelect(day)}
                    sx={{
                      cursor: "pointer",
                      fontWeight: isToday ? "bold" : "normal",
                      bgcolor: isToday
                        ? "#f0f0f0"
                        : isSelected
                        ? "#e0e0ff"
                        : "transparent",
                      border: isSelected
                        ? "2px solid #3f51b5"
                        : "1px solid #ddd",
                      ...(isWeekend && WeekendStyles.weekend),
                      textAlign: "center",
                      p: 0.5,
                      width: "14%",
                      height: "40px",
                      position: "relative", // ← Для правильного позиционирования
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)", // ← Центрируем число
                      }}
                    >
                      {day.toFormat("d")}
                    </Box>
                    {showTooltips && (
                      <Tooltip
                        title={
                          <>
                            <div>{day.toFormat("EEEE", { locale: "ru" })}</div>
                            <div>День года: {day.ordinal}</div>
                            <div>
                              Ваэр: {waerDate.waerDay}{" "}
                              {waerMonths[waerDate.waerMonth - 1]}{" "}
                              {waerDate.waerYear}
                            </div>
                          </>
                        }
                      >
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                          }}
                        />
                      </Tooltip>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ display: "flex", gap: 1, mt: 2, justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={onClose}>
          Закрыть
        </Button>
      </Box>
    </Box>
  );
};

export default GregorianCalendarTool;
