import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../../utils/session';
import AccountSideBar from '../../components/AccountSidebar';

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
  const { user } = req.session;
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
  return (
    <div className="flex flex-col md:flex-row">
      <AccountSideBar user={props.user} />
      <div className="flex-1 p-2 md:p-8">
        <h1 className="text-5xl dark:text-white text-gray-900">
          Welcome back, {props.user.first_name}
        </h1>
      </div>
    </div>
  );
}
