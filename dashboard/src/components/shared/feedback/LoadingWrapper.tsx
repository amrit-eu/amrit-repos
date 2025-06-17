import { Box, CircularProgress, Paper } from '@mui/material'
import React from 'react'

interface TableWrapperProps {
    loading: boolean
    children: React.ReactNode
}

const LoadingWrapper = ({loading, children}:TableWrapperProps) => {
  return (
    <Box sx={{ width: '100%' }}>

      {loading && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1,          
        }}>
          <CircularProgress />
        </Box>
      )}
        <Paper sx={{ width: '100%', mb: 2 }}>
            {children}
        </Paper>
    </Box>
  )
}

export default LoadingWrapper