import axios from 'axios';

import { API_BASE_URL, SO_ADMIN_URL } from '../utils/urls';
import SharedService from './SharedService';

export class SOAdminService {
  static getSOAdmins = async () => {
    const url = `${API_BASE_URL}${SO_ADMIN_URL}`;
    try {
      const { data } = await axios.get(url, SharedService.setDefaultHeaders());

      return SOAdminService.addKeysToAdmins(data);
    } catch (e: any) {
      return false;
    }
  };

  static addSOAdmin = async (payload: any) => {
    const url = `${API_BASE_URL}${SO_ADMIN_URL}/add`;
    try {
      const { data } = await axios.post(
        url,
        payload,
        SharedService.setDefaultHeaders()
      );

      return data;
    } catch (e: any) {
      return false;
    }
  };

  static editSOAdmin = async (id: string, payload: any) => {
    const url = `${API_BASE_URL}${SO_ADMIN_URL}/edit/${id}`;
    try {
      const { data } = await axios.put(
        url,
        payload,
        SharedService.setDefaultHeaders()
      );

      return data;
    } catch (e: any) {
      return false;
    }
  };

  static deleteSOAdmin = async (id: string) => {
    const url = `${API_BASE_URL}${SO_ADMIN_URL}/remove/${id}`;
    try {
      await axios.delete(url, SharedService.setDefaultHeaders());

      return true;
    } catch (e: any) {
      return false;
    }
  };

  static addKeysToAdmins(admins: any) {
    return admins.map((admin: any) => {
      admin.key = admin.adminId;
      admin.label = `${admin.firstName} ${admin.lastName}`;
      admin.value = admin.adminId;

      return admin;
    });
  }
}
