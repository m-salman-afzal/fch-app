import dayjs from 'dayjs';

import { ALL } from './constants';
import { DATE_FORMATS, getFormattedDateInUTC } from './dateFormatsTimezones';

//Function Converts Dates as Well
export const getFitlerValuesAndFilterAll = <T extends object>(values: T) => {
  let object = structuredClone(values);

  for (const key in object) {
    if (object[key] === ALL) {
      delete object[key];
    }

    if (object[key] instanceof Date) {
      object = {
        ...object,
        [key]: getFormattedDateInUTC({
          date: object[key] as Date,
          format: DATE_FORMATS.YMD
        }) as string
      };
    }
  }

  return object;
};
