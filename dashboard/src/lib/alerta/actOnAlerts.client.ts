import { gatewayFetchViaProxy } from "../gateway/gatewayFetchViaProxy.client";
import batchRequestByIds from "../utils/batchRequestByIds";
import { ActionType } from "@/constants/alertOptions";



/**
 * Launch fetch methods (PUT or DELETE) for each alert id given in ids[] parameter
 * @param ids List of id
 * @param action type of action : ack, unack, close or delete
 * @returns 
 */
export default async function actOnAlerts (ids : readonly string[], action: ActionType, text="") {

  switch (action) {
    case 'ack':
    case 'unack' :
    case 'open' :
    case 'close' :
    case "shelve" :
    case "unshelve" :
    case "assign" :
      return batchRequestByIds(ids, (id)=> actionAlert(id, action));
    case 'delete':
      return batchRequestByIds(ids,deleteAlert );
    case 'note' :
      return batchRequestByIds(ids, (id)=> addNoteOnAlert (id, text));
  } 
    

}

const actionAlert = async (id :string, action:ActionType ) =>  await gatewayFetchViaProxy<Response> ('PUT',`/alerta/alert/${id}/action`,{
        action: action,
        timeout: null
      }
  )
const deleteAlert = async (id: string) => await gatewayFetchViaProxy<Response> ('DELETE',`/alerta/alert/${id}`)

const addNoteOnAlert = async (alertId :string, text:string ) =>  await gatewayFetchViaProxy<Response> ('PUT',`/alerta/alert/${alertId}/note`, {text:text})
  

