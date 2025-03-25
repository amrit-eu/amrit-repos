'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import MainTopbar from '../components/MainTopbar';
import Sidebar from '../components/sidebar/Sidebar';
import Home from '../components/Home';
import Alerts from '../components/Alerts';
import { SidebarOption } from '../types/types';
import ThemeRegistry from '../theme/ThemeRegistry';

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SidebarOption>('Home');
  const [searchText, setSearchText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchActive, setSearchActive] = useState(false);

  const isMobile = useMediaQuery('(max-width:900px)');

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);
  

  return (
    <ThemeRegistry mode={darkMode ? 'dark' : 'light'}>
      <MainTopbar
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode((prev) => !prev)}
        setSearchText={setSearchText}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onSearchFocus={() => setSearchActive(true)}
        onSearchBlur={() => setSearchActive(false)}
      />

      <Box
        component="div"
        sx={{
          display: 'flex',
          height: 'calc(100vh - 64px)',
          width: '100vw',
          mt: '64px',
        }}
      >
        <Box
          component="aside"
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
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            open={sidebarOpen}
          />
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 2,
            overflow: 'auto',
            height: 'calc(100vh - 64px)',
            width: '100%',
          }}
        >
          {selectedOption === 'Alerts' ? (
            <Alerts />
          ) : (
            <Home />
          )}
        </Box>
      </Box>
    </ThemeRegistry>
  );
}
