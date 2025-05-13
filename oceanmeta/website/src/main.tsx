import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DataProvider } from './DataContext';
import '@fontsource/lexend/300.css';
import '@fontsource/lexend/400.css';
import '@fontsource/lexend/500.css';
import '@fontsource/lexend/600.css';
import '@fontsource/lexend/700.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
	<DataProvider>
    	<App />
	</DataProvider>
  </StrictMode>,
)
