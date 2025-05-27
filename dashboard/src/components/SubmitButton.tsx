import { Button, CircularProgress } from '@mui/material'
import React from 'react'
//import { useFormStatus } from 'react-dom';

// May be reusable in different form ? if not move to /components/login
const SubmitButton = ({children, pending} : {children: React.ReactNode, pending:boolean}) => {

    // pending from useFormStatus not working because of a React bug : https://github.com/facebook/react/issues/30368 
    // Using a props instead :
    //const {pending} = useFormStatus(); 

    return (
        <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={pending}
            startIcon={pending ? <CircularProgress size={20} /> : null}              
        >
            {children}
        </Button>
    )
}

export default SubmitButton