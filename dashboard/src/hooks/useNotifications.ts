// import { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";

// interface NotificationData {
//   resource:string;
//   event:string;
// }

// interface NotificationHookOptions {
//   onConnect?: () => void;
//   onDisconnect?: () => void;
//   onError?: (error: Error) => void;
// }

// export const useNotifications = (options?: NotificationHookOptions) => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [notifications, setNotifications] = useState<NotificationData[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const socketRef = useRef<Socket | null>(null);

//   useEffect(() => {   
//     // Create socket connection
//     const socket = io('http://localhost:3001/notifications', {
//       path: '/api/notifications/socket.io',
//       withCredentials: true, // Important pour envoyer les cookies (session)
//       transports: ['websocket', 'polling'], // Préférer websocket
      
//       // Si vous utilisez un Bearer token au lieu de cookies:
//       // auth: {
//       //   token: token,
//       // },
      
//       // Ou via extraHeaders (moins recommandé):
//       // extraHeaders: {
//       //   Authorization: `Bearer ${token}`,
//       // },
//     });

//     socketRef.current = socket;

//     // Event: Connexion réussie
//     socket.on('connect', () => {
//       console.log('✅ Connected to notifications WebSocket');
//       setIsConnected(true);
//       options?.onConnect?.();
//     });

//     // Event: Déconnexion
//     socket.on('disconnect', (reason) => {
//       console.log('❌ Disconnected from WebSocket:', reason);
//       setIsConnected(false);
//       options?.onDisconnect?.();
//     });

//     // Event: Erreur de connexion
//     socket.on('connect_error', (error) => {
//       console.error('❌ Connection error:', error.message);
//       setIsConnected(false);
//       options?.onError?.(error);
//     });

//     // Event: Refresh des alertes
//     socket.on('alerts:refresh', () => {
//       console.log('🔔 Alerts refresh requested');
//       // Vous pouvez déclencher un refetch de vos alertes ici
//       // Par exemple avec React Query: queryClient.invalidateQueries(['alerts'])
//     });

//     // Event: Nouvelle notification pour cet utilisateur
//     socket.on('notifications:new', (notification: NotificationData) => {
//       console.log('🔔 New notification:', notification);
//       setNotifications(prev => [notification, ...prev]);
//       setUnreadCount(prev => prev + 1);
//     });

//     // Cleanup à la déconnexion du composant
//     return () => {
//       socket.close();
//     };
//   }, []); // Dépendances vides = se connecte une seule fois au mount

//   // Fonction pour marquer les notifications comme lues
//   const markAsRead = useCallback(() => {
//     setUnreadCount(0);
//   }, []);

//   // Fonction pour supprimer une notification
//   const removeNotification = useCallback((id: string) => {
//     setNotifications(prev => prev.filter(n => n.id !== id));
//   }, []);

//   return {
//     isConnected,
//     notifications,
//     unreadCount,
//     markAsRead,
//     removeNotification,
//     socket: socketRef.current,
//   };
// };