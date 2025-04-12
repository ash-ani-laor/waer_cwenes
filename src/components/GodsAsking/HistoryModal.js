//src\components\GodsAsking\HistoryModal.js
import React from "react";
import {
  Modal,
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Chip,
} from "@mui/material";
import { Stage, Layer, Circle, Text, Group } from "react-konva";
import { DateTime } from "luxon";
import { getWaerDateTimeString } from "../../utils/waerUtils";

const HistoryModal = React.memo(
  ({
    open,
    onClose,
    history,
    filterTag,
    setFilterTag,
    onLoadDivination,
    onDeleteRecord,
    isDeleteMode,
    handleToggleDeleteMode,
  }) => {
    const renderPreview = (layout, visibleLayout, previewImage) => {
      if (previewImage) {
        return (
          <img
            src={previewImage}
            alt="Preview"
            style={{ width: 150, height: 100, objectFit: "contain" }}
          />
        );
      }

      const previewWidth = 150;
      const previewHeight = 100;
      const scale = 0.2;
      const circleSize = 8;

      // Находим минимальные и максимальные координаты для центрирования
      const nodes = visibleLayout || layout;
      const minX = Math.min(...nodes.map((node) => node.x));
      const maxX = Math.max(...nodes.map((node) => node.x));
      const minY = Math.min(...nodes.map((node) => node.y));
      const maxY = Math.max(...nodes.map((node) => node.y));

      // Вычисляем смещение для центрирования
      const offsetX = (previewWidth - (maxX - minX) * scale) / 2 - minX * scale;
      const offsetY =
        (previewHeight - (maxY - minY) * scale) / 2 - minY * scale;

      return (
        <Stage width={previewWidth} height={previewHeight}>
          <Layer>
            {nodes.map((node) => (
              <Group
                key={node.layoutId}
                x={node.x * scale + offsetX}
                y={node.y * scale + offsetY}
              >
                <Circle
                  x={circleSize}
                  y={circleSize}
                  radius={circleSize}
                  fill={node.isRune ? "#6B728E" : "#D4A017"}
                />
                <Text
                  text={node.symbol}
                  x={0}
                  y={0}
                  fontSize={12}
                  fill={node.isRune ? "#fff" : "#000"}
                  width={circleSize * 2}
                  align="center"
                />
              </Group>
            ))}
          </Layer>
        </Stage>
      );
    };

    const filteredHistory = filterTag
      ? history.filter((record) =>
          record.tags.some((tag) =>
            tag.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
      : history;

    return (
      <Modal
        open={open}
        onClose={onClose}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            width: "80%",
            maxHeight: "80vh",
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 2,
            overflowY: "auto",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              История раскладов
            </Typography>
            <Button
              variant="outlined"
              onClick={handleToggleDeleteMode}
              color={isDeleteMode ? "error" : "primary"}
            >
              {isDeleteMode ? "Отключить удаление" : "Включить удаление"}
            </Button>
          </Box>
          <TextField
            label="Фильтр по тегам"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          {history.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              Нет сохранённых раскладов.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {filteredHistory.map((record, index) => {
                const waerDateTime = record.questionFixedTime
                  ? (() => {
                      const parsedDate = DateTime.fromISO(
                        record.questionFixedTime
                      );
                      if (!parsedDate.isValid) {
                        console.error(
                          "Invalid questionFixedTime in record:",
                          record.questionFixedTime,
                          record
                        );
                        return null;
                      }
                      return getWaerDateTimeString(parsedDate);
                    })()
                  : null;
                return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box
                      sx={{
                        p: 1,
                        border: "1px solid #ddd",
                        borderRadius: 1,
                        cursor: isDeleteMode ? "crosshair" : "pointer",
                        "&:hover": { bgcolor: "#f5f5f5" },
                      }}
                      onClick={() => {
                        isDeleteMode
                          ? onDeleteRecord(record)
                          : onLoadDivination(record);
                      }}
                    >
                      <Typography variant="body2" gutterBottom>
                        {record.title || record.question}
                      </Typography>
                      {waerDateTime && (
                        <Typography variant="caption" color="textSecondary">
                          Задан дня <strong>{waerDateTime.waerDay}</strong>{" "}
                          месяца <strong>{waerDateTime.waerMonth}</strong> (
                          <strong>{waerDateTime.waerDayOfYear}</strong>) года{" "}
                          <strong>{waerDateTime.waerYear}</strong> в{" "}
                          <strong>{waerDateTime.waerTime}</strong>
                        </Typography>
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        {renderPreview(
                          record.layout,
                          record.visibleLayout,
                          record.previewImage
                        )}{" "}
                        {/* {record.layout.length > 5 && (
                          <Typography variant="caption">...</Typography>
                        )} */}
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        {record.tags && record.tags.length > 0 ? (
                          record.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))
                        ) : (
                          <Typography variant="caption" color="textSecondary">
                            Нет тегов
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          )}
          <Button variant="contained" onClick={onClose} sx={{ mt: 2 }}>
            Закрыть
          </Button>
        </Box>
      </Modal>
    );
  }
);

export default HistoryModal;
