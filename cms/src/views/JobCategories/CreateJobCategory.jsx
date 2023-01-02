import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory } from '../../store/features/jobCategorySlice';
import { Toast } from 'primereact/toast';
import JobCategoryForm from '../../components/job-categories/JobCategoryForm';
import jobCategoryService from '../../services/jobCategoryService';
import { jobCategory as jobCategorySchema } from '../../utils/schema';

function CreateJobCategory(props) {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  
  async function createCategory(submit) {
    setLoading(true);
    try {
      const category = await jobCategoryService.create(submit);
      dispatch(addCategory(category));
      toast.current.show({
        severity: 'success',
        summary: 'Job category created',
      });
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: 'error',
        summary: 'There was a problem creating that category',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-normal">Create a new job category</h1>
      <JobCategoryForm
        formData={{ ...jobCategorySchema}}
        submit={createCategory}
        loading={loading}
        reset={true}
      />
      <Toast ref={toast} />
    </div>
  );
}

export default CreateJobCategory;
