import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux'
import { http } from '../services/http';
import { login as setLogin, setLoggedInUser } from '../store/features/authSlice';

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const values = { email: '', password: '' };
  const defaultValues = { ...values };
  const [formSubmitState, setFormSubmitState] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues,
    values,
  });

  function displayFormSubmitState() {
    return (
      formSubmitState && (
        <p role="alert" className={formSubmitState.classes}>
          {formSubmitState.message}
        </p>
      )
    );
  }

  async function loginUser(submit) {
    try {
      const res = await http.post('/login', submit);
      dispatch(setLogin(res.data.token));
      const { user } = res.data.data;
      dispatch(setLoggedInUser(user));
      router.push('/account');
    } catch (error) {
      console.error(error);
      setFormSubmitState({
        error: true,
        message: error.response.data.message,
        classes: 'text-2xl mb-8 text-red-600',
      });
    }
  }

  return (
    <section className="pt-8 pb-8">
     <h1 className='text-6xl mb-6 font-medium text-gray-900 dark:text-white'>Login to apply for jobs</h1>
      <form onSubmit={handleSubmit(loginUser)} className="p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      {displayFormSubmitState()}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@email.com"
              {...register('email')}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              {...register('password')}
            />
          </div>
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </section>
  );
}
