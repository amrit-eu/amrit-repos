'use client';

import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import { iconMapping, SidebarOption } from '../../types/types';

interface SidebarListProps {
  category: string;
  options: SidebarOption[];
  selectedOption: SidebarOption;
  setSelectedOption: (option: SidebarOption) => void;
  darkMode: boolean;
  open: boolean;
}

const SidebarList: React.FC<SidebarListProps> = ({
  category,
  options,
  selectedOption,
  setSelectedOption,
  darkMode,
  open,
}) => {
  const theme = useTheme();

  return (
    <>
      {category && open && (
        <Typography
          variant="caption"
          sx={{
            pl: 2,
            pt: 2,
            color: theme.palette.primary.main,
            fontWeight: 600,
          }}
        >
          {category}
        </Typography>
      )}

      <List disablePadding>
        {options.map((option) => {
          const isSelected = selectedOption === option;

          return (
            <ListItemButton
              key={option}
              selected={isSelected}
              onClick={() => setSelectedOption(option)}
              sx={{
                height: 48,
                // px: open ? 2 : 1,
                justifyContent: open ? 'initial' : 'center',
                color: isSelected ? theme.palette.primary.main : 'inherit',
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  ml: "4px",
                  justifyContent: 'center',
                  color: isSelected ? theme.palette.primary.main : 'inherit',
                }}
              >
                {iconMapping[option]}
              </ListItemIcon>
              {open && <ListItemText primary={option} />}
            </ListItemButton>
          );
        })}
      </List>
    </>
  );
};

export default SidebarList;
