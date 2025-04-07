import { TableViewConfig } from '@/config/tableConfigs';
import { Order } from '@/types/types';
import { Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import React from 'react'



interface EnhancedTableProps<T> {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: keyof T;
    rowCount: number;
    columnsConfig: TableViewConfig<T>
  }

function EnhancedTableHead<T> ({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, columnsConfig }: EnhancedTableProps<T>)  {


  
  const createSortHandler =
  (property: keyof T) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell />
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}            
          />
        </TableCell>
        
        {columnsConfig.mainColumns.map(col => (
          <TableCell
            sx={{fontWeight: 'bold'}}
            key={`headCell-${String(col.key)}`}
            align={col.align ?? 'left'} 
            padding={col.padding ?? 'normal'}
            sortDirection={orderBy === col.key ? order : false}
          >
            <TableSortLabel
              active={orderBy === col.key}
              direction={orderBy === col.key ? order : 'asc'}
              onClick={createSortHandler(col.key)}
            >
              {col.label ?? String(col.key)}
              {orderBy === col.key ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}




export default EnhancedTableHead