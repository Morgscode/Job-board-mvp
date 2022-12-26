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

function ManageJobCategories() {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categories = useSelector((state) => state.jobCategories.data);
  useEffect(() => {
    async function getCategories() {
      const categories = await jobCategoryService.index();
      dispatch(setCategories(categories));
    }
    if (categories.length === 0) {
      getCategories();
    }
  }, [categories]);

  const [manageCategory, setManageCategory] = useState({
    action: null,
    data: null,
  });
  useEffect(() => {
    async function deleteCategoryById(job) {
      try {
        await jobCategoryService.delete(job.id);
        dispatch(deleteCategory(job.id));
        toast.current.show({ severity: 'success', summary: 'Job category deleted' });
      } catch (error) {
        toast.current.show({
          severity: 'error',
          summary: 'There was a problem deleting that job category',
        });
      }
    }
    if (manageCategory.action && manageCategory.data) {
      if (manageCategory.action === 'edit') {
        navigate(`/job-categories/${manageCategory.data.id}/edit`);
      } else if (manageCategory.action === 'delete') {
        deleteCategoryById(manageCategory.data);
      }
    }
    return;
  }, [manageCategory]);

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
