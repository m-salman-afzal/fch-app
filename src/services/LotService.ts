import axios from 'axios';

import { API_BASE_URL, INVENTORY_URL, LOT_URL } from '../utils/urls';
import SharedService from './SharedService';
import sharedService from './SharedService';

class LotService {
  /**
   * @param {string} lotId
   * @param {any} payload
   * @returns
   */
  static async updateLot(lotId: string, payload: any) {
    try {
      const url = `${API_BASE_URL}${INVENTORY_URL}/${LOT_URL}/edit/${lotId}`;
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
   * @param {string} lotId
   * @returns
   */
  static async deleteLot(lotId: string) {
    try {
      const url = `${API_BASE_URL}${INVENTORY_URL}/${LOT_URL}/remove/${lotId}`;
      await axios.delete(url, SharedService.setDefaultHeaders());

      return true;
    } catch (error) {
      return false;
    }
  }
}

export default LotService;
