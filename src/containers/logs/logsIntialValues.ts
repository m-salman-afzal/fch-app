export type searchingDataTypes = {
  text: undefined | string;
  action: '' | 'UPDATE' | 'DELETE' | 'ADD';
  role: string;
  entity: string;
  sort: 'ASC' | 'DESC';
  adminId: string;
  patientId: string;
  fromDate: string | undefined;
  toDate: string | undefined;
};
export type selectedLogsType = {
  imageType: string | null;
  patientId: string | null | any;
  imageReference: string | null;
};
export const searchingInitialValues: searchingDataTypes = {
  text: undefined,
  action: '',
  role: '',
  entity: '',
  sort: 'DESC',
  adminId: '',
  patientId: '',
  fromDate: undefined,
  toDate: undefined
};

export const selectedLogsInitialValues = {
  imageType: null,
  patientId: null,
  imageReference: null
};
