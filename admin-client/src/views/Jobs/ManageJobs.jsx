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
  const [action, setAction] = useState('index');
  const [job, setJob] = useState(null);
  const jobs = useSelector((state) => state.jobs.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function getJobs() {
    const jobData = await jobService.index();
    dispatch(setJobs(jobData.data.data.jobs));
  }

  useEffect(() => {
    if (jobs.length === 0) {
      getJobs();
    }
  });

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
      <JobLister jobs={jobs} changeAction={setAction} />
    </div>
  );
}

export default ManageJobs;
