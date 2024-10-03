import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';

import { SelectOption, TPaginatedData, TPagination } from '@/types/commonTypes';

const useSelectPagination = <T>(
  getData: (
    pagination: TPagination,
    search?: string
  ) => Promise<TPaginatedData<SelectOption>>
) => {
  const [dropdownLoading, setDropdownLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const isSmall = window.screen.width <= 576;

  const [pagination, setPagination] = useState<TPagination>({
    currentPage: 1,
    perPage: isSmall ? 50 : 25,
    totalItems: 0
  });

  const handleSearch = useCallback(
    debounce(e => {
      searchDropdown(e);
    }, 500),
    []
  );

  const onPopupScroll = async (e: any) => {
    if (dropdownLoading) {
      return;
    }
    const { target } = e;
    const currentPagination = { ...pagination };
    if (
      (target as any).scrollTop + (target as any).offsetHeight ===
      (target as any).scrollHeight
    ) {
      // if not load all;
      if (
        !!currentPagination.totalItems &&
        currentPagination.totalItems > options.length
      ) {
        setDropdownLoading(true);
        const data = await getData(
          {
            ...currentPagination,
            currentPage: currentPagination.currentPage + 1
          },
          search as string
        );
        if (!data) {
          setDropdownLoading(false);

          return;
        }
        setPagination({ ...data.paginationInfo, perPage: 25 });
        setOptions([...options, ...data.rows]);
        setDropdownLoading(false);
      }
    }
  };

  const onScrollMobile = async () => {
    if (dropdownLoading) {
      return;
    }
    const currentPagination = { ...pagination };

    setDropdownLoading(true);
    const data = await getData({
      ...currentPagination,
      currentPage: currentPagination.currentPage + 1
    });
    if (!data) {
      setDropdownLoading(false);

      return;
    }
    setPagination({ ...pagination, ...data.paginationInfo });
    setOptions([...options, ...data.rows]);
    setDropdownLoading(false);
  };

  const onDropdownVisibleChange = async (open: boolean) => {
    if ((open && options.length === 0) || search) {
      setDropdownLoading(true);
      const data = await getData(pagination);
      if (!data) {
        setDropdownLoading(false);

        return;
      }
      setPagination({ ...pagination, ...data.paginationInfo });
      setOptions([...options, ...data.rows]);
      setDropdownLoading(false);
      setSearch(undefined);
    }

    if (!open && !!search) {
      setOptions([]);
    }
  };

  const searchDropdown = async (search: string) => {
    setDropdownLoading(true);
    const data = await getData(pagination, search);
    if (!data) {
      setOptions([]);
      setDropdownLoading(false);

      return;
    }
    setPagination({ ...pagination, ...data.paginationInfo });
    setOptions([...data.rows]);
    setDropdownLoading(false);
  };

  return {
    dropdownLoading,
    options,
    handleSearch,
    search,
    onDropdownVisibleChange,
    onPopupScroll,
    onScrollMobile
  };
};

export default useSelectPagination;

export type TSelectPaginationHook = {
  dropdownLoading: boolean;
  options: SelectOption[];
  handleSearch: (e: any) => void;
  search: string | undefined;
  onDropdownVisibleChange: (open: boolean) => Promise<void>;
  onPopupScroll: (e: any) => Promise<void>;
  onScrollMobile: () => Promise<void>;
};
