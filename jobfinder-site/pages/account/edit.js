import React, { useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../utils/session";
import { useForm } from "react-hook-form";
import axios from "axios";
import meService from "../../services/meService";
import AccountSideBar from "../../components/AccountSidebar";

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
  const { user = null } = req.session;

  if (!user) {
    return {
      redirect: {
        destination: "/login",
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

export default function EditAccount(props) {
  const values = { ...props.user };
  const defaultValues = { ...values };
  const [formSubmitState, setFormSubmitState] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    values,
  });

  function fieldErrorMessage(field) {
    return (
      errors[field] && (
        <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-500">
          {errors[field].message}
        </p>
      )
    );
  }

  function displayFormSubmitState() {
    return (
      formSubmitState && (
        <p role="alert" className={formSubmitState.classes}>
          {formSubmitState.message}
        </p>
      )
    );
  }

  async function updateUser(user) {
    try {
      await axios.post("/api/account/edit", user);
      setFormSubmitState({
        error: false,
        message: "Your details have been updated.",
        classes: "text-2xl mb-8 text-green-600",
      });
    } catch (error) {
      setFormSubmitState({
        error: true,
        message: error?.response?.data?.message,
        classes: "text-2xl mb-8 text-red-600",
      });
    }
  }

  return (
    <div className="flex flex-col md:flex-row">
      <AccountSideBar user={props.user} />
      <div className="flex-1 p-2 md:p-8">
        <h1 className="mb-6 text-4xl text-gray-900 dark:text-white">
          Update your details
        </h1>
        <form
          onSubmit={handleSubmit(updateUser)}
          className="p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
        >
          {displayFormSubmitState()}
          <div className="mb-6 grid gap-8 md:grid-cols-2">
            <div className="mb-3">
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Title
              </label>
              <input
                type="title"
                id="title"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="title"
                {...register("title", {
                  required: "Please enter a title",
                  minLength: 2,
                })}
              />
              {fieldErrorMessage("title")}
            </div>
            <div className="mb-3">
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                First name
              </label>
              <input
                type="text"
                id="first_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="First name"
                {...register("first_name", {
                  required: "Your first name is required.",
                  minLength: 2,
                })}
              />
              {fieldErrorMessage("first_name")}
            </div>
            <div className="mb-3">
              <label
                htmlFor="surname"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Surname
              </label>
              <input
                type="text"
                id="surname"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Surname"
                {...register("surname", {
                  required: "Your surname is required",
                  minLength: 2,
                })}
              />
              {fieldErrorMessage("surname")}
            </div>
            <div className="mb-3">
              <label
                htmlFor="middle_names"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Middle names
              </label>
              <input
                type="text"
                id="middle_names"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter any middle names"
                {...register("middle_names")}
              />
              {fieldErrorMessage("middle_names")}
            </div>
          </div>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
