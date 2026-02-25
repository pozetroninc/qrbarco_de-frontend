import sassConfig from '../app.sass.config.json'

const COLOR_SCHEMES = sassConfig.COLOR_SCHEMES

export const COLOR_SCHEME_KEYS = Object.keys(COLOR_SCHEMES)

export function getRandomColorScheme() {
  if (!COLOR_SCHEME_KEYS.length) return null
  return COLOR_SCHEME_KEYS[Math.floor(Math.random() * COLOR_SCHEME_KEYS.length)]
}

export function rgbString({r, g, b}) {
  return `${r}, ${g}, ${b}`
}

export function applyColorScheme(schemeName) {
  if (!schemeName || !COLOR_SCHEMES[schemeName]) return
  const scheme = COLOR_SCHEMES[schemeName]
  const root = document.documentElement
  for (const [slot, rgb] of Object.entries(scheme)) {
    root.style.setProperty(`--scheme-${slot}-rgb`, rgbString(rgb))
    root.style.setProperty(`--scheme-${slot}`, `rgb(${rgbString(rgb)})`)
  }
}

export function isValidColorScheme(value) {
  return !value || COLOR_SCHEME_KEYS.includes(value)
}
