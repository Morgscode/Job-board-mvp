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
    const page = query.page || 1;
    
    try {
      let { jobs, totalRecords } = await jobService.index(`active=1&page=${page}`);
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
        page
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
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(props.page);
  const [paged, setPaged] = useState(false);
  
  useEffect(() => {
    let qs = `active=1&page=${page}`;
    if (query) {
      qs += `&title=${query}`
    }
    if (!paged && page !== props.page || paged || query) {
      getJobs(qs);
      setPaged(true);
    }
  }, [page, query, props.page, paged]);

  async function getJobs(query) {
    const { jobs, totalRecords } = await jobService.index(query);
    const params = new URLSearchParams(query);
    setJobsTitle(`${params.get('title') ? `Results for ${params.get('title')}` : 'Latest jobs'}`);
    setTotalRecords(totalRecords);
    setJobs(jobs);
  }

  return (
    <React.Fragment>
      <section id="job-search" className="pt-8 pb-8">
        <div className="flex justify-center">
          <BasicSearch submit={setQuery} />
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
