import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/neo.css'
import './styles/reference-theme.css'
import App from './App.tsx'

// Keep the splash up long enough to read as a deliberate load rather than a
// flash, but never block the app for long if a font or image is slow.
const SPLASH_MIN_MS = 100
const SPLASH_MAX_WAIT_MS = 1500

function hideSplash() {
  const splash = document.getElementById('app-splash')
  if (!splash) return

  const timeout = new Promise((resolve) => setTimeout(resolve, SPLASH_MAX_WAIT_MS))
  const assetsReady = Promise.all([
    document.fonts?.ready,
    new Promise((resolve) => {
      if (document.readyState === 'complete') resolve(null)
      else window.addEventListener('load', resolve, { once: true })
    }),
  ])

  Promise.race([assetsReady, timeout]).then(() => {
    const remaining = Math.max(0, SPLASH_MIN_MS - performance.now())

    setTimeout(() => {
      splash.classList.add('is-ready', 'is-hidden')
      splash.addEventListener('transitionend', () => splash.remove(), { once: true })
      setTimeout(() => splash.remove(), 250)
    }, remaining)
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

hideSplash()
