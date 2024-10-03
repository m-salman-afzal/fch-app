import { PropsWithChildren } from 'react';
import { DownOutlined, LogoutOutlined } from '@ant-design/icons';
import { Button, Col, Popover, Row, Space, theme, Typography } from 'antd';
import Image from 'next/image';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import ProfileIcon from '@/assets/icons/common/profileIcon.svg';

import { useHeaderStyle } from './useHeaderStyle';

interface props {
  logoutUser: () => void;
  getRoleForHeader: (roles: any[]) => string;
  admin: any;
}

const { useToken } = theme;

export const ProfileDropdown: React.FC<PropsWithChildren<props>> = ({
  logoutUser,
  getRoleForHeader,
  admin,
  children
}) => {
  const { logoutWrap, avatarBg, heading, subTitle, profileButton } =
    useHeaderStyle();

  const { token } = useToken();

  return (
    <Popover
      open={admin?.firstName ? undefined : !!admin?.firstName}
      placement="bottomRight"
      overlayClassName={logoutWrap}
      trigger={['click']}
      overlayStyle={{ top: pxToRem(60) }}
      overlayInnerStyle={{ padding: pxToRem(16), maxWidth: pxToRem(233) }}
      content={
        <>
          <Row>
            <Col span={5}>
              <div className={avatarBg}>
                <Image width={40} alt={'MSG'} src={ProfileIcon} />
              </div>
            </Col>
            <Col span={19}>
              <Row>
                <div className={heading}>
                  {`${admin?.firstName} ${admin?.lastName}`}
                </div>
                <div className={subTitle}>{admin?.email}</div>
              </Row>
            </Col>
          </Row>

          <Row style={{ marginTop: pxToRem(12) }}>
            <Col span={24}>
              <Row>{children}</Row>

              <Row
                style={{
                  marginTop: pxToRem(12)
                }}
              >
                <VsButton
                  antButtonProps={{
                    type: 'primary'
                  }}
                  size={BUTTON_SIZES.middle}
                  onClick={logoutUser}
                >
                  <LogoutOutlined />
                  Logout
                </VsButton>
              </Row>
            </Col>
          </Row>
        </>
      }
    >
      <Space>
        <Button className={profileButton} type="link" shape="round">
          <div className={avatarBg}>
            <Image width={28} alt={'MSG'} src={ProfileIcon} />
          </div>
          <DownOutlined
            style={{
              color: '#000000E0',
              fontSize: '0.714rem',
              marginLeft: '0.2rem'
            }}
          />
        </Button>
      </Space>
    </Popover>
  );
};
