import { ChangeEvent, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';

import { useFilterSearchStyle } from './useFilterSearchStyle';

interface props {
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  onBlur?: (e: any) => void;
  style?: any;
}

const FilterSearch: React.FC<props> = ({
  placeholder,
  onChange,
  autoFocus,
  onBlur = e => {},
  style
}) => {
  const { searchBox, searchBoxFocused } = useFilterSearchStyle();
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <Input
      style={style}
      className={isFocused ? searchBoxFocused : searchBox}
      placeholder={placeholder}
      prefix={<SearchOutlined />}
      onFocus={() => {
        setIsFocused(true);
      }}
      onBlur={e => {
        onBlur(e);
        setIsFocused(false);
      }}
      onChange={onChange}
      autoFocus={autoFocus}
    />
  );
};

export default FilterSearch;
