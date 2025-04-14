import Home from '../components/Home';
import { verifySession } from './_lib/session';

export default async function HomePage() {
  const session = await verifySession(); // get session to conditionnaly render this server component
  return <Home  session={session}/>;
}
