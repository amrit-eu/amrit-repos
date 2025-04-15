import { Box } from '@mui/material';
import { verifySession } from '@/app/_lib/session';


const Alerts = async () => {
  const session = await verifySession();
 
  return (
	<Box sx={{ width: '100%', padding: 2 }}>
	  My subscriptions dashboard coming soon
	</Box>
  );
};

export default Alerts;
