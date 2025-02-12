// Define an interface for style display info
interface StyleDisplayInfo {
  label: string;
  description?: string;
  badge?: string;
}

// Map of style IDs to their display information
export const STYLE_DISPLAY_MAP: Record<string, StyleDisplayInfo> = {
  "vector_illustration/doodle_line_art": {
    label: "Doodle Line Art",
    badge: "Doodle B/W"
  },
  "watercolor": {
    label: "Watercolor Illustration",
    badge: "Watercolor"
  }
  // Easy to add new styles here in the future
};

/**
 * Gets the display badge text for a given style ID
 * @param styleId - The ID of the style
 * @returns The badge text to display, or the formatted style ID if not found
 */
export function getStyleBadgeText(styleId: string | null): string {
  if (!styleId) return "";
  
  // Check if we have a predefined badge text
  const styleInfo = STYLE_DISPLAY_MAP[styleId];
  if (styleInfo?.badge) {
    return styleInfo.badge;
  }

  // Fallback: Format the style ID into a readable string
  return styleId
    .split('/')
    .pop()!
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
} 