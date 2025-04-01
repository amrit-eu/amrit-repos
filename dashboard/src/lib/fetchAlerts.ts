import { ALERTA_API_BASE_URL } from '@/config/api-routes'
import React from 'react'

const baseUrl = ALERTA_API_BASE_URL;


export default async function getAllOpenAlerts(page:number =1, pageSize:number =25) : Promise<AlertApiResponse> {
  const res = await fetch(`${baseUrl}/alerts?status=open&page=${page}&page-size=${pageSize}`);

  if (!res.ok) throw new Error ("failed to fetch Alert data");

  return res.json();
}
