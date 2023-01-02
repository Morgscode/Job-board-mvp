import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import locationService from '../../services/locationService';
import {
  deleteLocation,
  setLocations,
} from '../../store/features/locationSlice';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import LocationLister from '../../components/locations/LocationLister';
import useManageResource from '../../utils/manageResource';

function ManageLocations() {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const locations = useSelector((state) => state.locations.data);
  useEffect(() => {
    async function getLocations() {
      const locations = await locationService.index();
      dispatch(setLocations(locations));
    }
    if (locations.length === 0) {
      getLocations();
    }
  }, [locations]);

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

  const [manageLocation, setManageLocation] = useManageResource('locations', 'edit', deleteLocationById);

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
