import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../../utils/session';
import AccountSideBar from '../../components/AccountSidebar';
import useAuthState from '../../utils/useAuthState';

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
  const { user = null } = req.session;

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
}, sessionOptions);

export default function Account(props) {
  useAuthState(true, props.user);
  return (
    <div className="flex flex-col md:flex-row">
      <AccountSideBar user={props.user} />
      <div className="flex-1 p-2 md:p-8">
        <h1 className="text-5xl text-gray-900 dark:text-white">
          Welcome back, {props.user.first_name}
        </h1>
      </div>
    </div>
  );
}
