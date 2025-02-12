import { STYLE_OPTIONS } from "../types"

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