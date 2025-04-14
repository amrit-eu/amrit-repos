import { logout } from '@/app/_actions/auth'
import React from 'react'
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton, Tooltip } from '@mui/material';

const LogOutButton = () => {
  return (
    <Tooltip title='Log out'>
        <IconButton onClick={() => logout() } color="primary"  aria-label="Log out button" >
            <LogoutIcon/>        
        </IconButton>
    </Tooltip>
  )
}

export default LogOutButton