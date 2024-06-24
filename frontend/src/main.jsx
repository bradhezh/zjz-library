import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'

// script extension can be omitted
import App from './App'

// initial render; of course render() of App and all its children is called
createRoot(document.getElementById('root')).render(
  // if jsx used, this script should have extension ".jsx" to indicate to vite
  // it needs to be transformed;
  // jsx syntax: create the virtual DOM with App as a placeholder
  <StrictMode>
    <App />
  </StrictMode>
)
