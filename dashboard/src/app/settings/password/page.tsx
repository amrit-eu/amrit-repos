
import * as React from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import SettingsTabs from '@/components/modules/settings/SettingsTabs';
import PasswordForm from '@/components/modules/settings/PasswordForm';

export default function PasswordPage() {

  return (
      <><SettingsTabs />
      <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                p: { xs: 2, sm: 3, md: 4 },
                backgroundColor: 'background.default',
              }}>
      <PasswordForm />

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnack(s => ({ ...s, open: false }))}
          severity={snack.sev}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box></>
  );
}
