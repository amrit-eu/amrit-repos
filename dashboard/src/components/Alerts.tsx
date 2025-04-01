import { Box } from '@mui/material';
import getAllOpenAlerts from '@/lib/fetchAlerts';
import EnhancedTable from './alert_table/EnhancedTable';


const Alerts = () => {

 





  return (
    <Box sx={{ width: '100%', padding:2 }}>
		
    <EnhancedTable/>

    </Box>
  );
};

export default Alerts;
