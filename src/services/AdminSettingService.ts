import axios from 'axios';

import {
  ADMIN_SETTING_URL,
  ADMIN_URL,
  API_BASE_URL,
  FILE_URL
} from '../utils/urls';
import SharedService from './SharedService';

interface AdminType {
  firstName: string;
  lastName: string;
  email: string;
  adminType: string;
}

class AdminSettingService {
  /**
   * @returns
   */
  static async getAdmins() {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}${ADMIN_URL}/`,
        SharedService.setDefaultHeaders()
      );

      return AdminSettingService.addKeysToAdmins(data);
    } catch (e: any) {
      return [];
    }
  }

  /**
   * @param {AdminType} payload
   * @returns
   */
  static async addAdmin(payload: AdminType) {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}${ADMIN_URL}/add`,
        payload,
        SharedService.setDefaultHeaders()
      );

      return data;
    } catch (error) {
      return false;
    }
  }

  /**
   * @param {string} adminSettingId
   * @param {any} payload
   * @returns
   */
  static async updateAdminSettings(adminSettingId: string, payload: any) {
    try {
      const url = `${API_BASE_URL}${ADMIN_SETTING_URL}/edit/${adminSettingId}`;
      const { data } = await axios.put(
        url,
        payload,
        SharedService.setDefaultHeaders()
      );

      return data;
    } catch (error) {
      return false;
    }
  }

  /**
   * @param {string} adminId
   * @returns
   */
  static async deleteAdmin(adminId: string) {
    try {
      const url = `${API_BASE_URL}${ADMIN_URL}/remove/${adminId}`;
      await axios.delete(url, SharedService.setDefaultHeaders());

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * @param {any} csvFile
   * @returns
   */
  static async bulkUpload(csvFile: any) {
    try {
      const url = `${API_BASE_URL}${FILE_URL}/add`;
      await axios.post(url, csvFile, SharedService.setDefaultHeaders());

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * @param admins
   * @returns
   */
  static addKeysToAdmins(admins: any) {
    return admins.map((admin: any) => {
      admin.key = admin.adminId;
      admin.label = `${admin.firstName} ${admin.lastName}`;
      admin.value = admin.adminId;

      return admin;
    });
  }
}

export default AdminSettingService;
