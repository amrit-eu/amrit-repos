'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import DarkModeToggle from './DarkModeToggle';
import Link from 'next/link';
import LogOutButton from './login/LogOutButton';


interface MainTopbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const MainTopbar: React.FC<MainTopbarProps> = ({
  darkMode,
  toggleDarkMode,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const theme = useTheme(); 

  return (
    <AppBar
      position="fixed"
      elevation={2}
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', pl: { xs: 2, sm: 0 } }}>
          <IconButton
            edge="start"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{ mr: 1 }}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>

          <Typography
			variant="h6"
			noWrap
			sx={{
				fontFamily: '"Quicksand", sans-serif',
				display: 'flex',
				alignItems: 'center',
				ml: 1,
				fontWeight: 500,
				mt: -0.7,
				letterSpacing: '0px',
				color: "#4cb2b6",
			}}
			>
				<Box
					component="img"
					src="/img/amrit-logo-name.png" 
					alt="Amrit logo"
					sx={{
					height: '1.4rem',
					mr: 0.3,
					display: 'inline-block',
					}}
				/>
			</Typography>

        </Box>

        {/* Right side: Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}> 

          <Button component={Link} variant="contained" color="primary" sx={{ textTransform: 'none' }} href='/login'>
            Login
          </Button>
          <LogOutButton />          
          <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MainTopbar;
