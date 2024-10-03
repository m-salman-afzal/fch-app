import { useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { NotificationsAndTasksLayout } from '@/components/notificationsAndTasks/notificationsAndTasksLayout';
import { NotificationsLayout } from '@/components/notificationsAndTasks/notificationsLayout';

import { FacilityContext } from '@/context/facilityContext';
import useCookies from '@/hooks/useCookies';
import { useFacility } from '@/hooks/useFacility';
import { useFetch } from '@/hooks/useFetch';
import {
  ALL,
  FACILITY_CHECKLIST_ITEMS,
  NOTIFICATION_TYPE,
  PERMISSION_PRIORITY,
  PERMISSIONS_TYPES
} from '@/utils/constants';
import {
  archiveNotificationUrl,
  getNotificationFacilitiesUrl,
  getNotificationUrl,
  markAsReadNotificationUrl
} from '@/utils/endpoints';

import { CONTROLS_LOGBOOK_SCREENS } from '../controlsLogbook/constants';
import { NOTIFICATIONS_AND_TASKS_SCREENS } from './constants';

export const NotificationsAndTasksContainer = () => {
  const tabInUrl = useSearchParams().get('tab');
  const { getDataFromCookie } = useCookies();
  const admin = getDataFromCookie();
  const SCREENS = NOTIFICATIONS_AND_TASKS_SCREENS;
  const { onChangeFacilityForNotification } = useFacility({ admin });

  const PAGINATION_DEFEUALT_STATE = {
    currentPage: 1,
    perPage: 10,
    totalPages: 0,
    totalItems: 0
  };

  const filterInitialValue = {
    screen: SCREENS[0].value,
    facilityId: '',
    isAlert: false
  } as const;

  const [searchFilters, setSearchFilters] = useState<any>(filterInitialValue);

  const params = useSearchParams();
  const router = useRouter();

  const { fetchData, updateData, isLoading } = useFetch();
  const [selectedScreen, setSelectedScreen] = useState(
    tabInUrl ? tabInUrl : (SCREENS[0]?.value as string)
  );

  const [facilities, setFacilities] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(PAGINATION_DEFEUALT_STATE);
  const [notifications, setNotifications] = useState<any>([]);

  const isTask = (notification: any) => {
    return (
      notification.notificationType ===
      NOTIFICATION_TYPE.FACILITY_CHECKLIST_INCOMPLETE
    );
  };

  const onScrollPagination = (event: any) => {
    if (event?.target) {
      const { scrollTop, scrollHeight, clientHeight } = event.target;

      if (
        scrollTop + clientHeight >=
          (window.screen.width === 3840 ? scrollHeight - 1 : scrollHeight) &&
        !isLoading
      ) {
        if (pagination.currentPage < pagination?.totalPages) {
          const currentPagination = {
            ...pagination,
            currentPage: pagination.currentPage + 1
          };
          getNotifications(searchFilters, currentPagination);
        }
      }
    }
  };

  const onScreenChange = (screen: any) => {
    setSelectedScreen(screen);
    setPagination(PAGINATION_DEFEUALT_STATE);
    setFacilities([]);
    setNotifications([]);
    router.push(`/notificationsAndTasks?tab=${screen}`);
  };

  const onChangeFacilityFilter = (val: any) => {
    setPagination(PAGINATION_DEFEUALT_STATE);
    setSearchFilters({ ...searchFilters, facilityId: val.key });
    getNotifications(
      { ...searchFilters, facilityId: val.key },
      PAGINATION_DEFEUALT_STATE
    );
  };

  const getFacilities = async () => {
    try {
      const url = getNotificationFacilitiesUrl();
      const payload = {
        isArchived: selectedScreen === SCREENS[2].value,
        screen: selectedScreen
      };
      const nfs = await fetchData(url, payload);

      if (nfs.status === 'error') {
        setFacilities([]);
      }

      if (nfs) {
        setFacilities([
          { label: ALL, key: ALL, value: '' },
          ...nfs.map((facility: any) => {
            return {
              key: facility.facilityId,
              value: facility.facilityId,
              label: facility.facilityName
            };
          })
        ]);
      }
    } catch (error) {}
  };

  const getNotifications = async (
    searchFilters: any,
    paginationInfo = pagination,
    isArchive?: boolean
  ) => {
    try {
      const url = getNotificationUrl();
      const payload = {
        ...paginationInfo,
        ...searchFilters,
        facilityId:
          searchFilters.facilityId === '' ? undefined : searchFilters.facilityId
      };
      const nfs = await fetchData(url, payload);
      if (nfs.status === 'error') {
        setNotifications([]);
      }

      if (nfs.rows) {
        const processedNotifications = nfs.rows.map((notification: any) => {
          const text = setNotificationText(notification);

          return {
            ...notification,
            ...text,
            key: notification.notificationAdminId
          };
        });

        if (isArchive) {
          setNotifications(processedNotifications);
          const remainingItems = pagination.totalItems - 1;
          const isPreviousPage =
            remainingItems ===
            pagination.perPage * (pagination.currentPage - 1);
          setPagination({
            ...pagination,
            ...nfs.paginationInfo,
            currentPage: pagination.currentPage - (isPreviousPage ? 1 : 0),
            totalPages: pagination.totalPages - (isPreviousPage ? 1 : 0)
          });

          return;
        }

        const newNotifications =
          paginationInfo.currentPage === 1
            ? processedNotifications
            : [...notifications, ...processedNotifications];
        setNotifications(newNotifications);
        setPagination({ ...pagination, ...nfs.paginationInfo });
      }
    } catch (error) {}
  };

  useEffect(() => {
    getFacilities();
    setSearchFilters({ ...filterInitialValue, screen: selectedScreen });
    getNotifications(
      { ...filterInitialValue, screen: selectedScreen },
      pagination
    );
  }, [selectedScreen]);

  const markAsRead = async (notification: any) => {
    const { isRead, notificationAdminId } = notification;
    const url = `${markAsReadNotificationUrl()}/${notificationAdminId}`;
    const payload = {
      isRead: !isRead
    };

    const response = await updateData(url, payload);
    if (response?.status !== 'error') {
      const newNotifications = notifications.map((item: any) => {
        if (item.notificationAdminId === notification.notificationAdminId) {
          item.isRead = !isRead;
        }

        return item;
      });
      setNotifications(newNotifications);
    }
  };

  const markAsArchive = async (notification: any) => {
    const { isArchived, notificationAdminId } = notification;
    const url = `${archiveNotificationUrl()}/${notificationAdminId}`;
    const payload = {
      isArchived: !isArchived
    };

    const response = await updateData(url, payload);
    if (response.status !== 'error') {
      const remainingItems = pagination.totalItems - 1;
      const isPreviousPage =
        remainingItems === pagination.perPage * (pagination.currentPage - 1);

      const newPagination = {
        currentPage: 1,
        perPage:
          pagination.perPage *
          (pagination.currentPage - (isPreviousPage ? 1 : 0))
      };
      getNotifications(searchFilters, newPagination, true);
    }
  };

  const onViewNotification = async (notification: any) => {
    if (!notification.isRead && !isTask(notification)) {
      markAsRead(notification);
    }

    const newParams = new URLSearchParams(params.toString());

    onChangeFacilityForNotification(notification.facilityId);

    if (isTask(notification)) {
      window.location.replace('/facilityChecklist');

      return;
    }
    if (notification.safeReport) {
      newParams.set('reportId', notification.report.reportId);
      window.location.replace(`/safeReporting?${newParams.toString()}`);

      return;
    }
    if (notification.controlledDrug) {
      newParams.set(
        'controlledDrugId',
        notification.controlledDrug.controlledDrugId
      );
      window.location.replace(`/controlsLogbook?${newParams.toString()}`);

      return;
    }
    if (notification.formulary) {
      newParams.set('formularyId', notification.formulary.formularyId);
      window.location.replace(`/inventory?${newParams.toString()}`);

      return;
    }
    if (
      notification.shiftCountLogId &&
      PERMISSION_PRIORITY[admin?.rbac?.controlLogBookAdminister] <= 2
    ) {
      newParams.set('shiftCountLogId', notification.shiftCountLogId);
      window.location.replace(
        `/controlsLogbook?tab=shiftCount&subTab=shiftCountLogs&${newParams.toString()}`
      );

      return;
    }
  };

  const setNotificationText = (notification: any) => {
    let title = '';
    let text = '';
    let subText = '';
    let rbac = '';
    let minPermission = '';
    switch (notification.notificationType) {
      case NOTIFICATION_TYPE.FACILITY_CHECKLIST_INCOMPLETE:
        title = `Complete Facility Checklist`;
        text = `${notification.facilityName} checklist needs to be completed.`;
        break;
      case NOTIFICATION_TYPE.INVENTORY_DEPLETE:
        title = `${notification.formulary.name} is a non-formulary item that is out of inventory.`;
        text = `Please deactivate this drug via the edit feature found in the Formulary menu.`;
        break;

      case NOTIFICATION_TYPE.ASSIGNE:
        title = `${notification.report.reportType === 'ISSUE' ? 'Issue' : 'SAFE'} Report Assigned`;
        text =
          notification.report.reportType === 'ISSUE'
            ? `An Issue Report has been submitted for your investigation.`
            : `A SAFE Report has been assigned to you.`;
        break;
      case NOTIFICATION_TYPE.OWNERSHIP_TRANSFER:
        title = `SAFE Report Ownership`;
        text = `A SAFE report has been assigned to you for ownership${notification?.safeAssignmentComment?.comment ? ' with comment.' : '.'}`;
        break;
      case NOTIFICATION_TYPE.RETURNED_OWNER:
      case NOTIFICATION_TYPE.RETURNED_SENDER:
        title = `${notification.report.reportType === 'ISSUE' ? 'Issue' : 'SAFE'} Report Returned`;
        text = `${notification.report.reportType === 'ISSUE' ? 'An Issue' : 'A SAFE'} report has been returned to you for more details${notification?.safeAssignmentComment?.comment ? ' with comment.' : '.'}`;
        break;
      case NOTIFICATION_TYPE.IN_REVIEW:
        title = `SAFE Report Review`;
        text = `A SAFE report has been sent to you for your review.`;
        break;
      case NOTIFICATION_TYPE.CLOSED:
        title = `${notification.report.reportType === 'ISSUE' ? 'Issue' : 'SAFE'} Report Closed`;
        text = `We are writing to inform you that the investigation into your ${notification.report.reportType === 'ISSUE' ? 'Issue' : 'SAFE'} report that was submitted has been completed. Thank you for bringing this matter to our attention. We value your commitment to maintaining a culture of safety, and we encourage you to continue reporting any concerns you may have.`;
        break;
      case NOTIFICATION_TYPE.SUBMITTED:
        title = ` ${notification.report.reportType === 'ISSUE' ? 'Issue' : 'SAFE'}  Report Submitted`;
        text = `This is to confirm that we have received your ${notification.report.reportType === 'ISSUE' ? 'Issue' : 'SAFE'} report submission. Our team will review and notify you once the report is closed. We appreciate you reporting this matter.`;
        break;
      case NOTIFICATION_TYPE.AWARENESS:
        title = `${notification.report.reportType === 'ISSUE' ? 'Issue' : 'SAFE'} Report Awareness`;
        text = `${notification.report.reportType === 'ISSUE' ? 'An Issue' : 'A Safe'} Report has been submitted for your awareness.`;
        break;
      case NOTIFICATION_TYPE.CONTROLLED_DRUG_DELETE:
        title = `A controlled substance has been deleted from inventory, please ensure that the perpetual inventory is updated accordingly.`;
        text = `${notification.formulary.name}`;
        subText = `${notification.controlledDrug.controlledId}`;
        break;
      case NOTIFICATION_TYPE.CONTROLLED_DRUG_STATUS:
        title = `A controlled substance has been deactivated from inventory, please ensure that the perpetual inventory is updated accordingly.`;
        text = `${notification.formulary.name}`;
        subText = `${notification.controlledDrug.controlledId}`;
        break;
      case NOTIFICATION_TYPE.DISCREPANCY:
        title = `Shift Count Discrepancy`;
        text = `A shift count discrepancy has been logged for cart: ${notification.cart}`;
        rbac = 'controlLogBookAdminister';
        minPermission = PERMISSIONS_TYPES.READ;

        return { title, text, rbac, minPermission };
    }

    return { title, text, subText };
  };

  return (
    <NotificationsAndTasksLayout
      selectedScreen={selectedScreen}
      onScreenChange={onScreenChange}
      facilities={facilities}
      onChangeFacilityFilter={onChangeFacilityFilter}
      onScrollPagination={onScrollPagination}
      notifications={notifications}
      isLoading={isLoading}
    >
      <NotificationsLayout
        markAsArchive={markAsArchive}
        markAsRead={markAsRead}
        notifications={notifications}
        onViewNotification={onViewNotification}
        isTask={isTask}
      />
    </NotificationsAndTasksLayout>
  );
};
