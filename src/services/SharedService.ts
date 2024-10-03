import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

const applicationTokenKey = 'VSCorrectionsToken';
const adminDataKey = 'AdminData';

class SharedService {
  /**
   * @returns
   */
  static setDefaultHeaders() {
    return {
      withCredentials: true
    };
  }

  /**
   * @returns {string}
   */

  static getTokenFromStorage(): string | null {
    return localStorage.getItem(applicationTokenKey);
  }

  /**
   * @param token
   */
  static setTokenToStorage(token: any) {
    return localStorage.setItem(applicationTokenKey, token);
  }

  static setAdminDataToStorage(admin: any) {
    return localStorage.setItem(adminDataKey, JSON.stringify(admin));
  }

  /**
   * @returns {boolean}
   */
  static isTokenExists(): boolean {
    return localStorage.getItem(applicationTokenKey) !== null;
  }

  static getAdminData() {
    let adminData: any;
    const savedCookie = Cookies.get('session');
    if (savedCookie) {
      let parsedCookies = SharedService.parseCookie(document.cookie);
      adminData = SharedService.extractAdminDataFromCookie(
        parsedCookies['session']
      );
    } else {
      adminData = null;
    }

    return { ...JSON.parse(adminData) };
  }

  static async removeTokenFromStorage() {
    return localStorage.removeItem(applicationTokenKey);
  }

  static async removeAdminDataFromStorage() {
    return localStorage.removeItem(adminDataKey);
  }

  static getAdminIdFromToken() {
    const token: any = SharedService.getTokenFromStorage();
    const authData: any = jwt.decode(token);
    const { adminId } = authData;

    return adminId;
  }

  static bindQueryParams(query: any) {
    const keys = Object.keys(query);

    return keys
      .filter(k => query[k])
      .map(k => `${k}=${query[k]}`)
      .join('&');
  }

  static isJsonString(jsonString: any) {
    try {
      JSON.parse(jsonString);
    } catch (error) {
      return false;
    }

    return true;
  }

  static getTokenData() {
    const token: any = localStorage.getItem(applicationTokenKey);

    return jwt.decode(token);
  }

  /**
   * @param sentence
   * @returns
   */
  static capitalizeTheString(sentence: string) {
    let allParts = sentence.split(' ');
    let capitalizedString = ``;
    for (let part of allParts) {
      capitalizedString += ` ${
        part.toLocaleLowerCase().charAt(0).toUpperCase() +
        part.toLocaleLowerCase().slice(1)
      }`;
    }

    return capitalizedString.trimStart().trimEnd();
  }

  /**
   * @param str
   * @returns
   */
  static parseCookie(str: string) {
    return str
      .split(';')
      .map(v => v.split('='))
      .reduce((acc: any, v: any) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());

        return acc;
      }, {});
  }

  /**
   * @param cookie
   * @returns
   */
  static extractAdminDataFromCookie(cookie: string) {
    let cookieParts = cookie.split('}.');

    return `${cookieParts[0].replace('s:j:', '')}}`;
  }

  /**
   * @returns
   * @param role
   */
  static checkPermissionBasedOnRole(role: string | string[]): boolean {
    const adminData = SharedService.getAdminData();

    return adminData.role.find((item: any) => {
      return Array.isArray(role)
        ? role.includes(item.name)
        : item.name === role;
    });
  }
}

export default SharedService;
