import { FilterOption } from "@/types/filters";
import { CountryAPIResponse } from "@/types/types";
import { handleCountryAPIJsonResponse } from "../utils/handleCountryAPIJsonResponse";
import { gatewayFetchViaProxy } from "../gateway/gatewayFetchViaProxy.client";

export default async function fetchCountryOptions(): Promise<FilterOption[]> {
  const json = await gatewayFetchViaProxy<CountryAPIResponse>('GET',`/data/countries`);
  return handleCountryAPIJsonResponse(json);
}


