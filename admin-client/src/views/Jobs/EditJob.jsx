import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setLocations } from '../../store/features/locationSlice';
import { setJobCategories } from '../../store/features/jobCategorySlice';
import { setSalaryTypes } from '../../store/features/salaryTypeSlice';
import { setContractTypes } from '../../store/features/employmentContractTypeSlice';
import { Toast } from 'primereact/toast';
import JobForm from '../../components/jobs/JobForm';
import jobService from '../../services/jobService';
import locationService from '../../services/locationService';
import jobCategoryService from '../../services/jobCategoryService';
import salaryTypeService from '../../services/salaryTypeService';
import employmentContractTypeService from '../../services/employmentContractTypeService';

function EditJob(props) {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const toast = useRef(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const locations = useSelector((state) => state.locations.data);
  const categories = useSelector((state) => state.jobCategories.data);
  const salaryTypes = useSelector((state) => state.salaryTypes.data);
  const contractTypes = useSelector(
    (state) => state.employmentContractTypes.data
  );

  async function getJob(id) {
    const res = await jobService.find(id);
    const { job } = res.data.data;
    setJob(job);
  }

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

  async function getEmploymentContractTypes() {
    const res = await employmentContractTypeService.index();
    const { contractTypes } = res.data.data;
    dispatch(setContractTypes(contractTypes));
  }

  async function updateJob(submit) {
    console.log(submit);
    setLoading(true);
    try {
      const job = await jobService.update(submit);
      dispatch(updateJob(job.data.data.job));
      toast.current.show({
        severity: 'success',
        summary: 'Job posted',
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

  useEffect(() => {
    if (!job) {
      getJob(id);
    }
    if (locations?.length === 0) {
      getLocations();
    }
    if (categories?.length === 0) {
      getJobCategories();
    }
    if (salaryTypes.length === 0) {
      getSalaryTypes();
    }
    if (contractTypes.length === 0) {
      getEmploymentContractTypes();
    }
  });

  return (
    <div>
      <h1 className="font-normal">Edit job posting</h1>
      <JobForm
        formData={job}
        locations={locations}
        categories={categories}
        salaryTypes={salaryTypes}
        contractTypes={contractTypes}
        submit={updateJob}
        loading={loading}
      />
      <Toast ref={toast} />
    </div>
  );
}

export default EditJob;
