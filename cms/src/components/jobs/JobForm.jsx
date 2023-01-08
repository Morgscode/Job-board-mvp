import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';
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
  const defaultValues = {...values};
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues,
    values,
  });

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
      if (props.reset) {
        reset(defaultValues);
      }
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
      className="flex w-full p-6 border-solid border-round border-1 border-gray-50 flex-column shadow-1"
      onSubmit={handleSubmit(submit)}
    >
      <div className="mb-6 field-checkbox">
        <Controller
          name="active"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <React.Fragment>
              <Checkbox
                inputId={field.name}
                value={field.value}
                checked={field.value}
                trueValue={1}
                falseValue={0}
                className={classNames({ 'p-invalid': fieldState.invalid })}
                onChange={(e) => field.onChange(e.checked ? 1 : 0)}
              />
              <label className="inline-block ml-3" htmlFor="active">
                Make this job posting active
              </label>
            </React.Fragment>
          )}
        />
      </div>
      <div className="mb-4 formgrid gird">
        <div className="flex field flex-column">
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
      <div className="mb-2 formgrid grid">
        <div className="flex field col flex-column">
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
        <div className="flex field col flex-column">
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
        <div className="flex field col flex-column">
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
      </div>
      <div className="mb-4 formgrid grid">
        <div className="flex col field flex-column">
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
        <div className="flex col field flex-column">
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
      <div className="pb-4 mb-4 formgrid grid">
        <div className="flex w-full field flex-column">
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
      <div className="mb-2 formgrid grid">
        <div className="flex w-full field flex-column">
          <label htmlFor="application-deadline">Application deadline</label>
          <Controller
            name="deadline"
            control={control}
            rules={{ required: 'You need to set a deadline for applications' }}
            render={({ field, fieldState }) => (
              <Calendar
                id="application-deadline"
                value={field.value}
                viewDate={field.value}
                onChange={(e) =>
                  field.onChange(moment(e.value).format('YYYY-MM-DD'))
                }
                className={classNames({ 'p-invalid': fieldState.invalid })}
                dateFormat="dd/mm/yy"
                showIcon
                placeholder={moment(field.value).format('DD/MM/YYYY')}
              />
            )}
          />
          {getFormErrorMessage('deadline')}
        </div>
      </div>
      <div className="mb-2 formgrid grid">
        <div className="flex w-full field flex-column">
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
