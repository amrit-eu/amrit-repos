import { Box } from '@mui/material';
import { getAlertCount } from '@/lib/fetchAlerts';
import AlertsClientWrapper from './AlertsClientWrapper';


const Alerts = async () => {
  // fetch filters data here (server side) :
  // TO DO : make filters configurable
  const alertsCountData = getAlertCount();
  const counts = await alertsCountData;

  const filtersData = {
    severity: Object.entries(counts.severityCounts).map(([key, value])=> `${key} (${value})`),
    status:  Object.entries(counts.statusCounts).map(([key, value])=> `${key} (${value})`)
  }
 
 
  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <AlertsClientWrapper filtersData={filtersData}/>
    </Box>
  );
};

export default Alerts;
