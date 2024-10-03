import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

const TIME_24_HR = 'HH:mm';
export const DATE_FORMATS = {
  YMD: 'YYYY-MM-DD',
  MDY: 'MM/DD/YYYY',
  TIME: TIME_24_HR,
  HMS_TIME: `${TIME_24_HR}:ss`,
  MDY_TIME: `MM/DD/YYYY - ${TIME_24_HR}`,
  YMD_HMS: `YYYY-MM-DD ${TIME_24_HR}:ss`,
  FILE_DATE: 'MM-DD-YYYY'
} as const;

type ValueOf<T> = T[keyof T];

type TFormat = ValueOf<typeof DATE_FORMATS>;

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.tz.setDefault('America/New_York');

type TGetDate = {
  format?: TFormat;
  date?: string | Date;
  startOf?: dayjs.OpUnitType;
  endOf?: dayjs.OpUnitType;
  parseFrom?: string;
  subtract?: { amount: number; unit: dayjs.ManipulateType };
  add?: { amount: number; unit: dayjs.ManipulateType };
  noTimezone?: boolean;
};

export const getDate = ({
  date,
  startOf,
  endOf,
  parseFrom,
  add,
  subtract,
  noTimezone
}: TGetDate) => {
  const parsedFromDate = noTimezone
    ? dayjs(date, parseFrom)
    : dayjs.utc(date, parseFrom);

  let tempDate = parseFrom
    ? parsedFromDate
    : noTimezone
      ? dayjs(date)
      : dayjs.utc(date);

  if (startOf) {
    tempDate = tempDate.startOf(startOf);
  }

  if (endOf) {
    tempDate = tempDate.endOf(endOf);
  }
  if (add) {
    tempDate = tempDate.add(add.amount, add.unit);
  }
  if (subtract) {
    tempDate = tempDate.subtract(subtract.amount, subtract.unit);
  }

  return tempDate;
};

export const getFormattedDateInEST = (getDateProps: TGetDate) => {
  const tempDate = getDate(getDateProps).tz();

  if (getDateProps.format) {
    return tempDate.format(getDateProps.format);
  }

  return tempDate.toISOString();
};

export const getFormattedDateInUTC = (getDateProps: TGetDate) => {
  const tempDate = getDate(getDateProps);

  if (getDateProps.format) {
    return tempDate.format(getDateProps.format);
  }

  return tempDate.toISOString();
};

export const getFormattedDateNoTimeZone = (getDateProps: TGetDate) => {
  const tempDate = getDate({ ...getDateProps, noTimezone: true });

  if (getDateProps.format) {
    return tempDate.format(getDateProps.format);
  }

  return tempDate.toISOString();
};

export const getIsAfterDate = (
  date: string | Date,
  isAfter: string | Date,
  unit?: dayjs.OpUnitType,
  parseFrom?: string
) => {
  return dayjs(getDate({ date: date, parseFrom })).isAfter(
    getDate({ date: isAfter }),
    unit
  );
};
export const getIsBeforeDate = (
  date: string | Date,
  isBefore: string | Date,
  unit?: dayjs.OpUnitType,
  parseFrom?: string
) => {
  return dayjs(getDate({ date: date, parseFrom })).isBefore(
    getDate({ date: isBefore }),
    unit
  );
};

export const getDateDiff = (
  date: string | Date,
  diffDate: string | Date,
  parseFrom?: string,
  diffParseFrom?: string
) => {
  const tempDate = getDate({ date, parseFrom });
  const dateToDff = getDate({ date: diffDate, parseFrom: diffParseFrom });

  return tempDate.diff(dateToDff);
};
