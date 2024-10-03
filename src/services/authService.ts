import axios from 'axios';
import Cookies from 'js-cookie';

import ShowToast from '@/utils/showToast';

import { ADMIN_AUTH_URL, API_BASE_URL, APP_VERSION } from '../utils/urls';
import SharedService from './SharedService';

class AuthService {
  /**
   * @param payload
   * @returns {Promise<string|any>}
   */
  static async login(payload: any): Promise<string | any> {
    payload.appVersion = APP_VERSION;
    const url = `${API_BASE_URL}${ADMIN_AUTH_URL}/login`;
    try {
      const { data } = await axios.post(
        url,
        payload,
        SharedService.setDefaultHeaders()
      );

      return data;
    } catch (e: any) {
      if (e?.response?.data) {
        return e.response.data;
      }

      return {};
    }
  }

  /**
   * @param payload
   * @returns {Promise<any>}
   */
  static async forgotPassword(payload: any): Promise<any> {
    try {
      payload.appVersion = APP_VERSION;
      const url = `${API_BASE_URL}${ADMIN_AUTH_URL}/forgotPassword`;
      const { data } = await axios.post(url, payload);

      return data;
    } catch (error: any) {
      ShowToast(error.response.data.message, 'error', 5);

      return false;
    }
  }

  /**
   * @param payload
   * @param resetToken
   * @returns {Promise<any>}
   */
  static async resetPassword(payload: any, resetToken: any): Promise<any> {
    try {
      const url = `${API_BASE_URL}${ADMIN_AUTH_URL}/resetPassword/${resetToken}`;
      const { data } = await axios.post(url, payload);

      return data;
    } catch (error: any) {
      ShowToast(error.response.data.message, 'error', 5);

      return false;
    }
  }

  /**
   * @returns {boolean}
   */
  static isLoggedIn(): boolean {
    let loggedIn = false;
    const savedCookie = Cookies.get('session');
    if (savedCookie) {
      loggedIn = true;
    }

    return loggedIn;
  }

  /**
   * @returns
   */
  static isSessionExists() {
    const savedCookie = Cookies.get('session');
    if (savedCookie) {
      return true;
    }

    return false;
  }

  /**
   * @returns
   */
  static async logout() {
    if (AuthService.isSessionExists()) {
      const url = `${API_BASE_URL}auth/logout`;
      try {
        await axios.post(url, {}, SharedService.setDefaultHeaders());

        return true;
      } catch (e: any) {
        return false;
      }
    }

    return true;
  }

  static getAdminData() {
    const adminData = SharedService.getAdminData();
    if (adminData) {
      return adminData;
    }

    return {};
  }

  static removeAllCookies() {
    Cookies.remove('session');
    Cookies.remove('connect.sid');
  }
}

export default AuthService;
