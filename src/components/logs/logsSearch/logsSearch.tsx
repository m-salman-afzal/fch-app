import { FC, useState } from 'react';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons/lib/components/Icon';
import {
  AutoComplete,
  Dropdown,
  FormInstance,
  Grid,
  MenuProps,
  Row,
  Select
} from 'antd';
import { DrawerFilterButton, VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { pxToRem } from '@/utils/sharedUtils';

import { SortSvg } from '../styles/svgs';
import { LogsFilters } from './logsFilter';
import { useLogSearchStyle } from './useLogsSearchStyle';

interface Props {
  setSearchValue: (val: string) => void;
  setLogType: (val: string) => void;
  searchResult: any[];
  setSelectedUser: (val: any) => void;
  setSort: (val: string) => void;
  setFilterOpen: (val: boolean) => void;
  handleReset: () => void;
  onClickApply: (val: any) => void;
  filterFormRef: FormInstance<any>;
}

const { useBreakpoint } = Grid;

export const LogsSearch: FC<Props> = ({
  setLogType,
  setSearchValue,
  searchResult,
  setSelectedUser,
  setSort,
  handleReset,
  onClickApply,
  filterFormRef
}) => {
  const size = useBreakpoint();
  const { selectClass, selectClassFocused } = useLogSearchStyle();
  const [val, setVal] = useState('');
  const [focused, setFocus] = useState(false);

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
  const onSelectUser = (val: string, options: any) => {
    setSelectedUser(options);
  };

  return (
    <Row
      justify={'space-between'}
      align={'middle'}
      style={{
        marginBottom: pxToRem(18),
        gap: pxToRem(20)
      }}
      gutter={[0, 8]}
    >
      <div>
        {size.xs && <strong style={{ fontSize: pxToRem(16) }}>Logs</strong>}
      </div>
      <div
        style={{
          height: '100%',
          gap: pxToRem(10),
          display: 'flex',
          width: size.xs ? '100%' : undefined
        }}
      >
        <AutoComplete
          className={focused ? selectClassFocused : selectClass}
          showSearch
          onFocus={() => setFocus(x => !x)}
          onBlur={() => setFocus(x => !x)}
          placeholder={
            <div>
              <SearchOutlined /> Search by name
            </div>
          }
          onSearch={setSearchValue}
          onChange={e => setVal(e)}
          onSelect={onSelectUser}
          style={{ width: size.xs ? '100%' : pxToRem(255) }}
          options={searchResult}
          value={val}
        />

        <LogsFilters
          handleReset={handleReset}
          onClickApply={onClickApply}
          filterFormRef={filterFormRef}
        />

        <Dropdown menu={{ items }} trigger={['click']}>
          <VsButton
            antButtonProps={{
              icon: <Icon className="sortIcon" component={SortSvg} />
            }}
            size={BUTTON_SIZES.middle}
          >
            Sort
          </VsButton>
        </Dropdown>
      </div>
    </Row>
  );
};
