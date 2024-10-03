import { Grid, Typography } from 'antd';
import Image from 'next/image';

import HIDDEN_ROLE_ICON from '@/assets/icons/noRole/hiddenRole.svg';
import { pxToRem } from '@/utils/sharedUtils';

const { useBreakpoint } = Grid;

export const ForbiddenAccessScreen = () => {
  const size = useBreakpoint();

  return (
    <>
      <style jsx global>
        {`
          .ant-layout-content {
            padding: 0 !important;
          }
        `}
      </style>
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingInline: pxToRem(38)
        }}
      >
        <div
          style={{
            width: pxToRem(439),
            height: pxToRem(331),
            backgroundColor: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'column',
            padding: pxToRem(24),
            borderRadius: pxToRem(8)
          }}
        >
          <Image
            src={HIDDEN_ROLE_ICON}
            alt="lock"
            style={{ width: pxToRem(122), height: pxToRem(167) }}
          />
          <Typography.Title
            style={{
              fontSize: size.xs ? pxToRem(20) : pxToRem(24),
              fontWeight: 600,
              textAlign: 'center',
              margin: 0
            }}
          >
            Please contact the leadership team to grant you access to the FCH
            App features
          </Typography.Title>
        </div>
      </div>
    </>
  );
};
