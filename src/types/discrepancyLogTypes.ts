import { Admin } from './adminTypes';
import { TCartData } from './cartTypes';
import {
  TPerpetualInventory,
  TPerpetualInventoryDeduction
} from './perpetualInventoryTypes';

export type TDiscrepancyLog = {
  discrepancyLogId: string;
  type: string;
  level: number;
  comment: string;
  perpetualInventoryId: string;
  perpetualInventoryDeductionId: string;
  cartId: string;
  facilityId: string;
  adminId: string;
  perpetualInventory: TPerpetualInventory | null;
  perpetualInventoryDeduction: TPerpetualInventoryDeduction | null;
  createdAt: string;
  cart: TCartData;
  admin: Admin;
  dateTime?: string;
  expectedQuantity: number;
  handOffName: string;
  receiverName: string;
  quantityAllocated: number;
  quantityDeducted: number;
};
