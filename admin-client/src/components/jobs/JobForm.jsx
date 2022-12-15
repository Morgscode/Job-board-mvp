import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';

function JobForm(props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(props.formData || {});

  async function handleSubmit(submit) {
    submit.preventDefault();
    setLoading(true);
    console.log(submit);
    try {
      return true;
    } catch (error) {
      console.error(error);
    } finally {
      console.log('done');
      setLoading(false);
    }
  }

  const controls = ['bold', 'italic', 'link', 'underline', 'list', 'code-block', 'blockquote']

  const header = (
    <React.Fragment>
      <span className="ql-formats">
          <button className="ql-bold" aria-label="Bold"></button>
          <button className="ql-italic" aria-label="Italic"></button>
          <button className="ql-underline" aria-label="Underline"></button>
          <button className="ql-link" aria-label="Link"></button>
          <button className="ql-list" value="bullet" aria-label="List"></button>
          <button className="ql-list" value="ordered" aria-label="List"></button>
          <button className="ql-underline" aria-label="Underline"></button>
          <button className="ql-code-block" aria-label="Code Block"></button>
          <button className="ql-blockquote" aria-label="Block Quote"></button>
      </span>
    </React.Fragment>
);

  return (
    <form
      className="border-round border-solid border-1 border-gray-50 w-full flex flex-column p-6  shadow-1"
      onSubmit={handleSubmit}
    >
      <div className="formgrid gird mb-6">
        <div className="field flex flex-column">
          <label htmlFor="job-title">Job Title</label>
          <InputText id="job-title" />
        </div>
      </div>
      <div className="formgrid grid">
        <div className="field col flex flex-column">
          <label htmlFor="salary">Salary</label>
          <InputNumber value={0} mode="currency" currency="GBP" locale="en-GB" />
        </div>
        <div className="field col flex flex-column">
          <label htmlFor="salary">Salary Type</label>
          <Dropdown id="salary" options={salaryTypes} />
        </div>
      </div>
      <div className="formgrid grid mb-6">
        <div className="col field flex flex-column">
          <label htmlFor="locations-select" className="block">
            Locations
          </label>
          <MultiSelect
            id="locations-select"
            options={props.locations}
            optionLabel="name"
            optionValue="id"
          />
        </div>
        <div className="col field flex flex-column">
          <label htmlFor="categories-select" className="block">
            Job Categories
          </label>
          <MultiSelect
            options={props.categories}
            optionLabel="name"
            optionValue="id"
          />
        </div>
      </div>
      <div className="formgrid grid mb-6">
        <div className="field flex flex-column w-full">
          <label htmlFor="job-description">Job Description</label>
          <Editor id="job-description" style={{'min-height':'250px'}} formats={controls} headerTemplate={header} />
        </div> 
      </div>
      <div className="formgrid grid mb-3">
        <div className="field flex flex-column w-full">
            <label htmlFor="application-deadline">Application deadline</label>
            <Calendar />
          </div>
      </div>
      <Button label="Submit" loading={loading} loadingIcon="pi pi-spinner" />
    </form>
  );
}

export default JobForm;
