"use client";

import { Dialog } from '@mui/material';

import React from 'react'

interface ModalProps {
  children:React.ReactNode
  isModalOpen : boolean
  handleClose : () => void

}

const Modal = ({children, isModalOpen, handleClose} : ModalProps) => {
   

  return (    
        <Dialog id="modal" open={isModalOpen} onClose={handleClose} slotProps={{
          backdrop: {
            sx: {             
              backdropFilter: 'blur(2px)',
             
            },
          },
           paper : {
            sx: {
              backgroundColor: 'transparent',
              backgroundImage: 'none',
              boxShadow: 'none',
              width: '100%',
            },
          }}}>

            {children}

        </Dialog>

  )
}

export default Modal