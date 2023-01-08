import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { classNames } from 'primereact/utils';

function LocationForm(props) {
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
      className="flex w-full p-6 border-solid border-round border-1 border-gray-50 flex-column  shadow-1"
      onSubmit={handleSubmit(submit)}
    >
      <div className="mb-4 formgrid gird">
        <div className="flex field flex-column">
          <label htmlFor="name">Name</label>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'A name is required' }}
            render={({ field, fieldState }) => (
              <InputText
                {...field}
                id="name"
                autoFocus
                className={classNames({ 'p-invalid': fieldState.invalid })}
              />
            )}
          />
          {getFormErrorMessage('name')}
        </div>
      </div>
      <div className="pb-4 mb-4 formgrid grid">
        <div className="flex w-full field flex-column">
          <label htmlFor="location-description">Description</label>
          <Controller
            name="description"
            control={control}
            rules={{ required: 'You need to set a description' }}
            render={({ field, fieldState }) => (
              <Editor
                id="location-description"
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

export default LocationForm;
