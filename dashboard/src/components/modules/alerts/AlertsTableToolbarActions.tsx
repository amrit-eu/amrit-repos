import { Button, IconButton,  Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react'
import SnackbarAlert from '../../shared/feedback/SnackbarAlert';
import SubmitTextModal from '../../shared/modals/SubmitTextModal';
import { useAlertActions } from '@/hooks/useAlertActions';
import ConfirmationDialogModal from '@/components/shared/modals/ConfirmationDialogModal';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {useRouter } from 'next/navigation';
import { Alert } from '@/types/alert';

type AlertsTableToolbarActionsProps = {
    selected :  readonly string[]
    setSelected : React.Dispatch<React.SetStateAction<readonly string[]>>
    onActionDone : () => void
    isUserLogin:boolean
    userRoles: string[]
    alertsData:  Array<Alert>
}
const AlertsTableToolbarActions = ({selected, setSelected, onActionDone, isUserLogin,alertsData, userRoles} : AlertsTableToolbarActionsProps) => {
    const router = useRouter();
    // state for Add a note modal :
    const [addNoteModalOpen, setAddNoteModalOpen] = useState(false);
    // state for confirmation dialog on delete :
    const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false)
    // state for snackbar when user not logged or don't have permissions :
    const [userNotLoggedNoPermissionsSnackBarOpen, setUserNotLoggedNoPermissionsSnackBarOpen] = useState(!isUserLogin || !userRoles.includes("alert_editor"));

    // use a custom hook useAlertsAction which can be reuse in other components
    const {
        loading,
        handleActOnAlerts,
        resultsMessage,
        severity,
        clearResultMessage,
    } = useAlertActions(selected, onActionDone)   

    const areActionDisabled = loading || !isUserLogin || !userRoles.includes("alert_editor");

    const shouldShowGlobalTooltip = !isUserLogin || !userRoles.includes("alert_editor");
    const tooltipMessage = !isUserLogin
    ? "You must be logged in to perform actions"
    : !userRoles.includes("alert_editor")
    ? "You don't have permission to perform actions"
    : "";

    const handleCloseSnackBarAfterAction = () => {
        clearResultMessage();
       
        // check if selected alerts are in the new fetched alerts list (depends on filter applied)
        const updatedSelected = []
        for (const alertId of selected) { 
            if (alertsData.map(alert => alert.id).includes(alertId)) {
                updatedSelected.push(alertId)
            }
        }
        setSelected(updatedSelected)
    }
  return (
   <>
        <Tooltip title={tooltipMessage} disableHoverListener={!shouldShowGlobalTooltip}>
            <span style={{ display: 'flex'}}>
                <SnackbarAlert snackBarOpen={!!resultsMessage} handleCloseSnackbar={handleCloseSnackBarAfterAction } message={resultsMessage ?? ""} severity={severity}/>
                <SnackbarAlert  snackBarOpen={userNotLoggedNoPermissionsSnackBarOpen} handleCloseSnackbar={() => setUserNotLoggedNoPermissionsSnackBarOpen(false)} message={tooltipMessage} severity={'warning'}
                    action={<>
                    <Button variant='outlined' color='inherit' onClick={() => router.push('/login')}>Login</Button>
                    <IconButton
                    aria-label="close"
                    color="inherit"
                    sx={{ p: 0.5 }}
                    onClick={() => setUserNotLoggedNoPermissionsSnackBarOpen(false)}
                    >
                    <CloseIcon />
                    </IconButton>
                    </>
                    }
                    />
                
                <Tooltip title="Acknowledge">
                    <IconButton onClick={() => handleActOnAlerts("ack")} disabled={areActionDisabled} aria-label="Acknowledge alert">
                        <CheckIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Unacknowledge">
                    <IconButton onClick={() => handleActOnAlerts("unack")} disabled={areActionDisabled} aria-label="Acknowledge alert">
                        <UndoIcon />
                    </IconButton>
                </Tooltip>
                
                <Tooltip title="Add a note">
                    <IconButton onClick={() => setAddNoteModalOpen(true)} disabled={areActionDisabled} aria-label="Add note">
                        <NoteAddIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Open">
                    <IconButton onClick={() => handleActOnAlerts("open")} disabled={areActionDisabled} aria-label="open alert">
                        <LockOpenIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Close">
                    <IconButton onClick={() => handleActOnAlerts("close")} disabled={areActionDisabled} aria-label="close alert">
                        <CloseIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                    <IconButton onClick={() => setDeleteConfirmationDialogOpen(true)} disabled={areActionDisabled} aria-label="delete alert">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </span>
        </Tooltip>
        {/* MODALS */}

        <SubmitTextModal title={`Add a note on ${selected.length} alert${selected.length > 1 ? 's':''}`} open={addNoteModalOpen} onClose={() => setAddNoteModalOpen(false)} 
        onConfirm={async (textNote) => {
            await handleActOnAlerts("note", textNote);
            setAddNoteModalOpen(false);
            }} 
        pending={loading} />

        <ConfirmationDialogModal open={deleteConfirmationDialogOpen} onClose={() => setDeleteConfirmationDialogOpen(false)} onConfirm={async () => {await handleActOnAlerts("delete"); setDeleteConfirmationDialogOpen(false)} } pending={loading}>        
            {`Are you sure you want to delete ${selected.length} alert${selected.length>1 ? 's' :''} ? `}            
        </ConfirmationDialogModal>

   </>
  )
}

export default AlertsTableToolbarActions