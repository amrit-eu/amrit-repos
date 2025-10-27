import { Checkbox, Chip, Collapse, IconButton,  Link,  TableCell, TableRow } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React from 'react'
import { TableViewConfig } from '@/config/tableConfigs';
import { extractHost, isValidUrl } from '@/lib/utils/stringUtils';
import EnhancedTableCell from '../EnhancedTableCell';




interface EnhancedTableRowProps<T> {
    rowData: T
    columnsConfig: TableViewConfig<T>
    isItemSelected: boolean
    handleClickOnRow:  (event: React.MouseEvent<unknown>, id: string) => void
    rowId: string
    collapsingComponent?:  React.ReactNode
   

}

function EnhancedTableRow<T> ({rowData, columnsConfig, isItemSelected, handleClickOnRow, rowId, collapsingComponent}: EnhancedTableRowProps<T>) {

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
            sx={{ cursor: 'pointer',
               ...(open ? { '& > *': { borderBottom: 'unset !important' } } :{} )
             }}
            
        >
            {collapsingComponent&&
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
					slotProps={{
						input: {
						  'aria-label': 'Select row',
						  'aria-labelledby': `row-${rowId}`,
						},
					}}               
                />
            </TableCell>
            

            {columnsConfig.mainColumns.map((col, index) => 
            
            <EnhancedTableCell 
              key={`cell-${rowId}-${index}`} 
              rowData={rowData} 
              col={col} 
              index={index} 
              rowId={rowId} />
             )}   

        </TableRow>

        {/*  Collapsing table part */}
        { collapsingComponent && 
        ( 
        <TableRow  sx={{ '& > *': { borderBottom: 'unset !important', paddingTop: 0, paddingBottom: 0 } }} style={{ border: 0}}>
            <TableCell width='100%' style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columnsConfig.mainColumns.length + 2}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                
                  {collapsingComponent}
               
              </Collapse>
          </TableCell>
        </TableRow>
        )       
       
        }
    </React.Fragment>
  )
}

export default EnhancedTableRow