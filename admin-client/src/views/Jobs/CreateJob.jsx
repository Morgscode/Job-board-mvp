import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocations } from '../../store/features/locationSlice';
import { setJobCategories } from '../../store/features/jobCategorySlice';
import { setSalaryTypes } from '../../store/features/salaryTypeSlice';
import { addJob } from '../../store/features/jobSlice';
import { Toast } from 'primereact/toast';
import JobForm from '../../components/jobs/JobForm';
import jobService from '../../services/jobService';
import locationService from '../../services/locationService';
import jobCategoryService from '../../services/jobCategoryService';
import salaryTypeService from '../../services/salaryTypeService';

function CreateJob(props) {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const locations = useSelector((state) => state.locations.data);
  const categories = useSelector((state) => state.jobCategories.data);
  const salaryTypes = useSelector((state) => state.salaryTypes.data);

  async function getLocations() {
    const res = await locationService.index();
    const { locations } = res.data.data;
    dispatch(setLocations(locations));
  }

  async function getJobCategories() {
    const res = await jobCategoryService.index();
    const { categories } = res.data.data;
    dispatch(setJobCategories(categories));
  }

  async function getSalaryTypes() {
    const res = await salaryTypeService.index();
    const { salaryTypes } = res.data.data;
    dispatch(setSalaryTypes(salaryTypes));
  }

  async function createJob(submit) {
    console.log(submit);
    setLoading(true);
    try {
      const job = await jobService.create(submit);
      dispatch(addJob(job.data.data.job));
      toast.current.show({
        severity: 'success',
        summary: 'Job posted',
      });
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: 'error',
        summary: 'There was a problem creating that job',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (locations?.length === 0) {
      getLocations();
    }
    if (categories?.length === 0) {
      getJobCategories();
    }
    if (salaryTypes.length === 0) {
      getSalaryTypes();
    }
  });

  return (
    <div>
      <h1 className="font-normal">Create a job posting</h1>
      <JobForm locations={locations} categories={categories} salaryTypes={salaryTypes} submit={createJob} loading={loading} />
      <Toast ref={toast} />
    </div>
  );
}

export default CreateJob;
