import { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Form, FormInstance, Grid, Modal, Typography } from 'antd';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import {
  TCartAllocation,
  TCartAllocationControlledForm,
  TControlledIds
} from '@/types/cartFulfillmentTypes';
import { SelectOption } from '@/types/commonTypes';

import { DRUG_CLASSES } from '@/containers/carFulfillment/constants';
import { useFetch } from '@/hooks/useFetch';
import { API_BASE_URL, CART_REQUEST_DRUGS_URL } from '@/utils/urls';

import DesktopControlledForm from './reviewControlledForms/desktopControlledFormReview';
import MobileControlledForm from './reviewControlledForms/mobileControlledFormReview';

interface props {
  open: boolean;
  onCloseModal: () => void;
  onSubmit: (values: TCartAllocationControlledForm) => Promise<void>;
  selectedData: TCartAllocation[];
  controlledFulfillForm: FormInstance<TCartAllocationControlledForm>;
  isLoading: boolean;
}

const { useBreakpoint } = Grid;

const ReviewControlledModal: React.FC<props> = ({
  open,
  onCloseModal,
  onSubmit,
  selectedData = [],
  controlledFulfillForm,
  isLoading
}) => {
  const size = useBreakpoint();
  const { fetchData, isLoading: controlledLoading } = useFetch();
  const [controlledList, setControlled] = useState<
    (SelectOption & { tr: string })[]
  >([]);
  const getControlledIds = async () => {
    try {
      const url = `${API_BASE_URL}${CART_REQUEST_DRUGS_URL}controlledIds`;
      const data = await fetchData(url, {
        formularyId: selectedData[0].formularyId
      });
      setControlled(
        (data as TControlledIds[]).map(
          ({ controlledDrugId, controlledId, tr }) => ({
            key: controlledDrugId,
            value: controlledDrugId,
            label: controlledId,
            tr: tr
          })
        )
      );
    } catch (e) {}
  };

  useEffect(() => {
    getControlledIds();
  }, [selectedData]);

  useEffect(() => {
    if (open) {
      controlledFulfillForm.setFieldsValue({
        totalUnits: selectedData[0].totalUnits,
        packageQuantity: selectedData[0].packageQuantity,
        drug: selectedData[0].formulary.name,
        cart: selectedData[0].cart.cart
      });
    }
  }, [open]);

  const onSelect = (e: string) => {
    controlledFulfillForm.setFieldValue(
      'tr',
      controlledList.find(controlled => controlled.value === e)?.tr
    );
  };

  return (
    <Modal
      open={open}
      onCancel={onCloseModal}
      footer={null}
      style={{
        maxWidth: 'none'
      }}
      title={
        <Typography.Title
          style={{
            paddingInlineStart: pxToRem(20),
            marginBlock: 0,
            fontSize: pxToRem(20)
          }}
        >
          Review for {selectedData[0].cart.cart} {'(Controlled)'}
        </Typography.Title>
      }
      maskClosable={false}
      centered
      width={size.xs ? '100vw' : pxToRem(872)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
      destroyOnClose
    >
      <Form
        style={{ width: '100%' }}
        form={controlledFulfillForm}
        onFinish={values =>
          onSubmit({
            ...values,
            cartRequestDrugId: [selectedData[0].cartRequestDrugId],
            controlledId: controlledList.find(
              controlled => controlled.value === values.controlledId
            )?.label
          })
        }
      >
        {size.xs ? (
          <MobileControlledForm
            isLoading={isLoading}
            controlledList={controlledList}
            controlledLoading={controlledLoading}
            onCloseModal={onCloseModal}
            isAntiretroviral={
              selectedData[0]?.formulary?.drugClass === DRUG_CLASSES.ARV
            }
            onSelect={onSelect}
          />
        ) : (
          <DesktopControlledForm
            isLoading={isLoading}
            controlledLoading={controlledLoading}
            controlledList={controlledList}
            onCloseModal={onCloseModal}
            isAntiretroviral={
              selectedData[0]?.formulary?.drugClass === DRUG_CLASSES.ARV
            }
            onSelect={onSelect}
          />
        )}
      </Form>
    </Modal>
  );
};

export default ReviewControlledModal;
