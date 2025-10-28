import { TableColumnConfig } from '@/config/tableConfigs'
import { extractHost, isValidUrl } from '@/lib/utils/stringUtils'
import { Chip, IconButton,  TableCell, Tooltip } from '@mui/material'
import LinkIcon from '@mui/icons-material/Link';
import React from 'react'

interface EnhancedTableCellProps<T> {
  rowData: T
  col: TableColumnConfig<T>
  index: number
  rowId: string

}

function EnhancedTableCell<T>({rowData, col, index, rowId} : EnhancedTableCellProps<T> )  {
  
    const rawContent = rowData[col.key] as Record<string, unknown>
    let content = rawContent != null ? String(rawContent) : '';
    // test if rowData[col.key]  is an object and we shoud use subKey to find content:         
    if (col.subKey && rowData[col.key] != null && typeof rowData[col.key] === 'object' &&  !Array.isArray(rowData[col.key]) &&  Object.prototype.hasOwnProperty.call(rowData[col.key], col.subKey)) {
        const subContent = rawContent[col.subKey]
        content = subContent != null ? String(subContent) : ''
    } 
    // if link is specified
    let contentComponent = (col.link===true && isValidUrl(content)) ?    
                                <Tooltip title={`See more on ${extractHost(content)}`}>
                                    <IconButton
                                        color="primary" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(content, '_blank', 'noopener,noreferrer');
                                            }}  
                                        aria-label="external link">
                                        <LinkIcon />
                                    </IconButton>
                                </Tooltip> 
                            : 
                                content
    
    // if chip specified in column configs :
    if (col.chipColor) {
        contentComponent = <Chip label={contentComponent} color={col.chipColor[content] ?? 'default'  }/>
    }

    return (
        <TableCell
            key={`${String(col.key)}-${rowId}`}
            component={index === 0 ? 'th' : undefined}
            scope={index === 0 ? 'row' : undefined}
            padding={col.padding ?? 'normal'}
            align={index !== 0 ? 'left' : undefined}
            >
                
            {contentComponent}

        </TableCell>
    )
}

export default EnhancedTableCell