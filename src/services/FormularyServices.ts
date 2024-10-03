import axios from 'axios';

import {
  API_BASE_URL,
  FILE_URL,
  FORMULARY_URL,
  STOCK_REFILL
} from '../utils/urls';
import SharedService from './SharedService';
import sharedService from './SharedService';

class FormularyServices {
  /**
   * @param {any} payload
   * @returns
   */
  static async addFormulary(payload: any) {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}${FORMULARY_URL}/add`,
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
  static async getFormulary(query: any) {
    try {
      if (!query.name) {
        delete query.name;
      }
      if (!query.isActive) {
        delete query.isActive;
      }
      const { data } = await axios.get(`${API_BASE_URL}${FORMULARY_URL}`, {
        ...SharedService.setDefaultHeaders(),
        params: { ...query }
      });
      data.rows = FormularyServices.addKeysToFormulary(data.rows);

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
   * @param {string} formularyId
   * @param {any} payload
   * @returns
   */
  static async updateFormulary(formularyId: string, payload: any) {
    try {
      const url = `${API_BASE_URL}${FORMULARY_URL}/edit/${formularyId}`;
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
   * @param formularyId
   * @returns
   */
  static async softDeleteFormulary(formularyId: string) {
    try {
      const url = `${API_BASE_URL}${FORMULARY_URL}/remove/${formularyId}`;
      await axios.delete(url, SharedService.setDefaultHeaders());

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * @param formularyId
   * @param data
   * @returns
   */
  static async markFormularyActiveOrDeactive(formularyId: string, data: any) {
    try {
      const url = `${API_BASE_URL}${FORMULARY_URL}/editStatus/${formularyId}`;
      await axios.put(url, data, SharedService.setDefaultHeaders());

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * @param query
   * @returns
   */
  static async getStockRefillFormulary(query: any) {
    try {
      if (!query.name) {
        delete query.name;
      }
      if (!query.isActive) {
        delete query.isActive;
      }
      const { data } = await axios.get(`${API_BASE_URL}${STOCK_REFILL}`, {
        ...SharedService.setDefaultHeaders(),
        params: { ...query }
      });
      data.rows = FormularyServices.addKeysToFormulary(data.rows);

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
   * @param payload
   * @returns
   */
  static async updateRefillStock(payload: Object) {
    try {
      const url = `${API_BASE_URL}${STOCK_REFILL}`;
      const { data } = await axios.put(
        url,
        payload,
        SharedService.setDefaultHeaders()
      );
      const { csv, formulary } = data;
      const { rows, paginationInfo } = formulary;
      const transformedCsvData = FormularyServices.transformRefillCsvData(csv);
      const { formularyIds, transformedFormulary } =
        FormularyServices.getTransformedFormulary(rows);

      return {
        paginationInfo,
        transformedCsvData,
        formularyIds,
        transformedFormulary
      };
    } catch (error) {
      return {
        paginationInfo: {},
        transformedCsvData: [],
        formularyIds: [],
        transformedFormulary: []
      };
    }
  }

  /**
   * @param formularies
   * @returns
   */
  static addKeysToFormulary(formularies: any) {
    return formularies.map((x: any) => {
      const {
        formularyId,
        isGeneric,
        minLevel,
        reorderQuantity,
        counter,
        minParLevel,
        maxParLevel
      } = x;
      x.key = formularyId;
      x.nestedQuantities = [
        {
          key: `nest-${formularyId}`,
          isGeneric,
          minLevel,
          reorderQuantity,
          counter,
          minParLevel,
          maxParLevel
        }
      ];

      return x;
    });
  }

  /**
   * @param formularies
   * @returns
   */
  static getTransformedFormulary(formularies: any) {
    const transformedFormulary =
      formularies && formularies.length > 0
        ? FormularyServices.addKeysToFormulary(formularies)
        : [];
    const formularyIds =
      formularies && formularies.length > 0
        ? formularies.map((form: any) => form.formularyId)
        : [];

    return {
      formularyIds,
      transformedFormulary
    };
  }

  /**
   * @param csvData
   */
  static transformRefillCsvData(csvData: any[]) {
    return csvData.map((formulary: any) => {
      return {
        ID: formulary.id ? formulary.id.toString().padStart(3, 0) : '',
        Drug: formulary.name ? formulary.name.replaceAll(',', '') : '',
        'Brand Name': formulary.brandName
          ? formulary.brandName.replaceAll(',', '')
          : '',
        'Generic Name': formulary.genericName
          ? formulary.genericName.replaceAll(',', '')
          : '',
        'Drug Class': formulary.drugClass
          ? formulary.drugClass.replaceAll(',', '')
          : '',
        'Min Level': formulary.minLevel,
        'Reorder Quantity': formulary.reorderQuantity
      };
    });
  }
}

export default FormularyServices;
