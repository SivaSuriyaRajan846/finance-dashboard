import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

try {
  const t = localStorage.getItem('zorovyn_finance_theme')
  if (t === 'dark') document.documentElement.dataset.theme = 'dark'
} catch {
  /* private mode */
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
