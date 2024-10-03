import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, Form, FormInstance, Tag } from 'antd';
import dayjs from 'dayjs';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { SelectOption } from '@/types/commonTypes';

import { ALL } from '@/utils/constants';
import { camelToTitleCase, getProperCase } from '@/utils/stringFormatting';

interface props<T extends object> {
  filterForm: FormInstance<T>;
  filterState: T & { [key: string]: string | number | Date };
  filterInitialValues: T;
  onChangeFilters: (values: T) => void;
  marginTop?: string | number;
  marginBottom?: string | number;
  customKeys?: { [x: string]: string };
  customMapForSelect?: {
    [x: string]: SelectOption[];
  };
  excludeKeys?: {
    [x: string]: boolean;
  };
  rangeKeys?: {
    [x: string]: [string, string];
  };
  repositoryId?: string | null;
  closable?: boolean;
}

const FilterTags = <T extends object>({
  filterForm,
  filterInitialValues,
  onChangeFilters,
  filterState,
  marginTop,
  marginBottom,
  customKeys,
  customMapForSelect,
  excludeKeys,
  rangeKeys,
  repositoryId,
  closable = true
}: props<T>) => {
  const [keysList, setKeysList] = useState<string[]>([]);
  const isSmall = window.screen.width <= 576;

  const getKeysList = () => {
    const tempKeys = [];
    for (const key in filterState) {
      if (!excludeKeys) {
        if (filterState[key] !== ALL && filterState[key]) {
          tempKeys.push(key);
        }
      }
      if (excludeKeys) {
        if (filterState[key] !== ALL && filterState[key] && !excludeKeys[key]) {
          tempKeys.push(key);
        }
      }
    }
    setKeysList(tempKeys);
  };

  useEffect(() => {
    getKeysList();
  }, [filterState]);

  const isDate = (value: string | Date) => {
    if (typeof value === 'number') {
      return false;
    }
    if (typeof value === 'string') {
      return dayjs(value, 'YYYY-MM-DD', true).isValid();
    }

    return dayjs(value).isValid();
  };

  const getRangeKey = (filterName: string) => {
    if (rangeKeys) {
      const keys = Object.keys(rangeKeys);
      const values = Object.values(rangeKeys);

      for (const index in values) {
        const found = values[index].find(name => name === filterName);
        if (found) {
          return keys[index];
        }
      }
    }

    return false;
  };

  const resetFilterOnTagClose = (key: keyof T) => {
    filterForm.resetFields([key]);

    if (rangeKeys) {
      const rangeKey = getRangeKey(key as string);
      if (rangeKey) {
        const index = rangeKeys[rangeKey].findIndex(
          name => name === (key as string)
        );

        const valueOfRangeKey = filterForm.getFieldValue([rangeKey]);

        filterForm.setFieldValue(
          [rangeKey],
          valueOfRangeKey.map((item: number, itemIndex: number) => {
            if (index === itemIndex) {
              return filterInitialValues[key];
            }

            return item;
          })
        );
        filterForm.setFieldValue([key], filterInitialValues[key]);
        onChangeFilters(filterForm.getFieldsValue());

        return;
      }
    }

    if (filterInitialValues[key] === ALL) {
      filterForm.setFieldValue([key], ALL);
      onChangeFilters(filterForm.getFieldsValue());

      return;
    }

    filterForm.setFieldValue([key], filterInitialValues[key]);
    onChangeFilters(filterForm.getFieldsValue());
  };

  const onPressClearAll = () => {
    filterForm.resetFields();
    let tempObject = structuredClone(filterInitialValues);
    for (const key in tempObject) {
      if (
        typeof filterInitialValues[key] === 'string' &&
        !isDate(filterInitialValues[key]) &&
        filterInitialValues[key] === ALL
      ) {
        (tempObject[key] as string) = ALL;
      } else if (filterInitialValues[key]) {
        tempObject[key] = filterInitialValues[key];
      }
    }
    filterForm.setFieldsValue(tempObject);

    onChangeFilters(tempObject);
  };

  const getFilterName = (filterName: string) => {
    if (!customKeys) {
      return getProperCase(filterName);
    }

    if (!customKeys[filterName]) {
      return getProperCase(filterName);
    }

    return customKeys[filterName];
  };

  const getDefaultMapping = (filterName: string) => {
    if (isDate(filterState[filterName] as string | Date)) {
      return dayjs(filterState[filterName]).format('MM/DD/YYYY');
    }

    if (typeof filterState[filterName] === 'string') {
      return getProperCase(filterState[filterName]);
    }

    return filterState[filterName] as number;
  };

  const getcustomMappingForSelect = (filterName: string) => {
    if (!customMapForSelect) {
      return getDefaultMapping(filterName);
    }

    if (!customMapForSelect[filterName]) {
      return getDefaultMapping(filterName);
    }

    const foundElement = customMapForSelect[filterName].find(
      option => option.value === filterState[filterName]
    )?.label;

    return foundElement;
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        columnGap: pxToRem(2),
        marginBottom: marginBottom,
        marginTop: marginTop
      }}
    >
      {!isSmall &&
        !repositoryId &&
        keysList.map(filter => (
          <div
            key={filter}
            style={{
              display: 'flex',
              alignItems: 'center',
              columnGap: pxToRem(5),
              padding: closable ? undefined : pxToRem(4)
            }}
          >
            {getFilterName(filter)}:
            <Tag
              bordered={false}
              onClose={() => {
                resetFilterOnTagClose(filter as keyof T);
              }}
              closable={closable}
              key={filter}
              color="blue"
            >
              {getcustomMappingForSelect(filter)}
            </Tag>
          </div>
        ))}
      {!isSmall && !repositoryId && keysList.length > 0 && closable && (
        <Button
          style={{ paddingInline: 0 }}
          onClick={onPressClearAll}
          type={'link'}
        >
          <u>Clear All</u>
        </Button>
      )}
    </div>
  );
};

export default FilterTags;
