'use client';

import { Order } from '@/types/types';
import { Box, Checkbox, FormControlLabel, Paper, Switch, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react'
import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTableHead from './EnhancedTableHead';
import getAllOpenAlerts from '@/lib/fetchAlerts';

//Tables sorting functions :
// function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
//     if (b[orderBy] < a[orderBy]) {
//       return -1;
//     }
//     if (b[orderBy] > a[orderBy]) {
//       return 1;
//     }
//     return 0;
//   }
// function getComparator<Key extends keyof any>(
//     order: Order,
//     orderBy: Key,
//   ): (
//     a: { [key in Key]: number | string },
//     b: { [key in Key]: number | string },
//   ) => number {
//     return order === 'desc'
//       ? (a, b) => descendingComparator(a, b, orderBy)
//       : (a, b) => -descendingComparator(a, b, orderBy);
//   }

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (aValue === undefined && bValue === undefined) return 0;
    if (typeof aValue === 'object' || typeof bValue === 'object' ) return 0;
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;

    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator<Key extends keyof any>( order: Order, orderBy: Key,): (a: { [key in Key]?: number | string |undefined | object},b: { [key in Key]?: number | string |undefined | object }, ) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }



const EnhancedTable = () => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Alert>('lastReceiveTime');
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [loading, setLoading] = useState(false);
  const [alertsData, setAlertsData] = useState<Alert[]>([]);


    // fetch alerts data
    useEffect(() => {   
      
      async function fetchAlertData() {
        setLoading(true);
        try {
          const alertsData: Promise<AlertApiResponse> = getAllOpenAlerts(page+1, rowsPerPage);
          const data = await alertsData;
          setAlertsData(data.alerts);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }

      fetchAlertData();    
    }, [page, rowsPerPage])
    


  
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Alert,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = alertsData.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
        const selectedIndex = selected.indexOf(id);
   // const selectedIndex = selected.findIndex(item => item===id );
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - alertsData.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...alertsData]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage],
  );


  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={alertsData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={alertsData.length}
            />
            <TableBody>
              {visibleRows.map((alert, index) => {
                const isItemSelected = selected.includes(alert.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, alert.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={alert.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {alert.resource}
                    </TableCell>
                    <TableCell align="left" >{alert.severity}</TableCell>
                    <TableCell align="left">{alert.status}</TableCell>
                    <TableCell align="left">{alert.event}</TableCell>
                    <TableCell align="left">{alert.value}</TableCell>
                    <TableCell align="left">{alert.text}</TableCell>
                    <TableCell align="left">{alert.lastReceiveTime}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  )
}

export default EnhancedTable