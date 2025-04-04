import { Box, Checkbox, Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React from 'react'
import { camelCaseToTitle } from '@/utils/formatString';

interface EnhancedTableRowProps<T> {
    rowData: T
    colmunsTodisplay: Array<keyof T>
    isItemSelected: boolean
    handleClickOnRow:  (event: React.MouseEvent<unknown>, id: string) => void
    rowId: string
    optionnalAdditionalMoreInfoColumns? : Array<keyof T>

}

function EnhancedTableRow<T> ({rowData, colmunsTodisplay, isItemSelected, handleClickOnRow, rowId, optionnalAdditionalMoreInfoColumns}: EnhancedTableRowProps<T>) {

const [open, setOpen] = React.useState(false); // state for collapse table
  return (
    <React.Fragment>
        <TableRow
            hover
            onClick={(event) => handleClickOnRow(event, rowId)}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={rowId}
            selected={isItemSelected}
            sx={{ cursor: 'pointer' }}
        >
            {optionnalAdditionalMoreInfoColumns &&
             <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // don't want to select row when clicking on expand/collapse "more info" table button
                      setOpen(!open)
                    }}
                >
                 {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>}
            
            <TableCell padding="checkbox">
                <Checkbox
                    color="primary"
                    checked={isItemSelected}                        
                />
            </TableCell>
            

            {colmunsTodisplay.map((columnKey, index) => (
                <TableCell
                key={`${String(columnKey)}-${rowId}`}
                component={index === 0 ? 'th' : undefined}
                scope={index === 0 ? 'row' : undefined}
                padding={index === 0 ? 'none' : undefined}
                align={index !== 0 ? 'left' : undefined}
              >
                {String(rowData[columnKey])}
              </TableCell>
            ))}   
        </TableRow>

        {/*  Collapsing table part */}
        {optionnalAdditionalMoreInfoColumns &&
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={colmunsTodisplay.length + 1 }>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant="h6" gutterBottom component="div">
                    More informations
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        {optionnalAdditionalMoreInfoColumns.map((columnName, index) => 
                            (<TableCell
                                key={`additional-rowHeader-${index}`}
                                align={index === 0 ? 'left' : 'right'}
                                sx={{fontWeight: 'bold'}}
                              >
                                {camelCaseToTitle(String(columnName))}
                              </TableCell>)
                         )}                        
                      </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow key={`additional-row-${rowId}`}>
                            {optionnalAdditionalMoreInfoColumns.map((columnName, index) => (
                                <TableCell
                                key={`additional-cell-${rowId}-${index}`}
                                {...(index === 0
                                ? { component: 'th', scope: 'row' }
                                : { align: 'right' })}
                            >
                                {String(rowData[columnName])}
                            </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        }
    </React.Fragment>
  )
}

export default EnhancedTableRow