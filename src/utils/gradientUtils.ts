const gradients = [
  ["#8B5CF6", "#3B82F6"],
  ["#EC4899", "#8B5CF6"],
  ["#22C55E", "#14B8A6"],
  ["#F59E0B", "#EF4444"],
  ["#06B6D4", "#3B82F6"],
  ["#6366F1", "#A855F7"],
];

export const getRandomGradient = () => {
  const random =
    gradients[
      Math.floor(Math.random() * gradients.length)
    ];

  return `linear-gradient(135deg, ${random[0]}, ${random[1]})`;
};