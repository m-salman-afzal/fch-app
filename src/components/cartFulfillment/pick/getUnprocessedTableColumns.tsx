import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

import { TCartFullfillmentPick } from '@/types/cartFulfillmentTypes';

import { pxToRem } from '@/utils/sharedUtils';

export const getUnprocessedColumns: () => any[] = () => {
  const isSmall = window.screen.width <= 576;
  const isIPhone = /iPhone|iPod/.test(navigator.userAgent);

  return [
    {
      title: 'Drug',
      width: isSmall ? 150 : undefined,
      render: (value: TCartFullfillmentPick) => {
        return (
          <div>
            {value.name}{' '}
            {!value.isDrugFound && (
              <Tooltip title="There is not enough inventory on hand to fulfill this request">
                <InfoCircleOutlined
                  style={{
                    fontSize: pxToRem(18),
                    color: '#FAAD14',
                    marginInlineStart: pxToRem(5),
                    marginBlockEnd: isIPhone ? pxToRem(5) : undefined
                  }}
                />
              </Tooltip>
            )}
          </div>
        );
      }
    },
    {
      title: 'Package Qty',
      width: isSmall ? 150 : undefined,
      dataIndex: 'packageQuantity'
    },
    {
      title: 'Total Units',
      width: isSmall ? 150 : undefined,
      dataIndex: 'totalUnits'
    }
  ];
};
