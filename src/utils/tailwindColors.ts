const tailwindColors = [
  { name: "red-500", hex: "#ef4444" },
  { name: "blue-500", hex: "#3b82f6" },
  { name: "green-500", hex: "#22c55e" },
  { name: "yellow-500", hex: "#eab308" },
  { name: "purple-500", hex: "#a855f7" },
  { name: "pink-500", hex: "#ec4899" },
  { name: "indigo-500", hex: "#6366f1" },
  { name: "gray-500", hex: "#6b7280" },
];

const hexToRgbObject = (hex: string) => {
  const bigint = parseInt(
    hex.replace("#", ""),
    16
  );

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

const colorDistance = (
  c1: any,
  c2: any
) => {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
      Math.pow(c1.g - c2.g, 2) +
      Math.pow(c1.b - c2.b, 2)
  );
};

export const getNearestTailwindColor = (
  hex: string
) => {
  const target = hexToRgbObject(hex);

  let nearest = tailwindColors[0];
  let minDistance = Infinity;

  for (const color of tailwindColors) {
    const current = hexToRgbObject(color.hex);

    const distance = colorDistance(
      target,
      current
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = color;
    }
  }

  return nearest;
};