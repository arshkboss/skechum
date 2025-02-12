import { STYLE_OPTIONS } from "../types"

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
  
  // Find the style in STYLE_OPTIONS
  const styleOption = STYLE_OPTIONS.find(style => style.id === styleId);
  if (styleOption) {
    // For line art, show as "Doodle B/W"
    if (styleId === "vector_illustration/doodle_line_art") {
      return "Doodle B/W";
    }
    // For flux_lora, show as "Color Doodle"
    if (styleId === "flux_lora") {
      return "Color Doodle";
    }
    // For other styles, use their name
    return styleOption.name;
  }

  // Fallback: Format the style ID into a readable string
  return styleId
    .split('/')
    .pop()!
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
} 