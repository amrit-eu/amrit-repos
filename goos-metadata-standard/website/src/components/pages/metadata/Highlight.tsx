import React from 'react';
import { Box } from '@mui/material';

interface HighlightProps {
  children: React.ReactNode;
}

const Highlight: React.FC<HighlightProps> = ({ children }) => {
  return (
    <Box
      component="span"
      sx={{
        fontWeight: 600,
        color: '#f38417', 
        display: 'inline',
      }}
    >
      {children}
    </Box>
  );
};

export default Highlight;
