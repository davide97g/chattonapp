// Format timestamp to a readable format
export const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get initials for avatar fallback
export const getInitials = (name?: string) => {
  return name?.charAt(0);
};

// Get a consistent color based on username
export const getUserColor = (name?: string) => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];

  // Simple hash function to get a consistent index
  let hash = 0;
  for (let i = 0; i < (name?.length ?? 0); i++) {
    hash = (name?.charCodeAt(i) ?? -1) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

// Generate a random username for this session
export const generateUsername = () => {
  const adjectives = [
    "Happy",
    "Clever",
    "Brave",
    "Calm",
    "Eager",
    "Gentle",
    "Jolly",
    "Kind",
    "Lively",
  ];
  const nouns = [
    "Panda",
    "Tiger",
    "Eagle",
    "Dolphin",
    "Fox",
    "Wolf",
    "Bear",
    "Hawk",
    "Lion",
  ];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdjective}${randomNoun}`;
};

// Common emojis for the shortcut list
export const commonEmojis = [
  "😊",
  "😂",
  "❤️",
  "👍",
  "😍",
  "🎉",
  "🔥",
  "👏",
  "😎",
  "🙌",
  "✨",
  "🤔",
  "😢",
  "😭",
  "🥰",
  "😘",
  "🤣",
  "😁",
  "👋",
  "🙏",
  "💯",
  "⭐",
  "🌟",
  "💪",
];

// Check if a string contains only emojis
export const isEmojiOnly = (str: string) => {
  // This regex matches most common emoji patterns
  const emojiRegex =
    /^(\p{Emoji_Presentation}|\p{Extended_Pictographic}|\p{Emoji}\uFE0F|[\u{1F3FB}-\u{1F3FF}]|\p{Emoji}\u200D\p{Emoji})+$/u;
  return emojiRegex.test(str.trim());
};

// Truncate text for reply preview
export const truncateText = (text: string, maxLength = 30) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
