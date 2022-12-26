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

  const locations = useSelector((state) => state.locations.data);
  useEffect(() => {
    async function getLocations() {
      const locations = await locationService.index();
      dispatch(setLocations(locations));
    }
    if (locations?.length === 0) {
      getLocations();
    }
  }, [locations]);

  const categories = useSelector((state) => state.jobCategories.data);
  useEffect(() => {
    async function getJobCategories() {
      const categories = await jobCategoryService.index();
      dispatch(setJobCategories(categories));
    }
    if (categories?.length === 0) {
      getJobCategories();
    }
  }, [categories]);

  const salaryTypes = useSelector((state) => state.salaryTypes.data);
  useEffect(() => {
    async function getSalaryTypes() {
      const salaryTypes = await salaryTypeService.index();
      dispatch(setSalaryTypes(salaryTypes));
    }
    if (salaryTypes.length === 0) {
      getSalaryTypes();
    }
  }, [salaryTypes]);

  const contractTypes = useSelector(
    (state) => state.employmentContractTypes.data
  );
  useEffect(() => {
    async function getEmploymentContractTypes() {
      const contractTypes = await employmentContractTypeService.index();
      dispatch(setContractTypes(contractTypes));
    }
    if (contractTypes.length === 0) {
      getEmploymentContractTypes();
    }
  }, [contractTypes]);

  async function updateJobById(submit) {
    setLoading(true);
    try {
      await jobService.update(submit, submit.id);
      dispatch(updateJob(submit));
      toast.current.show({
        severity: 'success',
        summary: 'Job updated',
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
      <h1 className="font-normal">Edit job posting</h1>
      <JobForm
        formData={job}
        locations={locations}
        categories={categories}
        salaryTypes={salaryTypes}
        contractTypes={contractTypes}
        submit={updateJobById}
        loading={loading}
      />
      <Toast ref={toast} />
    </div>
  );
}

export default EditJob;
