import { useContext } from 'react';

import { FacilityContext } from '@/context/facilityContext';

import { useSessionStorage } from './useSessionStorage';

interface IUseFacility {
  admin?: any;
}
export const useFacility = ({ admin }: IUseFacility = {}) => {
  const {
    currentFacility,
    setCurrentFacility,
    previousFacility,
    setPreviousFacility
  } = useContext(FacilityContext);

  const { setSessionStorage, removeAllSessionStorage } = useSessionStorage();

  const onChangeFacilityForNotification = (value: any) => {
    const selectedFacility = admin?.facility.find(
      (f: any) => f.facilityId === value
    );
    if (!previousFacility) {
      setPreviousFacility(currentFacility);
      setSessionStorage({
        key: 'facility',
        value: selectedFacility
      });
      setSessionStorage({
        key: 'previousFacility',
        value: currentFacility
      });
    }

    setCurrentFacility(selectedFacility);
  };

  const restoreFacility = () => {
    if (previousFacility) {
      setCurrentFacility(previousFacility);
      setPreviousFacility(undefined);
      removeAllSessionStorage('previousFacility');
      setSessionStorage({
        key: 'facility',
        value: previousFacility
      });
    }
  };

  return {
    currentFacility,
    restoreFacility,
    onChangeFacilityForNotification
  };
};
