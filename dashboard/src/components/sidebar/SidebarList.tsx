import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { iconMapping, SidebarOption } from '../../types/types';

interface SidebarListProps {
  category: string;
  options: SidebarOption[];
  selectedOption: SidebarOption;
  setSelectedOption: (option: SidebarOption) => void;
  darkMode: boolean;
  open: boolean;
}

const SidebarList: React.FC<SidebarListProps> = ({ category, options, selectedOption, setSelectedOption, darkMode, open }) => {
  return (
    <>
      {category && (
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: '0.8rem',
            marginBottom: '0px',
            paddingLeft: '17px',
            paddingTop: '14px',
            height: '38px',
            color: darkMode ? "#03a9f4" : "#009af4",
          }}
        >
          {open ? category : ''}
        </Typography>
      )}

      <List sx={{ padding: 0 }}>
        {options.map(option => (
          <ListItem
            key={option}
            sx={{
              height: '40px',
              cursor: 'pointer',
              color: selectedOption === option ? (darkMode ? "#03a9f4" : "#009af4") : 'inherit',
              backgroundColor: selectedOption === option ? (darkMode ? '#333' : '#f0f0f0') : 'inherit',
              '&:hover': {
                backgroundColor: darkMode ? '#555' : '#f5f5f5',
              },
            }}
            onClick={() => setSelectedOption(option)}
          >
            <ListItemIcon sx={{ color: selectedOption === option ? (darkMode ? "#03a9f4" : "#009af4") : 'inherit' }}>
              {iconMapping[option]}
            </ListItemIcon>
            {open && <ListItemText primary={option} />}
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default SidebarList;
