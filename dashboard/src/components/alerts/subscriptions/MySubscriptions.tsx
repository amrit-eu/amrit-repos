import { Box, Typography } from '@mui/material';
import { verifySession } from '@/app/_lib/session';


const Alerts = async () => {
  const session = await verifySession();
 
  return (
	<Box sx={{ width: '100%', padding: 2 }}>
	   	{session && 
          <Typography variant="h6" sx={{ mb: 3 }}>
            {`${session.username}'s subscriptions! Coming soon`}
          </Typography> } 
	</Box>
  );
};

export default Alerts;
