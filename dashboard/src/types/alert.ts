import {  AlertCategory, AlertSeverity, AlertStatus, ChangeType, MqttTopic } from "@/constants/alertOptions";

type Environment = "Development" | "Production"

export type Alert = AlertRaw & { // TO BE completed

  // id of alert given by ALerta
  id:string 

  lastReceiveTime: string

  duplicateCount?: number

  repeat?: boolean;
  previousSeverity?: AlertSeverity;
  trendIndication?: string;
  receiveTime?: string;
  lastReceiveId?: string;
  updateTime?: string;
  customer?: string | null;

}

type AlertRaw = {

  /**
  * Unique identifier of resource under alarm.
  */
  resource: string
  /**
  * event name
  */
  event: string
  /**
  * Environment, used to namespace the resource. Development or Production.
  */
  environment: Environment
  /**
  * Severity of alert (default normal)
  */
  severity: AlertSeverity;
  /**
  * Status of alert (default open)
  */
  status: AlertStatus;
  /**
  * list of related event names
  */
  correlate?: string
  /**
  * list of effected services (array must contain at least one element)
  */
  service: [string, ...string[]]
  /**
  * event group used to group events of similar type
  */
  group?: string
  /**
  * event value eg. 100%, Down, PingFail, 55ms, ORA-1664
  */
  value?: string
  /**
  * freeform text description
  */
  text?: string
  /**
  * set of tags in any format eg. aTag, aDouble:Tag, a:Triple=Tag
  */
  tags?: string[]
  /**
  * Dictionary of key-value pairs
  */
  attributes?: AlertAttributes;
  /**
  * ame of monitoring component that generated the alert
  */
  origin?: string
  /**
  * alert type eg. snmptrapAlert, syslogAlert, gangliaAlert
  */
  type?: string
  /**
  * UTC date-time the alert was generated in ISO8601 format
  */
  createTime?: string

  /**
  * number of seconds before alert is considered stale
  */
  timeout?: number
  /**
  * unprocessed data eg. full syslog message or SNMP trap
  */
  rawData?: string

  /**
   * whenever an alert changes severity or status then a list of key alert attributes are appended to the history log
   */

  history: HistoryEntry[]

  lastNote? : string

}

export type AlertAttributes = {
  /**
   * Country of origin of the alert
   */
  Country: string;

  /**
   * Identification of maritime zone
   */
  basin_id?: string;

  /**
   * WIGOS Station Identifiers
   */
  wigos_id?:string;
  
  /**
   * Category of alert
   */
  alert_category?: AlertCategory

  /**
   * MQTT topic on which the alert was received
   */
  mqtt_topic?: MqttTopic

  /**
   * URL for more informations on the resource
   */
  url?: string;

  /**
   * Allow any other custom key-value pair
   */
  [key: string]: unknown; // <- permet les `additionalProperties`
}

export type HistoryEntry = {
  id:string; 
  event : string;
  severity: AlertSeverity;
  status: AlertStatus;
  text:string;
  type: ChangeType
  updateTime: string
  user: string
  value: string

}

export type AlertApiResponse = AlertCountApiResponse & {
    alerts: Alert[];   
    lastTime: string;
    more: boolean;
    page: number;
    pageSize: number;
    pages: number;   
  };

  export type AlertCountApiResponse = {  
    autoRefresh: boolean;
    severityCounts: Record<string, number>;
    status: string;
    statusCounts: Record<string, number>;
    total: number;
  };

  export type AlertsCount = {
    severityCounts: Record<string, number>;
    status: string;
    statusCounts: Record<string, number>;
    total: number;
  }

  export type Note = {
    attributes : {environment: string, event: string, resource: string}
    createTime : string
    id : string
    text: string
    type: string
    user : string
  }

  export type NoteApiResponse = {
    notes: Note[]
    status : string
    total: number
  }

