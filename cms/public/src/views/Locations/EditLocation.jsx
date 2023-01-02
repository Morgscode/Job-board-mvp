import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import locationService from '../../services/locationService';
import { updateLocation } from '../../store/features/locationSlice';
import { Toast } from 'primereact/toast';
import LocationForm from '../../components/locations/LocationForm';
import { location as locationSchema } from '../../utils/schema';
import useFetchResource from '../../utils/fetchResource';

function EditLocation(props) {
  const { id } = useParams();
  const toast = useRef(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  
  const resource = useFetchResource(id, locationSchema, locationService);

  async function updateLocationById(submit) {
    setLoading(true);
    try {
      await locationService.update(submit, submit.id);
      dispatch(updateLocation(submit));
      toast.current.show({
        severity: 'success',
        summary: 'Location updated',
      });
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: 'error',
        summary: 'There was a problem updating that location',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-normal">Edit location</h1>
      <LocationForm
        formData={resource}
        submit={updateLocationById}
        loading={loading}
      />
      <Toast ref={toast} />
    </div>
  );
}

export default EditLocation;
