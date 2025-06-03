import { GATEWAY_BASE_URL } from "@/config/api-routes";
import { FilterOption } from "@/types/filters";

const baseUrl = GATEWAY_BASE_URL;

type CountryAPIResponse = {
  data: {
    id?: string | number;
    name?: string;
    code2?: string;
  }[];
};

export default async function fetchCountryOptions(): Promise<FilterOption[]> {
  const res = await fetch(`${baseUrl}/data/countries`, {
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch countries');
  }

  const json: CountryAPIResponse = await res.json();

  return json.data
    .filter((item) => item.id && item.name)
    .map((item) => ({
      id: String(item.id),
      name: item.name ?? 'Unknown',
      code2: item.code2 ?? '',
    }));
}
