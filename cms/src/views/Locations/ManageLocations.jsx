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
import LocationLister from '../../components/locations/LocationLister';
import useManageResource from '../../utils/manageResource';
import useLazyParams from '../../utils/lazyParams';

function ManageLocations() {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const totalRecords = useSelector((state) => state.locations.totalRecords);
  const currentPage = useSelector((state) => state.locations.page);
  const firstRow = useSelector((state) => state.locations.firstRow);

  function setFirst(row) {
    dispatch(setFirstRow(row));
  }
  
  function setCurrentPage(page) {
    dispatch(setPage(page))
  }

  async function getLocations(page) {
    try {
      const locations = await locationService.index(`page=${page}&limit-1`);
      if (locations instanceof Object) {
        dispatch(setLocations(locations.locations));
        dispatch(setTotalRecords(locations.totalRecords));
      }
      setRequestSuccess(true);
    } catch (error) {
      setRequestSuccess(false);
      console.error(error);
    }
  }

  const locations = useSelector((state) => state.locations.data);
  useEffect(() => {
    if (locations.length === 0 && !requestSuccess) {
      getLocations(page);
    }
  }, [locations, requestSuccess]);

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

  const [manageLocation, setManageLocation] = useManageResource(
    'locations',
    'edit',
    deleteLocationById
  );

  const [lazyParams, setLazyParams] = useLazyParams(firstRow, currentPage, getLocations, setCurrentPage);

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

  return (
    <div>
      <Toolbar className="mb-5" right={actions} />
      <LocationLister locations={locations} manage={setManageLocation} />
      <Toast ref={toast} />
    </div>
  );
}

export default ManageLocations;
