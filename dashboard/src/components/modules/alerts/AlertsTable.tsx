import getAlerts from '@/lib/fetchers/fetchAlerts.client';
import { Alert, AlertApiResponse } from '@/types/alert'
import { Order, Session } from '@/types/types';
import React, { useEffect, useState } from 'react'
import EnhancedTable from '../../shared/tables/enhancedTable/EnhancedTable';
import AlertsTableToolbarActions from './AlertsTableToolbarActions';
import { ALERTS_MAIN_TABLE_CONFIG } from '@/config/tableConfigs/alertTableConfig';
import addAlertsLastNotesToAlertApiResponse from '@/lib/utils/computeAlertLastNote';
import { FiltersValuesMap } from '@/types/filters';
import AlertDetails from './AlertDetails';
import LoadingWrapper from '@/components/shared/feedback/LoadingWrapper';


interface AlertsTableProps {
   filtersSelectedValues: FiltersValuesMap
   isOnlyMySubsAlerts:boolean
   session: Session | null
   page:number,
   setPage:React.Dispatch<React.SetStateAction<number>>
       
}

const AlertsTable = ({filtersSelectedValues, session, isOnlyMySubsAlerts, page, setPage}: AlertsTableProps) => {

  // load table configuration
  const alertaColumnsConfig = ALERTS_MAIN_TABLE_CONFIG;

  //Table's states
  const [alertsApiResponseData, setAlertsApiResponseData] = useState<AlertApiResponse>();
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof Alert>('lastReceiveTime');
  // const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // fetch alerts data
  useEffect(() => {   
    let isLatestRequest = true; 
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchAlertData() {
      setLoading(true);
      try {
        const alertsData = await getAlerts(filtersSelectedValues,page+1, rowsPerPage, [order==='desc' ? orderBy : "-"+orderBy],true,isOnlyMySubsAlerts, session?.userId ?? 0, signal );
        // compute last note of each alert from alerts's history entries :
        addAlertsLastNotesToAlertApiResponse(alertsData)
        if (isLatestRequest) { 
          setAlertsApiResponseData(alertsData);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
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
  }, [page, rowsPerPage, orderBy, order, filtersSelectedValues, refreshKey, isOnlyMySubsAlerts])

  // TO DO : may be use a more general way using the MQTT broker : when there is a new alet, trigger the refresh
  const triggerRefetch = () => {
    setRefreshKey(prev => prev + 1);
    // reset selected alerts after an update (ack, close, delete, etc.). Because after an action is done, some alerts may disapear (because not corresponding anymore to current filters) but still be selected in state if we not reset the selected :
    //setSelected([]) // was 
  };

  const toolBarActionComponent = <AlertsTableToolbarActions selected={selected} onActionDone={triggerRefetch} setSelected={setSelected} isUserLogin={session ? session.isAuth : false} alertsData={alertsApiResponseData?.alerts ?? []} userRoles={session?.roles ?? []}/>
  
  
 
  return (

    <LoadingWrapper loading={loading}> 
      <EnhancedTable<Alert> selected={selected} setSelected={setSelected} orderBy={orderBy} setOrderBy={setOrderBy} order={order} setOrder={setOrder} page={page} setPage={setPage} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} data={alertsApiResponseData?.alerts ?? []} totalCount={alertsApiResponseData?.total ?? 0} toolbarActions={toolBarActionComponent} colmunsConfiguration={alertaColumnsConfig} collapsingComponent={(data) => <AlertDetails data={data}/>}/>
    </LoadingWrapper>
  )
}

export default AlertsTable
