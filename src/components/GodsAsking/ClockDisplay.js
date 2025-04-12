//src\components\GodsAsking\ClockDisplay.js
import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { Box, Typography } from "@mui/material";
import { convertToWaerDate, convertToWaerTime } from "../../utils/dateUtils";

const ClockDisplay = () => {
  const [currentTime, setCurrentTime] = useState(DateTime.now());

  useEffect(() => {
    const waerSecondInterval = 2400;
    const standardSecondInterval = 1000;

    const standardInterval = setInterval(() => {
      setCurrentTime(DateTime.now());
    }, standardSecondInterval);

    const waerInterval = setInterval(() => {
      setCurrentTime(DateTime.now());
    }, waerSecondInterval);

    return () => {
      clearInterval(standardInterval);
      clearInterval(waerInterval);
    };
  }, []);

  const waerDate = convertToWaerDate(currentTime);
  const waerTime = convertToWaerTime(currentTime);

  const standardDate = currentTime.toFormat("dd/MM/yyyy");
  const standardTime = currentTime.toFormat("HH:mm:ss");

  const waerDateStr = `${String(waerDate.waerDay).padStart(2, "0")}/${String(
    waerDate.waerMonth
  ).padStart(2, "0")}/${waerDate.waerYear}`;
  const waerTimeStr = `${String(waerTime.waerHour).padStart(2, "0")}:${String(
    waerTime.waerMinute
  ).padStart(2, "0")}:${String(waerTime.waerSecond).padStart(2, "0")}`;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: 0.5, // Уменьшенный промежуток
        mb: 0.5, // Уменьшенный отступ снизу
        padding: 0.3, // Уменьшенный внутренний отступ
        border: "1px solid #4B536E",
        borderRadius: 1,
        backgroundColor: "#2E2E2E",
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography variant="caption" color="#B0B0B0">
          Ваэрское время
        </Typography>
        <Typography variant="body2" color="#fff">
          {waerTimeStr}
        </Typography>
        <Typography variant="caption" color="#B0B0B0" sx={{ mt: 0.2 }}>
          Ваэрская дата
        </Typography>
        <Typography variant="body2" color="#fff">
          {waerDateStr}
        </Typography>
      </Box>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography variant="caption" color="#B0B0B0">
          Обычное время
        </Typography>
        <Typography variant="body2" color="#fff">
          {standardTime}
        </Typography>
        <Typography variant="caption" color="#B0B0B0" sx={{ mt: 0.2 }}>
          Обычная дата
        </Typography>
        <Typography variant="body2" color="#fff">
          {standardDate}
        </Typography>
      </Box>
    </Box>
  );
};

export default ClockDisplay;
