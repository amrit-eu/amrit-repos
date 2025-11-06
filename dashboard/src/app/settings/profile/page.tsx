'use client';

import * as React from 'react';
import { Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import SettingsTabs from '@/components/modules/settings/SettingsTabs';
import ProfileForm from '@/components/modules/settings/ProfileForm';
import type { Me } from '@/types/me';
import { gatewayFetchViaProxy } from '@/lib/gateway/gatewayFetchViaProxy.client';

export default function ProfilePage() {
  const [me, setMe] = React.useState<Me | null>(null);
  const [loading, setLoading] = React.useState(true);

  const [snack, setSnack] = React.useState<{open: boolean; msg: string; sev: 'success'|'error'}>({
    open: false, msg: '', sev: 'success'
  });
  const openSnack = (msg: string, sev: 'success'|'error'='success') =>
    setSnack({ open: true, msg, sev });

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await gatewayFetchViaProxy<Me>('GET', '/oceanops/auth/me');
        if (!alive) return;
        setMe(data ?? {});
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
      <><SettingsTabs />
      <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          p: { xs: 2, sm: 3, md: 4 },
          backgroundColor: 'background.default',
        }}>
      {loading ? (
        <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <ProfileForm
          me={me}
          loading={false}
          onUpdated={(u) => setMe((prev) => ({ ...(prev ?? {}), ...u }))}
          openSnack={openSnack} />
      )}

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
