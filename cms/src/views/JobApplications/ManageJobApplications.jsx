import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import jobApplicationService from '../../services/jobApplicationService';
import jobApplicationStatusService from '../../services/jobApplicationStatusService';
import jobService from '../../services/jobService';
import userService from '../../services/userService';
import {
  setApplications,
  deleteApplication,
  setPage,
  setFirstRow,
  setTotalRecords,
} from '../../store/features/jobApplicationSlice';
import { setStatuses } from '../../store/features/jobApplicationStatusSlice';
import { setJobs } from '../../store/features/jobSlice';
import { setUsers } from '../../store/features/userSlice';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import Lister from '../../components/Lister';
import useManageResource from '../../utils/manageResource';
import useLazyParams from '../../utils/lazyParams';

function ManageJobApplications() {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const totalRecords = useSelector((state) => state.users.totalRecords);
  const currentPage = useSelector((state) => state.users.page);
  const firstRow = useSelector((state) => state.users.firstRow);

  const [lazyParams, setLazyParams] = useLazyParams(
    firstRow,
    10,
    currentPage,
    getApplications,
    setCurrentPage
  );

  function setFirst(row) {
    dispatch(setFirstRow(row));
  }

  function setCurrentPage(page) {
    dispatch(setPage(page));
  }

  async function getApplications(params) {
    try {
      setLoading(true);
      const { applications, totalRecords } = await jobApplicationService.index(
        `page=${params.page}&limit=${params.rows}`
      );
      if (applications instanceof Array) {
        dispatch(setApplications(applications));
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

  const applications = useSelector((state) => state.jobApplications.data);
  useEffect(() => {
    if (applications.length === 0 && !requestSuccess) {
      getApplications(lazyParams);
    }
  }, [applications, requestSuccess, lazyParams]);

  const statuses = useSelector((state) => state.jobApplicationStatuses.data);
  useEffect(() => {
    async function getStatuses() {
      const { statuses } = await jobApplicationStatusService.index();
      dispatch(setStatuses(statuses));
    }
    if (statuses.length === 0) {
      getStatuses();
    }
  }, [statuses]);

  const users = useSelector((state) => state.users.data);
  useEffect(() => {
    async function getUsers() {
      const { users } = await userService.index();
      dispatch(setUsers(users));
    }
    if (users.length === 0) {
      getUsers();
    }
  }, [users]);

  const jobs = useSelector((state) => state.jobs.data);
  useEffect(() => {
    async function getJobs() {
      const { jobs } = await jobService.index();
      dispatch(setJobs(jobs));
    }
    if (jobs.length === 0) {
      getJobs();
    }
  }, [jobs]);

  async function deleteApplicationById(job) {
    try {
      await jobApplicationService.delete(job.id);
      dispatch(deleteApplication(job.id));
      toast.current.show({
        severity: 'success',
        summary: 'Job application deleted',
      });
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'There was a problem deleting that job application',
      });
    }
  }

  const [manageApplication, setManageApplication] = useManageResource(
    'job-applications',
    'manage',
    deleteApplicationById
  );

  const actions = (
    <React.Fragment>
      <Button
        label="New"
        icon="pi pi-plus"
        className="mr-2"
        onClick={() => console.log('bulk updates', selectedApplications)}
      />
    </React.Fragment>
  );

  const formatApplicationDate = (options) =>
    moment(options.createdAt).format('L');

  const formatStatus = (options) => {
    const status =
      statuses.length && statuses.find(
        (status) => status.id === options.job_application_status_id
      ) || false;
    return status?.name || 'Loading...';
  };

  const formatApplicantName = (options) => {
    const user = users.length && users.find((user) => user.id === options.user_id) || false;
    return user
      ? `${user?.title} ${user?.first_name} ${user?.surname}`
      : 'Loading...';
  };

  const formatJobTitle = (options) => {
    const job = jobs.length && jobs.find((job) => job.id === options.job_id) || false;
    return job ? job.title : 'Loading...';
  };

  const columns = [
    {
      field: 'job_application_status_id',
      header: 'Status',
      filter: false,
      body: formatStatus,
    },
    {
      field: 'job_id',
      header: 'Job title',
      filter: true,
      body: formatJobTitle,
    },
    {
      field: 'user_id',
      header: 'Applicant name',
      filter: true,
      body: formatApplicantName,
    },
    {
      field: 'createdAt',
      header: 'Application date',
      filter: true,
      body: formatApplicationDate,
    },
  ];

  const dataColumns = columns.map((col, i) => {
    return (
      <Column
        key={i}
        field={col.field}
        filter={col.filter}
        header={col.header}
        body={col.body}
      />
    );
  });

  return (
    <div>
      {/* <Toolbar className="mb-5" right={actions} /> */}
      <Lister
        resourceName="Users"
        data={applications}
        dataColumns={dataColumns}
        manage={setManageApplication}
        selectedResources={selectedApplications}
        setSelectedResources={setSelectedApplications}
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

export default ManageJobApplications;
