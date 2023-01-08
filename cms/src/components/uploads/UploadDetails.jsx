import React, { useEffect } from 'react';
import moment from 'moment';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';

function UploadDetails(props) {
  const values = props.upload;
  const {
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: values,
    values,
  });

  useEffect(() => {
    if (!isDirty) {
      reset(values);
    }
  }, [values, isDirty]);

  function getFormErrorMessage(name) {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  }

  return (
    <React.Fragment>
      <div className="formgrid grid">
        <div className="flex w-full field col flex-column">
          <label htmlFor="title">File nicename</label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <InputText
                id="title"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.value)}
                disabled={props.disabled}
              />
            )}
          />
          {getFormErrorMessage('title')}
        </div>
        <div className="flex w-full field col flex-column">
          <label htmlFor="name">Filesystem name</label>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <InputText
                id="name"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.value)}
                disabled={props.disabled}
              />
            )}
          />
          {getFormErrorMessage('name')}
        </div>
      </div>
      <div className="formgrid grid">
        <div className="flex w-full field col flex-column">
          <label htmlFor="location">Location</label>
          <Controller
            name="path"
            control={control}
            render={({ field }) => (
              <InputText
                id="location"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.value)}
                disabled={props.disabled}
              />
            )}
          />
          {getFormErrorMessage('path')}
        </div>
        <div className="flex w-full field col flex-column">
          <label htmlFor="mimetype">File mimetype</label>
          <Controller
            name="mimetype"
            control={control}
            render={({ field }) => (
              <InputText
                id="mimetype"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.value)}
                disabled={props.disabled}
              />
            )}
          />
          {getFormErrorMessage('mimetype')}
        </div>
      </div>
      <div className="formgrid grid">
        <div className="flex w-full field col flex-column">
          <label htmlFor="upload-date">Upload date</label>
          <Controller
            name="createdAt"
            control={control}
            render={({ field }) => (
              <InputText
                id="upload-date"
                value={moment(field.value).format('DD-MM-YYYY H:M:SS') || ''}
                onChange={(e) => field.onChange(e.value)}
                disabled={props.disabled}
              />
            )}
          />
          {getFormErrorMessage('createdAt')}
        </div>
        <div className="flex w-full field col flex-column">
          <label htmlFor="last-updated">last modified</label>
          <Controller
            name="updatedAt"
            control={control}
            render={({ field }) => (
              <InputText
                id="last-updated"
                value={moment(field.value).format('DD-MM-YYYY H:M:SS') || ''}
                onChange={(e) => field.onChange(e.value)}
                disabled={props.disabled}
              />
            )}
          />
          {getFormErrorMessage('updatedAt')}
        </div>
      </div>
    </React.Fragment>
  );
}

export default UploadDetails;
