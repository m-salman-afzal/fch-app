export type TSFTPLogFilter = {
  bridgeTherapyLogCreatedAt?: string;
  adminId?: string;
  sort?: 'ASC' | 'DESC';
  adminName?: string;
};

export const searchingInitialValuesSftpLogs: TSFTPLogFilter = {
  sort: 'DESC'
};
