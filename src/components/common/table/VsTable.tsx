import { Table, TableProps } from 'antd';

import { useTableStyle } from './useTableStyle';

interface props {
  tableProps?: TableProps<any>;
}

const VsTable = ({ tableProps }: props) => {
  const { tableClassName, rowDark, rowLight } = useTableStyle();

  return (
    <div className={tableClassName}>
      <Table
        {...tableProps}
        className={tableClassName}
        sticky={true}
        rowClassName={
          tableProps?.rowClassName
            ? tableProps.rowClassName
            : (record, index) => (index % 2 === 0 ? rowLight : rowDark)
        }
        pagination={{
          pageSizeOptions: ['15', '30', '50', '100'],
          ...tableProps?.pagination,
          locale: {
            items_per_page: ''
          }
        }}
      />
    </div>
  );
};

export default VsTable;
