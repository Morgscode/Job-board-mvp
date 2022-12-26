import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jobApplicationService from '../../services/jobApplicationService';
import {
  setApplications,
  deleteApplication,
} from '../../store/features/jobApplicationSlice';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import JobApplicationLister from '../../components/job-applications/JobApplicationLister';

// applications

// statuses

// jobs

// users

function ManageJobApplications() {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedApplications, setSelectedApplications] = useState([]);

  const applications = useSelector((state) => state.jobApplications.data);
  useEffect(() => {
    async function getApplications() {
      const applications = await jobApplicationService.index();
      dispatch(setApplications(applications));
    }
    if (applications.length === 0) {
      getApplications();
    }
  }, [applications]);

  const [manageApplication, setManageApplication] = useState({
    action: null,
    data: null,
  });
  useEffect(() => {
    async function deleteApplicationById(job) {
      try {
        await jobApplicationService.delete(job.id);
        dispatch(deleteApplication(job.id));
        toast.current.show({
          severity: 'success',
          summary: 'Job category deleted',
        });
      } catch (error) {
        toast.current.show({
          severity: 'error',
          summary: 'There was a problem deleting that job category',
        });
      }
    }
    if (manageApplication.action && manageApplication.data) {
      if (manageApplication.action === 'edit') {
        navigate(`/job-applications/${manageApplication.data.id}/edit`);
      } else if (manageApplication.action === 'delete') {
        deleteApplicationById(manageApplication.data);
      }
    }
    return;
  }, [manageApplication]);

  const actions = (
    <React.Fragment>
      <Button
        label="New"
        icon="pi pi-plus"
        className="mr-2"
        onClick={() => console.log('bulk status update', selectedApplications)}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Toolbar className="mb-5" right={actions} />
      <JobApplicationLister
        applications={applications}
        manage={setManageApplication}
        selectedApplications={selectedApplications}
        setSelectedApplications={setSelectedApplications}
      />
      <Toast ref={toast} />
    </div>
  );
}

export default ManageJobApplications;
