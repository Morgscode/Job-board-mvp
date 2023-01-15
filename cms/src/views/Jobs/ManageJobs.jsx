import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
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
import { Column } from 'primereact/column';
import Lister from '../../components/Lister';
import useManageResource from '../../utils/manageResource';
import useLazyParams from '../../utils/lazyParams';

function ManageJobs() {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const totalRecords = useSelector((state) => state.jobs.totalRecords);
  const currentPage = useSelector((state) => state.jobs.page);
  const firstRow = useSelector((state) => state.jobs.firstRow);
  const [manageJob, setManageJob] = useManageResource(
    'jobs',
    'edit',
    deleteJobById
  );

  const [lazyParams, setLazyParams] = useLazyParams(
    firstRow,
    10,
    currentPage,
    getJobs,
    setCurrentPage
  );

  function setFirst(row) {
    dispatch(setFirstRow(row));
  }

  function setCurrentPage(page) {
    dispatch(setPage(page));
  }

  async function getJobs(params) {
    try {
      setLoading(true);
      const { jobs, totalRecords } = await jobService.index(
        `page=${params.page}&limit=${params.rows}`
      );
      if (jobs instanceof Array) {
        dispatch(setJobs(jobs));
        dispatch(setTotalRecords(totalRecords));
        setRequestSuccess(true);
      }
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
      getJobs(lazyParams);
    }
  }, [jobs, requestSuccess, lazyParams]);

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

  function formatCreatedDate(data) {
    return moment(data.createdAt).format('DD-MM-YYYY');
  }

  function formateDeadline(data) {
    return moment(data.deadline).format('DD-MM-YYYY');
  }

  function formatActive(data) {
    return data.active == 0 ? 'Hidden' : 'Active';
  }

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

  const columns = [
    { field: 'title', header: 'Job title', filter: true, body: false },
    { field: 'active', header: 'Status', filter: true, body: formatActive },
    { field: 'createdAt', header: 'Post date', filter: true, body: formatCreatedDate },
    { field: 'deadline', header: 'Closing date', filter: true, body: formateDeadline },
  ];

  const dataColumns = columns.map((col, i) => {
    return <Column key={i} field={col.field} filter={col.filter} header={col.header} body={col.body} />;
  });

  return (
    <div>
      <Toolbar className="mb-5" right={actions} />
      <Lister
        resourceName="Jobs"
        data={jobs}
        dataColumns={dataColumns}
        manage={setManageJob}
        selectedResources={selectedJobs}
        setSelectedResources={setSelectedJobs}
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
