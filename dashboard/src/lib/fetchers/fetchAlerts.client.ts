import { ALERTS_FILTERS_REGEX_MATCH } from '@/config/alertsFiltersCategories';
import { ALERTA_API_BASE_URL } from '@/config/api-routes'
import { ALERT_CUSTOMS_PARAMS } from '@/constants/alertOptions';
import {  AlertApiResponse } from '@/types/alert';
import { FiltersValuesMap } from '@/types/filters';
import { CountryOption, TopicOption } from '@/types/types';

const baseUrl = ALERTA_API_BASE_URL;


export default async function getAlerts(filters:FiltersValuesMap = {"status": ["open", "ack"]}, page:number =1, pageSize:number =25, sortBy:Array<string> = ["severity"],history:boolean=false, signal?: AbortSignal) : Promise<AlertApiResponse> {
  // convert filters object to string for query parameters:
  const filterQuery = filtersToQueryString(filters);
  // convert sortBy[] to string for query parameters:
  const sortByQuery=sortBy.map(s => `sort-by=${s}`).join("&");
  // pagination :
  const pagination = `page=${page}&page-size=${pageSize}`;
  // history
  const showHistory= `show-history=${history}`

  //build request params
  const queryString = [filterQuery, sortByQuery, pagination, showHistory].filter(Boolean).join('&'); // we filter null, undefined or empty string "" and join in a string with a & separator

  // fetch data
  const res = await fetch(`${baseUrl}/alerts?${queryString}`, {signal,
    credentials: 'include'});

  if (!res.ok) throw new Error ("failed to fetch Alert data");

  return res.json();
}



/**
 * Transform the filters object  in a queryString. Clean values with a regex
 * @param filters Partial<Record<keyof Alert, string[]>> (ex: {"status" : ["open (251)", "ack (7)"], "severity": ["critical"]})
 * @returns string to be use in the request parameters // => status=open&status=ack&severity=critical
 */
function filtersToQueryString(filters: FiltersValuesMap): string {
  const params = new URLSearchParams();
  const qClauses: string[] = [];

  for (const [key, values] of Object.entries(filters) as [keyof FiltersValuesMap, FiltersValuesMap[keyof FiltersValuesMap]][]) {
    let valuesToProcess: string[] = [];
    const useRegex = (ALERTS_FILTERS_REGEX_MATCH as string[]).includes(key); // if we want a regex match

    if (key === "Country") {
      const countryValues = values as CountryOption[];
      valuesToProcess = countryValues.map(c => c.name);
    } else if (key === "alert_category") {
      const topics = values as TopicOption[];
      valuesToProcess = topics.map(c => c.label);
    } else {
      valuesToProcess = values as string[];
    }

    // If custom attributes, must be processed with Lucene query string `q=` (https://docs.alerta.io/api/query-syntax.html)
    if ((ALERT_CUSTOMS_PARAMS as readonly string[]).includes(key)) {
      const field = `_.${key}`;
      if (valuesToProcess.length === 1) {
        const val = valuesToProcess[0];
        const queryValue = useRegex ? `/${escapeRegex(val)}/` : escapeLuceneValue(val);
        qClauses.push(`${field}:${queryValue}`);
      } else if (valuesToProcess.length > 1) {
        const orValues = valuesToProcess.map(val => useRegex ? `/${escapeRegex(val)}/` : escapeLuceneValue(val)).join(" OR ");
        qClauses.push(`${field}:(${orValues})`);
      }
    } else {
      for (const val of valuesToProcess) {
        const cleanValue = val.replace(/\s*\(\d+\)\s*$/, '').trim();
        let newKey = key;
        if ((ALERT_CUSTOMS_PARAMS as readonly string[]).includes(newKey)) {
          newKey = "attributes." + newKey;
        }
        // if a regex match is neededs        
        const finalValue = useRegex ? `~${cleanValue}` : cleanValue;

        params.append(newKey, finalValue);
      }
    }
  }

  // add 'q' parameter if needed
  if (qClauses.length > 0) {
    params.append("q", qClauses.join(" AND "));
  }

  return params.toString();
}

function escapeLuceneValue(value: string): string {
  // Protect space or key word like AND or OR
  if (/\s/.test(value) || /[():]/.test(value)) {
    return `"${value}"`;
  }
  return value;
}

function escapeRegex(value: string): string {
  return value.replace(/\s*\(\d+\)\s*$/, '').trim(); 
}