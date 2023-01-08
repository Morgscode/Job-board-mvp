import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

function JobApplicationStatus(props) {
  const values = { ...props.application };
  const { control, reset, handleSubmit } = useForm({
    defaultValues: values,
    values,
  });

  useEffect(() => {
    if (Object.keys(values).length === 0) {
      reset(values);
    }
  }, [values]);

  return (
    <form className="flex field col flex-column" onSubmit={handleSubmit(props.handleStatusChange)}>
      <label htmlFor="application-status">Current Application Status</label>
      <div className="p-inputgroup">
        <Controller
          name="job_application_status_id"
          control={control}
          render={({ field }) => (
            <React.Fragment>
              <Dropdown
                {...field}
                id="application-status"
                options={props.statuses}
                optionLabel="name"
                optionValue="id"
              />
              <Button
                label="Update status"
                loading={props.loading}
                loadingIcon="pi pi-spinner"
              />
            </React.Fragment>
          )}
        />
      </div>
    </form>
  );
}

export default JobApplicationStatus;
