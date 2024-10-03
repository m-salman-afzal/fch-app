import { FC } from 'react';
import { FilterOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons/lib/components/Icon';
import { Col, Dropdown, Grid, MenuProps, Row, Typography } from 'antd';
import { VsButton, VsTooltip } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { pxToRem } from '@/utils/sharedUtils';

import { SortSvg } from '../../styles/svgs';

interface Props {
  setFilterOpen: (val: boolean) => void;
  setSort: (val: string) => void;
}

const { useBreakpoint } = Grid;

export const SftpLogsSearch: FC<Props> = ({ setFilterOpen, setSort }) => {
  const size = useBreakpoint();
  const items: MenuProps['items'] = [
    {
      label: 'Newest',
      key: 'DESC',
      onClick: () => setSort('DESC')
    },
    {
      label: 'Oldest',
      key: 'ASC',
      onClick: () => setSort('ASC')
    }
  ];

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col>
          <Dropdown menu={{ items }} trigger={['click']}>
            <VsButton
              antButtonProps={{
                icon: <Icon className="sortIcon" component={SortSvg} />
              }}
              size={size.xs ? BUTTON_SIZES.squareIcon : BUTTON_SIZES.middle}
            >
              {!size.xs ? 'Sort' : undefined}
            </VsButton>
          </Dropdown>
        </Col>

        <Col>
          <VsButton
            size={size.xs ? BUTTON_SIZES.squareIcon : BUTTON_SIZES.middle}
            onClick={() => setFilterOpen(true)}
          >
            <FilterOutlined
              style={{
                fontSize: size.xs ? pxToRem(16) : pxToRem(14)
              }}
            />
            {!size.xs && <Typography.Text>{'Filters'}</Typography.Text>}
          </VsButton>
        </Col>
      </Row>
    </>
  );
};
