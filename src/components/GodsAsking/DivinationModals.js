//src\components\GodsAsking\DivinationModals.js
import React from "react";
import { Typography, Box, Modal, Button } from "@mui/material";
import HistoryModal from "./HistoryModal";
import ConfirmLoadModal from "./ConfirmLoadModal";
import DeleteModal from "./DeleteModal";
import SaveModal from "./SaveModal";

const DivinationModals = ({
  uiStore,
  historyStore,
  allTags,
  layoutStore,
  handleLoadDivination,
  handleDeleteRecord,
  handleToggleDeleteMode,
  handleConfirmDelete,
  handleCancelDelete,
  recordHandler,
  recordToDelete,
  handleConfirmSave,
  handleCancelEdit,
  handleAddTag,
  handleDeleteTag,
  handleLayoutChange,
  newLayoutHandler,
}) => {
  const setIsConfirmNewLayoutModalOpen = uiStore.setIsConfirmNewLayoutModalOpen;
  const setIsConfirmLoadModalOpen = uiStore.setIsConfirmLoadModalOpen;

  return (
    <>
      <HistoryModal
        open={uiStore.isHistoryModalOpen}
        onClose={() => uiStore.setIsHistoryModalOpen(false)}
        history={historyStore.divinationHistory}
        filterTag={historyStore.filterTag}
        setFilterTag={historyStore.setFilterTag}
        onLoadDivination={handleLoadDivination}
        onDeleteRecord={handleDeleteRecord}
        isDeleteMode={uiStore.isDeleteMode}
        handleToggleDeleteMode={handleToggleDeleteMode}
      />
      <ConfirmLoadModal
        open={uiStore.isConfirmLoadModalOpen}
        onConfirm={() => {
          recordHandler?.confirm();
          setIsConfirmLoadModalOpen(false);
        }}
        onCancel={() => {
          recordHandler?.cancel();
          setIsConfirmLoadModalOpen(false);
        }}
        message="Вы уверены, что хотите загрузить этот расклад? Несохранённый расклад будет утрачен."
      />
      <ConfirmLoadModal
        open={uiStore.isConfirmNewLayoutModalOpen}
        onConfirm={() => {
          newLayoutHandler?.confirm();
          setIsConfirmNewLayoutModalOpen(false);
        }}
        onCancel={() => {
          newLayoutHandler?.cancel();
          setIsConfirmNewLayoutModalOpen(false);
        }}
        message="Вы уверены, что хотите создать новый расклад? Несохранённый расклад будет утрачен."
      />
      <DeleteModal
        open={uiStore.isDeleteModalOpen}
        onConfirm={() => handleConfirmDelete(recordToDelete)}
        onCancel={handleCancelDelete}
        record={recordToDelete}
      />
      <SaveModal
        open={uiStore.isSaveModalOpen || uiStore.isEditModalOpen || false}
        onClose={() => {
          uiStore.setSaveModalOpen(false);
          uiStore.setIsEditing(false);
        }}
        tagInput={historyStore.tagInput}
        setTagInput={historyStore.setTagInput}
        tags={historyStore.tags}
        allTags={allTags}
        onAddTag={handleAddTag}
        onDeleteTag={handleDeleteTag}
        onConfirmSave={handleConfirmSave}
        layout={layoutStore.layout}
        onLayoutChange={handleLayoutChange}
        initialTitle={
          uiStore.isEditing
            ? historyStore.divinationHistory.find(
                (d) => d.timestamp === uiStore.originalTimestamp
              )?.title || ""
            : ""
        }
      />
      <Modal
        open={uiStore.deleteModalOpen}
        onClose={handleCancelDelete}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Подтверждение удаления
          </Typography>
          <Typography variant="body2" gutterBottom>
            Вы уверены, что хотите удалить этот расклад? Это действие нельзя
            отменить.
          </Typography>
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={handleCancelDelete}>
              Отмена
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
            >
              Удалить
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DivinationModals;
