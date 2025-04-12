//src\components\GodsAsking\SaveModal.js
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Autocomplete,
  TextField,
  Chip,
} from "@mui/material";

const SaveModal = ({
  open,
  onClose,
  tagInput,
  setTagInput,
  tags,
  allTags,
  onAddTag,
  onDeleteTag,
  onConfirmSave,
  layout,
  onLayoutChange,
  initialTitle,
}) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (initialTitle) {
      setTitle(initialTitle);
    }
  }, [initialTitle]);

  const handleAddTag = () => {
    if (tagInput && typeof tagInput === "string" && tagInput.trim()) {
      onAddTag(tagInput.trim());
      setTagInput("");
    }
  };

  const handleSave = () => {
    console.log("Saving with title:", title, "tags:", tags);
    onConfirmSave(title, tags);
    setTitle("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          width: 600,
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Сохранение расклада
        </Typography>
        <TextField
          label="Название (опционально)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Typography variant="body2" gutterBottom>
          Введите теги для расклада:
        </Typography>
        <Autocomplete
          freeSolo
          multiple
          options={allTags}
          value={tags}
          inputValue={tagInput}
          onInputChange={(event, newInputValue) => setTagInput(newInputValue)}
          onChange={(event, newValue) => {
            const uniqueTags = [...new Set(newValue)];
            uniqueTags.forEach((tag) => {
              if (!tags.includes(tag)) onAddTag(tag);
            });
            tags.forEach((tag) => {
              if (!uniqueTags.includes(tag)) onDeleteTag(tag);
            });
          }}
          renderInput={(params) => (
            <TextField {...params} label="Теги" fullWidth sx={{ mb: 2 }} />
          )}
        />
        <Button variant="outlined" onClick={handleAddTag} sx={{ mb: 2 }}>
          Добавить тег
        </Button>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {(Array.isArray(tags) ? tags : []).map((tag, index) => (
            <Chip
              key={`${tag}-${index}`} // ← Уникальный ключ
              label={typeof tag === "string" ? tag : ""}
              onDelete={() => onDeleteTag(tag)}
              size="small"
            />
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={onClose}>
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={layout.length === 0}
          >
            Сохранить
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SaveModal;
