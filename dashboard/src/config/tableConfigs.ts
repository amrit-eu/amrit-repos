import { Alert } from "@/types/alert";

interface TableColumnConfig<T> {
  key: keyof T;
  label?: string; // String(key) default
  align?: 'left' | 'right' | 'center'; // left default
  padding?: 'none' | 'normal' // normal default
  chipColor? : Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined> // Will be displayed in form of a chip if set. Depend on value of the specific key : {"value": "chip color", }

}

export interface TableViewConfig<T> {
  mainColumns: TableColumnConfig<T>[];
  moreInfoColumns?: TableColumnConfig<T>[];
}

export const ALERTS_TABLE_CONFIG: TableViewConfig<Alert> = {
  mainColumns: [
    { key: 'resource', label: "Resource", padding: 'none' },
    { key: 'severity', label: "Severity", chipColor: {"critical":"error", "major":"warning", "warning":"info", "informational":"success"} },
    { key: 'status', label: "Status" },
    { key: 'event', label:"Event" },
    { key: 'value', label: "Value" },
    { key: 'text', label: "Description" },
    { key: 'lastReceiveTime', label: "Last receive Time"  }
  ],
  moreInfoColumns: [
    { key: 'id' },
    { key: 'origin', label: "Origin" },
    { key: 'createTime', label : "Alert creation time" },
    { key: 'duplicateCount', label : "Number of duplicate" }
  ]
};