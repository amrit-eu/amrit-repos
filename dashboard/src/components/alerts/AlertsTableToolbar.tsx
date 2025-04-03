import { Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import React from 'react'

interface AlertsTableToolbarProps {
    numSelected: number;
  }

  // TO DO : must be a "toolbarLayout" with a children contianing the tools needed

const AlertsTableToolbar = ({numSelected} : AlertsTableToolbarProps) => {
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Alerts
        </Typography>
      )}
      {numSelected > 0 && (
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center'
          }}>

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
                   
        </Box>
      ) }
    </Toolbar>
  )
}

export default AlertsTableToolbar