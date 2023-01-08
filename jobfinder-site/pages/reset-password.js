import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { http } from '../services/http';

export async function getServerSideProps(context) {
  let user = null;
  let jwt = null;

  const { email, token } = context.query;

  if (email && token) {
    try {
      const res = await http.get(
        `/reset-password?email=${email}&token=${token}`
      );
      if (res.status === 200) {
        user = res.data.data.user;
        jwt = res.data.data.token;
      }
    } catch (error) {
      console.error(error);
    }
  }

  return {
    props: {
      user,
      jwt,
    },
  };
}

export default function PasswordReset(props) {
  const [password, setPassword] = useState(null);
  const [passwordConfirm, setPasswordConfirm] = useState(null);
  const [formSubmitState, setFormSubmitState] = useState(false);
  const values = { password, passwordConfirm };
  const defaultValues = { ...values };
  const {
    register,
    handleSubmit,
    reset,
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

  function fieldErrorMessage(field) {
    return (
      errors[field] && (
        <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-500">
          {errors[field].message}
        </p>
      )
    );
  }

  async function updatePassword(form) {
    if (values.password !== values.passwordConfirm) {
      setFormSubmitState({
        error: true,
        message: 'Your password must match the confirmation',
      });
      return false;
    }
    try {
      const res = await http.put('/update-password', form, {
        headers: {
          Authorization: `Bearer ${props.jwt}`,
        },
      });
      setFormSubmitState({
        error: false,
        message: res?.data?.data?.message || 'Password reset. Please log in',
        classes: 'text-2xl mb-8 text-green-600',
      });
      reset(defaultValues);
    } catch (error) {
      console.error(error);
      setFormSubmitState({
        error: true,
        message:
          error?.response?.data?.message ||
          'There was a problem reseting your password',
        classes: 'text-2xl mb-8 text-red-600',
      });
    }
  }

  function markup() {
    if (props.user && props.jwt) {
      return (
        <form
          onSubmit={handleSubmit(updatePassword)}
          className="p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
        >
          {displayFormSubmitState()}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                New password
              </label>
              <input
                type="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                {...register('password', {
                  minLength: {
                    value: 8,
                    message: 'Your password must be at least 8 characters',
                  },
                })}
              />
              {fieldErrorMessage('password')}
            </div>
            <div className="mb-4">
              <label
                htmlFor="password-confirm"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm new password
              </label>
              <input
                type="password"
                id="password-confirm"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                {...register('passwordConfirm', {
                  minLength: {
                    value: 8,
                    message:
                      'Your password confirm must be at least 8 characters',
                  },
                })}
              />
              {fieldErrorMessage('passwordConfirm')}
            </div>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      );
    } else {
      return (
        <div className="flex flex-col items-center p-6 text-gray-900 bg-white border border-gray-200 rounded-lg shadow-md dark:text-white dark:bg-gray-800 dark:border-gray-700">
          <p className="mb-8">
            Please check your emails for a password reset link
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="100"
            height="100"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              fill="currentColor"
              d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm9.06 8.683L5.648 6.238 4.353 7.762l7.72 6.555 7.581-6.56-1.308-1.513-6.285 5.439z"
            />
          </svg>
        </div>
      );
    }
  }
  return (
    <section className="pt-8 pb-8">
      <div className="flex flex-col items-center">{markup()}</div>
    </section>
  );
}
