import { FilterOption } from "@/types/filters";
import { CountryAPIResponse } from "@/types/types";
import { handleCountryAPIJsonResponse } from "../utils/handleCountryAPIJsonResponse";
import { gatewayFetchViaProxy } from "../gateway/gatewayFetchViaProxy.client";

export default async function fetchCountryOptions(): Promise<FilterOption[]> {
  const json = await gatewayFetchViaProxy<CountryAPIResponse>('GET',`/data/countries`,undefined, undefined, 3600);
  return handleCountryAPIJsonResponse(json);
}


