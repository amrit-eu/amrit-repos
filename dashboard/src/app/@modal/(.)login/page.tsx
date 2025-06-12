
import LoginForm from '@/components/layout/login/LoginForm'
import RoutedModal from '@/components/shared/modals/RoutedModal'
import React from 'react'

const Login = async ({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) => {
  const {callbackUrl} = await searchParams;
  return (
    <RoutedModal backgroundTransparent={true}>
        <LoginForm callbackUrl={callbackUrl} />
    </RoutedModal>
  )
}

export default Login