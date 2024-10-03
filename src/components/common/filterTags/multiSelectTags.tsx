import { Button, Tag } from 'antd';

import { SelectOption } from '@/types/commonTypes';

import { ALL } from '@/utils/constants';
import { getProperCase } from '@/utils/stringFormatting';

interface props {
  keys: { [name: string]: string };
  selectedItems: {
    [name: string]: string[];
  };
  customMap?: {
    [name: string]: SelectOption[];
  };
  marginTop?: string | number;
  marginBottom?: string | number;
  onChangeFilter: (key: string) => void;
  onClearAll: () => void;
}

const multiSelectTags: React.FC<props> = ({
  keys,
  selectedItems,
  customMap,
  marginBottom,
  marginTop,
  onChangeFilter,
  onClearAll
}) => {
  const onCloseMultiSelectTag = (key: string) => {
    onChangeFilter(key);
  };
  const getCustomMap = (key: string, value: string) => {
    if (!customMap) {
      return getProperCase(value);
    }
    if (!customMap[key]) return;
    getProperCase(value);

    return customMap[key].find(val => val.key === value)?.label ?? '';
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: marginBottom,
        marginTop: marginTop
      }}
    >
      {Object.keys(keys).map(key => {
        if (
          selectedItems[key].length > 0 &&
          !selectedItems[key].find(item => item === ALL)
        ) {
          return (
            <div key={key}>
              {keys[key]}:{' '}
              {selectedItems[key].map(item => {
                if (item !== ALL) {
                  return (
                    <Tag
                      bordered={false}
                      onClose={() => {
                        onCloseMultiSelectTag(item);
                      }}
                      closable
                      key={item}
                      color="blue"
                    >
                      {getCustomMap(key, item)}
                    </Tag>
                  );
                }
              })}
            </div>
          );
        }
      })}
      {Object.values(selectedItems).flat().length > 0 &&
        !Object.values(selectedItems)
          .flat()
          .find(val => val === ALL) && (
          <Button
            style={{ paddingInline: 0 }}
            onClick={onClearAll}
            type={'link'}
          >
            <u>Clear All</u>
          </Button>
        )}
    </div>
  );
};

export default multiSelectTags;
