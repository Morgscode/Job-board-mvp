import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import locationService from '../../services/locationService';
import {
  deleteLocation,
  setLocations,
  setPage,
  setFirstRow,
  setTotalRecords,
} from '../../store/features/locationSlice';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import Lister from '../../components/Lister';
import useManageResource from '../../utils/manageResource';
import useLazyParams from '../../utils/lazyParams';

function ManageLocations() {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const totalRecords = useSelector((state) => state.locations.totalRecords);
  const currentPage = useSelector((state) => state.locations.page);
  const firstRow = useSelector((state) => state.locations.firstRow);
  const [manageLocation, setManageLocation] = useManageResource(
    'locations',
    'edit',
    deleteLocationById
  );
  const [lazyParams, setLazyParams] = useLazyParams(
    firstRow,
    10,
    currentPage,
    getLocations,
    setCurrentPage
  );

  function setFirst(row) {
    dispatch(setFirstRow(row));
  }

  function setCurrentPage(page) {
    dispatch(setPage(page));
  }

  async function getLocations(params) {
    try {
      setLoading(true);
      const { locations, totalRecords } = await locationService.index(
        `page=${params.page}&limit=${params.rows}`
      );
      if (locations instanceof Array) {
        dispatch(setLocations(locations));
        dispatch(setTotalRecords(totalRecords));
        setRequestSuccess(true);
      }
    } catch (error) {
      setRequestSuccess(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const locations = useSelector((state) => state.locations.data);
  useEffect(() => {
    if (locations.length === 0 && !requestSuccess) {
      getLocations(lazyParams);
    }
  }, [locations, requestSuccess, lazyParams]);

  async function deleteLocationById(job) {
    try {
      await locationService.delete(job.id);
      dispatch(deleteLocation(job.id));
      toast.current.show({ severity: 'success', summary: 'Location deleted' });
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'There was a problem deleting that location',
      });
    }
  }

  const actions = (
    <React.Fragment>
      <Button
        label="New"
        icon="pi pi-plus"
        className="mr-2"
        onClick={() => navigate('/locations/create')}
      />
    </React.Fragment>
  );

  const columns = [{ field: 'name', header: 'Location name', filter: true }];

  const dataColumns = columns.map((col, i) => {
    return <Column key={i} field={col.field} filter={col.filter} header={col.header} />;
  });

  return (
    <div>
      <Toolbar className="mb-5" right={actions} />
      <Lister
        resourceName="Locations"
        data={locations}
        dataColumns={dataColumns}
        manage={setManageLocation}
        selectedResources={selectedLocations}
        setSelectedResources={setSelectedLocations}
        params={lazyParams}
        setParams={setLazyParams}
        loading={loading}
        totalRecords={totalRecords}
        setFirst={setFirst}
      />
      <Toast ref={toast} />
    </div>
  );
}

export default ManageLocations;
