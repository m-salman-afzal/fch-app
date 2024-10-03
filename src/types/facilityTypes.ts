export type TFacility = {
  facilityId: string;
  facilityName: string;
  externalFacilityId: string;
  supplyDays: number;
};

export type TFacilityContext = {
  currentFacility: TFacility;
  setCurrentFacility: (val: any) => void;
  previousFacility: TFacility | undefined;
  setPreviousFacility: (val: any) => void;
};
