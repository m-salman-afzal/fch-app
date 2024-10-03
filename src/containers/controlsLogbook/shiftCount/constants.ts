export const SHIFT_COUNT_TAB_NAMES = {
  SHIFT_COUNT: 'Shift Count',
  LOGS: 'Logs'
} as const;

export const SHIFT_COUNT_TABS = [
  {
    key: 'shiftCount',
    label: SHIFT_COUNT_TAB_NAMES.SHIFT_COUNT,
    value: 'shiftCount'
  },
  {
    key: 'shiftCountLogs',
    label: SHIFT_COUNT_TAB_NAMES.LOGS,
    value: 'shiftCountLogs'
  }
];
