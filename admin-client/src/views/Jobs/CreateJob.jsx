import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocations } from '../../store/features/locationSlice';
import { setJobCategories } from '../../store/features/jobCategorySlice';
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

function CreateJob(props) {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const locations = useSelector((state) => state.locations.data);
  const categories = useSelector((state) => state.jobCategories.data);
  const salaryTypes = useSelector((state) => state.salaryTypes.data);
  const contractTypes = useSelector((state) => state.employmentContractTypes.data);

  const model = Object.freeze({
    title: '',
    salary: '0.00',
    salaryType: '',
    contractType: '',
    locations: [],
    categories: [],
    description: '<p>Make it snappy</p>',
    deadline: null,
  });

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

  async function createJob(submit) {
    console.log(submit);
    setLoading(true);
    try {
      const res = await jobService.create(submit);
      const { job } = res.data.data;
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
    if (contractTypes.length === 0) {
      getEmploymentContractTypes();
    }
  }, [locations, categories, salaryTypes, contractTypes]);

  return (
    <div>
      <h1 className="font-normal">Create a job posting</h1>
      <JobForm formData={{...model}} locations={locations} categories={categories} salaryTypes={salaryTypes} contractTypes={contractTypes} submit={createJob} loading={loading} />
      <Toast ref={toast} />
    </div>
  );
}

export default CreateJob;
