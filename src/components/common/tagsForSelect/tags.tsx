import { Tag } from 'antd';

export const tagRender = (props: any) => {
  const { label, value, closable, onClose, width, hide } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={'blue'}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{
        marginRight: '0.357rem',
        paddingBlock: '0.25rem',
        border: 'none',
        marginBlock: '0.142rem',
        fontSize: '1rem',
        lineHeight: '1.25rem',
        width: width ? (label.length >= 14 ? width : undefined) : undefined,
        display: hide ? 'none' : 'flex',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          maxWidth: width ? '90%' : undefined,
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {label}
      </div>
    </Tag>
  );
};
