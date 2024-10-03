import axios from 'axios';

import { API_BASE_URL, BRIDGE_THERAPY } from '../utils/urls';
import SharedService from './SharedService';

class PatientService {
  /**
   * @param filters
   * @returns
   */
  static async getPatients(filters: any) {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}${BRIDGE_THERAPY}/patients?${SharedService.bindQueryParams(
          filters
        )}`,
        SharedService.setDefaultHeaders()
      );
      data.rows = PatientService.addKeysToPatients(data.rows);

      return data;
    } catch (e: any) {
      return {
        paginationInfo: {
          currentPage: 0,
          totalItems: 0,
          totalPages: 0
        },
        rows: []
      };
    }
  }

  /**
   * @param payload
   * @returns
   */
  static async uploadSftpList(payload: any) {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}${BRIDGE_THERAPY}/`,
        { ...payload },
        SharedService.setDefaultHeaders()
      );

      return data;
    } catch (error) {
      return false;
    }
  }

  /**
   * @param payload
   * @returns
   */
  static async getBridgeTherapyLogs(payload: any) {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}${BRIDGE_THERAPY}/?${SharedService.bindQueryParams(
          payload
        )}`,
        SharedService.setDefaultHeaders()
      );
      data.rows = PatientService.addKeysToLogs(data.rows);

      return data;
    } catch (e: any) {
      return {
        paginationInfo: {
          currentPage: 0,
          totalItems: 0,
          totalPages: 0
        },
        rows: []
      };
    }
  }

  /**
   * @param payload
   * @returns
   */
  static async downloadBridgeTherapyLogFile(payload: any) {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}${BRIDGE_THERAPY}/download?${SharedService.bindQueryParams(
          payload
        )}`,
        SharedService.setDefaultHeaders()
      );

      return data;
    } catch (e: any) {
      return false;
    }
  }

  /**
   * @param patients
   * @returns
   */
  static addKeysToPatients(patients: any) {
    return patients.map((patient: any) => {
      patient.key = patient.patientId;

      return patient;
    });
  }

  /**
   * @param therapyLogs
   * @returns
   */
  static addKeysToLogs(therapyLogs: any) {
    return therapyLogs.map((log: any) => {
      log.key = log.bridgeTherapyLogId;

      return log;
    });
  }
}

export default PatientService;
