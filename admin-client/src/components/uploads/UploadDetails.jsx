import React, { useEffect } from 'react';
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
      <div className="formgrid grid mb-4 pb-4">
        <div className="field col flex flex-column w-full">
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
        <div className="field col flex flex-column w-full">
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
      <div className="formgrid grid mb-4 pb-4">
        <div className="field col flex flex-column w-full">
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
        <div className="field col flex flex-column w-full">
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
    </React.Fragment>
  );
}

export default UploadDetails;
