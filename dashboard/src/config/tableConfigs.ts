import { Alert } from "@/types/alert";

interface TableColumnConfig<T> {
  key: keyof T;
  label?: string; // not is use for now -> need to update EnhancedTable component
  align?: 'left' | 'right' | 'center'; // not is use for now -> need to update EnhancedTable component
  visible?: boolean; // not is use for now -> need to update EnhancedTable component
}

interface TableViewConfig<T> {
  mainColumns: TableColumnConfig<T>[];
  moreInfoColumns?: TableColumnConfig<T>[];
}

export const ALERTS_TABLE_CONFIG: TableViewConfig<Alert> = {
  mainColumns: [
    { key: 'resource' },
    { key: 'severity' },
    { key: 'status' },
    { key: 'event' },
    { key: 'value' },
    { key: 'text' },
    { key: 'lastReceiveTime' }
  ],
  moreInfoColumns: [
    { key: 'id' },
    { key: 'origin' },
    { key: 'createTime' },
    { key: 'duplicateCount' }
  ]
};