import type { RecraftV3 } from "@fal-ai/client"

type RecraftStyle = 
  | "3d-model"
  | "analog-film"
  | "anime"
  | "cinematic"
  | "comic-book"
  | "digital-art"
  | "enhance"
  | "fantasy-art"
  | "isometric"
  | "line-art"
  | "low-poly"
  | "neon-punk"
  | "origami"
  | "photographic"
  | "pixel-art"
  | "texture"
  | "craft-clay"

export const STYLE_NAMES: Record<RecraftStyle, string> = {
  "3d-model": "3D Model",
  "analog-film": "Analog Film",
  "anime": "Anime",
  "cinematic": "Cinematic",
  "comic-book": "Comic Book",
  "digital-art": "Digital Art",
  "enhance": "Enhance",
  "fantasy-art": "Fantasy Art",
  "isometric": "Isometric",
  "line-art": "Line Art",
  "low-poly": "Low Poly",
  "neon-punk": "Neon Punk",
  "origami": "Origami",
  "photographic": "Photographic",
  "pixel-art": "Pixel Art",
  "texture": "Texture",
  "craft-clay": "Craft Clay",
} as const

export const STYLES = Object.entries(STYLE_NAMES).map(([id, name]) => ({
  id: id as RecraftStyle,
  name,
}))

export const DEFAULT_STYLE: RecraftStyle = "photographic"

export const styles = [
  {
    id: "notion-style",
    label: "Notion Style",
    description: "Notion Style Art",
    icon: "🖼️",
  },
  {
    id: "line-art",
    label: "Line Art",
    icon: "✏️",
    style: "vector_illustration/line_art" as RecraftStyle,
    color: true
  },
  {
    id: "watercolor",
    label: "Watercolor",
    description: "Soft watercolor painting effect",
    icon: "🌊",
  },
] as const

export const sizes = [
  {
    id: "square",
    label: "Square",
    description: "1:1 ratio (1024x1024)",
  },
  {
    id: "portrait",
    label: "Portrait",
    description: "9:16 ratio (576x1024)",
  },
  {
    id: "landscape",
    label: "Landscape",
    description: "16:9 ratio (1024x576)",
  },
] as const 