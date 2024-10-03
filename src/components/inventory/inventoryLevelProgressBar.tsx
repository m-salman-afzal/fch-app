import { Typography } from 'antd';
import { NumberLiteralType } from 'typescript';

import { pxToRem } from '@/utils/sharedUtils';

import { useInventoryLevelsStyle } from './useInventoryLevelsStyle';

interface props {
  quantity: number;
  threshold: number;
  par: number;
}

const gradients = {
  low: 'linear-gradient(270deg, #EA2929 2.49%, #7F10C3 96.41%)',
  middle: 'linear-gradient(270deg, #09D975 2.49%, #088EA1 96.41%)',
  high: 'linear-gradient(270deg, #CFEA29 2.49%, #FFC42B 96.41%)'
};
const getWidth = (quantity: number, par: number, threshold: number) => {
  if (quantity <= threshold) {
    return '10%';
  }
  if (quantity > par) {
    return '100%';
  }
  if (quantity === par) {
    return '80%';
  }

  return `${(quantity * 100) / (threshold * 10) + 6 - 10}%`;
};
const InventoryLevelsProgressBar: React.FC<props> = ({
  quantity,
  threshold,
  par
}) => {
  const {
    inventoryProgessBar,
    inventoryProgressGradient,
    nodeContainer,
    levelCircleNode,
    nodeText
  } = useInventoryLevelsStyle();

  return (
    <div style={{ marginBlockStart: pxToRem(-40) }}>
      <div className={nodeContainer}>
        <div
          style={{
            position: 'relative',
            left: `10%`
          }}
        >
          <div className={levelCircleNode}>
            <div></div>
          </div>
          <div className={nodeText}>Threshold</div>
          <div className={nodeText}>
            <strong>{threshold?.toLocaleString() ?? '--'}</strong>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            left: '67%'
          }}
        >
          <div className={levelCircleNode}>
            <div></div>
          </div>
          <div className={nodeText}>Par</div>
          <div className={nodeText}>
            <strong>{par?.toLocaleString() ?? '--'}</strong>
          </div>
        </div>
      </div>

      <div className={inventoryProgessBar}>
        <div
          className={inventoryProgressGradient}
          style={{
            opacity: quantity > 0 && !!threshold && !!par ? undefined : '0',
            width: getWidth(quantity, par, threshold),
            left: quantity > threshold ? `10%` : undefined,
            background:
              quantity < threshold
                ? gradients.low
                : quantity > par
                  ? gradients.high
                  : gradients.middle
          }}
        ></div>
      </div>
    </div>
  );
};

export default InventoryLevelsProgressBar;
