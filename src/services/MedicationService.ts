import axios from 'axios';

import { API_BASE_URL, MEDICATIONS_URL } from '../utils/urls';
import SharedService from './SharedService';

class MedicationService {
  /**
   * @returns
   */
  static async getMedpassDowntimePatients() {
    try {
      const { data } = await axios.get(`${API_BASE_URL}${MEDICATIONS_URL}`, {
        ...SharedService.setDefaultHeaders(),
        params: {}
      });

      return data;
    } catch (e: any) {
      return [];
    }
  }
}

export default MedicationService;
