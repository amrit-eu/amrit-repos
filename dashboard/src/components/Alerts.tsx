import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import getAllOpenAlerts from '@/lib/fetchAlerts';
import EnhancedTable from './enhancedTable/EnhancedTable';


const Alerts = async () => {

  // fetch alerts data
  const alertsData: Promise<AlertApiResponse> = getAllOpenAlerts();
  const data = await alertsData;
  const alerts=data.alerts;
    





  return (
    <Box sx={{ width: '100%', padding:2 }}>
		
    <EnhancedTable alerts={alerts}/>

    </Box>
  );
};

export default Alerts;
