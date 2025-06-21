// Animaciones predefinidas para favicon
export const faviconAnimations = {
  // Parpadeo simple
  blink: (faviconHook, options = {}) => {
    const { interval = 1000, frames = 2 } = options
    const { setFavicon, resetFavicon } = faviconHook

    let currentFrame = 0
    const originalFavicon = "/logo.svg"
    const blankFavicon =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48L3N2Zz4K"

    const animationInterval = setInterval(() => {
      if (currentFrame % 2 === 0) {
        setFavicon(originalFavicon)
      } else {
        setFavicon(blankFavicon)
      }
      currentFrame++

      if (currentFrame >= frames * 2) {
        clearInterval(animationInterval)
        resetFavicon()
      }
    }, interval)

    return () => clearInterval(animationInterval)
  },

  // Rotación de colores
  colorRotation: (faviconHook, options = {}) => {
    const { interval = 500, colors = ["#4299e1", "#ef4444", "#10b981", "#f59e0b"] } = options
    const { setTextFavicon } = faviconHook

    let currentColorIndex = 0

    const animationInterval = setInterval(() => {
      setTextFavicon("S", {
        backgroundColor: colors[currentColorIndex],
        textColor: "#ffffff",
      })
      currentColorIndex = (currentColorIndex + 1) % colors.length
    }, interval)

    return () => clearInterval(animationInterval)
  },

  // Contador animado
  counter: (faviconHook, options = {}) => {
    const { start = 0, end = 10, interval = 200 } = options
    const { setTextFavicon } = faviconHook

    let current = start

    const animationInterval = setInterval(() => {
      setTextFavicon(current.toString(), {
        backgroundColor: "#4299e1",
        textColor: "#ffffff",
      })

      current++
      if (current > end) {
        clearInterval(animationInterval)
      }
    }, interval)

    return () => clearInterval(animationInterval)
  },

  // Pulso de badge
  badgePulse: (faviconHook, options = {}) => {
    const { badgeText = "!", interval = 800, pulses = 5 } = options
    const { setFaviconWithBadge, resetFavicon } = faviconHook

    let currentPulse = 0

    const animationInterval = setInterval(() => {
      const intensity = Math.sin((currentPulse * Math.PI) / pulses) * 0.5 + 0.5
      const red = Math.floor(239 * intensity + 100 * (1 - intensity))
      const badgeColor = `rgb(${red}, 68, 68)`

      setFaviconWithBadge({
        badgeText,
        badgeColor,
        backgroundColor: "#4299e1",
      })

      currentPulse++
      if (currentPulse >= pulses * 2) {
        clearInterval(animationInterval)
        resetFavicon()
      }
    }, interval)

    return () => clearInterval(animationInterval)
  },
}

// Función helper para ejecutar animaciones
export const playFaviconAnimation = (animationName, faviconHook, options = {}) => {
  const animation = faviconAnimations[animationName]
  if (!animation) {
    console.warn(`Animación '${animationName}' no encontrada`)
    return null
  }

  return animation(faviconHook, options)
}
