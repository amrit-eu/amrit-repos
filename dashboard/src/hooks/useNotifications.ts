import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppConfig } from "./useAppConfig";
import { NotificationDTO } from "@/types/notifications";



interface NotificationHookOptions {
  isAuthenticated?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export const useNotifications = (isAuthenticated: boolean,options?: NotificationHookOptions) => {
const { config, loading: configLoading, error: configError } = useAppConfig();
const [isConnected, setIsConnected] = useState(false);
const [newAlertCount, setNewAlertCount] = useState(0);
const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
const [unreadCount, setUnreadCount] = useState(0);
const socketRef = useRef<Socket | null>(null);

  useEffect(() => {   
    if (isAuthenticated=== false) {
        return;
    }

    if (configLoading) {
      return;
    }
    if (configLoading || !config) {
        return;
    }

    if (configError) {
      options?.onError?.(configError);
      return;
    }

    // Create socket connection
    const socket = io(`${config.websocketBaseUrl}/notifications`, {
      path: '/api/notifications',
      withCredentials: true, //send cookies (session)
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    // Event: successufl connection
    socket.on('connect', () => {
      setIsConnected(true);
      options?.onConnect?.();
    });

    // Event: Disconnect
    socket.on('disconnect', () => {
      setIsConnected(false);
      options?.onDisconnect?.();
    });

    // Event: connection error
    socket.on('connect_error', (error) => {
      setIsConnected(false);
      options?.onError?.(error);
    });

    // Event: Refresh alerts
    socket.on('alerts:refresh', () => {
      setNewAlertCount (prev => prev +1)

    });

    // Event: new notification for the user
    socket.on('notifications:new', (notification: NotificationDTO) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    
    return () => {
      socket.close();
    };
  }, [config, configLoading, configError,options, isAuthenticated]);

  // mark notifications has read
  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  // delete notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

   // delete all notification
  const removeAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);




  return {
    isConnected,
    newAlertCount,
    notifications,
    unreadCount,
    markAsRead,
    removeNotification,
    removeAllNotifications,
    socket: socketRef.current,
  };
};