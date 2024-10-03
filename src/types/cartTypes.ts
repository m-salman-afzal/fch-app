export type TUnitList = {
  unit: string;
  facilityUnitId: string;
};

export type TReferenceGuide = {
  name: string;
  referenceGuideId: string;
  note: string | null;
  isDeleted: boolean | undefined;
};

export type TCartData = {
  cart: string;
  facilityId: string;
  cartId: string;
  drugCount: string;
  units: TUnitList[];
  patientCount: number;
  quantity: number;
  referenceGuide: TReferenceGuide;
};

export type CartForm = Pick<TCartData, 'units' | 'cart' | 'cartId'>;
