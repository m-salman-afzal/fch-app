import { FC } from 'react';
import { Col, Row, theme, Tooltip, Typography } from 'antd';
import Image from 'next/image';

import Arrow from '@/assets/icons/logs/Arrow.svg';
import { pxToRem } from '@/utils/sharedUtils';
import { camelToTitleCase } from '@/utils/stringFormatting';

import { useChangeLogCardStyle } from './useChangeLogCardStyle';

const { useToken } = theme;

interface Props {
  field: string;
  before: string;
  after: string;
}

export const ChangeLogCard: FC<Props> = ({ field, before, after }) => {
  const { token } = useToken();
  const { tooltipStyle } = useChangeLogCardStyle();

  return (
    <div>
      <Row justify={'start'}>
        <Typography.Text style={{ fontWeight: 600, color: token.colorText }}>
          {camelToTitleCase(field)}
        </Typography.Text>
      </Row>
      <Row
        style={{
          background: token.colorFillContent,
          width: pxToRem(299),
          height: pxToRem(54),
          borderRadius: 4,
          padding: `${pxToRem(8)} ${pxToRem(14)} ${pxToRem(8)} ${pxToRem(14)}`
        }}
        justify={'space-between'}
        align={'middle'}
      >
        <Col span={10}>
          <Row>
            <Typography.Text
              style={{
                color: token.colorTextDescription,
                fontSize: pxToRem(12),
                fontWeight: 400
              }}
            >
              Before
            </Typography.Text>
          </Row>
          <Row>
            <Tooltip
              title={before}
              arrow={false}
              overlayClassName={tooltipStyle}
            >
              <Typography.Text
                style={{
                  color: token.colorText,
                  fontSize: pxToRem(12),
                  fontWeight: 400,
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden'
                }}
              >
                {before}
              </Typography.Text>
            </Tooltip>
          </Row>
        </Col>
        <Col span={4}>
          <Image src={Arrow} alt="arrow" width={25} />
        </Col>
        <Col span={10}>
          <Row>
            <Typography.Text
              style={{
                color: token.colorTextDescription,
                fontSize: pxToRem(12),
                fontWeight: 400
              }}
            >
              After
            </Typography.Text>
          </Row>
          <Row>
            <Tooltip
              title={after}
              arrow={false}
              overlayClassName={tooltipStyle}
            >
              <Typography.Text
                style={{
                  color: token.colorText,
                  fontSize: pxToRem(12),
                  fontWeight: 400,
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden'
                }}
              >
                {after}
              </Typography.Text>
            </Tooltip>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
