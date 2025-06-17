import BasicTable from '@/components/shared/tables/basicTable/BasicTable'
import { ALERTS_ATTRIBUTES_TABLE_CONFIG, ALERTS_DETAILS_GENERAL_INFO_TABLE_CONFIG, ALERTS_HISTORY_TABLE_CONFIG, ALERTS_NOTES_TABLE_CONFIG } from '@/config/tableConfigs/alertTableConfig'
import { gatewayFetchViaProxy } from '@/lib/gateway/gatewayFetchViaProxy.client'
import { Alert, Note, NoteApiResponse } from '@/types/alert'
import { Box, CircularProgress, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

interface AlertDetailsProps {      
    data: Alert   
}

const AlertDetails = ({ data} : AlertDetailsProps) => {

  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNoteLoading] = useState(false)

   // fetch alert's notes data
    useEffect(() => {   
      let isLatestRequest = true; 
      const controller = new AbortController();
      const signal = controller.signal;
  
      async function fetchAlertNotes() {
        setNoteLoading(true);
        try {
          const notesApiResponse= await gatewayFetchViaProxy<NoteApiResponse>('GET', `/alerta/alert/${data.id}/notes`, undefined, signal);
          if (isLatestRequest) { 
            setNotes(notesApiResponse.notes)
          }
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
          }        
        } finally {
          if (isLatestRequest) { 
            setNoteLoading(false);
          }
        }
      }  
      fetchAlertNotes();
      
      return () => {
        isLatestRequest = false; 
        controller.abort();
      };    
    }, [data])



  return (
    <Box  sx={{ marginInline:2, marginBottom: 4  }}>
      <Typography  variant="h6" gutterBottom component="div">General informations</Typography>
      <BasicTable colmunsConfiguration={ALERTS_DETAILS_GENERAL_INFO_TABLE_CONFIG} data={[data]}  />
      <Typography sx={{ marginTop: 3 }} variant="h6" gutterBottom component="div">Alert attributes</Typography>
      <BasicTable colmunsConfiguration={ALERTS_ATTRIBUTES_TABLE_CONFIG} data={data.attributes ? [{id:data.id, ...data.attributes}] : []}  />
      <Typography  sx={{ marginTop: 3 }} variant="h6" gutterBottom component="div">Alert&apos;s notes</Typography>
      {notesLoading ? <CircularProgress /> :
      <BasicTable colmunsConfiguration={ALERTS_NOTES_TABLE_CONFIG} data={notes}  /> }
      <Typography  sx={{ marginTop: 3 }} variant="h6" gutterBottom component="div">History</Typography>
      <BasicTable colmunsConfiguration={ALERTS_HISTORY_TABLE_CONFIG} data={data.history}  /> 
    </Box>
  )
}

export default AlertDetails