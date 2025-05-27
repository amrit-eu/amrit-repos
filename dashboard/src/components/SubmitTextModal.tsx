import React from 'react'
import Modal from './ui/Modal'
import { DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import SubmitButton from './SubmitButton';

interface SubmitTextModalProps {
    open : boolean;
    onClose: () => void;
    onConfirm : (text :string) => void;
    pending:boolean
    title:string
}

// Simple non-controlled form
const SubmitTextModal = ({open, onClose, onConfirm, pending, title} :SubmitTextModalProps) => {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const note = formData.get('text') as string
    onConfirm(note)    
  }

  return (
    <Modal isModalOpen={open} handleClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <TextField
          label = "submit a text"
          name="text" 
          fullWidth
          autoFocus         />
          
        </DialogContent>
        <DialogActions>
          <SubmitButton pending={pending}>Submit</SubmitButton>
        </DialogActions>
      </form>
      
    </Modal>
  )
}

export default SubmitTextModal