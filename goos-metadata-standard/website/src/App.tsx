import { useState } from 'react';
import { CssBaseline, Box, createTheme, ThemeProvider } from '@mui/material';
import Sidebar from './components/sidebar/Sidebar';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Intro from './components/pages/metadata/Intro';
import Diagram from './components/pages/metadata/Diagram';
import Dictionary from './components/pages/metadata/Dictionary';
import CodeTables from './components/pages/metadata/CodeTables';
import Passports from './components/pages/passports/Passports';
import JSON from './components/pages/metadata/OceanJson';
import CSV from './components/pages/metadata/OceanCsv';
import API from './components/pages/metadata/OceanAPI';
import RequestIds from './components/pages/passports/PreRegistration';
import SubmitPlatforms from './components/pages/passports/Workflow';

function AppContent({ darkMode, setSelectedOption }: { darkMode: boolean; setSelectedOption: (option: string) => void }) {

  return (
    <Box
      component="main"
      sx={{
			flexGrow: 1,
			px: 3,
			pt: 3,
			pb: 6,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'stretch', // or 'center' if needed
			minHeight: '100vh', // ✅ allow page to grow, but respect full screen on short pages
			overflowY: 'auto',
      }}
    >
		<Routes>
			<Route path="/intro" element={<Intro darkMode={darkMode} setSelectedOption={setSelectedOption} />} />
			<Route path="/diagram" element={<Diagram darkMode={darkMode} />} />
			<Route path="/dictionary" element={<Dictionary darkMode={darkMode} />} />
			<Route path="/code-tables" element={<CodeTables darkMode={darkMode} />} />
			<Route path="/passport" element={<Passports darkMode={darkMode} />} />
			<Route path="/json" element={<JSON darkMode={darkMode} />} />
			<Route path="/csv" element={<CSV darkMode={darkMode} />} />
			<Route path="/api" element={<API darkMode={darkMode} />} />
			<Route path="/workflow" element={<SubmitPlatforms darkMode={darkMode} />} />
			<Route path="/preregister" element={<RequestIds darkMode={darkMode} />} />
			<Route path="/" element={<Navigate to="/intro" replace />} />
			<Route path="*" element={<Navigate to="/intro" replace />} />
		</Routes>
    </Box>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('OceanMeta');

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', width: '100vw' }}>
          <Sidebar
            darkMode={darkMode}
            toggleDarkMode={() => setDarkMode(!darkMode)}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
          <AppContent darkMode={darkMode} setSelectedOption={setSelectedOption} />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
