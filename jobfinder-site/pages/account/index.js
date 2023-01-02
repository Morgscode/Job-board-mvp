import useAuthState from '../../utils/useAuthState';
import AccountSideBar from '../../components/AccountSidebar';

export default function Account() {
  const [ loggedIn, user ] = useAuthState(true);
  return (
    <div className='grid grid-cols-2'>
      <AccountSideBar />
    </div>
  );
}
