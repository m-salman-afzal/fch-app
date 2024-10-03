export type TServiceDisruption = {
  serviceDisruptionId: string;
  serviceDisruptionPatients: number;
  time: string;
  service: string;
  reason: string;
  facility: { staffCount: number };
  dateTimeUtc: string;
  date: string;
  adminId: string;
};

export type TServiceDisruptionFilters = {
  date?: Date | string;
  service?: string;
  reason?: string;
};
