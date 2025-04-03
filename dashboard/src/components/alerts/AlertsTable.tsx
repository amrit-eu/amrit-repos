import getAlerts from '@/lib/fetchAlerts';
import { Alert, AlertApiResponse } from '@/types/alert'
import { Order } from '@/types/types';
import React, { useEffect, useState } from 'react'
import EnhancedTable from '../enhancedTable/EnhancedTable';

interface AlertsTableProps {
   selectedFilters: Partial<Record<keyof Alert, string[]>>
}

const AlertsTable = ({selectedFilters}: AlertsTableProps) => {

  const COLUMNS_TO_DISPLAY : Array<keyof Alert> = ["resource", "severity", "status", "event", "value", "text", "lastReceiveTime"   ];
  const MORE_INFO_COLUMNS_TO_DISPLAY : Array<keyof Alert> = ["id", "origin", "createTime", "duplicateCount" ];


  const [alertsApiResponseData, setAlertsApiResponseData] = useState<AlertApiResponse>();
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof Alert>('lastReceiveTime');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [loading, setLoading] = useState(false);

    // fetch alerts data
    useEffect(() => {   
      let isLatestRequest = true; 
      const controller = new AbortController();
      const signal = controller.signal;

      async function fetchAlertData() {
        setLoading(true);
        try {
          const alertsData = await getAlerts(selectedFilters,page+1, rowsPerPage, [order==='desc' ? orderBy : "-"+orderBy], signal);
          if (isLatestRequest) { 
            setAlertsApiResponseData(alertsData);
          }
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            console.error('An error occurred while fetching alerts.');
          }
          
        } finally {
          if (isLatestRequest) { 
            setLoading(false);
          }
        }
      }

      fetchAlertData();
      
      return () => {
        isLatestRequest = false; 
        controller.abort();
      };    
    }, [page, rowsPerPage, orderBy, order, selectedFilters])


  return (
    <EnhancedTable<Alert> orderBy={orderBy} setOrderBy={setOrderBy} order={order} setOrder={setOrder} page={page} setPage={setPage} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} loading={loading} data={alertsApiResponseData?.alerts ?? []} totalCount={alertsApiResponseData?.total ?? 0}  colmunsTodisplay={COLUMNS_TO_DISPLAY} optionnalAdditionalMoreInfoColumns={MORE_INFO_COLUMNS_TO_DISPLAY} />
  )
}

export default AlertsTable