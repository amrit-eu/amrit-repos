import React from 'react';
import { AppBar, Toolbar, Box, TextField, InputAdornment, IconButton, Typography, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import DarkModeToggle from './DarkModeToggle'; 

interface MainTopbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setSearchText: (text: string) => void;
  sidebarOpen: boolean;  
  setSidebarOpen: (open: boolean) => void; 
  onSearchFocus: () => void;  
  onSearchBlur: () => void; 
}

const MainTopbar: React.FC<MainTopbarProps> = ({ darkMode, toggleDarkMode, setSearchText, sidebarOpen, setSidebarOpen, onSearchFocus, onSearchBlur }) => {

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: darkMode ? '#000' : '#fff',
        boxShadow: darkMode ? '0px 4px 8px rgba(0, 0, 0, 0.7)' : '0px 4px 8px rgba(0, 0, 0, 0.1)',
        borderBottom: darkMode ? '1px solid #000' : '1px solid #ddd' 
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
		paddingLeft: "8px !important",paddingRightt: "0px !important" }}>
        
        <Box sx={{ display: 'flex',  color: darkMode ? "#03a9f4" : "#009af4" }}>
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}   sx={{ marginLeft: '0px'}}>
            {sidebarOpen ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h5" noWrap sx={{  letterSpacing: "0.3px", marginTop: "3px", paddingLeft: '20px', fontWeight: 500, fontFamily: '"Quicksand", sans-serif', fontSize: '24px' }}>
            dash 
            <Typography variant="h5" component="span" sx={{ letterSpacing: "0.2px", marginTop: "3px", fontWeight: 300, fontFamily: '"Quicksand", sans-serif', fontSize: '24px' }}>
              boards
            </Typography>
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, paddingRight: '0px' }}>
          <Button variant="contained" color="primary" sx={{ textTransform: 'none' }}>
            Login
          </Button>
          <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </Box>
        
      </Toolbar>
    </AppBar>
  );
};

export default MainTopbar;
