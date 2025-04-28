
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
// Supports weights 300-700
import '@fontsource-variable/space-grotesk';
// import { Providers } from './Providers'; 
import { APP_ENV } from './config'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App/>
    {/* <Providers>
      <App />
    </Providers> */}
  </React.StrictMode>,
)
