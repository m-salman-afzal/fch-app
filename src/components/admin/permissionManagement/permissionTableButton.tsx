import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

export const PermissionTableButtonAdmin = (expandable: any) => {
  return expandable?.expandable?.length > 0 ? (
    <Button
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: pxToRem(4),
        height: pxToRem(16),
        width: pxToRem(16),
        padding: 0
      }}
      size="small"
      shape="default"
      onClick={e => expandable.onExpand(expandable.record, e)}
      icon={
        expandable.expanded ? (
          <MinusOutlined
            style={{
              width: pxToRem(12),
              height: pxToRem(12),
              fontSize: pxToRem(12)
            }}
          />
        ) : (
          <PlusOutlined
            style={{
              width: pxToRem(12),
              height: pxToRem(12),
              fontSize: pxToRem(12)
            }}
          />
        )
      }
    ></Button>
  ) : (
    <></>
  );
};
