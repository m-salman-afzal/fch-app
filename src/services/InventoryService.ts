import axios from 'axios';

import ShowToast from '@/utils/showToast';

import {
  API_BASE_URL,
  FILE_URL,
  FORMULARY_URL,
  INVENTORY_URL
} from '../utils/urls';
import SharedService from './SharedService';
import sharedService from './SharedService';

class InventoryService {
  /**
   * @param {any} payload
   * @returns
   */
  static async addSingleInventory(payload: any) {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}${INVENTORY_URL}/addWithLot`,
        payload,
        SharedService.setDefaultHeaders()
      );

      return data;
    } catch (e: any) {
      if (e?.response?.status && e?.response?.status === 409) {
        ShowToast(
          'This NDC is associated with another drug in the formulary.',
          'error',
          5
        );
      }

      return false;
    }
  }
  /**
   * @param {any} query
   * @returns
   */
  static async getInventory(query: any) {
    try {
      if (!query.name) {
        delete query.name;
      }
      if (!query.isActive) {
        delete query.isActive;
      }
      const { data } = await axios.get(`${API_BASE_URL}${INVENTORY_URL}`, {
        ...SharedService.setDefaultHeaders(),
        params: { ...query }
      });
      data.rows = InventoryService.addKeysToFormulary(data.rows);

      return data;
    } catch (e: any) {
      return {
        rows: [],
        paginationInfo: {
          totalItems: 0
        }
      };
    }
  }

  /**
   * @param {string} inventoryId
   * @param {any} payload
   * @returns
   */
  static async updateInventory(inventoryId: string, payload: any) {
    try {
      const url = `${API_BASE_URL}${INVENTORY_URL}/edit/${inventoryId}`;
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
   * @param {string} inventoryId
   * @returns
   */
  static async deleteInventory(inventoryId: string) {
    try {
      const url = `${API_BASE_URL}${INVENTORY_URL}/remove/${inventoryId}`;
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
   * @param formularies
   * @returns
   */
  static addKeysToFormulary(formularies: any) {
    return formularies.map((x: any) => {
      x.key = x.formularyId;

      return x;
    });
  }
}

export default InventoryService;
