// Presets de favicon predefinidos
export const faviconPresets = {
  // Favicon de tienda por defecto
  store: {
    type: "text",
    text: "S",
    backgroundColor: "#4299e1",
    textColor: "#ffffff",
  },

  // Favicon de ofertas
  sale: {
    type: "badge",
    badgeText: "%",
    badgeColor: "#ef4444",
    backgroundColor: "#4299e1",
    textColor: "#ffffff",
  },

  // Favicon de productos nuevos
  new: {
    type: "badge",
    badgeText: "N",
    badgeColor: "#10b981",
    backgroundColor: "#4299e1",
    textColor: "#ffffff",
  },

  // Favicon de carrito
  cart: {
    type: "text",
    text: "🛒",
    backgroundColor: "#4299e1",
    textColor: "#ffffff",
  },

  // Favicon de notificación
  notification: {
    type: "badge",
    badgeText: "!",
    badgeColor: "#f59e0b",
    backgroundColor: "#4299e1",
    textColor: "#ffffff",
  },
}

// Función para aplicar un preset
export const applyFaviconPreset = (presetName, faviconHook) => {
  const preset = faviconPresets[presetName]
  if (!preset) {
    console.warn(`Preset '${presetName}' no encontrado`)
    return false
  }

  const { setTextFavicon, setFaviconWithBadge } = faviconHook

  switch (preset.type) {
    case "text":
      return setTextFavicon(preset.text, {
        backgroundColor: preset.backgroundColor,
        textColor: preset.textColor,
      })

    case "badge":
      return setFaviconWithBadge({
        badgeText: preset.badgeText,
        badgeColor: preset.badgeColor,
        backgroundColor: preset.backgroundColor,
        textColor: preset.textColor,
      })

    default:
      return false
  }
}

// Generar favicon dinámico basado en el estado de la tienda
export const generateDynamicFavicon = (storeState, faviconHook) => {
  const { cart, newProducts, sales, notifications } = storeState

  // Prioridades (de mayor a menor)
  if (cart && cart.length > 0) {
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0)
    return faviconHook.setFaviconWithBadge({
      badgeText: itemCount.toString(),
      badgeColor: "#10b981",
      backgroundColor: "#4299e1",
    })
  }

  if (notifications && notifications.length > 0) {
    return applyFaviconPreset("notification", faviconHook)
  }

  if (newProducts && newProducts.length > 0) {
    return faviconHook.setFaviconWithBadge({
      badgeText: newProducts.length.toString(),
      badgeColor: "#ef4444",
      backgroundColor: "#4299e1",
    })
  }

  if (sales && sales.active) {
    return applyFaviconPreset("sale", faviconHook)
  }

  // Favicon por defecto
  return faviconHook.resetFavicon()
}
