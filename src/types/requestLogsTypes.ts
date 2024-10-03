import { Admin } from './adminTypes';

type TRequestCart = {
  cart: string;
  cartId: string;
  facilityId: string;
  referenceGuideId: string;
};

export type TRequestLogs = {
  createdAt: string;
  admin: Admin;
  type: 'STANDARD' | 'AFTER_HOUR';
  cart: TRequestCart;
  cartRequestLogId: string;
  cartId: string;
};
