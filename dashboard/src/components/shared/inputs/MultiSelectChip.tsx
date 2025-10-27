'use client';
import { firstLetterToUppercase } from '@/lib/utils/stringUtils';
import { Autocomplete,   Chip, FormControl,  TextField,  } from '@mui/material';
import React from 'react'


interface MultiSelectChipProps {
    datalist : string[]    
    filterName : string
    onFilterChange: (filterKey: string, values: string[]) => void
    selectedValues: string[]
    
}



const MultiSelectChip = ({datalist, onFilterChange, filterName, selectedValues} : MultiSelectChipProps) => {
    


  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <Autocomplete
          id={`${filterName}-autocomplete`} 
          multiple
          size="medium"
          options={datalist}
          value={selectedValues}
          onChange={(_, values) => onFilterChange(filterName, values)} 
          isOptionEqualToValue={(opt, val) => opt === val}               
          renderTags={(value: string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                key={option}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label={firstLetterToUppercase(filterName)}
                            
            />
          )}
          disableCloseOnSelect
          noOptionsText="No options available"
        />  
      </FormControl>
    </div>
  )
}

export default MultiSelectChip