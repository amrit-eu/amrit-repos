import { Metadata } from 'next';
import MySubscriptions from '../../../components/modules/subscriptions/MySubscriptions';
import AlertsTabs from '../../../components/modules/alerts/AlertsTabs';

export const metadata: Metadata = {
  title: 'Amrit Boards - Alerts',
  description: 'Amrit Alerts - My Subscriptions',
  icons: {
    icon: '/favicon.png',
  },
};

export default function AlertsPage() {
  return (
    <>
      <AlertsTabs /><MySubscriptions />
	</>)
}
