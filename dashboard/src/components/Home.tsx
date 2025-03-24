import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Button, useTheme } from '@mui/material';

interface HomeProps {
	setSearchText: (text: string) => void;
}
  

const Home: React.FC<HomeProps> = ({ setSearchText }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';


  return (
    <Box sx={{
      height: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 2,
      paddingBottom: 0,
      textAlign: 'center',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
		
      <Box sx={{ marginTop: 0, width: '100%', maxWidth: '700px' }}>
        <Typography variant="h5" sx={{ marginTop: 0, marginBottom: 0, marginRight: 0 }}>
              These dashboards are a free to use, collaborative project.<br/> <a href="https://github.com/British-Oceanographic-Data-Centre/amrit-repos" target="_blank">Join us on GitHub!</a>
        </Typography>
      </Box>

    </Box>
  );
};

export default Home;
