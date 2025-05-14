import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, useMediaQuery, useTheme, Box } from '@mui/material';
import { highlightCode } from '../../../lib/shikiHighlighter';

interface CodeModalProps {
  open: boolean;
  onClose: () => void;
  content: string;
  title: string;
  language: 'ttl' | 'json' | 'jsonld';
}

const CodeModal: React.FC<CodeModalProps> = ({ open, onClose, content, title, language }) => {
  const [highlightedHtml, setHighlightedHtml] = useState<string>('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md')); 

  useEffect(() => {
    if (open) {
      highlightCode(content, language === 'ttl' ? 'turtle' : 'json').then(setHighlightedHtml);
    }
  }, [open, content, language]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={fullScreen}
      maxWidth="xl" 
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            bgcolor: '#24292e', 
            p: 2,      
            borderRadius: 1,
            overflowX: 'auto',   
            fontFamily: 'monospace',
            fontSize: '0.9rem',
          }}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CodeModal;
