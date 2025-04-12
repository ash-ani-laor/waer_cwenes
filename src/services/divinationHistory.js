// src/services/divinationHistory.js
export const saveDivination = async (
  question,
  layout,
  tags,
  timestamp = null,
  title,
  groups,
  questionFixedTime = null,
  previewImage
) => {
  console.log("saveDivination called with:", {
    question,
    layout,
    tags: tags || [],
    timestamp,
    title: title || "",
    groups,
    questionFixedTime,
    previewImage,
  });
  const response = await fetch("http://localhost:3001/api/divinations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      layout,
      tags,
      timestamp,
      title,
      groups,
      questionFixedTime,
      previewImage,
    }),
  });
  if (!response.ok) throw new Error("Failed to save divination");
  return response.json();
};

export const loadDivinations = async () => {
  const response = await fetch("http://localhost:3001/api/divinations");
  if (!response.ok) throw new Error("Failed to load divinations");
  return response.json();
};

export const deleteDivination = async (timestamp) => {
  const response = await fetch(
    `http://localhost:3001/api/divinations/${timestamp}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) throw new Error("Failed to delete divination");
  return response.json();
};
