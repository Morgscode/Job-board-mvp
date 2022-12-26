import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import locationService from '../../services/locationService';
import { setLocations, updateLocation } from '../../store/features/locationSlice';
import { updateJob } from '../../store/features/jobSlice';
import { Toast } from 'primereact/toast';
import LocationForm from '../../components/locations/LocationForm';
import { location as locationSchema } from '../../utils/schema';

function EditJob(props) {
  const { id } = useParams();
  const toast = useRef(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  
  const [fetchedLocation, setFetchedLocation] = useState(false);
  const [location, setLocation] = useState({...locationSchema});
  useEffect(() => {
    async function getLocation(id) {
      const location = await locationService.find(id);
      if (!location) {
        getLocation(id);
      }
      setLocation(location);
      setFetchedLocation(true);
    }
    if (!fetchedLocation) {
      getLocation(id);
    }
  }, [fetchedLocation, location]);

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
        summary: 'There was a problem updating that job',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-normal">Edit location</h1>
      <LocationForm
        formData={location}
        submit={updateLocationById}
        loading={loading}
      />
      <Toast ref={toast} />
    </div>
  );
}

export default EditJob;
