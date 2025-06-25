import { Metadata } from 'next';
import Alerts from '../../components/modules/alerts/Alerts';

export const metadata: Metadata = {
  title: 'Amrit Boards - Alerts',
  description: 'AMRIT Alerts dashboard',
  icons: {
    icon: '/favicon.png',
  },
};

export default function AlertsPage() {
  return <Alerts />;
}
