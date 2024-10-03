import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';

export const RELEASED_STATUS = 'RELEASED';
export const ACTIVE_STATUS = 'ACTIVE';

export type TBridgeTherapyFilterTypes = {
  searchText?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  lastBookedDate?: string;
};

export const searchingInitialValuesBridgeTherapy: TBridgeTherapyFilterTypes = {
  searchText: '',
  status: RELEASED_STATUS,
  fromDate: getFormattedDateNoTimeZone({
    subtract: { amount: 1, unit: 'day' },
    format: DATE_FORMATS.YMD
  }),
  toDate: getFormattedDateNoTimeZone({
    subtract: { amount: 1, unit: 'day' },
    format: DATE_FORMATS.YMD
  }),
  lastBookedDate: getFormattedDateNoTimeZone({
    subtract: { amount: 6, unit: 'days' },
    format: DATE_FORMATS.YMD
  })
};
