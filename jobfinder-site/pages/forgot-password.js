import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState(null);
  const [formSubmitState, setFormSubmitState] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: email,
    values: email,
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

  async function requestPasswordReset(email) {
    try {
      const res = await axios.post("/api/forgot-password", email);
      setFormSubmitState({
        error: false,
        message:
          res.data?.message ||
          "Password reset link sent, Please check your emails",
        classes: "text-2xl mb-8 text-green-600",
      });
    } catch (error) {
      console.error(error);
      setFormSubmitState({
        error: true,
        message:
          error?.response?.data?.message || "There was a problem logging in",
        classes: "text-2xl mb-8 text-red-600",
      });
    }
  }

  return (
    <section className="pt-8 pb-8">
      <div className="flex flex-col items-center">
        <form
          onSubmit={handleSubmit(requestPasswordReset)}
          className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-md md:w-1/2 dark:bg-gray-800 dark:border-gray-700"
        >
          {displayFormSubmitState()}
          <h2 className="text-2xl mb-8 text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <div className="grid gap-8">
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
                {...register("email", {
                  required: "Your email is required",
                })}
              />
              {fieldErrorMessage("email")}
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
    </section>
  );
}
