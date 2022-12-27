import React, { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import uploadService from '../../services/uploadService';
import { Toast } from 'primereact/toast';

function FileDownload(props) {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);

  const values = { ...props.file };
  const { control, reset } = useForm({
    defaultValues: values,
    values,
  });

  useEffect(() => {
    if (Object.keys(values).length === 0) {
      reset(values);
    }
  }, [values]);

  const [downloadURL, setDownloadURL] = useState(null);
  useEffect(() => {
    async function download() {
      try {
        setLoading(true);
        const { data } = await uploadService.download(props.file.id);
        const url = URL.createObjectURL(new Blob([data]));
        setDownloadURL(url);
      } catch (error) {
        toast.current.show({
          severity: 'error',
          summary: 'There was a problem downloading the file',
        });
      } finally {
        setLoading(false);
      }
    }
    if (!downloadURL && Object.keys(values).length > 0) {
      download();
    }
  }, [downloadURL, values]);
  
  return (
    <React.Fragment>
      <div className="formgrid grid">
        <div className="field col flex flex-column w-full">
          <label htmlFor="cv-title">CV Upload</label>
          <div className="p-inputgroup">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <InputText id="cv-title" value={field.value || ''} disabled />
              )}
            />
            <a href={downloadURL} download={props?.file?.title || ''} className="no-underline">
              <Button
                label="Download"
                loading={loading}
                loadingIcon="pi pi-spinner"
              />
            </a>
          </div>
        </div>
      </div>
      <Toast />
    </React.Fragment>
  );
}

export default FileDownload;
