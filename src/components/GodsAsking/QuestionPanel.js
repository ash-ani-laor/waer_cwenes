// src/components/GodsAsking/QuestionPanel.js
import React from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { getWaerDateTimeString } from "../../utils/waerUtils";

const QuestionPanel = ({
  question,
  isQuestionLocked,
  handleQuestionChange,
  handleLockQuestion,
  questionFixedTime,
}) => {
  const waerDateTime = questionFixedTime
    ? getWaerDateTimeString(questionFixedTime)
    : null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 0.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          value={question}
          onChange={(e) =>
            !isQuestionLocked && handleQuestionChange(e.target.value)
          }
          fullWidth
          disabled={isQuestionLocked}
          placeholder="Введите ваш вопрос..."
          sx={{
            "& .MuiInputBase-root": {
              bgcolor: "#3A3A3A",
              color: isQuestionLocked ? "#E0E0E0" : "#E0E0E0", // Яркий цвет для обоих состояний
            },
            "& .MuiInputBase-input": {
              "&.Mui-disabled": {
                color: "#E0E0E0", // Яркий цвет текста при disabled
                WebkitTextFillColor: "#E0E0E0", // Для совместимости с Webkit-браузерами
                opacity: 1, // Убираем затемнение
              },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#B0B0B0",
              opacity: 1,
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#4B536E",
              },
              "&:hover fieldset": {
                borderColor: "#5B638E",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#5B638E",
              },
              "&.Mui-disabled fieldset": {
                borderColor: "#4B536E", // Сохраняем цвет рамки при disabled
              },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleLockQuestion}
          sx={{
            bgcolor: "#4B536E",
            "&:hover": {
              bgcolor: isQuestionLocked ? "#4B536E" : "#5B638E",
            },
            color: isQuestionLocked ? "#B0B0B0" : "#fff",
            boxShadow: isQuestionLocked
              ? "0 0 12px rgba(76,175,80,0.8)"
              : "none",
            "&:hover": {
              boxShadow: isQuestionLocked
                ? "0 0 12px rgba(76,175,80,0.8)"
                : "none",
            },
            transition: "box-shadow 0.2s ease",
          }}
          startIcon={
            isQuestionLocked ? <CheckIcon sx={{ color: "#E0E0E0" }} /> : null
          }
        >
          {isQuestionLocked ? "Вопрос зафиксирован" : "Зафиксировать вопрос"}
        </Button>
      </Box>
      <Typography variant="caption" color="#B0B0B0" sx={{ minHeight: "1.2em" }}>
        {isQuestionLocked && waerDateTime ? (
          <>
            Вопрос задан дня <strong>{waerDateTime.waerDay}</strong> месяца{" "}
            <strong>{waerDateTime.waerMonth}</strong> (
            <strong>{waerDateTime.waerDayOfYear}</strong>) года{" "}
            <strong>{waerDateTime.waerYear}</strong> в{" "}
            <strong>{waerDateTime.waerTime}</strong>
          </>
        ) : (
          " "
        )}
      </Typography>
    </Box>
  );
};

export default QuestionPanel;
