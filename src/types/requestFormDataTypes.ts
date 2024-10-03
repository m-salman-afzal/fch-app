import { Formulary } from './formularyTypes';

export type TRequestFormData = {
  max: number;
  min: number;
  referenceGuideDrugId: string;
  referenceGuideId: string;
  formularyId: string;
  formulary: Formulary;
  cartRequestForm: any;
  key: string;
  __temp_pkgQty?: number;
  pendingOrder?: number;
};

export type TRequestForm = {
  cartId: string;
  type: 'STANDARD' | 'AFTER_HOURS';
  drugType?: string;
  label?: string;
  isControlled?: boolean;
  note?: string | null;
};
