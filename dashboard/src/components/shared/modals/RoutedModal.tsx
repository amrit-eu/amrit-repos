'use client';

import { usePathname, useRouter } from 'next/navigation'
import Modal from './Modal'

const RoutedModal = ({children, backgroundTransparent=false} : {children: React.ReactNode, backgroundTransparent?:boolean}) => {
    
    const router = useRouter()    
    const pathname = usePathname();

    const isOpen = pathname === '/login'
    
    const handleClose = () => {
        router.back()
    }

  return (
    <Modal isModalOpen={isOpen} handleClose={handleClose} backgroundTransparent={backgroundTransparent}>{children}</Modal>
  )
}

export default RoutedModal