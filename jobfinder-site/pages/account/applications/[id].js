import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../../../utils/session';
import moment from 'moment';
import useAuthState from '../../../utils/useAuthState';
import { http } from '../../../services/http';
import jobService from '../../../services/jobService';
import jobApplicationService from '../../../services/jobApplicationService';
import jobApplicationStatusService from '../../../services/jobApplicationStatusService';
import AccountSideBar from '../../../components/AccountSidebar';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export const getServerSideProps = withIronSessionSsr(
  async ({ req, res, query }) => {
    const { user = null, jwt } = req.session;

    if (!user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    http.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

    const application = await jobApplicationService.find(query.id);
    if (!application) {
      return {
        notFound: true,
      };
    }

    const job = await jobService.find(application.job_id);

    const statuses = await jobApplicationStatusService.index();

    return {
      props: {
        application,
        job,
        statuses,
        user,
      }, // will be passed to the page component as props
    };
  },
  sessionOptions
);

export default function JobApplication(props) {
  useAuthState(true, props.user);
  const [status, setStatus] = useState(props.application.job_application_status_id);

  async function withdrawApplication(action) {
    action.preventDefault();
    try {
      await jobApplicationService.withdraw(props.application.id);
      setStatus(5);
    } catch (error) {
      console.error(error);
    }
  }

  function statusText() {
    const target = props.statuses.find(
      (item) => item.id === status
    );
    return target?.name || 'Unavailable';
  }

  function editor() {
    if (window) {
      return (
        <React.Fragment>
          {toolbar()}
          <ReactQuill
            className="text-gray-900 rounded-lg dark:text-white"
            theme="snow"
            value={props.application.cover_letter}
            format={formats}
            readOnly
            modules={{
              toolbar: {
                container: '#toolbar',
              },
            }}
          />
        </React.Fragment>
      );
    }
    return <textarea value={props.application.cover_letter}></textarea>;
  }

  const formats = [];

  function toolbar() {
    return <div id="toolbar"></div>;
  }

  function withdrawForm() {
    if (status != 5) {
      return (
        <form onSubmit={withdrawApplication}>
        <button
          type="submit"
          className="focus:outline-none text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-800 dark:hover:bg-red-500 dark:focus:ring-red-900"
        >
          Withdraw Application
        </button>
      </form>
      ); 
    }
  }

  return (
    <div className="flex flex-col md:flex-row">
      <AccountSideBar user={props.user} />
      <div className="flex-1 p-2 md:p-8">
        <h1 className="mb-6 text-5xl text-gray-900 dark:text-white">
          Application for {props.job.title}
        </h1>
        <div className="block w-full p-8 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col md:flex-row">
            <article className="flex-1 mr-auto">
              <h2 className="mb-6 text-2xl text-gray-900 dark:text-white">
                Application status: {statusText()}
              </h2>
              <h2 className="mb-6 text-2xl text-gray-900 dark:text-white">
                Application date:{' '}
                <span className="font-medium">
                  {moment(props.application.createdAt).format('DD-MM-YYYY')}
                </span>
              </h2>
              <h2 className="mb-4 text-2xl text-gray-900 dark:text-white">
                Covering Letter:
              </h2>
              <div>{editor()}</div>
            </article>
           {withdrawForm()}
          </div>
        </div>
      </div>
    </div>
  );
}
