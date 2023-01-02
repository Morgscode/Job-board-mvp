import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setLocations } from '../../store/features/locationSlice';
import { setCategories } from '../../store/features/jobCategorySlice';
import { setSalaryTypes } from '../../store/features/salaryTypeSlice';
import { setContractTypes } from '../../store/features/employmentContractTypeSlice';
import { updateJob } from '../../store/features/jobSlice';
import { Toast } from 'primereact/toast';
import JobForm from '../../components/jobs/JobForm';
import jobService from '../../services/jobService';
import locationService from '../../services/locationService';
import jobCategoryService from '../../services/jobCategoryService';
import salaryTypeService from '../../services/salaryTypeService';
import employmentContractTypeService from '../../services/employmentContractTypeService';
import { job as jobSchema } from '../../utils/schema';

function EditJob(props) {
  const { id } = useParams();
  const toast = useRef(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [fetchedJob, setFetchedJob] = useState(false);
  const [job, setJob] = useState({ ...jobSchema });
  useEffect(() => {
    async function getJob(id) {
      const job = await jobService.find(id);
      if (!job) {
        getJob(id);
      }
      const locations = await locationService.findByJobId(id);
      const categories = await jobCategoryService.findByJobId(id);
      job.categories = categories.map((category) => category.id);
      job.locations = locations.map((location) => location.id);
      setJob(job);
      setFetchedJob(true);
    }
    if (!fetchedJob) {
      getJob(id);
    }
  }, [fetchedJob, job]);

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
