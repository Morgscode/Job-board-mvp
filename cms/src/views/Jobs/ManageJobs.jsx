import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jobService from '../../services/jobService';
import { setJobs, deleteJob } from '../../store/features/jobSlice';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import JobLister from '../../components/jobs/JobLister';
import useManageResource from '../../utils/manageResource';

function ManageJobs() {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const jobs = useSelector((state) => state.jobs.data);
  useEffect(() => {
    async function getJobs() {
      const jobs = await jobService.index();
      dispatch(setJobs(jobs));
    }
    if (jobs.length === 0) {
      getJobs();
    }
  }, [jobs]);

  async function deleteJobById(job) {
    try {
      await jobService.delete(job.id);
      dispatch(deleteJob(job.id));
      toast.current.show({ severity: 'success', summary: 'Job deleted' });
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'There was a problem deleting that job',
      });
    }
  }

  const [manageJob, setManageJob] = useManageResource('jobs', 'edit', deleteJobById);

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
      <JobLister jobs={jobs} manage={setManageJob} />
      <Toast ref={toast} />
    </div>
  );
}

export default ManageJobs;
