export async function detectImageFormat(url: string): Promise<'svg' | 'png' | 'jpg'> {
  try {
    const response = await fetch(url)
    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('svg')) return 'svg'
    if (contentType?.includes('png')) return 'png'
    if (contentType?.includes('jpeg') || contentType?.includes('jpg')) return 'jpg'
    
    // Default to png if unknown
    return 'png'
  } catch (error) {
    console.error('Error detecting image format:', error)
    return 'png'
  }
}

export async function convertImage(
  url: string, 
  fromFormat: string, 
  toFormat: 'png' | 'jpg' | 'svg'
): Promise<Blob> {
  if (fromFormat === toFormat) {
    const response = await fetch(url)
    return response.blob()
  }

  if (fromFormat === 'svg') {
    // Convert SVG to PNG/JPG
    const response = await fetch(url)
    const svgText = await response.text()
    
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }
        
        ctx.drawImage(img, 0, 0)
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
            else reject(new Error('Failed to convert image'))
          },
          `image/${toFormat}`,
          0.9
        )
      }
      img.onerror = () => reject(new Error('Failed to load SVG'))
      img.src = 'data:image/svg+xml,' + encodeURIComponent(svgText)
    })
  }

  // For other conversions, just return the original format
  const response = await fetch(url)
  return response.blob()
} 