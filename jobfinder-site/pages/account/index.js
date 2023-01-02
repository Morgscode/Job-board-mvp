import useAuthState from '../../utils/useAuthState';
import AccountSideBar from '../../components/AccountSidebar';

export async function getServerSideProps(context) {
  return {
    props: {}
  }
} 

export default function Account() {
  const [ loggedIn, user ] = useAuthState(true);
  return (
    <div className='flex flex-col md:flex-row'>
      <AccountSideBar user={user} />
      <div className='flex-1 p-2 md:p-8'>
        <h1 className="text-5xl dark:text-white text-gray-900">Welcome back, {user.first_name}</h1>
      </div>
    </div>
  );
}
