import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { classNames } from 'primereact/utils';

const model = Object.freeze({
  title: '',
  salary: '0.00',
  salaryType: '',
  locations: [],
  categories: [],
  description: '<p></p>',
  deadline: null,
});

function JobForm(props) {
  const [formData, setFormData] = useState(
    props.formData || {...model}
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: formData });

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
  };

  async function submit(form) {
    try {
      await props.submit(form);
      setFormData({...model});
      console.log(formData);
    } catch (error) {
      console.error(error);
    }
  }

  const header = (
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
      <div className="formgrid gird mb-6">
        <div className="field flex flex-column">
          <label htmlFor="title">Job Title</label>
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Job title is required' }}
            render={({ field, fieldState }) => (
              <InputText
                id="title"
                {...field}
                autoFocus
                className={classNames({ 'p-invalid': fieldState.invalid })}
              />
            )}
          />
          {getFormErrorMessage('title')}
        </div>
      </div>
      <div className="formgrid grid">
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
          <label htmlFor="salaryType">Salary Type</label>
          <Controller
            name="salaryType"
            control={control}
            rules={{ required: 'Salary Type is required' }}
            render={({ field, fieldState }) => (
              <Dropdown
                {...field}
                className={classNames({ 'p-invalid': fieldState.invalid })}
                options={props.salaryTypes}
                optionLabel="name"
                optionValue="id"
                id="salaryType"
              />
            )}
          />
          {getFormErrorMessage('salaryType')}
        </div>
      </div>
      <div className="formgrid grid mb-6">
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
                value={field.value}
                className={classNames({ 'p-invalid': fieldState.invalid })}
                id="locations-select"
                options={props.locations}
                optionLabel="name"
                optionValue="id"
                onChange={(e) => field.onChange(e.value)}
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
                value={field.value}
                className={classNames({ 'p-invalid': fieldState.invalid })}
                options={props.categories}
                optionLabel="name"
                optionValue="id"
                id="categories-select"
                onChange={(e) => field.onChange(e.value)}
              />
            )}
          />
          {getFormErrorMessage('categories')}
        </div>
      </div>
      <div className="formgrid grid mb-6">
        <div className="field flex flex-column w-full">
          <label htmlFor="job-description">Job Description</label>
          <Controller
            name="description"
            control={control}
            rules={{ required: 'You need to set a job description' }}
            render={({ field, fieldState }) => (
              <Editor
                {...field}
                className={classNames({ 'p-invalid': fieldState.invalid })}
                id="job-description"
                style={{ minHeight: '250px' }}
                formats={editorControls}
                headerTemplate={header}
              />
            )}
          />
          {getFormErrorMessage('description')}
        </div>
      </div>
      <div className="formgrid grid mb-3">
        <div className="field flex flex-column w-full">
          <label htmlFor="application-deadline">Application deadline</label>
          <Controller
            name="deadline"
            control={control}
            rules={{ required: 'You need to set a deadline for applications' }}
            render={({ field, fieldState }) => (
              <Calendar
                value={field.value}
                className={classNames({ 'p-invalid': fieldState.invalid })}
                onChange={(e) => field.onChange(e.value)}
                id="application-deadline"
                dateFormat="dd/mm/yy" 
                mask="99/99/9999" 
                showIcon
              />
            )}
          />
          {getFormErrorMessage('deadline')}
        </div>
      </div>
      <Button
        label="Submit"
        loading={props.loading}
        loadingIcon="pi pi-spinner"
      />
    </form>
  );
}

export default JobForm;
