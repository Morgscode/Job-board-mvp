import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import FileDownload from '../uploads/FileDownload';

function JobApplicationDetails(props) {
  const values = {
    job: { ...props.job },
    cv: { ...props.cv },
    application: { ...props.application },
  };
  const {
    control,
    reset,
  } = useForm({
    defaultValues: values,
    values,
  });

  useEffect(() => {
    if (
      Object.keys(values.job).length === 0 ||
      Object.keys(values.cv).length === 0 ||
      Object.keys(values.application).length === 0
    ) {
      reset(values);
    }
  }, [values]);

  const editorHeader = (
    <React.Fragment>
      <span></span>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <div className="pb-4 mb-4 formgrid grid">
        <div className="flex w-full field col flex-column">
          <label htmlFor="job-title">Position applied for</label>
          <Controller
            name="job.title"
            control={control}
            render={({ field }) => (
              <InputText id="job-title" value={field.value || ''} disabled />
            )}
          />
        </div>
      </div>
      <div className="pb-4 mb-4 formgrid grid">
        <div className="flex w-full field col flex-column">
          <FileDownload file={props.cv} />
        </div>
        <div className="flex w-full field col flex-column">
          <label htmlFor="cover-letter">Application Date</label>
          <Controller
            name="application.createdAt"
            control={control}
            render={({ field }) => (
              <Calendar
                id="application-deadline"
                value={field.value || ''}
                viewDate={field.value}
                dateFormat="dd/mm/yy"
                showIcon
                disabled
                placeholder={moment(field.value).format('DD/MM/YYYY')}
              />
            )}
          />
        </div>
      </div>
      <div className="pb-4 mb-4 formgrid grid">
        <div className="flex field col flex-column w-half">
          <label htmlFor="cover-letter">Cover Letter</label>
          <Controller
            name="application.cover_letter"
            control={control}
            render={({ field }) => (
              <Editor
                id="cover-letter"
                value={field.value || ''}
                style={{ minHeight: '250px' }}
                headerTemplate={editorHeader}
                readOnly
              />
            )}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default JobApplicationDetails;
