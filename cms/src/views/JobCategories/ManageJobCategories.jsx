import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jobCategoryService from '../../services/jobCategoryService';
import {
  deleteCategory,
  setCategories,
  setPage,
  setFirstRow,
  setTotalRecords,
} from '../../store/features/jobCategorySlice';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import Lister from '../../components/Lister';
import useManageResource from '../../utils/manageResource';
import useLazyParams from '../../utils/lazyParams';

function ManageJobCategories() {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const totalRecords = useSelector((state) => state.jobCategories.totalRecords);
  const currentPage = useSelector((state) => state.jobCategories.page);
  const firstRow = useSelector((state) => state.jobCategories.firstRow);
  const [manageCategory, setManageCategory] = useManageResource(
    'job-categories',
    'edit',
    deleteCategoryById
  );
  const [lazyParams, setLazyParams] = useLazyParams(
    firstRow,
    10,
    currentPage,
    getCategories,
    setCurrentPage
  );

  function setFirst(row) {
    dispatch(setFirstRow(row));
  }

  function setCurrentPage(page) {
    dispatch(setPage(page));
  }

  async function getCategories(params) {
    try {
      setLoading(true);
      const { categories, totalRecords } = await jobCategoryService.index(
        `page=${params.page}&limit=${params.rows}`
      );
      if (categories instanceof Array) {
        dispatch(setCategories(categories));
        dispatch(setTotalRecords(totalRecords));
      }
      setRequestSuccess(true);
    } catch (error) {
      setRequestSuccess(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const categories = useSelector((state) => state.jobCategories.data);
  useEffect(() => {
    if (categories.length === 0 && !requestSuccess) {
      getCategories(lazyParams);
    }
  }, [categories, requestSuccess]);

  const jobs = useSelector((state) => state.jobs.data);
  useEffect(() => {
    async function getJobs() {}
    if (jobs.length === 0 && !requestSuccess) {
      getJobs();
    }
  }, [jobs, requestSuccess]);

  async function deleteCategoryById(job) {
    try {
      await jobCategoryService.delete(job.id);
      dispatch(deleteCategory(job.id));
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

  const actions = (
    <React.Fragment>
      <Button
        label="New"
        icon="pi pi-plus"
        className="mr-2"
        onClick={() => navigate('/job-categories/create')}
      />
    </React.Fragment>
  );

  const columns = [
    { field: 'name', header: 'Job Category name', filter: true },
  ];

  const dataColumns = columns.map((col, i) => {
    return <Column key={i} field={col.field} filter={col.filter} header={col.header} />;
  });

  return (
    <div>
      <Toolbar className="mb-5" right={actions} />
      <Lister
        resourceName="Locations"
        data={categories}
        dataColumns={dataColumns}
        manage={setManageCategory}
        selectedResources={selectedCategories}
        setSelectedResources={setSelectedCategories}
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

export default ManageJobCategories;
