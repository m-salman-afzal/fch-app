import { useEffect, useState } from 'react';

const useTablePaginationPosition = (
  isSelected?: boolean,
  customSelectedSpace: number = 80
) => {
  const [tableHeight, setTableHeight] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState(0);

  const selectedSpace =
    window.screen.width <= 576 ? 115 : zoomLevel > 1 ? customSelectedSpace : 0;
  useEffect(() => {
    const handleResize = () => {
      const newZoomLevel = window.devicePixelRatio;
      if (newZoomLevel !== zoomLevel) {
        setZoomLevel(newZoomLevel);
      }
    };

    window.addEventListener('resize', handleResize);
    setTableHeight(getScreenSizeAndTableSpace());

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [zoomLevel, isSelected]);

  const getScreenSizeAndTableSpace = () => {
    const spaceMobile = isSelected ? selectedSpace + 395 : 280;
    const spaceDesktop = isSelected ? selectedSpace + 275 : 275;
    if (window.screen.width >= 3840) {
      return window.innerHeight - (spaceDesktop + 100);
    }

    if (window.screen.width >= 2560) {
      return window.innerHeight - (spaceDesktop + 80);
    }

    if (window.screen.width <= 576) {
      window.innerHeight - spaceMobile;
    }

    return window.innerHeight - spaceDesktop;
  };

  return { tableHeight };
};
export default useTablePaginationPosition;
