'use client';

import { useRouter } from 'next/navigation'
import Modal from './Modal'

const RoutedModal = ({children} : {children: React.ReactNode}) => {
    
    const router = useRouter()

    const handleClose = () => {
        router.back()
    }

  return (
    <Modal isModalOpen={true} handleClose={handleClose}>{children}</Modal>
  )
}

export default RoutedModal