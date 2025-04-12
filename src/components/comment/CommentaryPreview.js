// src/components/comment/CommentaryPreview.js
import React from "react";
import { Box, Typography } from "@mui/material";
import { Stage, Layer, Circle, Text } from "react-konva";

const CommentaryPreview = ({ layout, groups }) => {
  const previewWidth = 300;
  const previewHeight = 100;
  const scale = 0.2;
  const circleSize = 8;

  const minX = Math.min(...layout.map((node) => node.x));
  const maxX = Math.max(...layout.map((node) => node.x));
  const minY = Math.min(...layout.map((node) => node.y));
  const maxY = Math.max(...layout.map((node) => node.y));
  const offsetX = (previewWidth - (maxX - minX) * scale) / 2 - minX * scale;
  const offsetY = (previewHeight - (maxY - minY) * scale) / 2 - minY * scale;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1">Превью расклада</Typography>
      <Stage width={previewWidth} height={previewHeight}>
        <Layer>
          {layout.map((node) => (
            <React.Fragment key={node.layoutId}>
              <Circle
                x={node.x * scale + offsetX + circleSize}
                y={node.y * scale + offsetY + circleSize}
                radius={circleSize}
                fill={node.isRune ? "#6B728E" : "#D4A017"}
              />
              <Text
                text={node.symbol}
                x={node.x * scale + offsetX}
                y={node.y * scale + offsetY}
                fontSize={12}
                fill={node.isRune ? "#fff" : "#000"}
                width={circleSize * 2}
                align="center"
              />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>
    </Box>
  );
};

export default CommentaryPreview;
