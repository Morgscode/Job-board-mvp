import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jobService from '../../services/jobService';
import {
  setJobs,
  deleteJob,
  setPage,
  setTotalRecords,
  setFirstRow,
} from '../../store/features/jobSlice';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import JobLister from '../../components/jobs/JobLister';
import useManageResource from '../../utils/manageResource';
import useLazyParams from '../../utils/lazyParams';

function ManageJobs() {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const totalRecords = useSelector((state) => state.jobs.totalRecords);
  const currentPage = useSelector((state) => state.jobs.page);
  const firstRow = useSelector((state) => state.jobs.firstRow);

  function setFirst(row) {
    dispatch(setFirstRow(row));
  }

  function setCurrentPage(page) {
    dispatch(setPage(page));
  }

  async function getJobs(page) {
    try {
      setLoading(true);
      const { jobs, totalRecords } = await jobService.index(`page=${page}`);
      dispatch(setJobs(jobs));
      dispatch(setTotalRecords(totalRecords));
      setRequestSuccess(true);
    } catch (error) {
      setRequestSuccess(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const jobs = useSelector((state) => state.jobs.data);
  useEffect(() => {
    if (jobs.length === 0 && !requestSuccess) {
      getJobs(currentPage);
    }
  }, [jobs, requestSuccess]);

  const locations = useSelector((state) => state.locations.data);
  useEffect(() => {
    async function getLocations() {}
    if (locations.length === 0 && !requestSuccess) {
      getLocations();
    }
  }, [locations, requestSuccess]);

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

  const [manageJob, setManageJob] = useManageResource(
    'jobs',
    'edit',
    deleteJobById
  );

  const [lazyParams, setLazyParams] = useLazyParams(
    firstRow,
    currentPage,
    getJobs,
    setCurrentPage
  );

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
        manage={setManageJob}
        params={lazyParams}
        setParams={setLazyParams}
        loading={loading}
        totalRecords={totalRecords}
        setFirst={setFirst}
      />
      <Toast ref={toast} />
    </div>
  );
}

export default ManageJobs;
