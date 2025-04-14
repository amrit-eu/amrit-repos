"use client";

import { Dialog } from '@mui/material';
import { useRouter } from 'next/navigation';

import React from 'react'

const Modal = ({children} : {children: React.ReactNode}) => {
    const router = useRouter()

    const handleClose = () => {
        router.back()
    }

  return (    
        <Dialog id="modal" open={true} onClose={handleClose} slotProps={{
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