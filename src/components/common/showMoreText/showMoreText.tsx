import { FC, MouseEventHandler, useEffect, useState } from 'react';

interface props {
  expanded?: boolean;
  charlimit: number;
  children: any;
  anchorClass?: string;
  className?: string;
  moreText?: string;
  lessText?: string;
  truncatedEndingText?: string;
  toggleTextClass?: string;
  onClick?: (expanded: boolean, event?: any) => void;
}

const ShowMoreText: FC<props> = ({
  charlimit,
  expanded = false,
  onClick = () => {},
  children,
  className,
  moreText = 'view more',
  lessText = 'view less',
  toggleTextClass,
  truncatedEndingText = '...'
}) => {
  const [isExpanded, setExpanded] = useState<boolean>(expanded);
  const [truncatedText, setTruncatedtext] = useState<string>('');

  const handleTruncate = () => {
    const mergeText = children.toString();
    let newText = mergeText;
    if (mergeText.length > charlimit && !isExpanded) {
      newText = `${mergeText.substring(0, charlimit)}${truncatedEndingText} `;
    }
    setTruncatedtext(newText);
  };

  const handleOnClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setExpanded(!isExpanded);
    onClick(isExpanded);
  };
  useEffect(() => {
    handleTruncate();
  }, [isExpanded]);

  return (
    <span className={className}>
      {truncatedText}
      {truncatedText.length > charlimit && (
        <span
          className={toggleTextClass}
          onClick={handleOnClick}
          style={{ cursor: 'pointer' }}
        >
          {isExpanded ? lessText : moreText}
        </span>
      )}
    </span>
  );
};

export default ShowMoreText;
