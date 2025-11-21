import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Box,
  Typography,
  Divider,
  Alert,
  useTheme,
} from '@mui/material';
import { NotificationsNone as NotificationsNoneIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationDTO } from '@/types/notifications';
import { useRouter } from 'next/navigation';
import { alpha } from '@mui/material/styles';


interface NotificationsIconProps {
  isAuthenticated: boolean;
}

const NotificationsIcon = ({ isAuthenticated }: NotificationsIconProps) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { notifications, unreadCount, markAsRead, removeAllNotifications, removeNotification } =
    useNotifications(isAuthenticated);

  const router = useRouter();    

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    markAsRead();
  };


  const handleNotificationClick = (notification: NotificationDTO) => {
      
      switch (notification.type) {
        case 'alert':
          router.push(`/alerts/${notification.id}`);
        default:
          removeNotification(notification.id);
          break;
      }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notifications-popover' : undefined;

  return (
    <>
      <IconButton
        aria-describedby={id}
        onClick={handleOpen}
        color="inherit"
        sx={{
          position: 'relative',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              maxHeight: 500,
              borderRadius: 2,
            },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Notifications
          </Typography>
          <Divider sx={{ mb: 0.5 }} />
        </Box>

        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              No notification
            </Alert>
          </Box>
        ) : (
          <>
            <List
              sx={{
                maxHeight: 350,
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
                },
                '&::-webkit-scrollbar-thumb': {
                  background: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[400],
                  borderRadius: '4px',
                  '&:hover': {
                    background: theme.palette.mode === 'dark' ? theme.palette.grey[500] : theme.palette.grey[600],
                  },
                },
              }}
            >
              {notifications.map((notification, index) => (
                <ListItem key={notification.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleNotificationClick(notification)}
                    sx={[{
                      py: 1.5,
                      px: 2,                      
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    },
                    index < unreadCount && {
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    }
                  ]}
                  >
                    <ListItemText
                      primary={notification.text}
                      slotProps={{
                        primary: {
                          variant: 'body2',
                          sx: { fontWeight: 500 },
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            <Divider />
            <Box
              sx={{
                p: 1.5,
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={removeAllNotifications}
                fullWidth
              >
                Remove all
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
};

export default NotificationsIcon;