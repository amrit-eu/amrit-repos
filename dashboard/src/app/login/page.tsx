import LoginForm from '@/components/layout/login/LoginForm'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: 'Amrit Boards - Login',
    description: 'Amrit Boards login form',
    icons: {
      icon: '/favicon.png',
    },
  };

const Login = () => {
  return (
    <LoginForm />
  )
}

export default Login