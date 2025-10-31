import { EventsCount } from "@/types/alert";
import { gatewayFetchViaProxy } from "../gateway/gatewayFetchViaProxy.client";

export default async function fetchEventsList(): Promise<EventsCount> {
  return gatewayFetchViaProxy<EventsCount>('GET',`/alerta/alerts/events`);
};