export type Pagination = {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages?: number;
};

export type SelectOption = {
  label: string;
  key: string;
  value: string | number;
  type?: string;
};

export type TPagination = {
  currentPage: number;
  perPage: number;
  totalItems?: number;
  totalPages?: number;
};

export type TPaginatedData<T> = {
  paginationInfo: TPagination;
  rows: T[];
};
