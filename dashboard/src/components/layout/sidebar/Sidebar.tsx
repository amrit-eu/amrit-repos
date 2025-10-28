'use client';

import { Drawer, Box } from '@mui/material';
import SidebarList from './SidebarList';
import type { SidebarOption } from '../../../types/types';

interface SidebarProps {
  darkMode: boolean;
  open: boolean;
}

const drawerWidth = 280;
const collapsedWidth = 64;

const sidebarOptions: SidebarOption[] = [
	{ label: 'Home', path: '/' },
	{
	  label: 'Alerts', path: '/alerts/alerts-table' 
	}
  ];

const Sidebar: React.FC<SidebarProps> = ({
  open,
}) => {
  return (
    <Drawer
      variant="permanent"
      open={open}
      aria-label="Sidebar Navigation"
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
          transition: 'width 0.3s',
          overflowX: 'hidden',
          borderRight: '1px solid rgba(0,0,0,0.1)',
          boxShadow: 1,
		  overflow: 'visible'
        },
      }}
    >
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', mt: '64px' }}>
	  	<SidebarList category="" options={sidebarOptions} open={open} />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
