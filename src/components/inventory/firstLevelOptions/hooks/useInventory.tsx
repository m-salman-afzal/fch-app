import { FC, useCallback, useEffect, useState } from 'react';
import { FormInstance } from 'antd';
import debounce from 'lodash.debounce';
import { BasicInput } from 'vs-design-components';

import { Formulary } from '@/types/formularyTypes';

import { useFetch } from '@/hooks/useFetch';
import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import { API_BASE_URL, INVENTORY_URL } from '@/utils/urls';

export const useInventory = (
  form: FormInstance,
  formData: Formulary,
  formName: string,
  setDisable: () => void
) => {
  const [ndcValue, setNdcValue] = useState('');
  const [lotValue, setLotValue] = useState('');
  const [ndcList, setNdcList] = useState<any[]>([]);
  const [lotList, setLotList] = useState<any[]>([]);
  const [inventoryData, setInventoryData] = useState([]);

  const { fetchData, isLoading } = useFetch();

  useEffect(() => {
    let ndcValue = form.getFieldValue([formName, 'ndc']);
    let lotValue = form.getFieldValue([formName, 'lotNo']);
    setLotValue(lotValue);
    setNdcValue(ndcValue);
  }, []);

  const onChangeNdc = async (input: string) => {
    const data = await fetchData(`${API_BASE_URL}${INVENTORY_URL}/suggestion`, {
      formularyId: formData.formularyId
    });

    if (data?.status === 'error') return;

    setInventoryData(data);
    setNdcList(
      Array.from(new Set(data.map((item: any) => item.ndc))).map(ndc => ({
        value: ndc,
        key: ndc
      }))
    );

    // setLotList(data.map((d: any) => ({ value: d.lotNo, key: d.lotNo })));
  };

  const delayOnChangeNdc = useCallback(
    debounce(async (inputText: string) => {
      await onChangeNdc(inputText);
    }, 0),
    [BasicInput]
  );

  const onSelectNdc = (value: string, option: any) => {
    form.setFieldValue([formName, 'ndc'], value);
    setLotList(
      inventoryData
        .filter((id: any) => id.ndc === value)
        .map((id: any) => ({
          value: id.lotNo,
          key: id.lotNo,
          inventoryId: id.inventoryId
        }))
    );

    const selected: any = inventoryData.filter(
      (id: any) => id.ndc === value
    )[0];

    form.setFieldValue([formName, 'manufacturer'], selected.manufacturer);
    form.validateFields([[formName, 'manufacturer']]);
    setNdcValue(value);
  };

  const onSelectLot = (value: string, option: any) => {
    form.setFieldValue([formName, 'lotNo'], value);

    const selected: any = inventoryData.filter(
      (id: any) => id.inventoryId === option.inventoryId
    )[0];

    form.setFieldValue(
      [formName, 'expirationDate'],
      getFormattedDateNoTimeZone({
        date: selected.expirationDate,
        format: DATE_FORMATS.MDY
      })
    );
    form.validateFields([[formName, 'expirationDate']]);
    setLotValue(value);
    setDisable();
  };

  return {
    isLoading,
    delayOnChangeNdc,
    ndcValue,
    ndcList,
    lotValue,
    lotList,
    onSelectNdc,
    onSelectLot,
    setNdcValue,
    setLotValue
  };
};
