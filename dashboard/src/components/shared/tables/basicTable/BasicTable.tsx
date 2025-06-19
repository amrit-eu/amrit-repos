import React from 'react' 
import {  Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { TableViewConfig } from '@/config/tableConfigs'

interface HasId {
  id: string;
}
interface BasicTableProps<T extends HasId > {
    colmunsConfiguration: TableViewConfig<T>
    data: Array<T>
    handleClickOnRow?:  (event: React.MouseEvent<unknown>, id: string) => void
}

function BasicTable<T extends HasId >({colmunsConfiguration, data, handleClickOnRow}: BasicTableProps<T>) {
    
  return (    
    
      <TableContainer  component={Paper}>           
        <Table  aria-label="simple table">
          <TableHead>
            <TableRow >
              {colmunsConfiguration.mainColumns.map(col => (
                        <TableCell
                          sx={{fontWeight: 'bold'}}
                          key={`headCell-${String(col.key)}`}
                          align={col.align ?? 'left'} 
                          padding={col.padding ?? 'normal'}                                            
                        >                        
                            {col.label ?? String(col.key)}
                            
                        </TableCell>
              ))}  
            </TableRow>
          </TableHead>       
          <TableBody>
            {(data ?? []).map((rowData, index) => {               
                  return (
                      
                      <TableRow
                          key={`basic-table-row-${rowData.id}-${index}`}
                          hover                  
                          onClick={handleClickOnRow && ((event: React.MouseEvent<unknown>) => handleClickOnRow(event, rowData.id))}                       
                          tabIndex={-1}                   
                          sx={handleClickOnRow ? { cursor: 'pointer',
                              '& > *': { borderBottom: 'unset !important' }
                              } :
                            {'& > *': { borderBottom: 'unset !important' }}
                            }                        
                      >
                          {colmunsConfiguration.mainColumns.map((col, index) => (
                              <TableCell
                              key={`${String(col.key)}-${rowData.id}`}
                              component={index === 0 ? 'th' : undefined}
                              scope={index === 0 ? 'row' : undefined}
                              padding={col.padding ?? 'normal'}  
                              align={index !== 0 ? 'left' : undefined}
                              >
                                  {col.chipColor ? (<Chip label={String(rowData[col.key])} color={col.chipColor[String(rowData[col.key])] ?? 'default'  }/>) : (rowData[col.key] != null ? String(rowData[col.key]) : '')}
                              </TableCell>
                          ))}   
                          
                      </TableRow>



                  );
                })}              
          </TableBody>
        </Table> 
      </TableContainer>   
   
  )
}

export default BasicTable