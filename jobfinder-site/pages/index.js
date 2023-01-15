import React, { useEffect, useState } from 'react';
import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../utils/session';
import BasicSearch from '../components/BasicSearch';
import JobLister from '../components/JobLister';
import Pagination from '../components/Pagination';
import jobService from '../services/jobService';
import useAuthState from '../utils/useAuthState';

export const getServerSideProps = withIronSessionSsr(
  async ({ req, res, query }) => {
    const { user = null } = req.session;
    let data = [];
    let total = 0;
    try {
      let { jobs, totalRecords } = await jobService.index();
      if (jobs instanceof Array) {
        data = jobs;
        total = totalRecords;
      }
    } catch (error) {
      console.error(error);
    }

    return {
      props: {
        user,
        data,
        total,
      }, // will be passed to the page component as props
    };
  },
  sessionOptions
);

export default function Home(props) {
  useAuthState(false, props.user);
  const [jobs, setJobs] = useState(props.data || []);
  const [jobsTitle, setJobsTitle] = useState('Latest Jobs');
  const [totalRecords, setTotalRecords] = useState(props.total || 0);

  const [page, setPage] = useState(1);
  useEffect(() => {
    pageJobs(page);
  }, [page]);

  async function pageJobs(page) {
    const { jobs } = await jobService.index(`page=${page}`);
    setJobs(jobs);
  }

  async function queryJobs(query, page) {
    const { jobs } = await jobService.index(`title=${query}&page=${page}`);
    setJobsTitle(`Results for ${query}`);
    setJobs(jobs);
  }

  return (
    <React.Fragment>
      <section id="job-search" className="pt-8 pb-8">
        <div className="flex justify-center">
          <BasicSearch submit={queryJobs} />
        </div>
      </section>
      <section id="job-results" className="pt-8 pb-8">
        <h2 className="mb-8 text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
          {jobsTitle}
        </h2>
        <JobLister jobs={jobs} />
        <Pagination page={page} totalRecords={totalRecords} setPage={setPage} />
      </section>
    </React.Fragment>
  );
}
