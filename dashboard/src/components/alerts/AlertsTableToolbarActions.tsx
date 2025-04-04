import { IconButton, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import React from 'react'

const AlertsTableToolbarActions = () => {
  return (
   <>
    <Tooltip title="Add a note">
        <IconButton>
            <NoteAddIcon />
        </IconButton>
    </Tooltip>
    
    <Tooltip title="Delete">
        <IconButton>
            <DeleteIcon />
        </IconButton>
    </Tooltip>
   </>
  )
}

export default AlertsTableToolbarActions