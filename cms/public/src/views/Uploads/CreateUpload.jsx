import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import FileUploader from '../../components/uploads/FileUploader';
import { addUpload } from '../../store/features/uploadSlice';
import uploadService from '../../services/uploadService';
import { Toast } from 'primereact/toast';

function CreateUpload() {
  const toast = useRef(null);
  const dispatch = useDispatch();

  async function upload(upload) {
    try {
      const data = new FormData();
      upload.files.forEach((file) => data.append('uploads', file));
      const uploads = await uploadService.create(data);
      uploads.forEach((upload) => dispatch(addUpload(upload)));
      toast.current.show({ severity: 'success', detail: 'Files Uploaded' });
      upload.options.clear();
    } catch (error) {
      toast.current.show({
        severity: 'error',
        detail: 'There was a problem uploading the files',
      });
    }
  }

  return (
    <React.Fragment>
      <FileUploader upload={upload} />
      <Toast ref={toast} />
    </React.Fragment>
  );
}

export default CreateUpload;
