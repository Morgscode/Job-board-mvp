import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocations } from '../../store/features/locationSlice';
import { setCategories } from '../../store/features/jobCategorySlice';
import { setSalaryTypes } from '../../store/features/salaryTypeSlice';
import { setContractTypes } from '../../store/features/employmentContractTypeSlice';
import { addJob } from '../../store/features/jobSlice';
import { Toast } from 'primereact/toast';
import JobForm from '../../components/jobs/JobForm';
import jobService from '../../services/jobService';
import locationService from '../../services/locationService';
import jobCategoryService from '../../services/jobCategoryService';
import salaryTypeService from '../../services/salaryTypeService';
import employmentContractTypeService from '../../services/employmentContractTypeService';
import { job as jobSchema } from '../../utils/schema';

function CreateJob(props) {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  
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
      dispatch(setCategories(categories));
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

  async function createJob(submit) {
    setLoading(true);
    try {
      const job = await jobService.create(submit);
      dispatch(addJob(job));
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

  return (
    <div>
      <h1 className="font-normal">Create a job posting</h1>
      <JobForm
        formData={{ ...jobSchema }}
        locations={locations}
        categories={categories}
        salaryTypes={salaryTypes}
        contractTypes={contractTypes}
        submit={createJob}
        loading={loading}
      />
      <Toast ref={toast} />
    </div>
  );
}

export default CreateJob;
