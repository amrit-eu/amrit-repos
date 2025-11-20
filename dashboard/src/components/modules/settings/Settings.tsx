import React from 'react'
import SettingsClient from './SettingsClient'
import { Me } from '@/types/me'
import { getFromGateway } from '@/lib/gateway/getFromGateway.server';

// server side component which fetch user data
const  Settings = async () => {
    let me :Me={};   
    try {
        me =await  getFromGateway<Me>('/oceanops/auth/me')
    } catch {
        me.firstName ='data not available'
    }

    <SettingsClient initialMe={me}/>
  
}

export default Settings