'use client';

import { useState } from 'react';
import EditableTable from '../../editableTable/EditableTable';
import { AlertSubscription } from '@/types/alert-subscription';
import { subscriptionsTableConfig } from '@/config/tableConfigs/subscriptionsTableConfig';
import AddFilterModal from './AddFilterModal';
import { FilterValue } from './AddFilterModal';

interface Props {
  data: AlertSubscription[];
}

type AlertSubscriptionRow = Omit<AlertSubscription, 'id'> & { id: string };


const MySubscriptionsTable = ({ data }: Props) => {
  const [loading] = useState(false);
  const [openAddFilterForId, setOpenAddFilterForId] = useState<string | null>(null);

  const handleConfirmAddFilter = (filterType: string, value: FilterValue) => {
	if (!openAddFilterForId) return;
  
	// 👇 You can implement real update logic here
	console.log(`Add filter "${filterType}" with value:`, value, 'to row:', openAddFilterForId);
  
	// Close modal
	setOpenAddFilterForId(null);
  };
  
  const [subscriptions] = useState<AlertSubscriptionRow[]>(
	data.map((s) => ({ ...s, id: String(s.id) }))
  );

  const handleDeleteRow = (id: string) => {
	console.log('Delete row with ID:', id);
	// Later: make an API call and update the state
  };

  const handleToggleSwitch = (id: string, field: keyof AlertSubscriptionRow, newValue: boolean) => {
	console.log('Toggle:', { id, field, newValue });
  
	// TODO: Update local state and/or make API call
  };
  
  return (
	<>
    <EditableTable<AlertSubscriptionRow> 
		loading={loading}
		data={subscriptions}
		totalCount={subscriptions.length}
		columnsConfiguration={subscriptionsTableConfig}
		onDeleteRow={handleDeleteRow}
		onToggleSwitch={handleToggleSwitch}
		onOpenAddFilter={setOpenAddFilterForId}
    />
	<AddFilterModal
		open={!!openAddFilterForId}
		onClose={() => setOpenAddFilterForId(null)}
		onConfirm={handleConfirmAddFilter}
	/>
	</>
  );
};

export default MySubscriptionsTable;
