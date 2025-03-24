import { Drawer, Box } from '@mui/material';
import SidebarList from './SidebarList'; 
import { SidebarOption } from '../../types/types'; 

interface SidebarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  selectedOption: SidebarOption;
  setSelectedOption: (option: SidebarOption) => void;
  setSearchText: (text: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ darkMode, selectedOption, setSelectedOption, open }) => {


  return (
	<Drawer
		variant="permanent"
		open={open}
		sx={{
			width: open ? 280 : 60,
			flexShrink: 0,
			'& .MuiDrawer-paper': {
				width: open ? 280 : 60,
				transition: 'width 0.3s',
				overflowX: 'hidden'
			},
		}}
	>

		
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', marginTop: '74px' }}>

        {/* Home, Interactive Map, and Log In options */}
        <SidebarList
          category=""
          options={['Home', 'Alerts']}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          darkMode={darkMode}
          open={open}
        />

      </Box>
    </Drawer>
  );
};

export default Sidebar;
