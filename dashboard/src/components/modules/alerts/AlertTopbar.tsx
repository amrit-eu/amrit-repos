'use client';
import { AppBar, IconButton, Toolbar, Tooltip, useTheme } from '@mui/material'
import { Dayjs } from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react' // ✅ add useEffect
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
import { useAppStore } from '@/store/useAppStore';
import { useShallow } from 'zustand/react/shallow';
import dayjs from 'dayjs';

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
const AlertTopbar = ({
  filtersValues, onFilterChange, filtersSelectedValues, isUserLogin,
  filtersToDisplayList, setfiltersToDisplayList, setFiltersSelectedValues,
  isOnlyMySubsAlerts, setIsOnlyMySubsAlerts
}: AlertTopBarProps) => {
  const theme = useTheme();

  // Zustand store bits we need
  const {
    alertsDisplayed,
    alertsSelected,
    alertsOnlyMySubs,
    setAlertSelected,
    bulkSetAlertSelected,
    setAlertsDisplayed,
    setOnlyMySubs,
  } = useAppStore(
    useShallow((s) => ({
      alertsDisplayed: s.alerts.displayed,
      alertsSelected: s.alerts.selected,
      alertsOnlyMySubs: s.alerts.onlyMySubs,
      setAlertSelected: s.setAlertSelected,
      bulkSetAlertSelected: s.bulkSetAlertSelected,
      setAlertsDisplayed: s.setAlertsDisplayed,
      setOnlyMySubs: s.setOnlyMySubs,
    }))
  );

  // We use persist API to know when rehydration finished
  const [hydrated, setHydrated] = useState(() => useAppStore.persist.hasHydrated());
  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
    // in case it already hydrated before effect ran:
    if (useAppStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  // After hydration, we seed the parent props from the store (once)
  useEffect(() => {
    if (!hydrated) return;

    // override regardless of parent's initial defaults
    setfiltersToDisplayList(alertsDisplayed ?? []);
    setFiltersSelectedValues(alertsSelected ?? {});
    setIsOnlyMySubsAlerts(alertsOnlyMySubs ?? false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // local modal state
  const [isFiltersListModalOpen, setIsFiltersListModalOpen] = useState(false);

  const sortedFiltersToDisplay = useMemo(() => {
    return [...filtersToDisplayList].sort(
      (a, b) => Object.values(ALERTS_FILTERS_CATEGORY).flat().indexOf(a) - Object.values(ALERTS_FILTERS_CATEGORY).flat().indexOf(b)
    );
  }, [filtersToDisplayList]);

  const handleTopicSelection = (newtopicId: number) => {
    if (filtersValues.alert_category) {
      const topicAndChildren = findAllChildrenTopicsFromId(filtersValues.alert_category, newtopicId);
      setAlertSelected('alert_category', topicAndChildren); // persist (zustand)
      onFilterChange('alert_category', topicAndChildren);
    }
  };

  const onFiltersListModalClose = (draftChosenElements?: AlertFilters[]) => {
    if (draftChosenElements) {
      const newFilterSelectedValues: FiltersValuesMap = { ...filtersSelectedValues };
      let filterRemoved = false;

      for (const [key] of Object.entries(newFilterSelectedValues)) {
        if (!draftChosenElements.includes(key as AlertFilters)) {
          delete newFilterSelectedValues[key as AlertFilters];
          filterRemoved = true;
        }
      }
      if (filterRemoved) {
        setFiltersSelectedValues(newFilterSelectedValues);
        bulkSetAlertSelected(newFilterSelectedValues);
      }

      setAlertsDisplayed(draftChosenElements);             // persist (zustand)
      setfiltersToDisplayList(draftChosenElements);
    }

    setIsFiltersListModalOpen(false);
  };

  return (
    <AppBar position="static" square={false} elevation={1}
      sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary }}>
      <Toolbar sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: '12px', margin: 0, gap: 2 }}>
        <Tooltip title="Filter list">
          <IconButton onClick={() => setIsFiltersListModalOpen(true)} aria-label="show filters list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>

        {sortedFiltersToDisplay.map((filter) => {
          switch (filter) {
            case 'severity':
            case 'status':
              if (filtersValues[filter])
                return (
                  <MultiSelectChip
                    key={filter}
                    datalist={Array.isArray(filtersValues[filter]) ? filtersValues[filter] : []}
                    filterName={filter}
                    selectedValues={Array.isArray(filtersSelectedValues[filter]) ? filtersSelectedValues[filter] : []}
                    onFilterChange={(filterKey, values) => {
                      setAlertSelected(filterKey as AlertFilters, values); // persist (zustand)
                      onFilterChange(filterKey as AlertFilters, values);
                    }}
                  />
                );
              return null;

            case 'resource':
            case 'event':
              return (
                <MultiChipInput
                  key={filter}
                  filterName={filter}
                  selectedItems={Array.isArray(filtersSelectedValues[filter]) ? filtersSelectedValues[filter] : []}
                  onFilterChange={(filterKey, values) => {
                    setAlertSelected(filterKey as AlertFilters, values);   // persist (zustand)
                    onFilterChange(filterKey as AlertFilters, values); 
                  }}
                />
              );

            case 'Country':
              return (
                <CountrySelect
                  key={filter}
                  multiple
                  label="Country"
                  options={filtersValues[filter] as CountryOption[]}
                  value={Array.isArray(filtersSelectedValues[filter]) ? (filtersSelectedValues[filter] as CountryOption[]) : []}
                  onChange={(newValue) => {
                    const val = Array.isArray(newValue) ? newValue : newValue ? [newValue] : undefined;
                    setAlertSelected('Country', val);                      // persist (zustand)
                    onFilterChange('Country', val);
                  }}
                />
              );

            case 'from-date':
            case 'to-date':
              return (
                <DateTimePicker
                  key={filter}
                  label={firstLetterToUppercase(filter.replace('-date', ''))}
                  format="YYYY-MM-DD HH:mm:ss"
                  value={
                    typeof filtersSelectedValues[filter] === 'string'
                      ? (dayjs(filtersSelectedValues[filter] as string).isValid()
                          ? dayjs(filtersSelectedValues[filter] as string)
                          : null)
                      : null
                  }
                  onChange={(newValue) => {
                    const iso = newValue ? newValue.toDate().toISOString() : undefined;
                    setAlertSelected(filter, iso);    // persist (zustand)
                    onFilterChange(filter, iso);     
                  }}
                  slotProps={{ field: { clearable: true } }}
                />
              );

            case 'alert_category':
              return (
                <TopicSelectField
                  key={filter}
                  size="medium"
                  value={filtersSelectedValues[filter] ? filtersSelectedValues[filter][0].id : null}
                  onChange={(newValue) => handleTopicSelection(newValue)}
                  topics={filtersValues.alert_category ?? []}
                />
              );
          }
        })}

        {isUserLogin && (
          <FormControlLabel
            control={
              <Checkbox
                checked={isOnlyMySubsAlerts}
                onChange={() => {
                  const next = !isOnlyMySubsAlerts;
                  setIsOnlyMySubsAlerts(next);
                  setOnlyMySubs(next);         // persist (zustand)
                }}
              />
            }
            label="View only my subscriptions"
          />
        )}

        <CategoryGroupedChoicesModal<AlertFilters>
          groupedElementsByCategory={ALERTS_FILTERS_CATEGORY}
          isModalOpen={isFiltersListModalOpen}
          onClose={onFiltersListModalClose}
          chosenElementsList={filtersToDisplayList}
          setChosenElementsList={setfiltersToDisplayList}
        />
      </Toolbar>
    </AppBar>
  );
};

export default AlertTopbar;