import React from 'react'
import Modal from './ui/Modal'
import { DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import SubmitButton from './SubmitButton';

interface SubmitTextModalProps {
    open : boolean;
    onClose: () => void;
    onConfirm : (text :string) => void;

}

const SubmitTextModal = ({open, onClose, onConfirm} :SubmitTextModalProps) => {
  return (
    <Modal isModalOpen={open} handleClose={onClose}>
      <DialogTitle padding={10}>Add a Note to x alert(s)</DialogTitle>
      <DialogContent>
        <TextField
        label = "add a note"
        fullWidth         />
        
      </DialogContent>
      <DialogActions>
        <SubmitButton>Add note</SubmitButton>
      </DialogActions>
      
    </Modal>
  )
}

export default SubmitTextModal