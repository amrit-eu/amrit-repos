import { List, ListItem, ListItemIcon } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

interface DarkModeToggleProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <List>
      <ListItem sx={{ cursor: 'pointer' }} onClick={toggleDarkMode}>
        <ListItemIcon>{darkMode ? <Brightness7 /> : <Brightness4 />}</ListItemIcon>
      </ListItem>
    </List>
  );
};

export default DarkModeToggle;
