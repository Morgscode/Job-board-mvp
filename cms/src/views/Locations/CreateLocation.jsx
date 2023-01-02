import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocations, addLocation } from '../../store/features/locationSlice';
import { Toast } from 'primereact/toast';
import LocationForm from '../../components/locations/LocationForm';
import locationService from '../../services/locationService';
import { location as locationSchema } from '../../utils/schema';

function CreateJob(props) {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  
  async function createLocation(submit) {
    setLoading(true);
    try {
      const location = await locationService.create(submit);
      dispatch(addLocation(location));
      toast.current.show({
        severity: 'success',
        summary: 'Location created',
      });
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: 'error',
        summary: 'There was a problem creating that location',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-normal">Create a new location</h1>
      <LocationForm
        formData={{ ...locationSchema }}
        submit={createLocation}
        loading={loading}
        reset={true}
      />
      <Toast ref={toast} />
    </div>
  );
}

export default CreateJob;
