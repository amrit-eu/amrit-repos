'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Stack,
  FormControl,
  InputLabel,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { ALERT_SEVERITY_OPTIONS } from '@/constants/alertOptions';
import { FilterOption } from '@/types/filters';
import CountrySelect from '../../shared/inputs/CountrySelect';
import { CountryOption } from '@/types/types';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Dayjs } from 'dayjs';
import fetchCountryOptions from '@/lib/fetchers/fetchCountryOptions.client';

export type FilterValue =
  | string
  | { minTime?: string; maxTime?: string }
  | CountryOption
  | null;

interface AddFilterModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (filterType: string, value: FilterValue) => void;
}

const FILTER_TYPES = [
  { label: 'Minimum Severity', value: 'minSeverityId' },
  { label: 'Country', value: 'countryName' },
  { label: 'Resource', value: 'resource' },
  { label: 'WIGOS-ID', value: 'wigosId' },
  { label: 'Time range', value: 'timeRange' },
  { label: 'Event', value: 'event' }
];

const AddFilterModal = ({ open, onClose, onConfirm }: AddFilterModalProps) => {
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState<FilterValue>('');
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [, setCountryValue] = useState<CountryOption | null>(null);
  const [selectOpen, setSelectOpen] = useState(false);
  const [severityOpen, setSeverityOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  const valueInputRef = useRef<HTMLInputElement>(null);

  // Auto-open the filter type select when the modal opens
  useEffect(() => {
    if (open) {
      setFilterType('');
      setFilterValue('');
      setSelectOpen(true);
      setSeverityOpen(false);
      setCountryOpen(false);
    } else {
      setSelectOpen(false);
    }
  }, [open]);

  const fetchOptions = async (type: string) => {
    setLoadingOptions(true);
    let options: FilterOption[] = [];

    try {
      switch (type) {
        case 'minSeverityId':
          options = ALERT_SEVERITY_OPTIONS;
          setFilterOptions(filterOptions);
          break;
        case 'countryName' :
          const data = await fetchCountryOptions();
          const fetchedCountryOptions = data
            .filter((item) => item.id && item.name)
            .map((item) => ({
              id: item.id ?? '',
              name: item.name ?? 'Unknown',
              code2: item.code2 ?? '',
            }));
          options = fetchedCountryOptions.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
      }
    }     
     catch  {      
    }
    setFilterOptions(options);    
    setLoadingOptions(false);
  };

  const handleTypeChange = async (selectedType: string) => {
    setFilterType(selectedType);
    setFilterValue('');
    setSelectOpen(false);
    setSeverityOpen(false);
    setCountryOpen(false);

    await fetchOptions(selectedType);

    if (selectedType === 'minSeverityId') {
      setTimeout(() => setSeverityOpen(true), 0);
    } else if (selectedType === 'countryName') {
      setTimeout(() => setCountryOpen(true), 0);
    }  else if (selectedType === 'event' || selectedType === 'resource' || selectedType === 'wigosId') {
      // focus the value textbox
      setTimeout(() => valueInputRef.current?.focus(), 0);
    }
  };


  const handleConfirm = () => {
    onConfirm(filterType, filterValue);
    setFilterType('');
    setFilterValue('');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add a Filter</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
        <FormControl fullWidth>
          <InputLabel id="filter-type-label">Filter type</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => handleTypeChange(e.target.value as string)}
              fullWidth
              label={"Filter type"}
              // Open the dropdown automatically on modal show
                open={selectOpen}
                onOpen={() => setSelectOpen(true)}
                onClose={() => setSelectOpen(false)}
                displayEmpty
                renderValue={(val) => (val ? FILTER_TYPES.find(f => f.value === val)?.label : '')}
                MenuProps={{ disableScrollLock: true }}
            >
              {FILTER_TYPES.map((f) => (
                <MenuItem key={f.value} value={f.value}>
                  {f.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {filterType === 'timeRange' ? (
            <Stack direction="row" spacing={2}>
				<DateTimePicker
				label="From"
  				format="YYYY-MM-DD HH:mm:ss"
				onChange={(newValue: Dayjs | null) =>
					setFilterValue((prev: FilterValue) => ({
					...(typeof prev === 'object' && prev !== null ? prev : {}),
					minTime: newValue?.toISOString() ?? undefined,
					}))
				}
				slotProps={{ textField: { fullWidth: true } }}
				/>

				<DateTimePicker
				label="To"
  				format="YYYY-MM-DD HH:mm:ss"
				onChange={(newValue: Dayjs | null) =>
					setFilterValue((prev: FilterValue) => ({
					...(typeof prev === 'object' && prev !== null ? prev : {}),
					maxTime: newValue?.toISOString() ?? undefined,
					}))
				}
				slotProps={{ textField: { fullWidth: true } }}
				/>
        </Stack>
          ) : (filterType && ['countryName'].includes(filterType) ? (
            <CountrySelect 
                label="Country"
                multiple={false}
                onChange={(newValue) => {
                  if (newValue) {
                    setCountryValue(newValue as CountryOption);
                    setFilterValue(newValue as CountryOption);
                  } else {
                    setCountryValue(null);
                    setFilterValue(null);
                  }
                } } 
                options={filterOptions as CountryOption[]}	
                menuOpen={countryOpen}
                onMenuOpen={() => setCountryOpen(true)}
                onMenuClose={() => setCountryOpen(false)}
                autoFocus		/>
          ) : filterType && ['minSeverityId'].includes(filterType) ? (
			
			<FormControl fullWidth>
 				 <InputLabel id="filter-severity-label">Minimum severity</InputLabel>
          <Select
            labelId="filter-severity-label"
            label="Minimum severity"
            value={String(filterValue)}
            fullWidth
            onChange={(e) => setFilterValue(e.target.value)}
            disabled={loadingOptions}
            // Auto-open after type selection
            open={severityOpen}
            onOpen={() => setSeverityOpen(true)}
            onClose={() => setSeverityOpen(false)}
          >
				{filterOptions.map((opt) => (
					<MenuItem key={opt.id ?? opt.value} value={opt.label ?? opt.name}>
					{opt.label ?? opt.name}
					</MenuItem>
				))}
				</Select>
			</FormControl>
          ) : (
            filterType && (
              <TextField
                label="Value"
                fullWidth
                value={typeof filterValue === 'string' ? filterValue : ''}
                onChange={(e) => setFilterValue(e.target.value)}
                inputRef={valueInputRef}
                autoFocus 
              />
            )
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}
          variant="outlined">Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!filterType || !filterValue}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFilterModal;
