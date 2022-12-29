import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';

function UserForm(props) {
  const values = props.formData;
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: values,
    values,
  });

  useEffect(() => {
    console.log(values);
    if (!isDirty) {
      reset(values);
    }
  }, [values, isDirty]);

  function getFormErrorMessage(name) {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  }

  const userRoles = [
    {
      name: 'Job board user (job seeker)',
      id: 1,
    },
    {
      name: 'Job board recruiter',
      id: 2,
    },
    {
      name: 'Job board admin',
      id: 3,
    }
  ];

  return (
    <div>
      <h1 className="font-normal">Create user</h1>
      <form
        onSubmit={handleSubmit(props.submit)}
        className="border-round border-solid border-1 border-gray-50 w-full flex flex-column p-6 shadow-1"
      >
        <div className="formgrid grid mb-4 pb-4">
          <div className="field col flex flex-column w-full">
            <label htmlFor="title">Title</label>
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Title is required.' }}
              render={({ field, fieldState }) => (
                <InputText
                  id="title"
                  {...field}
                  className={classNames({ 'p-invalid': fieldState.invalid })}
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
              rules={{ required: 'Surname is required.' }}
              render={({ field, fieldState }) => (
                <InputText
                  id="surname"
                  {...field}
                  className={classNames({ 'p-invalid': fieldState.invalid })}
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
              rules={{ required: 'First is required.' }}
              render={({ field, fieldState }) => (
                <InputText
                  id="first-name"
                  {...field}
                  className={classNames({ 'p-invalid': fieldState.invalid })}
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
              render={({ field, fieldState }) => (
                <InputText id="middle-names" {...field} />
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
              rules={{
                required: 'Email is required.',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Invalid email address. E.g. example@email.com',
                },
              }}
              control={control}
              render={({ field, fieldState }) => (
                <InputText
                  id="email"
                  {...field}
                  className={classNames({ 'p-invalid': fieldState.invalid })}
                />
              )}
            />
            {getFormErrorMessage('email')}
          </div>
          <div className="field col flex flex-column">
          <label htmlFor="user-role">User role</label>
          <Controller
            name="role"
            control={control}
            rules={{ required: 'User role is required' }}
            render={({ field, fieldState }) => (
              <Dropdown
                {...field}
                id="user-role"
                className={classNames({ 'p-invalid': fieldState.invalid })}
                options={userRoles}
                optionLabel="name"
                optionValue="id"
              />
            )}
          />
          {getFormErrorMessage('salaryType')}
        </div>
        </div>
        <div className="formgrid grid mb-2">
          <div className="field col flex flex-column w-full">
            <Button
              label="Submit"
              loading={props.loading}
              loadingIcon="pi pi-spinner"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default UserForm;
