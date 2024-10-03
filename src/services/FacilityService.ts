import axios from 'axios';

import { API_BASE_URL, FACILITIES_URL, FILE_URL } from '../utils/urls';
import SharedService from './SharedService';

class FacilityService {
  /**
   * @param {any} payload
   * @returns
   */
  static async addFacility(payload: any) {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}${FACILITIES_URL}/add`,
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
  static async getFacilitiesWithContacts(query: any) {
    try {
      const queryParams = SharedService.bindQueryParams(query);
      const { data } = await axios.get(
        `${API_BASE_URL}${FACILITIES_URL}?${queryParams}`,
        SharedService.setDefaultHeaders()
      );

      return FacilityService.addKeysToFacilities(data);
    } catch (e: any) {
      return [];
    }
  }

  /**
   * @param {string} facilityId
   * @param {any} payload
   * @returns
   */
  static async updateFacility(facilityId: string, payload: any) {
    try {
      const url = `${API_BASE_URL}${FACILITIES_URL}/edit/${facilityId}`;
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
   * @param {string} facilityId
   * @returns
   */
  static async deleteFacility(facilityId: string) {
    try {
      const url = `${API_BASE_URL}${FACILITIES_URL}/remove/${facilityId}`;
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

  static async locationUpload(csvFile: any) {
    try {
      const url = `${API_BASE_URL}${FILE_URL}/add`;
      await axios.post(url, csvFile, SharedService.setDefaultHeaders());

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * @param facilities
   * @returns
   */
  static addKeysToFacilities(facilities: any) {
    return facilities.map((x: any) => {
      x.key = x.facilityId;
      x.value = x.facilityId;
      x.label = x.facilityName;

      return x;
    });
  }
}

export default FacilityService;
