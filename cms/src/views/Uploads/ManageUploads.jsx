import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import uploadService from '../../services/uploadService';
import { setUploads, deleteUpload } from '../../store/features/uploadSlice';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import UploadLister from '../../components/uploads/UploadLister';
import useManageResource from '../../utils/manageResource';

function ManageUploads() {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedUploads, setSelectedUploads] = useState([]);

  const uploads = useSelector((state) => state.uploads.data);
  useEffect(() => {
    async function getUploads() {
      const uploads = await uploadService.index();
      dispatch(setUploads(uploads));
    }
    if (uploads.length === 0) {
      getUploads();
    }
  }, [uploads]);

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

  return (
    <div>
      <Toolbar className="mb-5" right={actions} />
      <UploadLister
        uploads={uploads}
        manage={setManageUpload}
        selectedUploads={selectedUploads}
        setSelectedUploads={setSelectedUploads}
      />
      <Toast ref={toast} />
    </div>
  );
}

export default ManageUploads;
