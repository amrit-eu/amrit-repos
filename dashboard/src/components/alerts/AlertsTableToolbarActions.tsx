import { IconButton, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react'

const AlertsTableToolbarActions = () => {
  return (
   <>
        <Tooltip title="Acknowledge">
            <IconButton>
                <CheckIcon />
            </IconButton>
        </Tooltip>
        
        <Tooltip title="Add a note">
            <IconButton>
                <NoteAddIcon />
            </IconButton>
        </Tooltip>

        <Tooltip title="Close">
            <IconButton>
                <CloseIcon />
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