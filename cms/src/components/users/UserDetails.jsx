import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';

function UserDetails(props) {
  const values = props.user;
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
          <label htmlFor="title">Title</label>
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
          <label htmlFor="surname">Surname</label>
          <Controller
            name="surname"
            control={control}
            render={({ field, fieldState }) => (
              <InputText
                id="surname"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.value)}
                disabled={props.disabled}
              />
            )}
          />
          {getFormErrorMessage('surname')}
        </div>
      </div>
      <div className="formgrid grid mb-4 pb-4">
        <div className="field col flex flex-column w-full">
          <label htmlFor="first-name">First Name</label>
          <Controller
            name="first_name"
            control={control}
            render={({ field }) => (
              <InputText
                id="first-name"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.value)}
                disabled={props.disabled}
              />
            )}
          />
          {getFormErrorMessage('first_name')}
        </div>
        <div className="field col flex flex-column w-full">
          <label htmlFor="middle-names">Middle Names</label>
          <Controller
            name="middle_names"
            control={control}
            render={({ field }) => (
              <InputText
                id="middle-names"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.value)}
                disabled={props.disabled}
              />
            )}
          />
          {getFormErrorMessage('middle_names')}
        </div>
      </div>
      <div className="formgrid grid mb-4 pb-4">
        <div className="field col flex flex-column w-full">
          <label htmlFor="email">Email</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <InputText
                id="email"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.value)}
                disabled={props.disabled}
              />
            )}
          />
          {getFormErrorMessage('email')}
        </div>
      </div>
    </React.Fragment>
  );
}

export default UserDetails;
