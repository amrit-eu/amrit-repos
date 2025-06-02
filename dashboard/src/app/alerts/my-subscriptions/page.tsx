import { Metadata } from 'next';
import MySubscriptions from '../../../components/modules/subscriptions/MySubscriptions';
import AlertsTabs from '../../../components/modules/alerts/AlertsTabs';

export const metadata: Metadata = {
  title: 'OceanBoards - Alerts',
  description: 'AMRIT Alerts - My Subscriptions',
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
