import React, { PropsWithChildren, useState } from 'react';
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { Col, Dropdown, Grid, Input, Row, Tooltip, Typography } from 'antd';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TReferenceGuide } from '@/types/referenceGuideTypes';

import useCookies from '@/hooks/useCookies';
import { PERMISSIONS_TYPES } from '@/utils/constants';
import { DeleteOption } from '@/utils/constantsComponents';
import {
  pxToRem,
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE
} from '@/utils/sharedUtils';

import { useReferenceGuideListStyle } from '../useReferenceGuideListStyle';

interface props {
  referenceGuideTitle?: string;
  onSaveEditedTitle: (name: string) => void;
  openReferenceGuideNoteModal: (note: string | undefined) => void;
  selectedReferenceGuide: TReferenceGuide | undefined;
  onDeleteReferenceGuide: () => void;
}

const { useBreakpoint } = Grid;

export const ReferenceGuideListTitle: React.FC<PropsWithChildren<props>> = ({
  referenceGuideTitle = '',
  onSaveEditedTitle,
  openReferenceGuideNoteModal,
  selectedReferenceGuide,
  onDeleteReferenceGuide
}) => {
  const size = useBreakpoint();
  const { getDataFromCookie } = useCookies();
  const admin = getDataFromCookie();
  const { referenceGuideListTitleEditable } = useReferenceGuideListStyle();
  const [editingReferenceGuideTitle, setEditingReferenceGuideTitle] =
    useState<boolean>(false);
  const [editableReferenceGuideTitle, setEditableReferenceGuideTitle] =
    useState<string>(referenceGuideTitle);

  const onSavingChangedTitle = () => {
    onSaveEditedTitle(editableReferenceGuideTitle);
    setEditingReferenceGuideTitle(false);
  };

  return (
    <Row
      style={{
        marginTop: pxToRem(16),
        paddingInline: size?.xs ? pxToRem(20) : 0
      }}
    >
      {!editingReferenceGuideTitle && referenceGuideTitle && (
        <Col>
          <Row
            style={{ display: 'flex', alignItems: 'center' }}
            gutter={[6, 0]}
          >
            <Col>
              <Typography.Text
                style={{
                  fontSize: size?.xs ? pxToRem(18) : pxToRem(24),
                  fontWeight: 600
                }}
              >
                {referenceGuideTitle}
              </Typography.Text>
            </Col>
            {admin?.rbac?.referenceGuide === PERMISSIONS_TYPES.WRITE && (
              <Col>
                <Dropdown
                  placement={'bottomLeft'}
                  menu={{
                    items: [
                      {
                        label: 'Edit',
                        key: 0,
                        onClick: () => {
                          setEditableReferenceGuideTitle(referenceGuideTitle);
                          setEditingReferenceGuideTitle(true);
                        }
                      },
                      {
                        label: selectedReferenceGuide?.note
                          ? 'Edit Note'
                          : 'Add Note',
                        key: 1,
                        onClick: () => {
                          openReferenceGuideNoteModal(
                            selectedReferenceGuide?.note as string
                          );
                        }
                      },
                      {
                        key: 2,
                        label: <DeleteOption />,
                        onClick: () => {
                          onDeleteReferenceGuide();
                        }
                      }
                    ]
                  }}
                  trigger={['click']}
                >
                  <VsButton
                    antButtonProps={{
                      icon: <MoreOutlined style={TABLE_BUTTON_ICON_SIZE} />
                    }}
                    style={TABLE_BUTTON_STYLE}
                    size={BUTTON_SIZES.large}
                  ></VsButton>
                </Dropdown>
              </Col>
            )}

            <Col>
              {selectedReferenceGuide?.note && (
                <Tooltip
                  title={selectedReferenceGuide?.note}
                  placement={'bottom'}
                >
                  <ExclamationCircleOutlined
                    style={{
                      color: '#FAAD14',
                      fontSize: pxToRem(16),
                      marginTop: pxToRem(2)
                    }}
                  />
                </Tooltip>
              )}
            </Col>
          </Row>
        </Col>
      )}
      {editingReferenceGuideTitle && referenceGuideTitle && (
        <Input
          height={pxToRem(32)}
          placeholder="Reference Guide Name"
          style={{
            width: size?.xs ? pxToRem(250) : pxToRem(322),
            borderRadius: 4,
            border: `${pxToRem(1)} solid rgba(0, 0, 0, 0.15)`
          }}
          className={referenceGuideListTitleEditable}
          autoFocus={true}
          value={editableReferenceGuideTitle}
          onChange={(val: any) =>
            setEditableReferenceGuideTitle(val?.target?.value)
          }
          suffix={
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: pxToRem(24),
                  height: pxToRem(24),
                  backgroundColor: 'white',
                  borderRadius: pxToRem(4),
                  border: `${pxToRem(1)} solid rgba(0, 0, 0, 0.25)`,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setEditableReferenceGuideTitle('');
                  setEditingReferenceGuideTitle(false);
                }}
              >
                <CloseOutlined />
              </div>
              {editableReferenceGuideTitle &&
                editableReferenceGuideTitle !== referenceGuideTitle && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: pxToRem(24),
                      height: pxToRem(24),
                      backgroundColor: 'rgba(9, 88, 217, 1)',
                      borderRadius: pxToRem(4),
                      cursor: 'pointer'
                    }}
                    onClick={onSavingChangedTitle}
                  >
                    <CheckOutlined style={{ color: 'white' }} />
                  </div>
                )}
            </>
          }
        />
      )}
    </Row>
  );
};
