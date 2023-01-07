import React, { useCallback, useState } from 'react';
import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../../../utils/session';
import dynamic from 'next/dynamic';
import { useDropzone } from 'react-dropzone';
import jobService from '../../../services/jobService';
import useAuthState from '../../../utils/useAuthState';
import jobApplicationService from '../../../services/jobApplicationService';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export const getServerSideProps = withIronSessionSsr(
  async ({ req, res, query }) => {
    const { user = null } = req.session;
    if (!user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    const job = await jobService.find(query.id);
    return {
      props: { job, user },
    };
  },
  sessionOptions
);

export default function Apply(props) {
  useAuthState(true, props.user);
  const [formSubmitState, setFormSubmitState] = useState(false);
  const [cv, setCv] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [errors, setErrors] = useState({});

  const onDrop = useCallback((files) => {
    if (files?.length > 0) {
      setCv(files[0]);
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const dropZoneMarkup = () => {
    if (cv && cv instanceof File) {
      return (
        <div className="flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="100"
            height="100"
            className="mb-6 dark:text-white"
            fill="#222222"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M3 8l6.003-6h10.995C20.55 2 21 2.455 21 2.992v18.016a.993.993 0 0 1-.993.992H3.993A1 1 0 0 1 3 20.993V8zm7-4.5L4.5 9H10V3.5z" />
          </svg>
          <p className="text-gray-900 dark:text-white">{cv.name}</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <svg
          aria-hidden="true"
          className="w-10 h-10 mb-3 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          ></path>
        </svg>
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Click to upload your cv</span> or drag
          and drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Please upload a PDF file
        </p>
      </div>
    );
  };

  function editor() {
    if (document && document instanceof Document) {
      return (
        <React.Fragment>
          {toolbar()}
          <ReactQuill
            className="text-gray-900 dark:text-white rounded-lg"
            theme="snow"
            value={coverLetter}
            onChange={setCoverLetter}
            format={formats}
            modules={{
              toolbar: {
                container: '#toolbar',
              },
            }}
          />
        </React.Fragment>
      );
    }
    return <textarea value={coverLetter} onChange={setCoverLetter}></textarea>;
  }

  const formats = ['header', 'bold', 'italic', 'list', 'bullet'];

  function toolbar() {
    return (
      <div id="toolbar">
        <select
          className="ql-header"
          defaultValue={''}
          onChange={(e) => e.persist()}
        >
          <option value="1" />
          <option value="2" />
          <option selected />
        </select>
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-list" value="ordered" type="button" />
        <button className="ql-list" value="bullet" type="button" />
      </div>
    );
  }

  async function handleJobApplication(submit) {
    submit.preventDefault();

    if (!cv || cv instanceof File !== true || cv.type !== 'application/pdf') {
      setErrors((errors) => ({
        ...errors,
        cv: 'A file upload as a PDF is required',
      }));
      return false;
    } else {
      setErrors((errors) => delete errors['cv']);
    }

    if (cv.size > 1000000) {
      setErrors((errors) => ({
        ...errors,
        cv: 'Please upload a CV with a maximum size of 1MB',
      }));
      return false;
    } else {
      setErrors((errors) => delete errors['cv']);
    }

    if (!coverLetter) {
      setErrors((errors) => ({
        ...errors,
        coverLetter: 'A cover letter is required',
      }));
      return false;
    } else {
      setErrors((errors) => delete errors['coverLetter']);
    }

    try {
      const application = new FormData();
      application.append('cv', cv);
      application.append('cover_letter', coverLetter);
      application.append('job_id', props.job.id);
      await jobApplicationService.create(application);
      setCv(null);
      setCoverLetter(null);
      setFormSubmitState({
        message: `Your application for the ${props.job.title} role has been submitted`,
        classes: 'text-2xl mb-8 text-green-600',
      });
    } catch (error) {
      setFormSubmitState({
        message: `There was a problem submitting your application for the ${props.job.title} role. Please try again.`,
        classes: 'text-2xl mb-8 text-red-600',
      });
    }
  }

  function fieldErrorMessage(field) {
    return (
      errors[field] && (
        <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-500">
          {errors[field]}
        </p>
      )
    );
  }

  function displayFormSubmitState() {
    return (
      formSubmitState && (
        <p role="alert" className={formSubmitState.classes}>
          {formSubmitState.message}
        </p>
      )
    );
  }

  return (
    <section className="pt-8 pb-8">
      <div className="max-w-[1000px] mx-auto block w-full p-8 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <form className="p-2 md:p-8" onSubmit={handleJobApplication}>
          <h1 className="text-4xl text-gray-900 dark:text-white mb-6">
            Apply for the {props.job.title} role
          </h1>
          {displayFormSubmitState()}
          <div id="cv-upload" className="mb-8">
            <h2 className="text-xl text-gray-900 dark:text-white mb-6">
              Please upload your cv
            </h2>
            <div
              {...getRootProps()}
              className="flex items-center justify-center w-full"
            >
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-solid rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                {dropZoneMarkup()}
                <input {...getInputProps()} />
              </label>
            </div>
            {fieldErrorMessage('cv')}
          </div>
          <div id="cover-letter" className="mb-8">
            <h2 className="text-xl text-gray-900 dark:text-white mb-6">
              Please write a covering letter for this application
            </h2>
            {editor()}
            {fieldErrorMessage('coverLetter')}
          </div>
          <button
            type="submit"
            href={`/jobs/${props.job.id}/apply`}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Apply
          </button>
        </form>
      </div>
    </section>
  );
}
