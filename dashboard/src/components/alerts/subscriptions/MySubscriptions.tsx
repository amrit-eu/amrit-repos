import { fetchAlertSubscriptions } from '@/lib/alertSubscriptions/fetchSubscriptions.server';
import MySubscriptionsClient from './MySubscriptionsClient';

const MySubscriptions = async () => {
  const subscriptions = await fetchAlertSubscriptions(); 

  return <MySubscriptionsClient initialData={subscriptions} />;
};

export default MySubscriptions;
