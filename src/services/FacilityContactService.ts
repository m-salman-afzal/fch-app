import axios from 'axios';

import { API_BASE_URL, FACILITIES_CONTACT_URL, FILE_URL } from '../utils/urls';
import SharedService from './SharedService';

class FacilityContactService {
  /**
   * @param {any} payload
   * @returns
   */
  static async addFacilityContact(payload: any) {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}${FACILITIES_CONTACT_URL}/add`,
        payload,
        SharedService.setDefaultHeaders()
      );

      return data;
    } catch (e: any) {
      return false;
    }
  }
  /**
   * @param {any} query
   * @returns
   */
  static async getFacilitiesContacts(query: any) {
    try {
      const queryParams = SharedService.bindQueryParams(query);
      const { data } = await axios.get(
        `${API_BASE_URL}${FACILITIES_CONTACT_URL}?${queryParams}`,
        SharedService.setDefaultHeaders()
      );

      return FacilityContactService.addKeysToFacilityContacts(data);
    } catch (e: any) {
      return [];
    }
  }

  /**
   * @param {string} contactId
   * @param {any} payload
   * @returns
   */
  static async updateContact(contactId: string, payload: any) {
    try {
      const url = `${API_BASE_URL}${FACILITIES_CONTACT_URL}/edit/${contactId}`;
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
   * @param {string} contactId
   * @returns
   */
  static async deleteContact(contactId: string) {
    try {
      const url = `${API_BASE_URL}${FACILITIES_CONTACT_URL}/remove/${contactId}`;
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
   * @param facilityConatcts
   * @returns
   */
  static addKeysToFacilityContacts(facilityConatcts: any) {
    return facilityConatcts.map((x: any) => {
      x.key = x.contactId;

      return x;
    });
  }
}

export default FacilityContactService;
