import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { classNames } from 'primereact/utils';

function JobForm(props) {
  const values = props.formData;
  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: values,
    values,
  });

  console.log(props);

  useEffect(() => {
    if (!isDirty) {
      reset(values);
    }
  }, [values, isDirty]);

  const editorControls = [
    'bold',
    'italic',
    'link',
    'underline',
    'list',
    'code-block',
  ];

  function getFormErrorMessage(name) {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  }

  async function submit(form) {
    try {
      await props.submit(form);
    } catch (error) {
      console.error(error);
    }
  }

  const editorHeader = (
    <React.Fragment>
      <span className="ql-formats">
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
        <button className="ql-link" aria-label="Link"></button>
        <button className="ql-list" value="bullet" aria-label="List"></button>
        <button className="ql-list" value="ordered" aria-label="List"></button>
        <button className="ql-code-block" aria-label="Code Block"></button>
        <button className="ql-clean" aria-label="Remove Styles"></button>
      </span>
    </React.Fragment>
  );

  return (
    <form
      className="border-round border-solid border-1 border-gray-50 w-full flex flex-column p-6  shadow-1"
      onSubmit={handleSubmit(submit)}
    >
      <h5>Make this job posting active</h5>
      <div className="field-checkbox">
        <Controller
          name="active"
          control={control}
          render={({ field, fieldState }) => (
            <Checkbox
              id="active"
              value={field.value}
              checked={field.value}
              onChange={(e) => field.onChange(e.checked ? 1 : 0)}
              trueValue={1}
              falseValue={0}
            />
          )}
        />
        <label htmlFor="binary">Remember Me</label>
      </div>
      <div className="formgrid gird mb-4">
        <div className="field flex flex-column">
          <label htmlFor="title">Job Title</label>
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Job title is required' }}
            render={({ field, fieldState }) => (
              <InputText
                {...field}
                id="title"
                autoFocus
                className={classNames({ 'p-invalid': fieldState.invalid })}
              />
            )}
          />
          {getFormErrorMessage('title')}
        </div>
      </div>
      <div className="formgrid grid mb-2">
        <div className="field col flex flex-column">
          <label htmlFor="salary">Salary</label>
          <Controller
            name="salary"
            control={control}
            rules={{ required: 'Salary is required' }}
            render={({ field, fieldState }) => (
              <InputNumber
                id="salary"
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                className={classNames({ 'p-invalid': fieldState.invalid })}
                mode="currency"
                currency="GBP"
                locale="en-GB"
              />
            )}
          />
          {getFormErrorMessage('salary')}
        </div>
        <div className="field col flex flex-column">
          <label htmlFor="salary-type">Salary Type</label>
          <Controller
            name="salary_type_id"
            control={control}
            rules={{ required: 'Salary Type is required' }}
            render={({ field, fieldState }) => (
              <Dropdown
                {...field}
                id="salary-type"
                className={classNames({ 'p-invalid': fieldState.invalid })}
                options={props.salaryTypes}
                optionLabel="name"
                optionValue="id"
              />
            )}
          />
          {getFormErrorMessage('salaryType')}
        </div>
        <div className="field col flex flex-column">
          <label htmlFor="contract-type">Contract Type</label>
          <Controller
            name="employment_contract_type_id"
            control={control}
            rules={{ required: 'Contract Type is required' }}
            render={({ field, fieldState }) => (
              <Dropdown
                {...field}
                id="contract-type"
                className={classNames({ 'p-invalid': fieldState.invalid })}
                options={props.contractTypes}
                optionLabel="name"
                optionValue="id"
              />
            )}
          />
          {getFormErrorMessage('salaryType')}
        </div>
      </div>
      <div className="formgrid grid mb-4">
        <div className="col field flex flex-column">
          <label htmlFor="locations-select" className="block">
            Locations
          </label>
          <Controller
            name="locations"
            control={control}
            rules={{ required: 'At least 1 location is required' }}
            render={({ field, fieldState }) => (
              <MultiSelect
                optionValue="id"
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                className={classNames({ 'p-invalid': fieldState.invalid })}
                id="locations-select"
                options={props.locations}
                optionLabel="name"
              />
            )}
          />
          {getFormErrorMessage('locations')}
        </div>
        <div className="col field flex flex-column">
          <label htmlFor="categories-select" className="block">
            Job Categories
          </label>
          <Controller
            name="categories"
            control={control}
            rules={{ required: 'At least 1 category is required' }}
            render={({ field, fieldState }) => (
              <MultiSelect
                id="categories-select"
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                className={classNames({ 'p-invalid': fieldState.invalid })}
                options={props.categories}
                optionLabel="name"
                optionValue="id"
              />
            )}
          />
          {getFormErrorMessage('categories')}
        </div>
      </div>
      <div className="formgrid grid mb-4 pb-4">
        <div className="field flex flex-column w-full">
          <label htmlFor="job-description">Job Description</label>
          <Controller
            name="description"
            control={control}
            rules={{ required: 'You need to set a job description' }}
            render={({ field, fieldState }) => (
              <Editor
                id="job-description"
                value={field.value}
                onTextChange={(e) => field.onChange(e.htmlValue)}
                className={classNames({ 'p-invalid': fieldState.invalid })}
                style={{ minHeight: '250px' }}
                formats={editorControls}
                headerTemplate={editorHeader}
              />
            )}
          />
          {getFormErrorMessage('description')}
        </div>
      </div>
      <div className="formgrid grid mb-2">
        <div className="field flex flex-column w-full">
          <label htmlFor="application-deadline">Application deadline</label>
          <Controller
            name="deadline"
            control={control}
            rules={{ required: 'You need to set a deadline for applications' }}
            render={({ field, fieldState }) => (
              <Calendar
                id="application-deadline"
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                className={classNames({ 'p-invalid': fieldState.invalid })}
                dateFormat="yy/mm/dd"
                showIcon
                placeholder={field.value}
              />
            )}
          />
          {getFormErrorMessage('deadline')}
        </div>
      </div>
      <div className="formgrid grid mb-2">
        <div className="field flex flex-column w-full">
          <Button
            label="Submit"
            loading={props.loading}
            loadingIcon="pi pi-spinner"
          />
        </div>
      </div>
    </form>
  );
}

export default JobForm;
