//src\hooks\useGroupManager.js
export const useGroupManager = ({ layout, setLayout, groups, setGroups }) => {
  const createGroup = (selectedNodeIds) => {
    if (selectedNodeIds.length < 2) return;
    const newGroupId = groups.length
      ? Math.max(...groups.map((g) => g.groupId)) + 1
      : 1;
    const nodes = layout.filter((node) =>
      selectedNodeIds.includes(node.layoutId)
    );
    const avgX = nodes.reduce((sum, node) => sum + node.x, 0) / nodes.length;
    const avgY = nodes.reduce((sum, node) => sum + node.y, 0) / nodes.length;

    setGroups((prev) => [
      ...prev,
      { groupId: newGroupId, nodeIds: selectedNodeIds, x: avgX, y: avgY },
    ]);
  };

  const moveGroup = (groupId, x, y) => {
    const group = groups.find((g) => g.groupId === groupId);
    if (!group) return;

    const dx = x - group.x;
    const dy = y - group.y;

    setLayout((prev) =>
      prev.map((node) =>
        group.nodeIds.includes(node.layoutId)
          ? { ...node, x: node.x + dx, y: node.y + dy }
          : node
      )
    );
    setGroups((prev) =>
      prev.map((g) => (g.groupId === groupId ? { ...g, x, y } : g))
    );
  };

  return { createGroup, moveGroup };
};
