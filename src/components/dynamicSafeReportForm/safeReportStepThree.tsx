import { FC, useState } from 'react';
import { Checkbox, Col, Divider, FormInstance, Grid } from 'antd';
import { ErrorMessage, VsFormItem } from 'vs-design-components';

import { pxToRem } from '@/utils/sharedUtils';

import { useDynamicSafeReportStyle } from './useDynamicSafeReportStyle';

const { useBreakpoint } = Grid;
const EVENT_TYPES = [
  { label: 'Medication', value: 'MEDICATION', key: 'medication' },
  { label: 'Mental Health', value: 'MENTAL_HEALTH', key: 'mentalHealth' },
  {
    label: 'Patient or Employee Safety',
    value: 'EMPLOYEE_SAFETY',
    key: 'employeeSafety'
  },
  { label: 'Environmental', value: 'ENVIRONMENTAL', key: 'environmental' },
  {
    label: 'Equipment Malfunction',
    value: 'EQUIPMENT_MALFUNCTION',
    key: 'equipmentMalfunction'
  },
  { label: 'Other Issue', value: 'OTHER_ISSUE', key: 'otherIssue' }
];

interface Props {
  reportFormRef: FormInstance;
}

export const SafeReportFormStepThree: FC<Props> = ({ reportFormRef }) => {
  const size = useBreakpoint();
  const { activeRecoveryFormItem, eventTypeCheckBoxContainer } =
    useDynamicSafeReportStyle();
  const [checkedList, setCheckedList] = useState<string[]>([]);

  const onChange = (checkedValues: any[]) => {
    if (checkedValues[0] === 'OTHER_ISSUE' && checkedValues.length > 1) {
      setCheckedList(checkedValues.slice(1));
      reportFormRef.setFieldValue('eventType', checkedValues.slice(1));

      return;
    }
    if (checkedValues.includes('OTHER_ISSUE')) {
      setCheckedList(['OTHER_ISSUE']);
      reportFormRef.setFieldValue('eventType', ['OTHER_ISSUE']);

      return;
    }

    setCheckedList(checkedValues);
  };

  return (
    <>
      <Col
        style={{
          width: size?.xs ? `100%` : pxToRem(463)
        }}
        className={activeRecoveryFormItem}
      >
        <VsFormItem
          formItemProps={{
            rules: [
              {
                required: true,
                message: <ErrorMessage>Select atleast one event</ErrorMessage>
              }
            ],
            name: 'eventType'
          }}
        >
          <Checkbox.Group
            name="eventType"
            className={eventTypeCheckBoxContainer}
            onChange={onChange}
            value={checkedList}
          >
            {EVENT_TYPES.map(reportEvent => {
              return (
                <>
                  {reportEvent.key === 'otherIssue' && (
                    <Divider style={{ marginBlock: 0 }} />
                  )}
                  <Checkbox key={reportEvent?.value} value={reportEvent?.value}>
                    {reportEvent?.label}
                  </Checkbox>
                </>
              );
            })}
          </Checkbox.Group>
        </VsFormItem>
      </Col>
    </>
  );
};
