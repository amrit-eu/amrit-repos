import { useState, useEffect } from 'react';
import SidebarHeader from './SidebarHeader';
import SidebarList from './SidebarList';
import DarkModeToggle from './DarkModeToggle';
import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer, Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface SidebarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}

const sidebarSections = [
  {
    category: "METADATA",
    options: [
      { label: "Introduction", path: "intro" },
      { label: "Dictionary", path: "dictionary" },
      { label: "Diagram", path: "diagram" },
      { label: "Code Tables", path: "code-tables" },
      { label: "JSON", path: "json" },
      { label: "CSV", path: "csv" },
      { label: "API", path: "api" },
    ]
  },
  {
    category: "PASSPORTS",
    options: [
		{ label: "Passport", path: "passport" },
      	{ label: "Workflow", path: "workflow"},
		{ label: "Pre-register", path: "preregister" }
    ]
  }
];

const Sidebar: React.FC<SidebarProps> = ({ darkMode, toggleDarkMode, selectedOption, setSelectedOption }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const navigate = useNavigate();
  const location = useLocation();

  // Sync selectedOption with URL
useEffect(() => {
  const currentPath = location.pathname.replace(/^\/+/, ''); // remove leading slash(es)
  const currentOption = sidebarSections
    .flatMap(section => section.options)
    .find(option => option.path === currentPath);
  if (currentOption) {
    setSelectedOption(currentOption.label);
  }
}, [location, setSelectedOption]);

  return (
    <>
      {/* Only show toggle button on xs/sm/md screens */}
      {isSmallScreen && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            top: 12,
            left: 12,
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant={isSmallScreen ? 'temporary' : 'permanent'}
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: { xs: 220, md: 280 },
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: { xs: 220, md: 280 },
            transition: 'width 0.3s',
            overflowX: 'hidden',
            zIndex: isSmallScreen ? theme.zIndex.drawer + 2 : 'auto',
          },
        }}
      >
        <SidebarHeader open={!isSmallScreen || open} setOpen={setOpen} darkMode={darkMode} />

        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {sidebarSections.map(({ category, options }) => (
            <SidebarList
              key={category}
              category={category}
              options={options}
              selectedOption={selectedOption}
              setSelectedOption={(option) => {
                setSelectedOption(option);
                const selectedPath = options.find(o => o.label === option)?.path;
                if (selectedPath) {
                  navigate(selectedPath);
                  if (isSmallScreen) setOpen(false); // Close menu on selection
                }
              }}
              darkMode={darkMode}
              open={!isSmallScreen || open}
            />
          ))}

          <Box sx={{ marginTop: 'auto' }}>
            <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} open={!isSmallScreen || open} />
          </Box>
        </Box>
      </Drawer>
    </>
  );
};


export default Sidebar;
