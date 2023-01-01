import React, {useState, useEffect } from 'react';
import JobSearch from '../components/JobSearch';
import JobLister from '../components/JobLister';
import jobService from '../services/jobService';

export async function getServerSideProps(context) {
  const jobs = await jobService.index();
  return {
    props: {
      jobs,
    }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const [jobs, setJobs] = useState(props.jobs || []);
  const [jobsTitle, setJobsTitle] = useState('Latest Jobs');

  async function queryJobs(query) {
    const jobs = await jobService.index(`title=${query}`);
    setJobsTitle(`Results for ${query}`);
    setJobs(jobs);
  }

  return (
    <React.Fragment>
      <section id="job-search" className="pt-8 pb-8">
        <div className="flex justify-center">
          <JobSearch submit={queryJobs} />
        </div>
      </section>
      <section id="job-results" className='pt-8 pb-8'>
        <h2 className='mb-2 text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-8'>{jobsTitle}</h2>
        <JobLister jobs={jobs} />
      </section>
    </React.Fragment>
  );
}
