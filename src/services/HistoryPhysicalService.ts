import axios from 'axios';

import { API_BASE_URL, HISTORY_PHYSICAL_URL } from '../utils/urls';
import SharedService from './SharedService';

class HistoryPhysicalService {
  static async getHistoryPhysicalData(query: any) {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}${HISTORY_PHYSICAL_URL}`,
        { ...SharedService.setDefaultHeaders(), params: { ...query } }
      );

      return data;
    } catch (e: any) {
      return false;
    }
  }
}

export default HistoryPhysicalService;
