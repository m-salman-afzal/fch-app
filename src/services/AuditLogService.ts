import axios from 'axios';

import { API_BASE_URL, AUDIT_LOG_URL } from '../utils/urls';
import SharedService from './SharedService';

export class AuditLogService {
  static async getAuditLogs(query: any) {
    try {
      const { data } = await axios.get(`${API_BASE_URL}${AUDIT_LOG_URL}`, {
        ...SharedService.setDefaultHeaders(),
        params: { ...query }
      });

      return data;
    } catch (e: any) {
      return {
        rows: [],
        paginationInfo: {
          totalItems: 0
        }
      };
    }
  }
}
