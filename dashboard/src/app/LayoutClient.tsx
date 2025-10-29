'use client';

import { useEffect, useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import MainTopbar from '../components/layout/MainTopbar';
import Sidebar from '../components/layout/sidebar/Sidebar';
import ThemeRegistry from '../theme/ThemeRegistry';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// Zustand
import { useAppStore } from '@/store/useAppStore';
import { useShallow } from 'zustand/react/shallow';

dayjs.extend(utc);

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  // 1) Call all hooks unconditionally, every render
  const { darkMode, sidebarOpen, toggleTheme, setSidebar } = useAppStore(
    useShallow((s) => ({
      darkMode: s.ui.darkMode,
      sidebarOpen: s.ui.sidebarOpen,
      toggleTheme: s.toggleTheme,
      setSidebar: s.setSidebar,
    }))
  );

  // 2) Mount guard only affects visibility, not hook order
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <ThemeRegistry mode={darkMode ? 'dark' : 'light'}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* Hide until mounted to avoid hydration flicker, but keep hooks order stable */}
        <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
          <MainTopbar
            darkMode={darkMode}
            toggleDarkMode={toggleTheme}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebar}
          />

          <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', mt: '64px' }}>
            <Sidebar darkMode={darkMode} open={sidebarOpen} />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                height: 'calc(100vh - 64px)',
                width: '100%',
              }}
            >
              {children}
            </Box>
          </Box>
        </div>
      </LocalizationProvider>
    </ThemeRegistry>
  );
}
