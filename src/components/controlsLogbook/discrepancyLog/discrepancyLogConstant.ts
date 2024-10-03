import { ALL_OPTION } from '@/utils/constants';

export const DISCREPANCY_LOG_FILTER_INITIAL_VALUES = {
  fromDate: '',
  toDate: '',
  name: '',
  cartId: '',
  type: ''
} as const;

export const DISCREPANCY_LOG_TYPES = {
  EDIT: 'EDIT',
  DELETE: 'DELETE',
  SHIFT_COUNT_LOG: 'SHIFT_COUNT_LOG'
};

export const DISCREPANCY_LOG_TYPES_FILTERS = [
  ALL_OPTION,
  {
    key: 'EDIT',
    value: 'EDIT',
    label: 'Edit'
  },
  {
    key: 'DELETE',
    value: 'DELETE',
    label: 'Delete'
  },
  {
    key: 'SHIFT_COUNT_LOG',
    value: 'SHIFT_COUNT_LOG',
    label: 'Discrepancy'
  }
];
