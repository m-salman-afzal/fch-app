import dayjs from 'dayjs';

import { PERMISSIONS_TYPES } from './constants';
import { DATE_FORMATS } from './dateFormatsTimezones';
import { MENU_ITEMS } from './menuItems';

export const mapItemsToSelect = (list: any[]) => {
  return list.map((item: any) => {
    return {
      ...item,
      key: item.name,
      label: item.name,
      value: item.name
    };
  });
};

export const extractNumbers = (phoneNumber: string) => {
  let number: any = phoneNumber?.match(/\d/g);
  number = number.join('');

  return number;
};
export const checkEmpty = (data: any) => {
  data = data || {};
};

export const tranformNullToString = (payload: any) => {
  const newObject: any = {};
  for (let key in payload) {
    newObject[key] = payload[key] ?? '';
  }

  return newObject;
};

export const formatCookie = (cookie: any) => {
  if (!cookie) {
    return;
  }
  let cookieParts = cookie?.split('}.');
  if (cookieParts.length > 0) {
    let extractedCookie = `${cookieParts[0]?.replace('s:j:', '')}}`;

    return { ...JSON.parse(extractedCookie) };
  }

  return '';
};

export const parseCookie = (str: string) => {
  return str
    .split(';')
    .map(v => v.split('='))
    .reduce((acc: any, v: any) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());

      return acc;
    }, {});
};

export const convertStringToProperCase = (str: string = '') => {
  const conversionArray: string[] = str?.toLowerCase().split(' ');
  for (let i = 0; i < conversionArray.length; i++) {
    conversionArray[i] =
      conversionArray[i].charAt(0).toUpperCase() + conversionArray[i].slice(1);
  }

  return conversionArray.join(' ');
};

export const formatPhoneNumber = (phoneNumberString: string) => {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    var intlCode = match[1] ? '+1 ' : '';

    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }

  return null;
};

export const pxToRem = (px: number) => {
  return `${px / 14}rem`;
};

export const randomColorHexGenerator = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);

  return '#' + n.slice(0, 6);
};

export const convertTimeIn12HourFormat = (time: string) => {
  let hour = Number(time?.split(':')[0]);
  let minutes = time?.split(':')[1];
  let modifier = 'AM';
  if (hour >= 12) {
    modifier = 'PM';
  }
  if (hour > 12) {
    hour = hour - 12;
  }

  return `${hour}:${minutes} ${modifier}`;
};

export const getNewPaginationState = (
  newPagination: any,
  previousState: any
) => {
  return {
    ...previousState,
    currentPage: newPagination.page,
    perPage: newPagination.pageSize
  };
};

export const toBase64File = async (file: any) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  return new Promise(resolve => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};

export const getContrastColor = (hexBackgroundColor = '') => {
  const red = parseInt(hexBackgroundColor.substring(1, 3), 16);
  const green = parseInt(hexBackgroundColor.substring(3, 5), 16);
  const blue = parseInt(hexBackgroundColor.substring(5, 7), 16);
  const brightness = red * 0.299 + green * 0.587 + blue * 0.114;

  return brightness > 145 ? '#000000' : '#ffffff';
};

export const toCapitalize = (word: string) => {
  return word
    ? word.replace(
        /(^\w|\s\w)(\S*)/g,
        (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()
      )
    : '';
};

export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const isRouteAllowed = (backendUrl: string[], admin: any) => {
  return backendUrl
    .map(url => {
      return admin?.rbac[url] !== PERMISSIONS_TYPES.HIDE;
    })
    .every(isShow => isShow === false);
};

export const firstAllowedRoute = (admin: any) => {
  const notificationsAndTasksBackEndUrl = MENU_ITEMS.find(
    item => item.url === '/notificationsAndTasks'
  )?.backendUrl;

  const updatedMenuItems = MENU_ITEMS.map(item => {
    const urlPermission: { [key: string]: string } = {};
    item.backendUrl.map(url => {
      urlPermission[url] = admin?.rbac[url];
    });

    return {
      ...item,
      urlPermission
    };
  });

  const routeMatched = updatedMenuItems.find(menuItem => {
    return (
      menuItem.backendUrl.filter(beUrl => {
        return menuItem.urlPermission[beUrl] !== PERMISSIONS_TYPES.HIDE;
      }).length !== 0
    );
  })?.url;

  return !isRouteAllowed(notificationsAndTasksBackEndUrl ?? [''], admin)
    ? '/notificationsAndTasks'
    : routeMatched ?? '/forbiddenAccess';
};

export const TABLE_BUTTON_STYLE = { width: pxToRem(24), height: pxToRem(24) };
export const TABLE_BUTTON_ICON_SIZE = { fontSize: pxToRem(12) };

export const segmentMenuItemsMobile = (options: any) => {
  Object.values(options).map(screen => ({
    value: screen,
    label: screen,
    key: screen
  }));
};
