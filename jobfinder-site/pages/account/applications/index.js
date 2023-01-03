import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../../../utils/session';
import AccountSideBar from '../../../components/AccountSidebar';
import meService from '../../../services/meService';

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
  const { user, jwt } = req.session;

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const applications = await meService.applications(jwt);

  return {
    props: {
      user,
      applications
    },
  };
}, sessionOptions);

export default function Applications(props) {
  const applications = props?.applications?.map((application) => (
    <p key={application.id}>{application.id}</p>
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
