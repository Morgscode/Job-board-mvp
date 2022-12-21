import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setJobs } from '../../store/features/jobSlice';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import jobService from '../../services/jobService';
import JobLister from '../../components/jobs/JobLister';

// bring in toast for ajax success/error

// fix api to only allow certain query terms

function ManageJobs() {
  const jobs = useSelector((state) => state.jobs.data);
  const [manageJob, setManageJob] = useState({ action: null, data: null });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function getJobs() {
    const jobData = await jobService.index();
    dispatch(setJobs(jobData.data.data.jobs));
  }

  async function deleteJobs(jobs) {
    console.log(jobs);
  }

  useEffect(() => {
    if (jobs.length === 0) {
      getJobs();
    }
    if (manageJob.action && manageJob.data) {
      if (manageJob.action === 'edit') {
        navigate(`/jobs/${manageJob.data.id}/edit`);
      } else if (manageJob.action === 'delete') {
        deleteJobs(manageJob.data);
      }
    }
  }, [jobs, manageJob]);

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
    </div>
  );
}

export default ManageJobs;
