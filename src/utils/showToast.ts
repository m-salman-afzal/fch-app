import { notification } from 'antd';
import { IconType } from 'antd/es/notification/interface';
import { ArgsProps } from 'antd/lib/notification';

const ShowToast = (
  message: any,
  type: IconType = 'info',
  duration: number = 5,
  description: string = ''
) => {
  const notificationData: ArgsProps = {
    message: message,
    description: description,
    placement: 'bottomRight',
    duration: duration,
    type: type
  };
  notification.open(notificationData);
};

export default ShowToast;
