'use client';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Form } from 'antd';
import debounce from 'lodash.debounce';
import { useRouter, useSearchParams } from 'next/navigation';

import { Patient } from '@/types/patientTypes';

import { BridgeTherapyMainScreenLayout } from '@/components/bridgeTherapy/bridgeTherapyMainScreenLayout';

import { BRIDGETHERAPY_SCREENS } from '@/utils/constants';

import BridgeTherapyContainer from './bridgeTherapyContainer';
import { searchingInitialValuesBridgeTherapy } from './bridgeTherapyIntialValues';
import SFTPLogsContainer from './sftpLogsContainer';
import {
  searchingInitialValuesSftpLogs,
  TSFTPLogFilter
} from './sftpLogsIntialValues';

export const BridgetherapyMainScreenContainer = () => {
  const tabInUrl = useSearchParams().get('tab');
  const router = useRouter();
  const [onScreen, setOnScreen] = useState<string>(
    tabInUrl ? tabInUrl : (BRIDGETHERAPY_SCREENS[0]?.value as string)
  );

  const onChangeScreen = (val: any) => {
    setOnScreen(val);
    router.push(`/bridgeTherapy?tab=${val}`);
  };

  const handleSearch = useCallback(
    debounce(async (e: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    }, 500),
    []
  );

  const [sort, setSort] = useState('DESC');

  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showTableActions, setShowTableActions] = useState(false);
  const [sftpPatientsList, setSftpPatientsList] = useState<any>([]);
  const [selectedPatientIds, setSelectedPatientIds] = useState<any>([]);
  const [selectedPatients, setSelectedPatients] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<{
    key: React.Key[];
    rows: Patient[];
  }>({ key: [], rows: [] });

  const onSelectChange = (
    selectedRowKeysP: React.Key[],
    selectedRowsP: Patient[]
  ) => {
    setShowTableActions(selectedRowKeysP.length > 0);
    setSelectedRows({
      key: [...selectedRows.key, ...selectedRowKeysP],
      rows: [...selectedRows.rows, ...selectedRowsP]
    });
  };
  const onSelectCheckbox = (
    record: any,
    selected: any,
    selectedRows: any,
    nativeEvent: any
  ) => {
    if (selected) {
      setSelectedPatientIds([...selectedPatientIds, ...[record.patientId]]);
      setSelectedPatients([...selectedPatients, ...[record]]);
      setSelectedRows({
        key: [...selectedPatientIds, ...[record.patientId]],
        rows: [...selectedPatients, ...[record]]
      });
      setShowTableActions(record.patientId.length > 0);
    } else {
      let filteredPatientIds = selectedPatientIds.filter((patientId: any) => {
        return record.patientId !== patientId;
      });
      let filteredPatients = selectedPatients.filter((patient: any) => {
        return record.patientId !== patient.patientId;
      });
      setSelectedPatientIds([...filteredPatientIds]);
      setSelectedPatients([...filteredPatients]);
      setSelectedRows({
        key: [...filteredPatientIds],
        rows: [...filteredPatients]
      });
      setShowTableActions(filteredPatientIds.length > 0);
    }
  };

  const onSelectAllCheckboxes = (
    selected: any,
    selectedRows: any,
    changeRows: any
  ) => {
    if (selected) {
      let tempSelectedPatientIds = selectedRows
        .map((patient: any) => {
          if (patient && selectedPatientIds.indexOf(patient.patientId) === -1) {
            return patient.patientId;
          } else {
            return false;
          }
        })
        .filter((pId: any) => pId);
      let tempSelectedPatients = selectedRows
        .map((patient: any) => {
          if (patient && selectedPatientIds.indexOf(patient.patientId) === -1) {
            return patient;
          } else {
            return false;
          }
        })
        .filter((tempPatient: any) => tempPatient);
      setSelectedPatientIds([...selectedPatientIds, ...tempSelectedPatientIds]);
      setSelectedPatients([...selectedPatients, ...tempSelectedPatients]);

      setSelectedRows({
        key: [...selectedPatientIds, ...tempSelectedPatientIds],
        rows: [...selectedPatients, ...tempSelectedPatients]
      });
      setShowTableActions(tempSelectedPatientIds.length > 0);
    } else {
      let tempNotSelectedPatienIds = changeRows.map(
        (patient: any) => patient.patientId
      );
      let filteredPatientIds = [];
      let tempFilteredPatients = [];
      for (const patientId of selectedPatientIds) {
        if (tempNotSelectedPatienIds.indexOf(patientId) === -1) {
          filteredPatientIds.push(patientId);
          tempFilteredPatients.push(
            selectedPatients.find(
              (tempPatient: any) => tempPatient.patientId === patientId
            )
          );
        }
      }
      setSelectedPatientIds([...filteredPatientIds]);
      setSelectedPatients([...tempFilteredPatients]);
      setSelectedRows({
        key: [...filteredPatientIds],
        rows: [...tempFilteredPatients]
      });
      setShowTableActions(filteredPatientIds.length > 0);
    }
  };

  const onAddToSFTPList = () => {
    setSftpPatientsList((prev: any[]) => {
      let patients = [...selectedRows.rows];
      patients.sort((a, b) => {
        let fa = a.name.toLowerCase(),
          fb = b.name.toLowerCase();
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }

        return 0;
      });

      patients = Array.from(
        new Map(patients.map(patient => [patient.patientId, patient])).values()
      );

      return patients;
    });
    setShowBulkModal(true);
  };

  const onSupplyDayChange = (record: Patient, value: string) => {
    const { rows } = selectedRows;

    const updatedRow = rows.map(item => {
      if (record.patientId === item.patientId) {
        item.supplyDays = value;
      }

      return item;
    });

    setSelectedRows(preState => {
      return {
        key: preState.key,
        rows: updatedRow
      };
    });
  };

  const [filterFormRef] = Form.useForm();
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchingFilterBridgeTherapy, setSearchingFilterBridgeTherapy] =
    useState<any>(searchingInitialValuesBridgeTherapy);
  const [searchingFilterSftpLogs, setSearchingFilterSftpLogs] =
    useState<TSFTPLogFilter>(searchingInitialValuesSftpLogs);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    setSearchingFilterBridgeTherapy(searchingInitialValuesBridgeTherapy);
    setSearchingFilterSftpLogs(searchingInitialValuesSftpLogs);
    setSearchValue('');
    setSort('DESC');
    setSftpPatientsList([]);
    setSelectedPatientIds([]);
    setSelectedPatients([]);
    setSelectedRows({ key: [], rows: [] });
  }, [onScreen]);

  return (
    <div>
      <BridgeTherapyMainScreenLayout
        setSelectedScreen={onChangeScreen}
        onScreen={onScreen}
        setSearchValue={handleSearch}
        setSearchValueReset={setSearchValue}
        setSort={setSort}
        onAddToSFTPList={onAddToSFTPList}
        showTableActions={showTableActions}
        setFilterOpen={setFilterOpen}
        selectedRows={selectedRows}
      />
      {onScreen === BRIDGETHERAPY_SCREENS[0]?.value ? (
        <BridgeTherapyContainer
          selectedRows={selectedRows}
          filterOpen={filterOpen}
          setFilterOpen={() => setFilterOpen(x => !x)}
          filterFormRef={filterFormRef}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          searchingFilter={searchingFilterBridgeTherapy}
          setSearchingFilter={setSearchingFilterBridgeTherapy}
          onScreen={onScreen}
          onChangeScreen={onChangeScreen}
          selectedPatients={selectedPatients}
          setSelectedPatients={setSelectedPatients}
          sftpPatientsList={sftpPatientsList}
          setSftpPatientsList={setSftpPatientsList}
          selectedPatientIds={selectedPatientIds}
          setSelectedPatientIds={setSelectedPatientIds}
          showBulkModal={showBulkModal}
          setShowBulkModal={setShowBulkModal}
          selectedRowKeys={selectedRows.key}
          onSelectChange={onSelectChange}
          onAddToSFTPList={onAddToSFTPList}
          showTableActions={showTableActions}
          onSelectCheckbox={onSelectCheckbox}
          onSelectAllCheckboxes={onSelectAllCheckboxes}
          setSelectedRows={setSelectedRows}
          setShowTableActions={setShowTableActions}
          onSupplyDayChange={onSupplyDayChange}
        />
      ) : (
        <SFTPLogsContainer
          filterOpen={filterOpen}
          setFilterOpen={() => setFilterOpen(x => !x)}
          filterFormRef={filterFormRef}
          searchingFilter={searchingFilterSftpLogs}
          setSearchingFilter={setSearchingFilterSftpLogs}
          sort={sort}
          setSort={setSort}
          onScreen={onScreen}
        />
      )}
    </div>
  );
};
