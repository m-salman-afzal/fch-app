interface IUseSession {
  key: string;
  value?: unknown;
}
export const useSessionStorage = () => {
  const setSessionStorage = (params: IUseSession) => {
    window.sessionStorage.setItem(
      params.key,
      typeof params.value === 'object'
        ? JSON.stringify(params.value)
        : (params.value as string)
    );
  };

  const getSessionStorage = (key: string = 'facility') => {
    const item = window.sessionStorage.getItem(key);

    try {
      return item && JSON.parse(item);
    } catch (error) {
      return item;
    }
  };

  const removeAllSessionStorage = (key?: string) => {
    if (key) {
      window.sessionStorage.removeItem(key);

      return;
    }

    window.sessionStorage.clear();
  };

  return {
    setSessionStorage,
    getSessionStorage,
    removeAllSessionStorage
  };
};
