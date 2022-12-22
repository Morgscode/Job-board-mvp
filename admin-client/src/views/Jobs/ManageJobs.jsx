import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setJobs } from '../../store/features/jobSlice';
import { setContractTypes } from '../../store/features/employmentContractTypeSlice';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import jobService from '../../services/jobService';
import employmentContractTypeService from '../../services/employmentContractTypeService';
import JobLister from '../../components/jobs/JobLister';

// bring in toast for ajax success/error

// fix api to only allow certain query terms

function ManageJobs() {
  const jobs = useSelector((state) => state.jobs.data);
  const contractTypes = useSelector((state) => state.employmentContractTypes.data);
  const [manageJob, setManageJob] = useState({ action: null, data: null });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function getJobs() {
    const jobData = await jobService.index();
    const { jobs } = jobData.data.data;
    dispatch(setJobs(jobs));
  }
  useEffect(() => {
    if (jobs.length === 0) {
      getJobs();
    }
  }, [jobs]);

  async function deleteJobs(jobs) {
    console.log(jobs);
  }

  async function getContractTypes() {
    const contractTypesData = await employmentContractTypeService.index();
    const { contractTypes } = contractTypesData.data.data;
    dispatch(setContractTypes(contractTypes));
  }

  useEffect(() => {
    if (contractTypes.length === 0) {
      getContractTypes();
    }
  }, [contractTypes]);

  useEffect(() => {
    if (manageJob.action && manageJob.data) {
      if (manageJob.action === 'edit') {
        navigate(`/jobs/${manageJob.data.id}/edit`);
      } else if (manageJob.action === 'delete') {
        deleteJobs(manageJob.data);
      }
    }
    return 
  }, [manageJob]); 

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
      <JobLister jobs={jobs} contractTypes={contractTypes} manage={setManageJob} />
    </div>
  );
}

export default ManageJobs;
