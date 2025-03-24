'use client';

import { useState, useRef, useMemo } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import MainTopbar from '../components/MainTopbar';
import Sidebar from '../components/sidebar/Sidebar';
import Home from '../components/Home';
import Alerts from '../components/Alerts';
import { SidebarOption } from '../types/types';

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SidebarOption>('Home');
  const [searchText, setSearchText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchActive, setSearchActive] = useState(false);

  const sidebarSearchRef = useRef<HTMLInputElement>(null);

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: 'Montserrat, sans-serif',
        },
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
        breakpoints: {
          values: {
            xs: 0,
            sm: 900,
            md: 1200,
            lg: 1500,
            xl: 2500,
          },
        },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <MainTopbar
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode((prev) => !prev)}
        setSearchText={setSearchText}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onSearchFocus={() => setSearchActive(true)}
        onSearchBlur={() => setSearchActive(false)}
      />

      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', width: '100vw', mt: '64px' }}>
        <Box
          sx={{
            width: sidebarOpen ? 280 : 60,
            transition: 'width 0.3s',
            height: '100%',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Sidebar
            darkMode={darkMode}
            toggleDarkMode={() => setDarkMode((prev) => !prev)}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            setSearchText={setSearchText}
            open={sidebarOpen}
            setOpen={setSidebarOpen}
          />
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 0,
            overflow: 'auto',
            height: 'calc(100vh - 64px)',
            width: '100%',
          }}
        >
          {searchActive ? (
            <div>Search results for: {searchText}</div>
          ) : selectedOption === 'Alerts' ? (
            <Alerts />
          ) : (
            <Home setSearchText={setSearchText} />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
