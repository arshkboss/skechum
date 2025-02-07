import type { RecraftV3 } from "@fal-ai/client/models"

type RecraftStyle = NonNullable<RecraftV3['input']>['style']

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