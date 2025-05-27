import { AlertColor, AlertPropsColorOverrides, IconButton,  Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react'
import SnackbarAlert from '../ui/SnackbarAlert';
import { OverridableStringUnion } from '@mui/types';
import actOnAlerts from '@/lib/alerta/actOnAlerts.client';
import SubmitTextModal from '../SubmitTextModal';
import addNoteOnAlerts from '@/lib/alerta/addNoteOnAlerts.client';

type AlertsTableToolbarActionsProps = {
    selected :  readonly string[]
    onActionDone : () => void
}
const AlertsTableToolbarActions = ({selected, onActionDone} : AlertsTableToolbarActionsProps) => {
    const [loading, setLoading] = useState(false);
    const [resultsMessage, setResultsMessage] = useState<string |null>(null)
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarSeverity, setSnackBarSeverity] = useState<OverridableStringUnion<AlertColor, AlertPropsColorOverrides>>("success")
    // state for Add a note modal :
    const [addNoteModalOpen, setAddNoteModalOpen] = useState(false);

    // TO DO : create a custom hook useAlertsAction which can be reuse in other components
    const handleActOnAlerts = async (action: "ack" | "unack" | "note", noteText?:string) : Promise<void> => {
        // which action to do :
        const actionHandlers = {
            ack: () => actOnAlerts(selected, 'ack'),
            unack: () => actOnAlerts(selected, 'unack'),
            note: () => addNoteOnAlerts(selected, noteText || ''),
        };        
        setLoading(true);        
        try {
             if (!actionHandlers[action]) {
                throw new Error(`Unsupported action: ${action}`);                
            }
            //act on alert :
            const results = await actionHandlers[action]();

            // handle differents results :
            if (results.success > 0 && results.failed > 0) {
                setResultsMessage(`${results.success} alert${results.success === 1 ? ' was' : 's were'} successfully updated (${action}) but ${results.failed} ${results.failed === 1 ? 'was' : 'were'} not.`);
                setSnackBarSeverity("warning");
            } else if (results.success > 0) {
                setResultsMessage(`Successfully updated (${action}) ${results.success} alert${results.success === 1 ? '' : 's'}.`);
                setSnackBarSeverity("success");
            } else {
                setResultsMessage(`No alert was updated`);
                setSnackBarSeverity("warning");               
            }
        } catch {
            setResultsMessage(`Something went wrong while ${action}nowledging alerts.`);
            setSnackBarSeverity("error");
        } finally {
            setSnackBarOpen(true)
            setLoading(false)
            onActionDone();
            if (action == 'note') {
                setAddNoteModalOpen(false)
            }
        }
    }

    const handleCloseSnackbar = () => {
        setSnackBarOpen(false)
    }

  return (
   <>
        <SnackbarAlert snackBarOpen={snackBarOpen} handleCloseSnackbar={handleCloseSnackbar } message={resultsMessage ?? ""} severity={snackBarSeverity}/>
        
        <Tooltip title="Acknowledge">
            <IconButton onClick={() => handleActOnAlerts("ack")} disabled={loading} aria-label="Acknowledge alert">
                <CheckIcon />
            </IconButton>
        </Tooltip>

        <Tooltip title="Unacknowledge">
            <IconButton onClick={() => handleActOnAlerts("unack")} disabled={loading} aria-label="Acknowledge alert">
                <UndoIcon />
            </IconButton>
        </Tooltip>
        
        <Tooltip title="Add a note">
            <IconButton onClick={() => setAddNoteModalOpen(true)} disabled={loading} aria-label="Add note">
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

        <SubmitTextModal title={`Add a note on ${selected.length} alert${selected.length > 1 ? 's':''}`} open={addNoteModalOpen} onClose={() => setAddNoteModalOpen(false)} onConfirm={(textNote) => handleActOnAlerts("note",textNote) } pending={loading} />

   </>
  )
}

export default AlertsTableToolbarActions