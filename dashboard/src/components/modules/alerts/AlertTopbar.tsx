'use client';
import { AppBar, IconButton, Toolbar, Tooltip, useTheme } from '@mui/material'
import { Dayjs } from 'dayjs';
import React, { useMemo, useState } from 'react'
import MultiSelectChip from '../../shared/inputs/MultiSelectChip';
import FilterListIcon from '@mui/icons-material/FilterList';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { firstLetterToUppercase } from '@/lib/utils/stringUtils';
import CategoryGroupedChoicesModal from '@/components/shared/modals/CategoriesGroupedCheckboxesModal/CategoriesGroupedCheckboxesModal';
import { ALERTS_FILTERS_CATEGORY } from '@/config/alertsFiltersCategories';
import { AlertFilters } from '@/constants/alertOptions';
import { FiltersValuesMap } from '@/types/filters';
import CountrySelect from '@/components/shared/inputs/CountrySelect';
import { CountryOption } from '@/types/types';
import MultiChipInput from '@/components/shared/inputs/MultiChipInput';
import TopicSelectField from '@/components/shared/inputs/TopicSelectField';
import { findAllChildrenTopicsFromId } from '@/lib/utils/findAllChildrenFromTopicId';

interface AlertTopBarProps {
    filtersValues: FiltersValuesMap
    filtersSelectedValues:  FiltersValuesMap
    setFiltersSelectedValues: React.Dispatch<React.SetStateAction<FiltersValuesMap>>
    filtersToDisplayList: AlertFilters[]
    setfiltersToDisplayList: React.Dispatch<React.SetStateAction<AlertFilters[]>>
    onFilterChange: <K extends AlertFilters>(filterKey: K, values: FiltersValuesMap[K]) => void
    isUserLogin : boolean
    isOnlyMySubsAlerts:boolean
    setIsOnlyMySubsAlerts: React.Dispatch<React.SetStateAction<boolean>>
}

const AlertTopbar = ({filtersValues, onFilterChange, filtersSelectedValues, isUserLogin, filtersToDisplayList, setfiltersToDisplayList, setFiltersSelectedValues,isOnlyMySubsAlerts,setIsOnlyMySubsAlerts   }: AlertTopBarProps) => {
    // need theme for some style
    const theme = useTheme();

    // state to open modal for filter choice :
    const [isFiltersListModalOpen, setIsFiltersListModalOpen] = useState(false);
    // sort the selected filters based on the order they have in the configuration array :
    const sortedFiltersToDisplay = useMemo(() => {
        return [...filtersToDisplayList].sort(
            (a, b) => Object.values(ALERTS_FILTERS_CATEGORY).flat().indexOf(a) - Object.values(ALERTS_FILTERS_CATEGORY).flat().indexOf(b)
        );
    }, [filtersToDisplayList]);

    // handle topic filters :
    const handleTopicSelection = (newtopicId: number) => {
        // get the topic object from topic id :
        if (filtersValues.alert_category) {            
            const topicAndChildren= findAllChildrenTopicsFromId( filtersValues.alert_category, newtopicId );
            onFilterChange ("alert_category", topicAndChildren)            
        }
    }

    // handle filters lsit modal close action :
    const onFiltersListModalClose = (draftChosenElements?:AlertFilters[]) => {
        if (draftChosenElements) {
            const newFilterSelectedValues: FiltersValuesMap = {...filtersSelectedValues}
            let filterRemoved = false;

            for (const [key] of Object.entries(newFilterSelectedValues)) {   
                if(!draftChosenElements.includes(key as AlertFilters )) {
                    // Removing a filter from display should set it to empty and refresh table    
                    delete newFilterSelectedValues[key as AlertFilters];
                    filterRemoved=true;
                }
            }
            if (filterRemoved) {
                setFiltersSelectedValues (newFilterSelectedValues)
            }
        }

        setIsFiltersListModalOpen(false)

    }
    

  
    return (

        <AppBar
            position="static"
            square={false}
            elevation={1}            
            sx={{
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,           
            }}
            >
        <Toolbar
            sx={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            padding: '12px',
            margin: 0,
            gap: 2,            
            }}           
        >
            <Tooltip title="Filter list">
                <IconButton onClick={() => setIsFiltersListModalOpen(true)}  aria-label="show filters list">
                    <FilterListIcon />
                </IconButton>
            </Tooltip>
            {sortedFiltersToDisplay.map((filter)=> {
                switch(filter) {
                    case 'severity':
                    case 'status' :                    
                        if (filtersValues[filter])
                            return <MultiSelectChip key={filter} datalist={Array.isArray(filtersValues[filter]) ? filtersValues[filter] : []} filterName={filter} onFilterChange={(filterKey, values) => {
                                onFilterChange(filterKey as AlertFilters, values);
                            } } selectedValues={Array.isArray(filtersSelectedValues[filter]) ? filtersSelectedValues[filter] : []}  />
                    case 'resource' :
                    case 'event':
                        return <MultiChipInput key={filter} selectedItems={Array.isArray(filtersSelectedValues[filter]) ? filtersSelectedValues[filter] : []} filterName={filter} onFilterChange={(filterKey, values) => {   
                                             onFilterChange(filterKey as AlertFilters, values);}} />
                    case 'Country' :
                        return <CountrySelect multiple={true} key={filter} label={'Country'} onChange={(newValue) => onFilterChange("Country", Array.isArray(newValue) ? newValue : newValue ? [newValue] : undefined) } options={filtersValues[filter] as CountryOption[]} value={Array.isArray(filtersSelectedValues[filter]) ? filtersSelectedValues[filter] as CountryOption[]: []}/> 
                    case "from-date":
                    case "to-date" :                        
                        return <DateTimePicker key={filter}
                            label={firstLetterToUppercase(filter.replace("-date", ""))}
                            format="YYYY-MM-DD HH:mm:ss"
                            onAccept={(newValue: Dayjs | null) => onFilterChange(filter, newValue?.toISOString() ?? undefined)}
                            onChange={(newValue) => {
                                if(newValue === null){
                                    onFilterChange(filter, undefined)
                                }}}
                            slotProps={{
                                field: { clearable: true },
                            }}
                        />
                    case "alert_category":
                        return <TopicSelectField key={filter} size={'medium'} value={filtersSelectedValues[filter] ? filtersSelectedValues[filter][0].id : null} onChange={(newValue) => handleTopicSelection(newValue)} topics={filtersValues.alert_category ?? []} />
                    }
            })}

            {isUserLogin &&
                <FormControlLabel control={<Checkbox checked={isOnlyMySubsAlerts} onChange={() => setIsOnlyMySubsAlerts(prev => !prev)}  />} label="View only my subscriptions" />
            }

            <CategoryGroupedChoicesModal<AlertFilters> groupedElementsByCategory={ALERTS_FILTERS_CATEGORY} isModalOpen={isFiltersListModalOpen} onClose={onFiltersListModalClose} chosenElementsList={filtersToDisplayList} setChosenElementsList={setfiltersToDisplayList} />
            
            </Toolbar> 
                    
            </AppBar>

    )
}


export default AlertTopbar