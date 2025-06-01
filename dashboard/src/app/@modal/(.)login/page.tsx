
import LoginForm from '@/components/layout/login/LoginForm'
import RoutedModal from '@/components/shared/modals/RoutedModal'
import React from 'react'

const Login = () => {
  return (
    <RoutedModal backgroundTransparent={true}>
        <LoginForm />
    </RoutedModal>
  )
}

export default Login