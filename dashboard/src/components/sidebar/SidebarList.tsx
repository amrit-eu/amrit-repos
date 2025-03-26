'use client';

import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { iconMapping, SidebarOption } from '../../types/types';

interface SidebarListProps {
  category: string;
  options: SidebarOption[];
  open: boolean;
}

const SidebarList: React.FC<SidebarListProps> = ({ category, options, open }) => {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();

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
          const path = option === 'Home' ? '/' : `/${option.toLowerCase()}`;
          const isSelected = pathname === path;

          return (
            <ListItemButton
              key={option}
              selected={isSelected}
              onClick={() => router.push(path)}
              sx={{
                height: 48,
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
                  ml: '4px',
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
