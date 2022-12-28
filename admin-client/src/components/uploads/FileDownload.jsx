import React, { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import uploadService from '../../services/uploadService';
import { Toast } from 'primereact/toast';

function FileDownload(props) {
  const anchor = useRef(null);
  const [url, setUrl] = useState('');
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

  async function download(download) {
    download.preventDefault();
    try {
      setLoading(true);
      const { data } = await uploadService.download(props.file.id)
      const url = URL.createObjectURL(
        new Blob([data], { type: props.file.mimetype })
      );
      setUrl(url);
      setTimeout(() => {
        anchor.current?.click();
      }, 500)
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'There was a problem downloading the file',
      });
    } finally {
      setLoading(false);
    }
  }

  if (props.buttonOnly) {
    return (
      <React.Fragment>
        <Button
          label="Download"
          onClick={download}
        />
        <a
          ref={anchor}
          href={url}
          download={props?.file?.title || ''}
          className="hidden"
        ></a>
        <Toast />
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <div className="formgrid grid">
          <div className="field col flex flex-column w-full">
            <label htmlFor="cv-title">{props.label || 'Upload'}</label>
            <div className="p-inputgroup">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <InputText id="cv-title" value={field.value || ''} disabled />
                )}
              />
              <Button
                onClick={download}
                label="Download"
              />
              <a
                ref={anchor}
                href={url}
                download={props?.file?.title || ''}
                className="hidden"
              ></a>
            </div>
          </div>
        </div>
        <Toast />
      </React.Fragment>
    );
  }
}

export default FileDownload;
