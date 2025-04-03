import { Order } from '@/types/types';
import { camelCaseToTitle } from '@/utils/formatString';
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
    colmunsTodisplay: Array<keyof T>
  }

function EnhancedTableHead<T> ({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, colmunsTodisplay }: EnhancedTableProps<T>)  {


  // const headCells: readonly HeadCell[] = [
  //   {
  //     id: 'resource',
  //     numeric: false,
  //     disablePadding: true,
  //     label: 'Resource',
  //   },
  //   {
  //     id: 'severity',
  //     numeric: false,
  //     disablePadding: false,
  //     label: 'Severity',
  //   },
  //   {
  //     id: 'status',
  //     numeric: false,
  //     disablePadding: false,
  //     label: 'Status',
  //   },
  //   {
  //     id: 'event',
  //     numeric: false,
  //     disablePadding: false,
  //     label: 'Event',
  //   },
  //   {
  //     id: 'value',
  //     numeric: false,
  //     disablePadding: false,
  //     label: 'Value',
  //   },
  //   {
  //     id: 'text',
  //     numeric: false,
  //     disablePadding: false,
  //     label: 'Description',
  //   },
  //   {
  //     id: 'lastReceiveTime',
  //     numeric: false,
  //     disablePadding: false,
  //     label: 'Last Receive Time',
  //   },    
  // ];
  
  
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
        
        {colmunsTodisplay.map((headCell, index) => (
          <TableCell
            sx={{fontWeight: 'bold'}}
            key={`headCell-${String(headCell)}`}
            align={'left'} // TO DO : add a way to adapt in fonction of type of  value( numeric : right). Need to have the object data
            padding={index === 0 ? 'none' : 'normal'}
            sortDirection={orderBy === headCell ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell}
              direction={orderBy === headCell ? order : 'asc'}
              onClick={createSortHandler(headCell)}
            >
              {camelCaseToTitle(String(headCell))}
              {orderBy === headCell ? (
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