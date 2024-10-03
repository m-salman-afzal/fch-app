import { FC, useState } from 'react';
import { Checkbox, Col, FormInstance, Grid, Row, Typography } from 'antd';
import {
  BasicInputFormItem,
  ErrorMessage,
  VsFormItem
} from 'vs-design-components';

import { pxToRem } from '@/utils/sharedUtils';

import { useDynamicSafeReportStyle } from './useDynamicSafeReportStyle';

const { useBreakpoint } = Grid;
interface Props {
  reportFormRef: FormInstance;
}

export const SafeReportFormStepTwo: FC<Props> = ({ reportFormRef }) => {
  const size = useBreakpoint();
  const { eventTypeCheckBoxContainer, activeRecoveryFormItem } =
    useDynamicSafeReportStyle();
  const [selectedLocations, setSelectedLocations] = useState<any[]>(
    reportFormRef.getFieldValue(['eventLocation']) || []
  );
  const onChangeEventLocation = (locations: any) => {
    setSelectedLocations(locations);
  };

  return (
    <>
      <Col
        style={{
          width: size?.xs ? `100%` : pxToRem(463),
          display: 'flex'
        }}
        className={activeRecoveryFormItem}
      >
        <VsFormItem
          formItemProps={{
            rules: [
              {
                required: true,
                message: (
                  <ErrorMessage>Select atleast one location</ErrorMessage>
                )
              }
            ],
            name: 'eventLocation'
          }}
        >
          <Checkbox.Group
            name="eventLocation"
            className={eventTypeCheckBoxContainer}
            onChange={onChangeEventLocation}
          >
            <Checkbox value="INTAKE">Intake</Checkbox>
            <Checkbox value="MEDICAL_UNIT_INFIRMARY">
              Medical Unit (Infirmary)
            </Checkbox>
            <Checkbox value="CLINIC">Clinic</Checkbox>
            <Checkbox value="HOUSING_UNIT">Housing Unit</Checkbox>
            {selectedLocations.includes('HOUSING_UNIT') && (
              <BasicInputFormItem
                placeholder="Housing Unit"
                formItemProps={{
                  rules: [
                    {
                      required: true,
                      message: <ErrorMessage>Enter Housing Unit</ErrorMessage>
                    }
                  ],
                  name: 'housingUnit',
                  style: {
                    marginLeft: pxToRem(20),
                    marginBottom: 0
                  }
                }}
                formNamePath={['housingUnit']}
                width={size?.xs ? pxToRem(300) : pxToRem(340)}
              />
            )}
            <Checkbox value="MEDICATION_CART">Medication Cart</Checkbox>
            {selectedLocations.includes('MEDICATION_CART') && (
              <BasicInputFormItem
                placeholder="Cart Name"
                formItemProps={{
                  rules: [
                    {
                      required: true,
                      message: <ErrorMessage>Enter Cart</ErrorMessage>
                    }
                  ],
                  name: 'cartName',
                  style: {
                    marginLeft: pxToRem(20),
                    marginBottom: 0
                  }
                }}
                formNamePath={['cartName']}
                width={size?.xs ? pxToRem(300) : pxToRem(340)}
              />
            )}
            <Checkbox value="OTHER">Other</Checkbox>
            {selectedLocations.includes('OTHER') && (
              <BasicInputFormItem
                placeholder="Other"
                formItemProps={{
                  rules: [
                    {
                      required: true,
                      message: <ErrorMessage>Enter other location</ErrorMessage>
                    }
                  ],
                  name: 'other',
                  style: {
                    marginLeft: pxToRem(20),
                    marginBottom: 0
                  }
                }}
                formNamePath={['other']}
                width={size?.xs ? pxToRem(300) : pxToRem(340)}
              />
            )}
          </Checkbox.Group>
        </VsFormItem>
      </Col>
    </>
  );
};
