import { FC, useMemo, useState } from 'react';
import Icon from '@ant-design/icons';
import { Grid, theme, Tree } from 'antd';
import { DataNode } from 'antd/es/tree';

import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import { pxToRem } from '@/utils/sharedUtils';

import { ChangeLogCard } from './changeLogs/changeLogsCard';
import { CollapseSvg, PinSvg } from './styles/svgs';
import { useTreeStyle } from './styles/useTreeStyle';

const { useToken } = theme;
const { useBreakpoint } = Grid;
interface Props {
  changedValues: any[];
  changeLogCreateAt: string;
}

export const LogsModalChanged: FC<Props> = ({
  changedValues,
  changeLogCreateAt
}) => {
  const [fileds, setFields] = useState<any[]>([]);
  const { treeClassname } = useTreeStyle();
  const { token } = useToken();
  const size = useBreakpoint();
  useMemo(() => {
    const val = changedValues.map(val => {
      return {
        title: (
          <ChangeLogCard
            field={val.field}
            before={val.beforeChange}
            after={val.afterChange}
          />
        ),
        key: Math.random()
      };
    });
    setFields(val);
  }, [changedValues]);

  const treeData: DataNode[] = [
    {
      title: (
        <span
          style={{
            backgroundColor: token.colorFillContent,
            borderRadius: 12,
            padding: `${pxToRem(3)} ${pxToRem(9)} ${pxToRem(3)} ${pxToRem(9)}`,
            fontSize: pxToRem(12),
            fontWeight: 400,
            marginInline: size.xs ? 10 : undefined
          }}
        >
          {getFormattedDateNoTimeZone({
            date: changeLogCreateAt,
            format: DATE_FORMATS.MDY_TIME
          })}
        </span>
      ),
      key: 'collapse',
      children: [...fileds]
    }
  ];

  return (
    <div
      style={{
        paddingLeft: size.xs ? pxToRem(23) : pxToRem(48),
        paddingRight: size.xs ? pxToRem(23) : pxToRem(48),
        overflowY: 'auto',
        height: pxToRem(260)
      }}
    >
      <Tree
        className={treeClassname}
        treeData={treeData}
        showIcon={true}
        showLine={true}
        expandedKeys={['collapse']}
        defaultExpandParent={true}
        switcherIcon={<Icon component={CollapseSvg} />}
      />
    </div>
  );
};
