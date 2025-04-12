//src\hooks\useRenderLines.js
import { useMemo } from "react";

export const useRenderLines = (layout) => {
  const renderLinesAndNumbers = useMemo(() => {
    if (!Array.isArray(layout) || layout.length === 0) return []; // Защита от пустого или битого layout

    const occupiedPositions = new Set();
    const RADIUS = 10;
    const sortedLayout = [...layout].sort((a, b) => a.order - b.order);

    return sortedLayout
      .map((node) => {
        if (!node || typeof node !== "object") return null; // Пропускаем битые узлы

        let numberX = node.x - 20;
        let numberY = node.y - 20;
        let isOverlapping = true;
        const directions = [
          { dx: -15, dy: -15 },
          { dx: 15, dy: -15 },
          { dx: 15, dy: 15 },
          { dx: -15, dy: 15 },
        ];
        let attempts = 0;

        while (isOverlapping && attempts < directions.length) {
          const positionKey = `${Math.round(numberX / RADIUS)},${Math.round(
            numberY / RADIUS
          )}`;
          isOverlapping = occupiedPositions.has(positionKey);
          if (!isOverlapping) {
            occupiedPositions.add(positionKey);
            break;
          }
          const direction = directions[attempts % directions.length];
          numberX = node.x + direction.dx;
          numberY = node.y + direction.dy;
          attempts++;
        }

        if (attempts >= directions.length) {
          numberX = node.x - 15;
          numberY = node.y - 15;
        }

        return {
          node,
          numberX,
          numberY,
        };
      })
      .filter(Boolean); // Убираем null значения
  }, [layout]);

  return renderLinesAndNumbers;
};
