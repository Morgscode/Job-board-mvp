import Link from 'next/link';
import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../../../utils/session';
import moment from 'moment';
import useAuthState from '../../../utils/useAuthState';
import { http } from '../../../services/http';
import jobService from '../../../services/jobService';
import jobApplicationService from '../../../services/jobApplicationService';
import jobApplicationStatusService from '../../../services/jobApplicationStatusService';
import AccountSideBar from '../../../components/AccountSidebar';

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

  function withdrawApplication(action) {
    action.preventDefault();
  }

  return (
    <div className="flex flex-col md:flex-row">
      <AccountSideBar user={props.user} />
      <div className="flex-1 p-2 md:p-8">
        <h1 className="text-5xl dark:text-white text-gray-900 mb-6">
          Application for {props.job.title}
        </h1>
        <div className="block w-full p-8 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
          <div className="flex">
            <article className="mr-auto">
              <h2 className="dark:text-white text-gray-900 text-2xl">
                Application date:{' '}
                <span className="font-medium">
                  {moment(props.application.createdAt).format('DD-MM-YYYY')}
                </span>
              </h2>
            </article>
            <form onSubmit={withdrawApplication}>
              <button
                type="submit"
                class="focus:outline-none text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-800 dark:hover:bg-red-500 dark:focus:ring-red-900"
              >
                Withdraw Application
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
