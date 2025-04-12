//src\components\GodsAsking\SymbolLayout.js
import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Circle, Text } from "react-konva";
import { Box } from "@mui/material";
import { useDragSymbol } from "../../hooks/useDragSymbol";
import { useRenderLines } from "../../hooks/useRenderLines";
import { useLayoutStore } from "../../stores/layoutStore";
import { useUiStore } from "../../stores/uiStore";
import SymbolNode from "./SymbolNode";

const SymbolLayout = ({
  layout,
  setLayout,
  symbols,
  setSymbols,
  drawMode,
  isDivinationMode,
  isBrushActive,
  setIsBrushActive,
  reshuffle,
  isReturnAllowed,
  selectedNodes,
  setSelectedNodes,
  onCreateGroup,
  question,
  setStagePosition,
  onCapturePreview,
}) => {
  const isProtocolMode = useUiStore((state) => state.isProtocolMode);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);

  const {
    drop,
    handleDrag,
    handleDragStart,
    handleDragEnd,
    handleDoubleClick,
    handleReturn,
  } = useDragSymbol({
    layout,
    setLayout,
    symbols,
    setSymbols,
    drawMode,
    isDivinationMode,
    isBrushActive,
    setIsBrushActive,
    reshuffle,
    isReturnAllowed,
    isProtocolMode,
    question,
    stagePos,
  });
  const groups = useLayoutStore((state) => state.groups || []);
  const renderLinesAndNumbers = useRenderLines(layout);

  const capturePreview = async () => {
    if (stageRef.current) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const dataUrl = stageRef.current.toDataURL({
          mimeType: "image/png",
          quality: 1,
        });
        return dataUrl;
      } catch (error) {
        console.error("CapturePreview: Failed to capture preview", error);
        return null;
      }
    }
    console.log("CapturePreview: stageRef.current is not ready");
    return null;
  };

  useEffect(() => {
    if (onCapturePreview) {
      onCapturePreview(capturePreview);
    }
  }, [onCapturePreview]);

  useEffect(() => {
    if (setStagePosition) {
      setStagePosition(stagePos);
    }
  }, [stagePos, setStagePosition]);

  const handleSelect = (layoutId) => {
    setSelectedNodes((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.includes(layoutId)
        ? safePrev.filter((id) => id !== layoutId)
        : [...safePrev, layoutId];
    });
  };

  const handleNodeClick = (layoutId) => {
    if (!isBrushActive) return;
    const clickedNode = layout.find((node) => node.layoutId === layoutId);
    if (clickedNode && !clickedNode.isReturned) {
      handleReturn(layoutId);
    }
    setIsBrushActive(false);
  };

  const handleMouseDown = (e) => {
    if (e.evt.button === 2) {
      setIsPanning(true);
      const stage = stageRef.current;
      const pointerPos = stage.getPointerPosition();
      setStartPos({
        x: pointerPos.x - stagePos.x,
        y: pointerPos.y - stagePos.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      const stage = stageRef.current;
      const pointerPos = stage.getPointerPosition();
      const newPos = {
        x: pointerPos.x - startPos.x,
        y: pointerPos.y - startPos.y,
      };
      setStagePos(newPos);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  // Адаптивные размеры сцены
  const previewWidth = window.innerWidth * 0.65; // Уменьшаем ширину, так как увеличили чашу
  const previewHeight = 450; // Уменьшаем высоту, чтобы вместиться в экран

  const visibleNodes = layout.filter((node) => {
    const x = node.x + stagePos.x;
    const y = node.y + stagePos.y;
    return x >= 0 && x <= previewWidth && y >= 0 && y <= previewHeight;
  });

  const renderGroupVisualization = () => {
    const safeGroups = Array.isArray(groups) ? groups : [];
    if (safeGroups.length === 0) return null;

    return safeGroups.map((group, index) => {
      if (!group || typeof group !== "object") {
        console.error(`Invalid group at index ${index}:`, group);
        return null;
      }

      const nodeIds = Array.isArray(group.nodeIds) ? group.nodeIds : [];
      const nodes = (Array.isArray(layout) ? layout : []).filter((node) => {
        if (!node || typeof node.layoutId === "undefined") {
          console.error("Invalid node in layout:", node);
          return false;
        }
        return nodeIds.includes(node.layoutId);
      });
      if (nodes.length < 2) return null;

      const lines = [];
      for (let i = 0; i < nodes.length - 1; i++) {
        const fromNode = nodes[i];
        const toNode = nodes[i + 1];
        lines.push(
          <Line
            key={`line-${group.groupId}-${i}`}
            points={[fromNode.x, fromNode.y, toNode.x, toNode.y]}
            stroke="black"
            strokeWidth={1}
            dash={[5, 5]}
          />
        );
      }

      return lines;
    });
  };

  return (
    <Box
      id="layout-area"
      ref={drop}
      sx={{
        position: "relative",
        height: "100%",
        maxHeight: "450px", // Синхронизируем с высотой чаши
        border: "2px dashed #4B536E",
        padding: "0 1vw",
        backgroundColor: "#2E2E2E",
        borderRadius: 2,
        overflow: "hidden",
        cursor: isBrushActive ? "crosshair" : "default",
      }}
      onDragOver={(e) => e.preventDefault()}
      onContextMenu={handleContextMenu}
    >
      <Stage
        ref={stageRef}
        x={stagePos.x}
        y={stagePos.y}
        width={previewWidth}
        height={previewHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {renderGroupVisualization()}
          {(Array.isArray(renderLinesAndNumbers)
            ? renderLinesAndNumbers
            : []
          ).map(({ node, numberX, numberY }) => {
            const x = numberX + stagePos.x;
            const y = numberY + stagePos.y;
            if (x < 0 || x > previewWidth || y < 0 || y > previewHeight)
              return null;
            return (
              <React.Fragment key={`label-${node.layoutId}`}>
                <Circle
                  x={numberX + 8}
                  y={numberY + 8}
                  radius={8}
                  fill="#444"
                  opacity={node.isReturned ? 0.6 : 1}
                />
                <Text
                  text={
                    node.dropOrder !== undefined && node.dropOrder !== null
                      ? String(node.dropOrder)
                      : "N/A"
                  }
                  x={numberX}
                  y={numberY + 1}
                  fontSize={10}
                  fill="#fff"
                  align="center"
                  width={16}
                />
                <Line
                  points={[numberX + 8, numberY + 8, node.x + 20, node.y + 20]}
                  stroke="black"
                  strokeWidth={1}
                  opacity={node.isReturned ? 0.6 : 1}
                />
              </React.Fragment>
            );
          })}
          {visibleNodes.map((node) => (
            <SymbolNode
              key={node.layoutId}
              node={node}
              isRune={node.isRune}
              onDrag={handleDrag}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDoubleClick={handleDoubleClick}
              onSelect={handleSelect}
              onClick={handleNodeClick}
              isSelected={(Array.isArray(selectedNodes)
                ? selectedNodes
                : []
              ).includes(node.layoutId)}
            />
          ))}
        </Layer>
      </Stage>
    </Box>
  );
};

export default SymbolLayout;
