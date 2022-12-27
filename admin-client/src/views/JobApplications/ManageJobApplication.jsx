import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import jobApplicationService from '../../services/jobApplicationService';
import jobApplicationStatusService from '../../services/jobApplicationStatusService';
import jobService from '../../services/jobService';
import userService from '../../services/userService';
import uploadService from '../../services/uploadService';
import { updateApplication } from '../../store/features/jobApplicationSlice';
import { setStatuses } from '../../store/features/jobApplicationStatusSlice';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import JobApplicationDetails from '../../components/job-applications/JobApplicationDetails';
import UserDetails from '../../components/users/UserDetails';

function ManageJobApplication() {
  const { id } = useParams();
  const toast = useRef(null);
  const dispatch = useDispatch();

  const [application, setApplication] = useState(null);
  useEffect(() => {
    async function getApplication(id) {
      const application = await jobApplicationService.find(id);
      setApplication(application);
    }
    if (!application) {
      getApplication(id);
    }
  }, [application]);

  const statuses = useSelector((state) => state.jobApplicationStatuses.data);
  useEffect(() => {
    async function getStatuses() {
      const statuses = await jobApplicationStatusService.index();
      dispatch(setStatuses(statuses));
    }
    if (statuses.length === 0) {
      getStatuses();
    }
  }, [statuses]);

  const [user, setUser] = useState(null);
  useEffect(() => {
    async function getUser(id) {
      const user = await userService.find(id);
      setUser(user);
    }
    if (!user && application) {
      getUser(application.user_id);
    }
  }, [user, application]);

  const [job, setJob] = useState(null);
  useEffect(() => {
    async function getJob() {
      const job = await jobService.find(application.job_id);
      setJob(job);
    }
    if (!job && application) {
      getJob(application.job_id);
    }
  }, [job, application]);

  const [cv, setCv] = useState(null);
  useEffect(() => {
    async function getCV(id) {
      const cv = await uploadService.find(application.cv_id);
      setCv(cv);
    }
    if (!cv && application) {
      getCV(application.cv_id);
    }
  }, [cv, application]);

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

  return (
    <div>
      <h1 className="font-normal">Manage job application</h1>
      <div className="border-round border-solid border-1 border-gray-50 w-full flex flex-column p-6 shadow-1">
        {/* <Toolbar className="mb-5" right={actions} /> */}
        <h2 className="font-normal">Application Details</h2>
        <UserDetails user={user} disabled />
        <JobApplicationDetails application={application} job={job} cv={cv} />
        <Toast ref={toast} />
      </div>
    </div>
  );
}

export default ManageJobApplication;
