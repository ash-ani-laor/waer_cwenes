// src/components/GodsAsking/ToolButtons.js
import React, { useState } from "react";
import { Box, IconButton, Modal, Tooltip } from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import NumbersIcon from "@mui/icons-material/Numbers";
import FunctionsIcon from "@mui/icons-material/Functions";
import CalculateIcon from "@mui/icons-material/Calculate";
import EventIcon from "@mui/icons-material/Event";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import CommentIcon from "@mui/icons-material/Comment";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh"; // Иконка для нового тулзика
import TranslitTool from "../../tools/TranslitTool";
import NumbersTool from "../../tools/NumbersTool";
import IsopsephiaTool from "../../tools/IsopsephiaTool";
import WaerCalculatorTool from "../../tools/WaerCalculatorTool";
import DateConverterTool from "../../tools/DateConverterTool";
import GregorianCalendarTool from "../../tools/GregorianCalendarTool";
import WaerCalendarTool from "../../tools/WaerCalendarTool";
import RuneIsopsephiaTool from "../../tools/RuneIsopsephiaTool"; // Импорт нового тулзика
import CommentaryTool from "../../components/comment/CommentaryTool";

const ToolButtons = () => {
  const [openTranslit, setOpenTranslit] = useState(false);
  const [openNumbers, setOpenNumbers] = useState(false);
  const [openIsopsephia, setOpenIsopsephia] = useState(false);
  const [openCalculator, setOpenCalculator] = useState(false);
  const [openDateConverter, setOpenDateConverter] = useState(false);
  const [openGregorianCalendar, setOpenGregorianCalendar] = useState(false);
  const [openWaerCalendar, setOpenWaerCalendar] = useState(false);
  const [openCommentary, setOpenCommentary] = useState(false);
  const [openRuneIsopsephia, setOpenRuneIsopsephia] = useState(false); // Новое состояние

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
    <Box sx={{ display: "flex", gap: 0.5 }}>
      <Tooltip title="Транслитерация текста">
        <IconButton onClick={() => setOpenTranslit(true)}>
          <TranslateIcon sx={{ color: "#B0B0B0" }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Преобразование чисел">
        <IconButton onClick={() => setOpenNumbers(true)}>
          <NumbersIcon sx={{ color: "#B0B0B0" }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Изопсефия текста">
        <IconButton onClick={() => setOpenIsopsephia(true)}>
          <FunctionsIcon sx={{ color: "#B0B0B0" }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Ваэрский калькулятор">
        <IconButton onClick={() => setOpenCalculator(true)}>
          <CalculateIcon sx={{ color: "#B0B0B0" }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Конвертер дат и времени">
        <IconButton onClick={() => setOpenDateConverter(true)}>
          <EventIcon sx={{ color: "#B0B0B0" }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Григорианский календарь">
        <IconButton onClick={() => setOpenGregorianCalendar(true)}>
          <CalendarTodayIcon sx={{ color: "#B0B0B0" }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Ваэрский календарь">
        <IconButton onClick={() => setOpenWaerCalendar(true)}>
          <HistoryEduIcon sx={{ color: "#B0B0B0" }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Комментарии к раскладу">
        <IconButton onClick={() => setOpenCommentary(true)}>
          <CommentIcon sx={{ color: "#B0B0B0" }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Изопсефия рун">
        <IconButton onClick={() => setOpenRuneIsopsephia(true)}>
          <AutoFixHighIcon sx={{ color: "#B0B0B0" }} />
        </IconButton>
      </Tooltip>

      <Modal open={openTranslit} onClose={() => setOpenTranslit(false)}>
        <Box sx={modalStyle}>
          <TranslitTool onClose={() => setOpenTranslit(false)} />
        </Box>
      </Modal>
      <Modal open={openNumbers} onClose={() => setOpenNumbers(false)}>
        <Box sx={modalStyle}>
          <NumbersTool onClose={() => setOpenNumbers(false)} />
        </Box>
      </Modal>
      <Modal open={openIsopsephia} onClose={() => setOpenIsopsephia(false)}>
        <Box sx={modalStyle}>
          <IsopsephiaTool onClose={() => setOpenIsopsephia(false)} />
        </Box>
      </Modal>
      <Modal open={openCalculator} onClose={() => setOpenCalculator(false)}>
        <Box sx={modalStyle}>
          <WaerCalculatorTool onClose={() => setOpenCalculator(false)} />
        </Box>
      </Modal>
      <Modal
        open={openDateConverter}
        onClose={() => setOpenDateConverter(false)}
      >
        <Box sx={modalStyle}>
          <DateConverterTool onClose={() => setOpenDateConverter(false)} />
        </Box>
      </Modal>
      <Modal
        open={openGregorianCalendar}
        onClose={() => setOpenGregorianCalendar(false)}
      >
        <Box sx={modalStyle}>
          <GregorianCalendarTool
            onClose={() => setOpenGregorianCalendar(false)}
            openDateConverter={() => setOpenDateConverter(true)}
          />
        </Box>
      </Modal>
      <Modal open={openWaerCalendar} onClose={() => setOpenWaerCalendar(false)}>
        <Box sx={modalStyle}>
          <WaerCalendarTool
            onClose={() => setOpenWaerCalendar(false)}
            openDateConverter={() => setOpenDateConverter(true)}
          />
        </Box>
      </Modal>
      <Modal open={openCommentary} onClose={() => setOpenCommentary(false)}>
        <Box sx={modalStyle}>
          <CommentaryTool onClose={() => setOpenCommentary(false)} />
        </Box>
      </Modal>
      <Modal
        open={openRuneIsopsephia}
        onClose={() => setOpenRuneIsopsephia(false)}
      >
        <Box sx={modalStyle}>
          <RuneIsopsephiaTool onClose={() => setOpenRuneIsopsephia(false)} />
        </Box>
      </Modal>
    </Box>
  );
};

export default ToolButtons;
