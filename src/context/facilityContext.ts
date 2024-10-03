import { createContext } from 'react';

import { TFacilityContext } from '@/types/facilityTypes';

export const FacilityContext = createContext<TFacilityContext>({
  currentFacility: {
    externalFacilityId: '',
    facilityId: '',
    facilityName: '',
    supplyDays: 7
  },
  setCurrentFacility: () => {},
  previousFacility: undefined,
  setPreviousFacility: () => {}
});
