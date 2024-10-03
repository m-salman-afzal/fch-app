import axios from 'axios';

import {
  ADMIN_URL,
  API_BASE_URL,
  FILE_URL,
  ROLE,
  ROLESLIST,
  SERVICE_LIST
} from '../utils/urls';
import SharedService from './SharedService';

interface AdminType {
  firstName: string;
  lastName: string;
  email: string;
  adminType: string;
}

class RoleService {
  /**
   * @returns
   */
  static async getRolesAndPermission() {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}${ROLESLIST}/`,
        SharedService.setDefaultHeaders()
      );

      return data;
    } catch (e: any) {
      return [];
    }
  }

  /**
   * @param {string} adminId
   * @param {AdminType} payload
   * @returns
   */
  static async updateRoles(payload: any) {
    try {
      const url = `${API_BASE_URL}${ROLESLIST}`;
      const { data } = await axios.put(
        url,
        { data: payload },
        SharedService.setDefaultHeaders()
      );

      return data;
    } catch (error: any) {
      return error.response.data || false;
    }
  }

  /**
   * @param {string} adminId
   * @param {AdminType} payload
   * @returns
   */
  static async getRolesServiceList() {
    try {
      const url = `${API_BASE_URL}${ROLESLIST}`;
      const { data } = await axios.get(url, SharedService.setDefaultHeaders());

      return data;
    } catch (error) {
      return false;
    }
  }

  /**
   * @param {string} adminId
   * @param {AdminType} payload
   * @returns
   */
  static async addRoles(payload: any) {
    try {
      const url = `${API_BASE_URL}${ROLE}`;
      const { data } = await axios.post(
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
   * @param {AdminType} payload
   * @returns
   */
  static async addService(payload: any) {
    try {
      const url = `${API_BASE_URL}${SERVICE_LIST}`;
      const { data } = await axios.post(
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
   * @param {AdminType} payload
   * @returns
   */
  static async updateRolesPosition(payload: any) {
    try {
      const url = `${API_BASE_URL}${ROLE}`;
      const { data } = await axios.put(
        url,
        { data: payload },
        SharedService.setDefaultHeaders()
      );

      return data;
    } catch (error) {
      return false;
    }
  }

  /**
   * @param {string} adminId
   * @param {AdminType} payload
   * @returns
   */
  static async getRoles() {
    try {
      const url = `${API_BASE_URL}${ROLE}`;
      const { data } = await axios.get(url, SharedService.setDefaultHeaders());

      return data;
    } catch (error) {
      return false;
    }
  }

  /**
   * @param {string} adminId
   * @param {AdminType} payload
   * @returns
   */
  static async deleteRole(roleId: string) {
    try {
      const url = `${API_BASE_URL}${ROLE}/${roleId}`;
      const { data } = await axios.delete(
        url,
        SharedService.setDefaultHeaders()
      );

      return data;
    } catch (error) {
      return false;
    }
  }
}

export default RoleService;
