import { NOTIFICATION_TYPE, PERMISSIONS_TYPES } from './constants';

export const setNotificationText = (notification: Record<string, any>) => {
  let title = '';
  let text = '';
  let subText = '';
  let rbac = '';
  let minPermission = '';
  switch (notification.notificationType) {
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
    case NOTIFICATION_TYPE.FACILITY_CHECKLIST_INCOMPLETE:
      title = `Complete Facility Checklist`;
      text = `${notification.facilityName} checklist needs to be completed.`;
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
