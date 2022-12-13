import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocations } from '../../store/features/locationSlice';
import { setJobCategories } from '../../store/features/jobCategorySlice';
import JobForm from '../../components/jobs/JobForm';
import locationService from '../../services/locationService';
import jobCategoryService from '../../services/jobCategoryService';

function CreateJob(props) {
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.locations.data);
  const categories = useSelector((state) => state.jobCategories.data);

  async function getLocations() {
    if (locations?.length === 0) {
      const res = await locationService.index();
      const { locations } = res.data.data;
      dispatch(setLocations(locations));
    }
  }

  async function getJobCategories() {
    if (categories?.length === 0) {
      const res = await jobCategoryService.index();
      const { categories } = res.data.data;
      dispatch(setJobCategories(categories));
    }
  }

  useEffect(() => {
    getLocations();
    getJobCategories();
  });

  return (
    <div>
      <h1 class="font-normal">Create a job posting</h1>
      <JobForm locations={locations} categories={categories} />
    </div>
  );
}

export default CreateJob;
