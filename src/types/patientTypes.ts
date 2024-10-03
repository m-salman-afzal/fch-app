export type Patient = {
  dob: string;
  externalPatientId: string;
  facilityId: string;
  gender: string;
  jmsId: string;
  lastBookedDate: string;
  lastReleaseDate: string;
  location: string;
  name: string;
  patientId: string;
  status: string;
  supplyDays?: string;
};

export type PatientFilters = Pick<Patient, 'status'>;
