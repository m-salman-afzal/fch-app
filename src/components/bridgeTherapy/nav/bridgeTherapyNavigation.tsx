import { ChangeEvent, FC, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Col, Grid, Row, Typography } from 'antd';
import { VsButton, VsSelectFormItem } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { Patient } from '@/types/patientTypes';

import VsSegmented from '@/components/common/segmented/VsSegmented';

import { BRIDGETHERAPY_SCREENS } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { BridgeTherapySearch } from '../bridgeTherapy/bridgeTherapySearch/bridgeTherapySearch';
import { SftpLogsSearch } from '../sftpLogs/sftpLogsSearch/sftpLogsSearch';

const { useBreakpoint } = Grid;

interface Props {
  setSort: (val: string) => void;
  setFilterOpen: (val: boolean) => void;
  setSelectedScreen: (val: string) => void;
  setSearchValue: (e: ChangeEvent<HTMLInputElement>) => void;
  setSearchValueReset: (val: string) => void;
  onAddToSFTPList: () => void;
  onScreen: string;
  showTableActions: {
    key: React.Key[];
    rows: Patient[];
  };
}

export const BridgeTherapyNavigation: FC<Props> = ({
  setSearchValue,
  setSort,
  setFilterOpen,
  setSearchValueReset,
  setSelectedScreen,
  onAddToSFTPList,
  showTableActions,
  onScreen
}) => {
  const size = useBreakpoint();
  const onChangeScreen = (val: any) => {
    setSelectedScreen(val);
    onScreen === BRIDGETHERAPY_SCREENS[0]?.value && setSearchValueReset('');
  };

  return (
    <div style={size.xs ? { paddingInline: pxToRem(20) } : {}}>
      <Row>
        {size.xs && (
          <Typography.Text style={{ fontSize: pxToRem(16), fontWeight: 600 }}>
            Bridge Therapy
          </Typography.Text>
        )}
      </Row>

      <Row
        justify={'space-between'}
        style={{ gap: 8, paddingTop: size.xs ? pxToRem(10) : '' }}
      >
        {size.xs ? (
          <Col span={24} style={{ height: pxToRem(32) }}>
            <VsSelectFormItem
              options={BRIDGETHERAPY_SCREENS}
              onChange={onChangeScreen}
              height={pxToRem(32)}
              width={'100%'}
              externalShowLabel={false}
              defaultValue={BRIDGETHERAPY_SCREENS[0].value}
              value={onScreen}
            />
          </Col>
        ) : (
          <VsSegmented
            segmentedProps={{
              options: BRIDGETHERAPY_SCREENS,
              defaultValue: BRIDGETHERAPY_SCREENS[0]?.value,
              block: true,
              value: onScreen,
              onChange: onChangeScreen,
              style: { width: pxToRem(263) }
            }}
          />
        )}
        <Row style={{ gap: 8 }}>
          {onScreen === BRIDGETHERAPY_SCREENS[0]?.value ? (
            <>
              <BridgeTherapySearch
                setSearchValue={setSearchValue}
                setFilterOpen={setFilterOpen}
              />
              {showTableActions.rows.length > 0 && (
                <VsButton
                  antButtonProps={{
                    icon: <PlusOutlined />,
                    type: 'primary'
                  }}
                  size={BUTTON_SIZES.middle}
                  onClick={onAddToSFTPList}
                >
                  Review SFTP List
                </VsButton>
              )}
            </>
          ) : (
            <SftpLogsSearch setSort={setSort} setFilterOpen={setFilterOpen} />
          )}
        </Row>
      </Row>
    </div>
  );
};
