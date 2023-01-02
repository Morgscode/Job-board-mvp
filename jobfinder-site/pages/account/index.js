import useAuthState from '../../utils/useAuthState';

export default function Account() {
  const [ loggedIn, user ] = useAuthState(true);
  return <h1>Welcome {user.email}</h1>;
}
