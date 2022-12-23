import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jobService from '../../services/jobService';
import employmentContractTypeService from '../../services/employmentContractTypeService';
import { setJobs, deleteJob } from '../../store/features/jobSlice';
import { setContractTypes } from '../../store/features/employmentContractTypeSlice';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import JobLister from '../../components/jobs/JobLister';

function ManageJobs() {
  const toast = useRef(null);
  const jobs = useSelector((state) => state.jobs.data);
  const contractTypes = useSelector(
    (state) => state.employmentContractTypes.data
  );
  const [manageJob, setManageJob] = useState({ action: null, data: null });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function getJobs() {
      const jobData = await jobService.index();
      const { jobs } = jobData.data.data;
      dispatch(setJobs(jobs));
    }
    if (jobs.length === 0) {
      getJobs();
    }
  }, [jobs]);

  useEffect(() => {
    async function getContractTypes() {
      const contractTypesData = await employmentContractTypeService.index();
      const { contractTypes } = contractTypesData.data.data;
      dispatch(setContractTypes(contractTypes));
    }
    if (contractTypes.length === 0) {
      getContractTypes();
    }
  }, [contractTypes]);

  useEffect(() => {
    async function deleteJobById(job) {
      try {
        await jobService.delete(job.id);
        dispatch(deleteJob(job.id));
        toast.current.show({severity: 'success', summary: 'Job deleted'});
      } catch (error) {
        toast.current.show({severity: 'error', summary: 'There was a problem deleting that job'});
      }
    }
    if (manageJob.action && manageJob.data) {
      if (manageJob.action === 'edit') {
        navigate(`/jobs/${manageJob.data.id}/edit`);
      } else if (manageJob.action === 'delete') {
        deleteJobById(manageJob.data);
      }
    }
    return;
  }, [manageJob]);

  const actions = (
    <React.Fragment>
      <Button
        label="New"
        icon="pi pi-plus"
        className="mr-2"
        onClick={() => navigate('/jobs/create')}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Toolbar className="mb-5" right={actions} />
      <JobLister
        jobs={jobs}
        contractTypes={contractTypes}
        manage={setManageJob}
      />
      <Toast ref={toast} />
    </div>
  );
}

export default ManageJobs;
