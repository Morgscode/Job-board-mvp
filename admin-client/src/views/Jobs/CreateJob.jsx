import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocations } from '../../store/features/locationSlice';
import { setJobCategories } from '../../store/features/jobCategorySlice';
import { setSalaryTypes } from '../../store/features/salaryTypeSlice';
import JobForm from '../../components/jobs/JobForm';
import locationService from '../../services/locationService';
import jobCategoryService from '../../services/jobCategoryService';
import salaryTypeService from '../../services/salaryTypeService';

function CreateJob(props) {
  const dispatch = useDispatch();
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
      <JobForm locations={locations} categories={categories} salaryTypes={salaryTypes} />
    </div>
  );
}

export default CreateJob;
