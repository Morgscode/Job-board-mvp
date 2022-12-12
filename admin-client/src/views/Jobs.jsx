import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setJobs } from '../store/features/jobSlice';
import jobService from '../services/jobService';
import JobLister from '../components/JobLister';

function Jobs() {
  const [action, setAction] = useState('index');
  const [job, setJob ] = useState(null);
  const jobs = useSelector((state) => state.jobs.data);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getJobs() {
      const jobData = await jobService.index();
      dispatch(setJobs(jobData.data.data.jobs));
    }
    if (jobs.length === 0) {
      getJobs();
    }
  });

  if (action === 'index') {
    return <JobLister jobs={jobs} changeAction={setAction} />;
  } else if (action === 'edit') {
    return <h1>Job Edit</h1>;
  } else if (action === 'create') {
    return <h1>Job Create</h1>;
  }
}

export default Jobs;
