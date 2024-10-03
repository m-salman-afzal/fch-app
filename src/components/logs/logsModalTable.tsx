import { FC, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Divider, Grid, Modal, Typography } from 'antd';
import { VsTable } from 'vs-design-components';

import { pxToRem } from '@/utils/sharedUtils';
import { camelToTitleCase } from '@/utils/stringFormatting';

import VsSegmented from '../common/segmented/VsSegmented';
import { LogsModalChanged } from './logsModalChanged';
import { useLogsModalStyle } from './styles/useLogsModalStyle';

interface Props {
  tableData: any[];
  showModal: boolean;
  handleCancel: () => void;
  changedData: any[];
  changeLogCreateAt: string;
}

const { useBreakpoint } = Grid;

const LOGS_MODAL_SCREENS = {
  CHANGE_LOGS: 'Change Logs',
  UNCHANGED_FIELDS: 'Unchanged Fields'
} as const;

export const LogsModalTable: FC<Props> = ({
  tableData,
  showModal,
  handleCancel,
  changedData,
  changeLogCreateAt
}) => {
  const size = useBreakpoint();
  const [onScreen, setOnScreen] = useState<string>(
    LOGS_MODAL_SCREENS.CHANGE_LOGS
  );
  const { tableClassName } = useLogsModalStyle();
  const onChangeScreen = (val: any) => {
    setOnScreen(val);
  };
  const columns: any[] = [
    {
      title: (
        <Typography.Text style={{ paddingInline: 20 }}>Field</Typography.Text>
      ),
      dataIndex: 'field',
      align: 'left',
      render: (val: any) => {
        return (
          <Typography.Text style={{ paddingInline: 20 }}>
            {camelToTitleCase(val)}
          </Typography.Text>
        );
      }
    },
    {
      title: (
        <Typography.Text style={{ paddingInline: 20 }}>Value</Typography.Text>
      ),
      dataIndex: 'value',
      align: 'left',
      render: (val: any) => {
        return (
          <Typography.Text style={{ paddingInline: 20 }}>{val}</Typography.Text>
        );
      }
    }
  ];

  return (
    <Modal
      open={showModal}
      okButtonProps={{ style: { display: 'none' } }}
      cancelButtonProps={{ style: { display: 'none' } }}
      styles={{
        content: {
          padding: 0,
          height: pxToRem(400)
        },
        header: { padding: '1rem', margin: 0 }
      }}
      width={size.xs ? '100%' : pxToRem(600)}
      title={onScreen}
      style={{
        maxWidth: 'none',
        margin: 0,
        overflow: 'hidden'
      }}
      onCancel={() => {
        handleCancel();
        setOnScreen(LOGS_MODAL_SCREENS.CHANGE_LOGS);
      }}
      maskClosable={false}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(20) }} />}
      centered
    >
      <Divider style={{ margin: 0 }} />
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: pxToRem(18),
          marginTop: pxToRem(18)
        }}
      >
        <VsSegmented
          segmentedProps={{
            options: Object.values(LOGS_MODAL_SCREENS),
            defaultValue: Object.values(LOGS_MODAL_SCREENS)[0],
            block: true,
            value: onScreen,
            onChange: onChangeScreen,
            style: { width: '80%' }
          }}
        />
      </div>
      {onScreen === LOGS_MODAL_SCREENS.CHANGE_LOGS && (
        <LogsModalChanged
          changedValues={changedData}
          changeLogCreateAt={changeLogCreateAt}
        />
      )}
      {onScreen === LOGS_MODAL_SCREENS.UNCHANGED_FIELDS && (
        <div
          style={{
            overflowY: 'auto',
            height: pxToRem(260)
          }}
          className={tableClassName}
        >
          <VsTable
            tableProps={{
              columns: columns,
              dataSource: tableData,
              pagination: false,
              sticky: true,
              scroll: { x: 'max-content' },
              className: tableClassName
            }}
          />
        </div>
      )}
    </Modal>
  );
};
