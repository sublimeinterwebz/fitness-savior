import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FitnessSavior from './FitnessSavior.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FitnessSavior />
  </StrictMode>,
)
