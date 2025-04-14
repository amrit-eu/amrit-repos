import { ALERTA_API_BASE_URL } from '@/config/api-routes'
import { Alert, AlertApiResponse, AlertCountApiResponse } from '@/types/alert';
import { cookies, headers } from 'next/headers';

const baseUrl = ALERTA_API_BASE_URL;

/**
 * Get the count of alert by severity and by status
 * 
 * @returns alerts count
 */
export  async function getAlertCount () : Promise<AlertCountApiResponse> {

    // need to add manually the session cookie containing the JWT as this fetch is done on server side:
    const cookieStore = await cookies();
    const session =  cookieStore.get('session')?.value;

    const forwardedHeaders = await headers();

    const res = await fetch(`${baseUrl}/alerts/count`, {
        headers: {
          Cookie: `session=${session}`,
          'X-Forwarded-For': forwardedHeaders.get('x-forwarded-for') ?? '', //To forward client IP
        },
    });

    if (!res.ok) throw new Error ("failed to fetch Alert data");

    return res.json();

}
