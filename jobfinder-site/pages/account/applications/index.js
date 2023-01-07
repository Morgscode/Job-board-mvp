import Link from 'next/link';
import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../../../utils/session';
import moment from 'moment';
import useAuthState from '../../../utils/useAuthState';
import { http } from '../../../services/http';
import meService from '../../../services/meService';
import jobService from '../../../services/jobService';
import jobApplicationStatusService from '../../../services/jobApplicationStatusService';
import AccountSideBar from '../../../components/AccountSidebar';

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
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

  let applicationRecords = await meService.applications(jwt);

  const applications = await Promise.all(
    applicationRecords.map(async (application) => {
      const job = await jobService.find(application.job_id);
      application.job = job;
      return application;
    })
  );

  const statuses = await jobApplicationStatusService.index();

  return {
    props: {
      user,
      applications,
      statuses,
    },
  };
}, sessionOptions);

export default function Applications(props) {
  useAuthState(true, props.user);
  function getApplicationStatus(id) {
    const status = props.statuses.find((status) => status.id === id);
    return status.name || 'Unavailable';
  }

  const applications =
    props.applications.map((application) => (
      <div
        key={application.id}
        className="block w-full p-8 bg-gray mb-4 border border-gray-200 rounded-lg shadow-md dark:bg-gray-600 dark:border-gray-700 flex items-start"
      >
        <div>
          <p className="text-white font-medium text-2xl mb-3">
            Job Title: {application.job.title}
          </p>
          <p className="text-white mb-3">
            Date applied: {moment(application.createdAt).format('DD-MM-YYYY')}
          </p>
          <p className="text-white mb-3">
            Application Status:{' '}
            <span className="font-semibold">
              {getApplicationStatus(application.job_application_status_id)}
            </span>
          </p>
        </div>
        <div className="ml-auto">
          <Link href={`/account/applications/${application.id}`}>
            <button
              type="button"
              className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              View job application
            </button>
          </Link>
        </div>
      </div>
    )) || [];
  return (
    <div className="flex flex-col md:flex-row">
      <AccountSideBar user={props.user} />
      <div className="flex-1 p-2 md:p-8">
        <h1 className="text-5xl dark:text-white text-gray-900 mb-6">
          Your job applications
        </h1>
        <div className="block w-full p-8 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
          {applications}
        </div>
      </div>
    </div>
  );
}
