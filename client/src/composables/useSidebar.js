import { ref } from 'vue'

const STORAGE_KEY = 'sidebar-collapsed'

function getStoredValue() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'true'
  } catch {
    return false
  }
}

const isCollapsed = ref(getStoredValue())

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
  try {
    localStorage.setItem(STORAGE_KEY, String(isCollapsed.value))
  } catch {
    // ignore
  }
}

// Responsive: auto-collapse on narrow viewports
// We track whether the current collapse was forced by the media query
let forcedByMedia = false

function setupMediaQuery() {
  if (typeof window === 'undefined') return

  const mq = window.matchMedia('(max-width: 1099px)')

  function handleMediaChange(e) {
    if (e.matches) {
      // Narrow: force collapse without writing to localStorage
      if (!isCollapsed.value) {
        forcedByMedia = true
        isCollapsed.value = true
      }
    } else {
      // Wide again: restore from localStorage
      if (forcedByMedia) {
        forcedByMedia = false
        isCollapsed.value = getStoredValue()
      }
    }
  }

  // Initial check
  if (mq.matches && !isCollapsed.value) {
    forcedByMedia = true
    isCollapsed.value = true
  }

  if (mq.addEventListener) {
    mq.addEventListener('change', handleMediaChange)
  } else {
    // Safari < 14 fallback
    mq.addListener(handleMediaChange)
  }
}

setupMediaQuery()

export function useSidebar() {
  return {
    isCollapsed,
    toggleSidebar
  }
}
