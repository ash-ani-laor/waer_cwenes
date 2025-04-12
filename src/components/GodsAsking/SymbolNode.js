//src\components\GodsAsking\SymbolNode.js
import React, { useEffect, useRef } from "react";
import { Circle, Text, Group } from "react-konva";
import Konva from "konva";

const SymbolNode = ({
  node,
  isRune,
  onDrag,
  onDragStart,
  onDragEnd,
  onDoubleClick,
  onSelect,
  isSelected,
  onClick,
}) => {
  const nodeRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (
      nodeRef.current &&
      node.isNew &&
      !hasAnimated.current &&
      !node.isReturned
    ) {
      hasAnimated.current = true;

      // Первый прыжок (большой, 15px)
      nodeRef.current.to({
        y: node.y - 15,
        duration: 0.1,
        easing: Konva.Easings.EaseOut,
        onFinish: () => {
          nodeRef.current.to({
            y: node.y,
            duration: 0.1,
            easing: Konva.Easings.EaseIn,
            onFinish: () => {
              // Второй прыжок (поменьше, 5px)
              nodeRef.current.to({
                y: node.y - 5,
                duration: 0.1,
                easing: Konva.Easings.EaseOut,
                onFinish: () => {
                  nodeRef.current.to({
                    y: node.y,
                    duration: 0.1,
                    easing: Konva.Easings.EaseIn,
                    onFinish: () => {
                      onDrag(node.layoutId, node.x, node.y);
                    },
                  });
                },
              });
            },
          });
        },
      });
    }
  }, [node.isNew, node.layoutId, node.x, node.y, onDrag, node.isReturned]);

  // Устанавливаем радиус и размер шрифта
  const radius = Math.max(20, Math.min(33, window.innerWidth * 0.05)) / 2;
  const fontSize = radius * 1.5; // Увеличиваем шрифт до 150% от радиуса

  return (
    <Group
      ref={nodeRef}
      x={node.x}
      y={node.y}
      draggable
      onDragMove={(e) => onDrag(node.layoutId, e.target.x(), e.target.y())}
      onDragStart={() => onDragStart(node.layoutId)}
      onDragEnd={(e) => onDragEnd()}
      onDblClick={() => onDoubleClick(node.layoutId)}
      onClick={(e) => {
        if (e.evt.ctrlKey) {
          onSelect(node.layoutId);
        } else {
          onClick(node.layoutId);
        }
      }}
    >
      {node.addedBeforeReturn && (
        <Circle
          x={radius}
          y={radius}
          radius={radius + 2}
          stroke="black"
          strokeWidth={1}
          opacity={node.isReturned ? 0.4 : 1}
        />
      )}
      <Circle
        x={radius}
        y={radius}
        radius={radius}
        fill={isRune ? "#6B728E" : "#D4A017"}
        shadowColor="rgba(0,0,0,0.3)"
        shadowBlur={6}
        shadowOffsetX={3}
        shadowOffsetY={3}
        shadowOpacity={0.5}
        opacity={node.isReturned ? 0.4 : 1}
        stroke={isSelected ? "blue" : null}
        strokeWidth={isSelected ? 2 : 0}
        filters={[Konva.Filters.Brighten]}
        brightness={0.2}
      />
      <Text
        text={
          typeof node.symbol === "string" && node.symbol.trim() !== ""
            ? node.symbol
            : "?"
        }
        x={0}
        y={radius - fontSize / 2}
        fontSize={fontSize}
        fill={isRune ? "#fff" : "#000"}
        align="center"
        width={radius * 2}
      />
    </Group>
  );
};

export default SymbolNode;
