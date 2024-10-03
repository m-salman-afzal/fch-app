import axios from 'axios';

import { API_BASE_URL, FACILITY_LOT_URL, INVENTORY_URL } from '../utils/urls';
import SharedService from './SharedService';

class FacilityLotService {
  /**
   * @param {string} facilityLotId
   * @returns
   */
  static async removeFacilityLot(facilityLotId: string) {
    try {
      const url = `${API_BASE_URL}${INVENTORY_URL}/${FACILITY_LOT_URL}/${facilityLotId}`;
      await axios.delete(url, SharedService.setDefaultHeaders());

      return true;
    } catch (error) {
      return false;
    }
  }
}

export default FacilityLotService;
