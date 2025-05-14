// components/CodeModal.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeModalProps {
  open: boolean;
  onClose: () => void;
  content: string;
  title: string;
  language: 'json' | 'jsonld' | 'ttl';
}

const CodeModal: React.FC<CodeModalProps> = ({ open, onClose, content, title, language }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <SyntaxHighlighter language={language} style={oneDark} wrapLongLines>
        {content}
      </SyntaxHighlighter>
    </DialogContent>
  </Dialog>
);

export default CodeModal;
