import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jobCategoryService from '../../services/jobCategoryService';
import {
  deleteCategory,
  setCategories,
} from '../../store/features/jobCategorySlice';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import JobCategoryLister from '../../components/job-categories/JobCategoryLister';
import useManageResource from '../../utils/manageResource';

function ManageJobCategories() {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [requestSuccess, setRequestSuccess] = useState(false);
  const categories = useSelector((state) => state.jobCategories.data);
  useEffect(() => {
    async function getCategories() {
      try {
        const categories = await jobCategoryService.index();
        if (categories instanceof Array) {
          dispatch(setCategories(categories));
        }
        setRequestSuccess(true);
      } catch (error) {
        setRequestSuccess(false);
        console.error(error);
      }
    }
    if (categories.length === 0 && !requestSuccess) {
      getCategories();
    }
  }, [categories, requestSuccess]);

  const jobs = useSelector((state) => state.jobs.data);
  useEffect(() => {
    async function getJobs() {}
    if (jobs.length === 0 && !requestSuccess) {
      getJobs();
    }
  }, [jobs, requestSuccess]);

  async function deleteCategoryById(job) {
    try {
      await jobCategoryService.delete(job.id);
      dispatch(deleteCategory(job.id));
      toast.current.show({
        severity: 'success',
        summary: 'Job category deleted',
      });
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'There was a problem deleting that job category',
      });
    }
  }

  const [manageCategory, setManageCategory] = useManageResource(
    'job-categories',
    'edit',
    deleteCategoryById
  );

  const actions = (
    <React.Fragment>
      <Button
        label="New"
        icon="pi pi-plus"
        className="mr-2"
        onClick={() => navigate('/job-categories/create')}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Toolbar className="mb-5" right={actions} />
      <JobCategoryLister categories={categories} manage={setManageCategory} />
      <Toast ref={toast} />
    </div>
  );
}

export default ManageJobCategories;
