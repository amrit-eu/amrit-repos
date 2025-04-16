'use client';

import { Box, Button } from '@mui/material';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import AddSubscriptionModal from './AddSubscriptionModal';
import MySubscriptionsTable from './MySubscriptionsTable';
import { AlertSubscription } from '@/types/alert-subscription';

const MySubscriptionsClient = ({ initialData }: { initialData: AlertSubscription[] }) => {
  const [addModalOpen, setAddModalOpen] = useState(false);

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddModalOpen(true)}
        >
          Add Subscription
        </Button>
      </Box>

      <MySubscriptionsTable data={initialData} />

      <AddSubscriptionModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={(newSub) => {
          console.log('Confirmed new subscription:', newSub);
          setAddModalOpen(false);
        }}
      />
    </Box>
  );
};

export default MySubscriptionsClient;
