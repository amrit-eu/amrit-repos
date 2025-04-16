'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Stack,
} from '@mui/material';
import React, { useState } from 'react';

type NewSubscriptionInput = {
	topicId: number;
	sendEmail: boolean;
  };
  

interface AddSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (newSubscription: NewSubscriptionInput) => void;
}

// improve this later with a real fetch from API
const mockTopics = [
  { id: 6, label: 'operational-beaching' },
  { id: 9, label: 'operational-technical-battery' },
  { id: 10, label: 'operational-technical-sensor' },
  { id: 12, label: 'data-qc-feedback' },
];

const AddSubscriptionModal = ({ open, onClose, onConfirm }: AddSubscriptionModalProps) => {
  const [topicId, setTopicId] = useState<number | ''>('');
  const [sendEmail, setSendEmail] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!topicId) return;

    onConfirm({
      topicId,
      sendEmail,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add a New Subscription</DialogTitle>

      <DialogContent>
        <Stack spacing={3} mt={1}>
          <FormControl fullWidth required>
            <InputLabel>Topic</InputLabel>
            <Select
              label="Topic"
              value={topicId}
              onChange={(e) => setTopicId(Number(e.target.value))}
            >
              {mockTopics.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
              />
            }
            label="Receive Emails"
          />

        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!topicId}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSubscriptionModal;
