import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import uploadService from '../../services/uploadService';
import {
  setUploads,
  deleteUpload,
  setPage,
  setFirstRow,
  setTotalRecords,
} from '../../store/features/uploadSlice';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import Lister from '../../components/Lister';
import useManageResource from '../../utils/manageResource';
import useLazyParams from '../../utils/lazyParams';
import FileDownload from '../../components/uploads/FileDownload';

function ManageUploads() {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [selectedUploads, setSelectedUploads] = useState([]);
  const totalRecords = useSelector((state) => state.users.totalRecords);
  const currentPage = useSelector((state) => state.users.page);
  const firstRow = useSelector((state) => state.users.firstRow);

  const [lazyParams, setLazyParams] = useLazyParams(
    firstRow,
    10,
    currentPage,
    getUploads,
    setCurrentPage
  );

  function setFirst(row) {
    dispatch(setFirstRow(row));
  }

  function setCurrentPage(page) {
    dispatch(setPage(page));
  }
  
  const loggedInUser = useSelector((state) => state.auth.loggedInUser);
  useEffect(() => {
    if (loggedInUser.role !== 3) {
      navigate('/dashboard');
    }
  }, [loggedInUser]);

  async function getUploads(params) {
    try {
      setLoading(true)
      const { uploads, totalRecords } = await uploadService.index(`page=${params.page}&limit=${params.rows}`);
      if (uploads instanceof Array) {
        dispatch(setUploads(uploads));
        dispatch(setTotalRecords(totalRecords));
        setRequestSuccess(true);
      }
    } catch (error) {
      console.error(error);
      setRequestSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  const uploads = useSelector((state) => state.uploads.data);
  useEffect(() => {
    if (uploads.length === 0 && !requestSuccess) {
      getUploads(lazyParams);
    }
  }, [uploads, requestSuccess, lazyParams]);

  async function deleteUploadById(job) {
    try {
      await uploadService.delete(job.id);
      dispatch(deleteUpload(job.id));
      toast.current.show({
        severity: 'success',
        summary: 'Upload deleted',
      });
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'There was a problem deleting that upload',
      });
    }
  }

  const [manageUpload, setManageUpload] = useManageResource(
    'uploads',
    'manage',
    deleteUploadById
  );

  const actions = (
    <React.Fragment>
      <Button
        label="New"
        icon="pi pi-plus"
        className="mr-2"
        onClick={() => navigate('/uploads/create')}
      />
    </React.Fragment>
  );

  function formatUploadDate(data) {
    return moment(data.createdAt).format('DD-MM-YYYY H:M:SS')
  }

  const downloadTemplate = (options) => {
    return (
      <FileDownload file={options} buttonOnly />
    );
  }

  const columns = [
    { field: 'title', header: 'Name', filter: true },
    { field: 'mimetype', header: 'File type', filter: true },
    { field: 'createdAt', header: 'Uploaded at', filter: true, body: formatUploadDate },
    { field: '', header: '', filter: false, body: downloadTemplate },
  ];

  const dataColumns = columns.map((col, i) => {
    return <Column key={i} field={col.field} filter={col.filter} header={col.header} body={col.body} />;
  });

  return (
    <div>
      <Toolbar className="mb-5" right={actions} />
      <Lister
        resourceName="Uploads"
        data={uploads}
        dataColumns={dataColumns}
        manage={setManageUpload}
        selectedResources={selectedUploads}
        setSelectedResources={setSelectedUploads}
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

export default ManageUploads;
